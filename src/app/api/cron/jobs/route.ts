import { createClient } from "@supabase/supabase-js";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { createSign } from "node:crypto";
import type { Database, Json } from "@/types/database";
import { recommendArticleFormat } from "@/lib/article-format";

export const maxDuration = 60;
function object(value: Json): Record<string,Json|undefined> { return typeof value==="object"&&value!==null&&!Array.isArray(value)?value:{}; }
function csv(value:unknown){const s=value==null?"":String(value);return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s;}
function privateIp(ip:string){return !isIP(ip)||/^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip)||ip==="::1"||/^f[cd]/i.test(ip)||/^fe80:/i.test(ip);}
async function inspectUrl(raw:string){const parsed=new URL(raw);if(!["http:","https:"].includes(parsed.protocol)||parsed.username||parsed.password||parsed.hostname==="localhost")throw new Error("Unsafe URL");const addresses=await lookup(parsed.hostname,{all:true});if(!addresses.length||addresses.some(a=>privateIp(a.address)))throw new Error("Private address rejected");parsed.hash="";const response=await fetch(parsed,{redirect:"error",signal:AbortSignal.timeout(12000),headers:{"user-agent":"GSDContentBot/2.0"}});if(!response.ok)throw new Error(`HTTP ${response.status}`);if(!(response.headers.get("content-type")??"").includes("text/html"))throw new Error("Not an HTML page");const html=(await response.text()).slice(0,1_000_000);const title=(html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1]??html.match(/<title[^>]*>([^<]+)/i)?.[1]??parsed.hostname).trim();const summary=(html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)/i)?.[1]??"").trim();const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim().slice(0,12000);return{parsed,title,summary,text};}

function base64url(value:string|Buffer){return Buffer.from(value).toString("base64url");}
async function googleAccessToken(){
  const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey=process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replaceAll("\\n","\n");
  if(!email||!privateKey)throw new Error("Google Drive service account is not configured");
  const now=Math.floor(Date.now()/1000);
  const header=base64url(JSON.stringify({alg:"RS256",typ:"JWT"}));
  const claim=base64url(JSON.stringify({iss:email,scope:"https://www.googleapis.com/auth/drive.readonly",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600}));
  const unsigned=`${header}.${claim}`;const signer=createSign("RSA-SHA256");signer.update(unsigned);signer.end();
  const assertion=`${unsigned}.${signer.sign(privateKey).toString("base64url")}`;
  const response=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion})});
  const body=await response.json() as {access_token?:string;error_description?:string};if(!response.ok||!body.access_token)throw new Error(body.error_description??"Google authorization failed");return body.access_token;
}
function driveFileOrder(name:string){const match=name.match(/(?:image|carousel)[-_ ]?(\d+)/i);return match?Number(match[1]):1;}
function driveRevision(file:{modifiedTime?:string;createdTime?:string}){return file.modifiedTime??file.createdTime??new Date(0).toISOString();}
async function syncDriveImages(supabase:ReturnType<typeof createClient<Database>>,job:Database["public"]["Tables"]["scheduled_jobs"]["Row"]){
  const input=object(job.input);const contentId=String(input.content_item_id??"");const identifier=String(input.identifier??"");const requestedAt=String(input.requested_at??job.created_at);const attempts=Number(input.attempts??0);const importExisting=input.import_existing===true;
  const folder=process.env.GOOGLE_DRIVE_FOLDER_ID;if(!contentId||!identifier||!folder)throw new Error("Drive watch job is missing its article or folder configuration");
  const token=await googleAccessToken();const prefix=`GSD-${identifier}-`;const query=`'${folder.replaceAll("'","\\'")}' in parents and trashed = false and name contains '${prefix.replaceAll("'","\\'")}'`;
  const listing=await fetch(`https://www.googleapis.com/drive/v3/files?${new URLSearchParams({q:query,fields:"files(id,name,mimeType,createdTime,modifiedTime,webViewLink,size)",orderBy:"name",pageSize:"100"})}`,{headers:{authorization:`Bearer ${token}`}});
  const listed=await listing.json() as {files?:Array<{id:string;name:string;mimeType:string;createdTime?:string;modifiedTime?:string;webViewLink?:string;size?:string}>;error?:{message?:string}};if(!listing.ok)throw new Error(listed.error?.message??"Drive listing failed");
  const files=(listed.files??[]).filter(file=>file.mimeType.startsWith("image/")&&(importExisting||new Date(driveRevision(file)).getTime()>=new Date(requestedAt).getTime()-60_000));
  if(!files.length){if(importExisting){await supabase.from("scheduled_jobs").update({status:"failed",error_message:`No matching legacy images found for GSD-${identifier}-`,completed_at:new Date().toISOString()}).eq("id",job.id);return {result:"not_found",count:0};}if(attempts>=71){await supabase.from("scheduled_jobs").update({status:"failed",error_message:"No matching Drive images appeared within six hours",completed_at:new Date().toISOString()}).eq("id",job.id);return {result:"timed_out",count:0};}const next=new Date(Date.now()+5*60_000).toISOString();await supabase.from("scheduled_jobs").update({status:"queued",input:{...input,attempts:attempts+1},run_after:next,started_at:null,result:{last_checked_at:new Date().toISOString()}}).eq("id",job.id);return {result:"waiting",count:0};}
  let attached=0;let updated=0;let unchanged=0;
  const {data:existingAssets,error:existingError}=await supabase.from("assets").select("id,storage_path,metadata").eq("owner_id",job.owner_id).eq("content_item_id",contentId).in("kind",["image","carousel_slide"]);
  if(existingError)throw existingError;
  for(const file of files){
    const revision=driveRevision(file);const safeName=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
    const existing=(existingAssets??[]).find(asset=>{const metadata=object(asset.metadata);return metadata.drive_file_id===file.id||metadata.source_filename===file.name;});
    const existingMetadata=existing?object(existing.metadata):{};
    if(existing&&existingMetadata.drive_modified_time===revision){unchanged++;continue;}
    const revisionKey=revision.replace(/[^0-9]/g,"");const storagePath=`${job.owner_id}/drive/${contentId}/${file.id}-${revisionKey}-${safeName}`;
    const download=await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,{headers:{authorization:`Bearer ${token}`}});if(!download.ok)throw new Error(`Could not download ${file.name}`);
    const bytes=await download.arrayBuffer();const {error:uploadError}=await supabase.storage.from("content-assets").upload(storagePath,bytes,{contentType:file.mimeType,upsert:false});if(uploadError)throw uploadError;
    const order=driveFileOrder(file.name);const {error:assetError}=await supabase.from("assets").insert({owner_id:job.owner_id,content_item_id:contentId,kind:files.length>1?"carousel_slide":"image",storage_path:storagePath,slide_number:files.length>1?order:null,metadata:{drive_file_id:file.id,drive_url:file.webViewLink??null,drive_modified_time:revision,source_filename:file.name,size:file.size??String(bytes.byteLength)}});if(assetError){await supabase.storage.from("content-assets").remove([storagePath]);throw assetError;}
    if(existing){const {error:deleteError}=await supabase.from("assets").delete().eq("id",existing.id);if(deleteError)throw deleteError;await supabase.storage.from("content-assets").remove([existing.storage_path]);updated++;}else attached++;
  }
  const eventType=importExisting?"legacy_images_imported":updated>0?"drive_images_updated":"drive_images_attached";
  await supabase.from("activity_events").insert({owner_id:job.owner_id,content_item_id:contentId,event_type:eventType,details:{attached,updated,unchanged,identifier}});
  await supabase.from("scheduled_jobs").update({status:"succeeded",result:{attached,updated,unchanged,matched:files.length},completed_at:new Date().toISOString()}).eq("id",job.id);return {result:updated>0?"updated":"attached",count:attached+updated};
}

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
      if(job.job_type==="drive_image_watch"){
        const result=await syncDriveImages(supabase,job);outcomes.push({id:job.id,...result});
      }else if(job.job_type==="daily_export"){
        const {data:rows,error:rowsError}=await supabase.from("content_items").select("*").eq("owner_id",job.owner_id).order("created_at"); if(rowsError)throw rowsError;
        const headers=["identifier","title","status","overview","content","caption","first_comment","generation_prompt","instagram_url","posted_at","created_at","updated_at"];
        const body=[headers.join(","),...(rows??[]).map(row=>headers.map(h=>csv(row[h as keyof typeof row])).join(","))].join("\n");
        const path=`${job.owner_id}/exports/${new Date().toISOString().slice(0,10)}-${job.id}.csv`; const {error:uploadError}=await supabase.storage.from("content-assets").upload(path,body,{contentType:"text/csv",upsert:false}); if(uploadError)throw uploadError;
        await supabase.from("assets").insert({owner_id:job.owner_id,kind:"export",storage_path:path,metadata:{scheduled_job_id:job.id,row_count:rows?.length??0}});
        await supabase.from("scheduled_jobs").update({status:"succeeded",result:{path,row_count:rows?.length??0},completed_at:new Date().toISOString()}).eq("id",job.id); outcomes.push({id:job.id,result:"exported"});
      }else if(job.job_type==="scheduled_discovery"){
        const input=object(job.input); const urls=Array.isArray(input.urls)?input.urls.filter((v):v is string=>typeof v==="string"):[];
        if(!urls.length)throw new Error("No URLs configured");
        const {data:batch,error:batchError}=await supabase.from("discovery_batches").insert({owner_id:job.owner_id,submitted_count:urls.length}).select().single();if(!batch||batchError)throw batchError??new Error("Batch failed");
        let created=0,existing=0,failed=0;
        for(const raw of urls){try{const inspected=await inspectUrl(raw);const canonical=inspected.parsed.toString();const {data:found}=await supabase.from("sources").select("id").eq("owner_id",job.owner_id).eq("canonical_url",canonical).maybeSingle();if(found){existing++;await supabase.from("discovery_results").insert({owner_id:job.owner_id,batch_id:batch.id,submitted_url:raw,canonical_url:canonical,status:"existing",source_id:found.id,reason:"Source already exists"});continue;}const format=await recommendArticleFormat({title:inspected.title,summary:inspected.summary,text:inspected.text});const {data:source,error:sourceError}=await supabase.from("sources").insert({owner_id:job.owner_id,canonical_url:canonical,website:inspected.parsed.hostname,title:inspected.title,summary:inspected.summary||null}).select().single();if(!source||sourceError)throw sourceError??new Error("Source failed");const {data:roots}=await supabase.from("content_items").select("identifier").eq("owner_id",job.owner_id).is("parent_id",null);const identifier=String(Math.max(0,...(roots??[]).map(r=>/^\d+$/.test(r.identifier)?Number(r.identifier):0))+1);const {data:item,error:itemError}=await supabase.from("content_items").insert({owner_id:job.owner_id,identifier,title:inspected.title,status:"auto_added",content_type:format.content_type,panel_count:format.panel_count,overview:inspected.summary||null,first_comment:canonical,generation_prompt:`Create a Hank and the Squirrel Instagram post based on ${canonical}\n\n${inspected.summary}`}).select().single();if(!item||itemError)throw itemError??new Error("Content failed");await supabase.from("content_sources").insert({owner_id:job.owner_id,content_item_id:item.id,source_id:source.id});created++;await supabase.from("discovery_results").insert({owner_id:job.owner_id,batch_id:batch.id,submitted_url:raw,canonical_url:canonical,status:"created",source_id:source.id,content_item_id:item.id,reason:"Source and content item created"});}catch(e){failed++;await supabase.from("discovery_results").insert({owner_id:job.owner_id,batch_id:batch.id,submitted_url:raw,status:"failed",reason:e instanceof Error?e.message:"Invalid URL"});}}
        await supabase.from("discovery_batches").update({status:failed===urls.length?"failed":"succeeded",created_count:created,existing_count:existing,failed_count:failed,completed_at:new Date().toISOString()}).eq("id",batch.id);
        await supabase.from("scheduled_jobs").update({status:"succeeded",result:{batch_id:batch.id,created,existing,failed},completed_at:new Date().toISOString()}).eq("id",job.id);outcomes.push({id:job.id,result:"checked",created,existing,failed});
      }else throw new Error(`Unknown job type: ${job.job_type}`);
    }catch(e){const message=e instanceof Error?e.message:"Unknown job error";await supabase.from("scheduled_jobs").update({status:"failed",error_message:message,completed_at:new Date().toISOString()}).eq("id",job.id);outcomes.push({id:job.id,result:"failed",reason:message});}
  }
  for(const job of jobs??[]){const input=object(job.input);const schedule=input.schedule;if((schedule==="daily"||schedule==="weekly")&&outcomes.some(o=>o.id===job.id)){const next=new Date();next.setUTCDate(next.getUTCDate()+(schedule==="weekly"?7:1));await supabase.from("scheduled_jobs").insert({owner_id:job.owner_id,job_type:job.job_type,idempotency_key:crypto.randomUUID(),status:"queued",input:job.input,run_after:next.toISOString()});}}
  return Response.json({processed:outcomes.length,outcomes});
}
