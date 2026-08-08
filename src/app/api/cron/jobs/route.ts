import { createClient } from "@supabase/supabase-js";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { Database, Json } from "@/types/database";

export const maxDuration = 60;
function object(value: Json): Record<string,Json|undefined> { return typeof value==="object"&&value!==null&&!Array.isArray(value)?value:{}; }
function csv(value:unknown){const s=value==null?"":String(value);return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s;}
function privateIp(ip:string){return !isIP(ip)||/^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)||ip==="::1"||/^f[cd]/i.test(ip)||/^fe80:/i.test(ip);}
async function inspectUrl(raw:string){const parsed=new URL(raw);if(!["http:","https:"].includes(parsed.protocol)||parsed.username||parsed.password||parsed.hostname==="localhost")throw new Error("Unsafe URL");const addresses=await lookup(parsed.hostname,{all:true});if(!addresses.length||addresses.some(a=>privateIp(a.address)))throw new Error("Private address rejected");parsed.hash="";const response=await fetch(parsed,{redirect:"error",signal:AbortSignal.timeout(12000),headers:{"user-agent":"GSDContentBot/2.0"}});if(!response.ok)throw new Error(`HTTP ${response.status}`);if(!(response.headers.get("content-type")??"").includes("text/html"))throw new Error("Not an HTML page");const html=(await response.text()).slice(0,1_000_000);const title=(html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]??html.match(/<title[^>]*>([^<]+)/i)?.[1]??parsed.hostname).trim();const summary=(html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)/i)?.[1]??"").trim();return{parsed,title,summary};}

export async function GET(request:Request){
  if(!process.env.CRON_SECRET||request.headers.get("authorization")!==`Bearer ${process.env.CRON_SECRET}`) return Response.json({error:"Unauthorized"},{status:401});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.SUPABASE_SECRET_KEY;
  if(!url||!key) return Response.json({error:"Scheduled execution requires SUPABASE_SECRET_KEY"},{status:503});
  const supabase=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:jobs,error}=await supabase.from("scheduled_jobs").select("*").eq("status","queued").lte("run_after",new Date().toISOString()).order("run_after").limit(10);
  if(error)return Response.json({error:error.message},{status:500}); const outcomes=[];
  for(const job of jobs??[]){
    await supabase.from("scheduled_jobs").update({status:"running",started_at:new Date().toISOString()}).eq("id",job.id);
    try{
      if(job.job_type==="daily_export"){
        const {data:rows,error:rowsError}=await supabase.from("content_items").select("*").eq("owner_id",job.owner_id).order("created_at"); if(rowsError)throw rowsError;
        const headers=["identifier","title","status","overview","content","caption","generation_prompt","instagram_url","posted_at","created_at","updated_at"];
        const body=[headers.join(","),...(rows??[]).map(row=>headers.map(h=>csv(row[h as keyof typeof row])).join(","))].join("\n");
        const path=`${job.owner_id}/exports/${new Date().toISOString().slice(0,10)}-${job.id}.csv`; const {error:uploadError}=await supabase.storage.from("content-assets").upload(path,body,{contentType:"text/csv",upsert:false}); if(uploadError)throw uploadError;
        await supabase.from("assets").insert({owner_id:job.owner_id,kind:"export",storage_path:path,metadata:{scheduled_job_id:job.id,row_count:rows?.length??0}});
        await supabase.from("scheduled_jobs").update({status:"succeeded",result:{path,row_count:rows?.length??0},completed_at:new Date().toISOString()}).eq("id",job.id); outcomes.push({id:job.id,result:"exported"});
      }else if(job.job_type==="scheduled_discovery"){
        const input=object(job.input); const urls=Array.isArray(input.urls)?input.urls.filter((v):v is string=>typeof v==="string"):[];
        if(!urls.length)throw new Error("No URLs configured");
        const {data:batch,error:batchError}=await supabase.from("discovery_batches").insert({owner_id:job.owner_id,submitted_count:urls.length}).select().single();if(!batch||batchError)throw batchError??new Error("Batch failed");
        let created=0,existing=0,failed=0;
        for(const raw of urls){try{const inspected=await inspectUrl(raw);const canonical=inspected.parsed.toString();const {data:found}=await supabase.from("sources").select("id").eq("owner_id",job.owner_id).eq("canonical_url",canonical).maybeSingle();if(found){existing++;await supabase.from("discovery_results").insert({owner_id:job.owner_id,batch_id:batch.id,submitted_url:raw,canonical_url:canonical,status:"existing",source_id:found.id,reason:"Source already exists"});continue;}const {data:source,error:sourceError}=await supabase.from("sources").insert({owner_id:job.owner_id,canonical_url:canonical,website:inspected.parsed.hostname,title:inspected.title,summary:inspected.summary||null}).select().single();if(!source||sourceError)throw sourceError??new Error("Source failed");const {data:roots}=await supabase.from("content_items").select("identifier").eq("owner_id",job.owner_id).is("parent_id",null);const identifier=String(Math.max(0,...(roots??[]).map(r=>/^\d+$/.test(r.identifier)?Number(r.identifier):0))+1);const {data:item,error:itemError}=await supabase.from("content_items").insert({owner_id:job.owner_id,identifier,title:inspected.title,status:"auto_added",overview:inspected.summary||null,generation_prompt:`Create a Hank and the Squirrel Instagram post based on ${canonical}\n\n${inspected.summary}`}).select().single();if(!item||itemError)throw itemError??new Error("Content failed");await supabase.from("content_sources").insert({owner_id:job.owner_id,content_item_id:item.id,source_id:source.id});created++;await supabase.from("discovery_results").insert({owner_id:job.owner_id,batch_id:batch.id,submitted_url:raw,canonical_url:canonical,status:"created",source_id:source.id,content_item_id:item.id,reason:"Source and content item created"});}catch(e){failed++;await supabase.from("discovery_results").insert({owner_id:job.owner_id,batch_id:batch.id,submitted_url:raw,status:"failed",reason:e instanceof Error?e.message:"Invalid URL"});}}
        await supabase.from("discovery_batches").update({status:failed===urls.length?"failed":"succeeded",created_count:created,existing_count:existing,failed_count:failed,completed_at:new Date().toISOString()}).eq("id",batch.id);
        await supabase.from("scheduled_jobs").update({status:"succeeded",result:{batch_id:batch.id,created,existing,failed},completed_at:new Date().toISOString()}).eq("id",job.id);outcomes.push({id:job.id,result:"checked",created,existing,failed});
      }else throw new Error(`Unknown job type: ${job.job_type}`);
    }catch(e){const message=e instanceof Error?e.message:"Unknown job error";await supabase.from("scheduled_jobs").update({status:"failed",error_message:message,completed_at:new Date().toISOString()}).eq("id",job.id);outcomes.push({id:job.id,result:"failed",reason:message});}
  }
  for(const job of jobs??[]){const input=object(job.input);const schedule=input.schedule;if((schedule==="daily"||schedule==="weekly")&&outcomes.some(o=>o.id===job.id)){const next=new Date();next.setUTCDate(next.getUTCDate()+(schedule==="weekly"?7:1));await supabase.from("scheduled_jobs").insert({owner_id:job.owner_id,job_type:job.job_type,idempotency_key:crypto.randomUUID(),status:"queued",input:job.input,run_after:next.toISOString()});}}
  return Response.json({processed:outcomes.length,outcomes});
}
