"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ContentStatus, Json } from "@/types/database";

type ActionResult = { ok: boolean; message: string };
const statuses = new Set<ContentStatus>(["new", "auto_added", "generated", "posted", "archived"]);

function textValue(form: FormData, key: string) { return String(form.get(key) ?? "").trim(); }
function numberValue(form: FormData, key: string) { const value = textValue(form, key); return value === "" ? null : Number(value); }
function resultObject(value: Json): Record<string, Json | undefined> { return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {}; }

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) redirect("/login");
  return { supabase, user };
}

export async function createItem(form: FormData) {
  const { supabase } = await authenticatedClient();
  const { data, error } = await supabase.rpc("create_content_item", { p_title: textValue(form, "title") || null });
  if (error) redirect(`/?notice=${encodeURIComponent(`Create failed: ${error.message}`)}`);
  const result = resultObject(data);
  if (result.result !== "created" || typeof result.id !== "string") redirect(`/?notice=${encodeURIComponent(String(result.reason ?? "Create failed"))}`);
  redirect(`/content/${result.id}?notice=Created%20successfully`);
}

export async function duplicateItem(form: FormData) {
  const { supabase } = await authenticatedClient();
  const { data, error } = await supabase.rpc("duplicate_content_item", { p_id: textValue(form, "id") });
  if (error) redirect(`/?notice=${encodeURIComponent(`Duplicate failed: ${error.message}`)}`);
  const result = resultObject(data);
  if (result.result !== "created" || typeof result.id !== "string") redirect(`/?notice=${encodeURIComponent(String(result.reason ?? "Duplicate failed"))}`);
  redirect(`/content/${result.id}?notice=${encodeURIComponent(`Created variation ${String(result.identifier)}`)}`);
}

export async function saveItem(_previous: ActionResult, form: FormData): Promise<ActionResult> {
  const { supabase } = await authenticatedClient();
  const status = textValue(form, "status") as ContentStatus;
  if (!statuses.has(status)) return { ok: false, message: "Invalid status" };
  const expectedVersion = numberValue(form, "record_version");
  if (!expectedVersion) return { ok: false, message: "Missing record version" };
  const args = {
    p_id: textValue(form, "id"), p_expected_version: expectedVersion,
    p_title: textValue(form, "title"), p_status: status, p_content_type: textValue(form, "content_type"),
    p_panel_count: numberValue(form, "panel_count"), p_overview: textValue(form, "overview"),
    p_content: textValue(form, "content"), p_caption: textValue(form, "caption"),
    p_generation_prompt: textValue(form, "generation_prompt"), p_score: numberValue(form, "score"),
    p_priority: numberValue(form, "priority"), p_is_favorite: form.get("is_favorite") === "on",
    p_instagram_url: textValue(form, "instagram_url"), p_publishing_notes: textValue(form, "publishing_notes"),
    p_reason: textValue(form, "reason") || "Content edited",
  };
  const { data, error } = await supabase.rpc("save_content_item", args);
  if (error) return { ok: false, message: `Save failed: ${error.message}` };
  const result = resultObject(data);
  if (result.result !== "saved") return { ok: false, message: String(result.reason ?? "Save failed") };
  revalidatePath("/"); revalidatePath(`/content/${args.p_id}`);
  return { ok: true, message: `Saved version ${String(result.version)}` };
}

export async function quickStatus(form: FormData) {
  const { supabase } = await authenticatedClient();
  const id = textValue(form, "id");
  const { data: item } = await supabase.from("content_items").select("*").eq("id", id).single();
  if (!item) redirect(`/?notice=${encodeURIComponent("Item not found")}`);
  const status = textValue(form, "status") as ContentStatus;
  const { data, error } = await supabase.rpc("save_content_item", {
    p_id: item.id, p_expected_version: item.record_version, p_title: item.title ?? "", p_status: status,
    p_content_type: item.content_type ?? "", p_panel_count: item.panel_count, p_overview: item.overview ?? "",
    p_content: item.content ?? "", p_caption: item.caption ?? "", p_generation_prompt: item.generation_prompt ?? "",
    p_score: item.score, p_priority: item.priority, p_is_favorite: item.is_favorite,
    p_instagram_url: item.instagram_url ?? "", p_publishing_notes: item.publishing_notes ?? "",
    p_reason: status === "archived" ? "Archived from dashboard" : "Status changed from dashboard",
  });
  const result = resultObject(data as Json);
  revalidatePath("/");
  redirect(`/?notice=${encodeURIComponent(error ? error.message : result.result === "saved" ? "Status updated" : String(result.reason ?? "Update failed"))}`);
}

export async function recordGeneration(form: FormData) {
  const { supabase, user } = await authenticatedClient();
  const id = textValue(form, "id"); const prompt = textValue(form, "prompt");
  if (!prompt) redirect(`/content/${id}?notice=${encodeURIComponent("Add a generation prompt first")}`);
  const { error } = await supabase.from("generation_runs").insert({ owner_id: user.id, content_item_id: id, idempotency_key: crypto.randomUUID(), prompt, status: "queued" });
  if (!error) await supabase.from("activity_events").insert({ owner_id: user.id, content_item_id: id, event_type: "generation_started", details: { source: "content_detail" } });
  revalidatePath(`/content/${id}`);
  redirect(`/content/${id}?notice=${encodeURIComponent(error ? `Generation tracking failed: ${error.message}` : "Generation run recorded and prompt ready to copy")}`);
}

export async function generateContent(form: FormData) {
  const { supabase, user } = await authenticatedClient();
  const id=textValue(form,"id"); const prompt=textValue(form,"prompt"); const expectedVersion=numberValue(form,"record_version");
  if (!prompt || !expectedVersion) redirect(`/content/${id}?notice=${encodeURIComponent("A prompt and current record version are required")}`);
  const key=crypto.randomUUID();
  const {data:run,error:runError}=await supabase.from("generation_runs").insert({owner_id:user.id,content_item_id:id,idempotency_key:key,prompt,status:"running"}).select().single();
  if(!run||runError) redirect(`/content/${id}?notice=${encodeURIComponent(runError?.message??"Could not start generation")}`);
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey){ await supabase.from("generation_runs").update({status:"failed",error_message:"OPENAI_API_KEY is not configured",completed_at:new Date().toISOString()}).eq("id",run.id); redirect(`/content/${id}?notice=${encodeURIComponent("AI generation is ready but the server API key is not configured")}`); }
  try {
    const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{authorization:`Bearer ${apiKey}`,"content-type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL??"gpt-5-mini",input:`Follow the GSD voice and image guidance in the prompt. Return a concise overview, complete carousel or single-panel content, an Instagram caption, and an image-generation prompt.\n\n${prompt}`,text:{format:{type:"json_schema",name:"gsd_content",strict:true,schema:{type:"object",additionalProperties:false,properties:{overview:{type:"string"},content:{type:"string"},caption:{type:"string"},generation_prompt:{type:"string"}},required:["overview","content","caption","generation_prompt"]}}}})});
    const body=await response.json() as {output_text?:string;error?:{message?:string}}; if(!response.ok||!body.output_text) throw new Error(body.error?.message??`OpenAI returned HTTP ${response.status}`);
    const output=JSON.parse(body.output_text) as {overview:string;content:string;caption:string;generation_prompt:string};
    const {data:item}=await supabase.from("content_items").select("*").eq("id",id).single();
    if(!item||item.record_version!==expectedVersion){await supabase.from("generation_runs").update({status:"succeeded",output,completed_at:new Date().toISOString(),error_message:"Output retained but not promoted because the record changed"}).eq("id",run.id);redirect(`/content/${id}?notice=${encodeURIComponent("Generation completed but was not applied because the item changed. The output remains in Generation Runs.")}`);}
    const {data:saved,error:saveError}=await supabase.rpc("save_content_item",{p_id:id,p_expected_version:expectedVersion,p_title:item.title??"",p_status:"generated",p_content_type:item.content_type??"",p_panel_count:item.panel_count,p_overview:output.overview,p_content:output.content,p_caption:output.caption,p_generation_prompt:output.generation_prompt,p_score:item.score,p_priority:item.priority,p_is_favorite:item.is_favorite,p_instagram_url:item.instagram_url??"",p_publishing_notes:item.publishing_notes??"",p_reason:"AI generation promoted"});
    const savedObject=resultObject(saved as Json); if(saveError||savedObject.result!=="saved") throw new Error(saveError?.message??String(savedObject.reason??"Could not promote output"));
    await supabase.from("generation_runs").update({status:"succeeded",output,promoted_at:new Date().toISOString(),completed_at:new Date().toISOString()}).eq("id",run.id);
    revalidatePath("/"); revalidatePath(`/content/${id}`); redirect(`/content/${id}?notice=${encodeURIComponent("Content generated and saved as a new version")}`);
  } catch(error) { unstable_rethrow(error); await supabase.from("generation_runs").update({status:"failed",error_message:error instanceof Error?error.message:"Unknown generation error",completed_at:new Date().toISOString()}).eq("id",run.id); redirect(`/content/${id}?notice=${encodeURIComponent(error instanceof Error?error.message:"Generation failed")}`); }
}
