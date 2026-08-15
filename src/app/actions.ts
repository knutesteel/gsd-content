"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ContentStatus, Json } from "@/types/database";

type ActionResult = { ok: boolean; message: string; version?: number };
const statuses = new Set<ContentStatus>(["new", "auto_added", "generated", "posted", "archived"]);
const contentTypes = new Set(["Single Pane Cartoon", "Multi-pane Cartoon", "Carousel (seperate images)"]);

function textValue(form: FormData, key: string) { return String(form.get(key) ?? "").trim(); }
function numberValue(form: FormData, key: string) { const value = textValue(form, key); return value === "" ? null : Number(value); }
function resultObject(value: Json): Record<string, Json | undefined> { return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {}; }
const firstCommentCaptionClose = "Read the article in the first Comment";
function finalizeInstagramCaption(value: string, hasArticleUrl: boolean) {
  const withoutClose = value.trim().replace(/\s*Read the article in the first Comment\.?\s*$/i, "").trim();
  return hasArticleUrl ? `${withoutClose}\n\n${firstCommentCaptionClose}` : withoutClose;
}

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

export async function deleteItem(form: FormData) {
  const { supabase } = await authenticatedClient();
  const id = textValue(form, "id");
  const { data: item } = await supabase.from("content_items").select("identifier").eq("id", id).single();
  if (!item) redirect(`/?notice=${encodeURIComponent("Item not found")}`);
  const { error } = await supabase.from("content_items").delete().eq("id", id);
  revalidatePath("/");
  redirect(`/?notice=${encodeURIComponent(error ? `Delete failed: ${error.message}` : `Deleted item ${item.identifier}`)}`);
}

export async function recordPublishingHandoff(form: FormData) {
  const { supabase, user } = await authenticatedClient();
  const id = textValue(form, "id");
  const { error } = await supabase.from("activity_events").insert({
    owner_id: user.id,
    content_item_id: id,
    event_type: "publishing_handoff",
    details: { destination: "instagram", caption_copied: true },
  });
  revalidatePath("/"); revalidatePath(`/content/${id}`);
  redirect(`/content/${id}?notice=${encodeURIComponent(error ? `Publishing handoff failed: ${error.message}` : "Caption copied and Instagram opened. Mark Posted after publishing.")}`);
}

export async function saveItem(_previous: ActionResult, form: FormData): Promise<ActionResult> {
  const { supabase } = await authenticatedClient();
  const status = textValue(form, "status") as ContentStatus;
  if (!statuses.has(status)) return { ok: false, message: "Invalid status" };
  const contentType = textValue(form, "content_type");
  if (contentType && !contentTypes.has(contentType)) return { ok: false, message: "Invalid content type" };
  const panelCount = numberValue(form, "panel_count");
  if (panelCount !== null && (!Number.isInteger(panelCount) || panelCount < 1 || panelCount > 10)) return { ok: false, message: "Panels must be a whole number from 1 to 10" };
  const expectedVersion = numberValue(form, "record_version");
  if (!expectedVersion) return { ok: false, message: "Missing record version" };
  const id = textValue(form, "id");
  const { data: existing, error: existingError } = await supabase
    .from("content_items")
    .select("instagram_url,publishing_notes")
    .eq("id", id)
    .single();
  if (existingError || !existing) return { ok: false, message: `Save failed: ${existingError?.message ?? "Item not found"}` };
  const args = {
    p_id: id, p_expected_version: expectedVersion,
    p_title: textValue(form, "title"), p_status: status, p_content_type: contentType,
    p_panel_count: panelCount, p_overview: textValue(form, "overview"),
    p_content: textValue(form, "content"), p_caption: textValue(form, "caption"),
    p_first_comment: textValue(form, "first_comment"), p_generation_prompt: textValue(form, "generation_prompt"), p_score: numberValue(form, "score"),
    p_priority: numberValue(form, "priority"), p_is_favorite: form.get("is_favorite") === "on",
    p_instagram_url: existing.instagram_url ?? "", p_publishing_notes: existing.publishing_notes ?? "",
    p_reason: "Content edited",
  };
  const { data, error } = await supabase.rpc("save_content_item", args);
  if (error) return { ok: false, message: `Save failed: ${error.message}` };
  const result = resultObject(data);
  if (result.result !== "saved") return { ok: false, message: String(result.reason ?? "Save failed") };
  revalidatePath("/"); revalidatePath(`/content/${args.p_id}`);
  const version = typeof result.version === "number" ? result.version : Number(result.version);
  return {
    ok: true,
    message: "All changes saved",
    version: Number.isFinite(version) ? version : undefined,
  };
}

export async function quickStatus(form: FormData) {
  const { supabase } = await authenticatedClient();
  const id = textValue(form, "id");
  const { data: item } = await supabase.from("content_items").select("*").eq("id", id).single();
  if (!item) redirect(`/?notice=${encodeURIComponent("Item not found")}`);
  let status = textValue(form, "status") as ContentStatus;
  if (form.get("restore") === "1" && item.status === "archived") {
    const { data: archivedTransition } = await supabase
      .from("status_history")
      .select("from_status")
      .eq("content_item_id", id)
      .eq("to_status", "archived")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const previousStatus = archivedTransition?.from_status as ContentStatus | null | undefined;
    status = previousStatus && previousStatus !== "archived" ? previousStatus : "new";
  }
  const { data, error } = await supabase.rpc("save_content_item", {
    p_id: item.id, p_expected_version: item.record_version, p_title: item.title ?? "", p_status: status,
    p_content_type: item.content_type ?? "", p_panel_count: item.panel_count, p_overview: item.overview ?? "",
    p_content: item.content ?? "", p_caption: item.caption ?? "", p_first_comment: item.first_comment ?? "", p_generation_prompt: item.generation_prompt ?? "",
    p_score: item.score, p_priority: item.priority, p_is_favorite: item.is_favorite,
    p_instagram_url: item.instagram_url ?? "", p_publishing_notes: item.publishing_notes ?? "",
    p_reason: status === "archived" ? "Archived from dashboard" : "Status changed from dashboard",
  });
  const result = resultObject(data as Json);
  revalidatePath("/");
  const requestedReturnPath = textValue(form, "return_to");
  const returnPath = /^\/content\/[0-9a-f-]+$/i.test(requestedReturnPath) ? requestedReturnPath : "/";
  const notice = error ? error.message : result.result === "saved" ? "Status updated" : String(result.reason ?? "Update failed");
  redirect(`${returnPath}?notice=${encodeURIComponent(notice)}`);
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

export async function queueImageGeneration(form: FormData) {
  const { supabase, user } = await authenticatedClient();
  const id = textValue(form, "id");
  const prompt = textValue(form, "prompt");
  const identifier = textValue(form, "identifier");
  if (!prompt || !identifier) redirect(`/content/${id}?notice=${encodeURIComponent("Add an image prompt first")}`);
  const requestedAt = new Date().toISOString();
  const { error } = await supabase.from("scheduled_jobs").insert({
    owner_id: user.id,
    job_type: "drive_image_watch",
    idempotency_key: crypto.randomUUID(),
    status: "queued",
    input: { content_item_id: id, identifier, requested_at: requestedAt, attempts: 0 },
    run_after: requestedAt,
  });
  if (!error) await supabase.from("activity_events").insert({
    owner_id: user.id,
    content_item_id: id,
    event_type: "image_generation_started",
    details: { destination: "chatgpt", drive_folder: "GSD Auto Assets", identifier },
  });
  revalidatePath(`/content/${id}`);
  redirect(`/content/${id}?notice=${encodeURIComponent(error ? `Image generation handoff failed: ${error.message}` : "Prompt copied and ChatGPT opened. This article is now watching GSD Auto Assets for completed images.")}`);
}

export async function importLegacyImages(form: FormData) {
  const { supabase, user } = await authenticatedClient();
  const id = textValue(form, "id");
  const identifier = textValue(form, "identifier");
  if (!id || !identifier) redirect(`/?notice=${encodeURIComponent("Article identifier is required")}`);
  const { data: item } = await supabase.from("content_items").select("status,panel_count").eq("id", id).single();
  const { count } = await supabase.from("assets").select("id", { count: "exact", head: true }).eq("content_item_id", id).in("kind", ["image", "carousel_slide"]);
  if (!item || item.status !== "generated" || !item.panel_count || (count ?? 0) > 0) {
    redirect(`/content/${id}?notice=${encodeURIComponent("Legacy image import is available only for Generated entries that show an image count but have no attached images")}`);
  }
  const { data: pendingJobs } = await supabase.from("scheduled_jobs").select("input").eq("owner_id", user.id).eq("job_type", "drive_image_watch").in("status", ["queued", "running"]);
  const alreadyQueued = (pendingJobs ?? []).some((job) => resultObject(job.input).content_item_id === id && resultObject(job.input).import_existing === true);
  if (alreadyQueued) redirect(`/content/${id}?notice=${encodeURIComponent("Image import is already queued for this entry")}`);
  const requestedAt = new Date().toISOString();
  const { error } = await supabase.from("scheduled_jobs").insert({
    owner_id: user.id,
    job_type: "drive_image_watch",
    idempotency_key: crypto.randomUUID(),
    status: "queued",
    input: { content_item_id: id, identifier, requested_at: requestedAt, attempts: 0, import_existing: true },
    run_after: requestedAt,
  });
  if (!error) await supabase.from("activity_events").insert({
    owner_id: user.id,
    content_item_id: id,
    event_type: "legacy_image_import_started",
    details: { drive_folder: "GSD Auto Assets", identifier },
  });
  revalidatePath(`/content/${id}`);
  redirect(`/content/${id}?notice=${encodeURIComponent(error ? `Image import failed: ${error.message}` : "Import started. Matching images from GSD Auto Assets will appear here after the watcher runs.")}`);
}

export async function generateContent(form: FormData) {
  const { supabase, user } = await authenticatedClient();
  const id=textValue(form,"id"); let prompt=textValue(form,"prompt");
  const {data:itemBeforeGeneration}=await supabase.from("content_items").select("*").eq("id",id).single();
  if (!itemBeforeGeneration) redirect(`/content/${id}?notice=${encodeURIComponent("Item not found")}`);

  // Content edited in the Content Creation screen is authoritative. Once it
  // exists, use AI only to interpret it into an image prompt for the saved
  // Type/quantity. Never replace the user's Content with the interpretation.
  const savedContent = itemBeforeGeneration.content?.trim() ?? "";
  if (savedContent) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) redirect(`/content/${id}?notice=${encodeURIComponent("AI prompt creation is ready but the server API key is not configured")}`);
    const savedType = itemBeforeGeneration.content_type && contentTypes.has(itemBeforeGeneration.content_type)
      ? itemBeforeGeneration.content_type
      : "Single Pane Cartoon";
    const savedPanels = itemBeforeGeneration.panel_count && itemBeforeGeneration.panel_count > 0
      ? itemBeforeGeneration.panel_count
      : 1;
    const { data: sourceLinks } = await supabase.from("content_sources").select("source_id").eq("content_item_id", id);
    const sourceIds = (sourceLinks ?? []).map((link) => link.source_id);
    const { data: linkedSources } = sourceIds.length
      ? await supabase.from("sources").select("canonical_url").in("id", sourceIds)
      : { data: [] };
    const sourceUrls = (linkedSources ?? []).map((source) => source.canonical_url).filter(Boolean);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
        input: `Interpret the user's Content as an image-creation brief.

The Content may be free-form notes, prose, dialogue, or a structured draft. Do not require specific headings or formatting. Preserve its intent, setting, interactions, jokes, and speech. Do not rewrite or return the Content field itself.

Also create a finished, publish-ready Instagram caption that matches the GSD Voice. It should be sharp, funny, conversational, and tied to the workplace or productivity angle in the Content. Do not summarize the image composition or repeat the dialogue. Include a concise audience question or call to action. Do not include the article URL in the caption. If source URLs are provided, end the caption with this exact sentence: "Read the article in the first Comment".

Authoritative format:
Type: ${savedType}
Quantity: ${savedPanels}

For "Single Pane Cartoon", create one image description. For "Multi-pane Cartoon", create one cartoon containing exactly ${savedPanels} panes. For "Carousel (seperate images)", create exactly ${savedPanels} separate image descriptions. Every image or pane must include both Hank and the squirrel in accordance with the GSD guidelines. Add other characters whenever the scene or story requires them. Include only scene-specific setting, interactions/actions, and exact speech. Do not add character appearance or drawing-style instructions.

End the prompt with this exact sentence:
Use the GSD Voice, Image, and ICP documents for instructions on how to create the images.

USER CONTENT
${savedContent}

SOURCE URLS
${sourceUrls.length ? sourceUrls.join("\n") : "None provided"}`,
        text: { format: { type: "json_schema", name: "image_prompt_and_caption", strict: true, schema: { type: "object", additionalProperties: false, properties: { generation_prompt: { type: "string" }, caption: { type: "string" } }, required: ["generation_prompt", "caption"] } } },
      }),
    });
    const body = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }>; error?: { message?: string } };
    const outputText = body.output_text ?? body.output?.flatMap((entry) => entry.content ?? []).find((part) => part.type === "output_text")?.text;
    if (!response.ok || !outputText) redirect(`/content/${id}?notice=${encodeURIComponent(body.error?.message ?? "AI could not interpret the Content")}`);
    const interpreted = JSON.parse(outputText) as { generation_prompt: string; caption: string };
    const closingInstruction = "Use the GSD Voice, Image, and ICP documents for instructions on how to create the images.";
    const promptBody = interpreted.generation_prompt.trim().replace(new RegExp(`\\n*${closingInstruction.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`), "").trim();
    const imagePrompt = `${promptBody}\n\n${closingInstruction}`;
    const primarySourceUrl = sourceUrls[0] ?? "";
    const instagramCaption = finalizeInstagramCaption(interpreted.caption, Boolean(primarySourceUrl));
    const { data: saved, error: saveError } = await supabase.rpc("save_content_item", {
      p_id: id,
      p_expected_version: itemBeforeGeneration.record_version,
      p_title: itemBeforeGeneration.title ?? "",
      p_status: "generated",
      p_content_type: itemBeforeGeneration.content_type ?? "",
      p_panel_count: itemBeforeGeneration.panel_count,
      p_overview: itemBeforeGeneration.overview ?? "",
      p_content: itemBeforeGeneration.content ?? "",
      p_caption: instagramCaption,
      p_first_comment: primarySourceUrl,
      p_generation_prompt: imagePrompt,
      p_score: itemBeforeGeneration.score,
      p_priority: itemBeforeGeneration.priority,
      p_is_favorite: itemBeforeGeneration.is_favorite,
      p_instagram_url: itemBeforeGeneration.instagram_url ?? "",
      p_publishing_notes: itemBeforeGeneration.publishing_notes ?? "",
      p_reason: "Image prompt and GSD Voice caption generated from edited Content using saved Type and quantity",
    });
    const savedObject = resultObject(saved as Json);
    if (saveError || savedObject.result !== "saved") {
      redirect(`/content/${id}?notice=${encodeURIComponent(saveError?.message ?? String(savedObject.reason ?? "Could not create prompt from Content"))}`);
    }
    revalidatePath("/");
    revalidatePath(`/content/${id}`);
    redirect(`/content/${id}?notice=${encodeURIComponent("Prompt and GSD Voice Instagram caption generated from the saved Content. Content was preserved.")}`);
  }

  const expectedVersion=itemBeforeGeneration.record_version;
  if (!prompt) {
    const {data:sourceLinks}=await supabase.from("content_sources").select("source_id").eq("content_item_id",id);
    const sourceIds=(sourceLinks??[]).map(link=>link.source_id);
    const {data:sources}=sourceIds.length?await supabase.from("sources").select("canonical_url,title,summary,strongest_comment").in("id",sourceIds):{data:[]};
    prompt=`Create a GSD Instagram post based on this news article.\n\nArticle title: ${itemBeforeGeneration?.title??"Untitled article"}\n${(sources??[]).map(source=>`Source: ${source.canonical_url}\nArticle overview: ${source.summary??""}\nNotable angle: ${source.strongest_comment??""}`).join("\n\n")}`.trim();
  }
  if (!prompt) redirect(`/content/${id}?notice=${encodeURIComponent("Add a source or generation prompt first")}`);
  const key=crypto.randomUUID();
  const {data:run,error:runError}=await supabase.from("generation_runs").insert({owner_id:user.id,content_item_id:id,idempotency_key:key,prompt,status:"running"}).select().single();
  if(!run||runError) redirect(`/content/${id}?notice=${encodeURIComponent(runError?.message??"Could not start generation")}`);
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey){ await supabase.from("generation_runs").update({status:"failed",error_message:"OPENAI_API_KEY is not configured",completed_at:new Date().toISOString()}).eq("id",run.id); redirect(`/content/${id}?notice=${encodeURIComponent("AI generation is ready but the server API key is not configured")}`); }
  try {
    const { data: instructionSetting } = await supabase.from("app_settings").select("setting_value").eq("setting_key", "instructions").maybeSingle();
    const workflowInstructions = resultObject((instructionSetting?.setting_value ?? {}) as Json).markdown;
    const brandContract = `GSD BRAND CONTRACT — NON-NEGOTIABLE
- Hank is a raccoon, never a human. He is calm, practical, organized, and usually wears his familiar hoodie.
- The squirrel is a male squirrel, never human and never given feminine characteristics. He is energetic, distractible, funny, and expressive without looking angry or frightened.
- Murphy, when used, is a happy, aware Bernese Mountain Dog.
- Preserve the established Hank, squirrel, and Murphy appearance, proportions, wardrobe, palette, and recurring props. Laptops are plain gray. Hank's standard mug reads "Focus > Fluff" in white on three lines.
- Tone is concise, warm, practical, and workplace-observational. Hank grounds the scene; the squirrel supplies energetic comic contrast. Do not turn either character into a generic motivational mascot.
- This is an edgy comedy brand. Depict absurd, awkward, confrontational, and slapstick moments directly when the source and joke call for them. Do not weaken an ordinary comedic scene with euphemisms, off-screen substitutes, empty-chair symbolism, or editorial safety commentary.
- Describe what is visibly happening in plain language. For example: "A clown sits with his hands behind him on a chair as a turtle walks up to a table of pies." Do not append phrases such as "without showing harm," "indicates the alleged incident," "avoid distress," or similar disclaimers unless a specific detail would otherwise require graphic gore or explicit injury.
- Use the stored Library guidelines to inform the concept, but do not repeat character descriptions, appearance rules, wardrobe, palette, props, or drawing-style instructions in generation_prompt.
- Output is for the V2 app. Do not include Google Sheet instructions, CSV rows, filenames, claims that you cannot access tools, or offers to do more work.
- If hashtags are useful, use no more than four in the caption. Do not put hashtags or CTA copy in Content or generation_prompt.`;
    const outputContract = `OUTPUT CONTRACT — NON-NEGOTIABLE
- Overview must contain exactly two short paragraphs separated by a blank line. Paragraph 1 is a factual 1–2 sentence overview of the news article. Paragraph 2 is a 1–2 sentence GSD take explaining Hank and the squirrel's comedic/productivity angle.
- Use exactly one of these content_type values: "Single Pane Cartoon", "Multi-pane Cartoon", or "Carousel (seperate images)".
- "Single Pane Cartoon" always has panel_count 1. "Multi-pane Cartoon" is one image containing multiple panes. "Carousel (seperate images)" uses one separate image per panel.
- Set panel_count to the exact number of panes or separate carousel images, from 1–10.
- Score the idea from 0–100 based on GSD brand fit, comedic potential, usefulness, and visual clarity.
- Caption must be finished, publish-ready Instagram copy that matches the GSD Voice—not an image summary. Make it sharp, funny, conversational, and tied to the workplace or productivity angle. Include a concise audience question or CTA tied to the workplace issue. Do not narrate the composition or repeat the panel dialogue.
- When the item has a source article URL, do not include the URL itself in Caption. End Caption with this exact sentence: "Read the article in the first Comment". The URL is stored separately in First Comment.
- Content is the complete creative blueprint and must use this exact V1-style structure:
  Setting: [one overall location for the full post]

  Panel 1 — [short beat title]
  Action: [plain, literal description of what happens in this panel]
  Hank: “[exact dialogue]”
  the squirrel: “[exact dialogue]”

  Repeat the Panel / Action / speaker lines for every panel. Include only speakers who appear. For a single image, use "Panel 1" and the same structure.
- Every image or pane must include both Hank and the squirrel in accordance with the GSD guidelines. Add other characters whenever the scene or story requires them.\n- Keep actions direct and concrete. For example, show the person seated with hands behind them while another character approaches a table of pies; do not replace the action with symbols, an empty chair, euphemisms, or safety commentary.
- The generation_prompt must begin by reproducing the complete Content blueprint verbatim: the single overall Setting line followed by every Panel, Action, and speaker-dialogue line. Do not translate it into an "Image # / Interactions / Conversation" format.
- After the complete image descriptions and one blank line, generation_prompt must end with this exact sentence: "Use the GSD Voice, Image, and ICP documents for instructions on how to create the images."
- The stored ChatGPT Library documents are the sole source for character appearance, proportions, wardrobe, palette, recurring props, and drawing style. Do not describe or restate any of those details in generation_prompt.
- Do not include composition boilerplate, continuity reminders, image dimensions, filenames, hashtags, caption copy, article summaries, explanations, or safety disclaimers in generation_prompt.
- Except for the required closing sentence, generation_prompt contains only the exact V1-style Content blueprint.`;
    const savedType = itemBeforeGeneration?.content_type && contentTypes.has(itemBeforeGeneration.content_type) ? itemBeforeGeneration.content_type : null;
    const savedPanels = itemBeforeGeneration?.panel_count && itemBeforeGeneration.panel_count > 0 ? itemBeforeGeneration.panel_count : null;
    const savedFormat = savedType || savedPanels
      ? `\n\nSAVED FORMAT — AUTHORITATIVE\n${savedType ? `The user selected Type "${savedType}". Use it exactly; do not override it.` : ""}${savedType && savedPanels ? "\n" : ""}${savedPanels ? `The user selected Panels ${savedPanels}. Use it exactly; do not override it.` : ""}`
      : "";
    const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{authorization:`Bearer ${apiKey}`,"content-type":"application/json"},body:JSON.stringify({model:process.env.OPENAI_MODEL??"gpt-5-mini",input:`${brandContract}\n\n${outputContract}${savedFormat}\n\nCURRENT WORKFLOW INSTRUCTIONS\n${typeof workflowInstructions === "string" ? workflowInstructions : ""}\n\nCreate the complete GSD content concept and its final image-generation prompt. Follow the source material without repeating operational instructions in the public-facing content.\n\nSOURCE MATERIAL\n${prompt}`,text:{format:{type:"json_schema",name:"gsd_content",strict:true,schema:{type:"object",additionalProperties:false,properties:{content_type:{type:"string",enum:["Single Pane Cartoon","Multi-pane Cartoon","Carousel (seperate images)"]},panel_count:{type:"integer",minimum:1,maximum:10},score:{type:"number",minimum:0,maximum:100},overview:{type:"string"},content:{type:"string"},caption:{type:"string"},generation_prompt:{type:"string"}},required:["content_type","panel_count","score","overview","content","caption","generation_prompt"]}}}})});
    const body=await response.json() as {output_text?:string;output?:Array<{content?:Array<{type?:string;text?:string}>}>;error?:{message?:string}};
    const outputText=body.output_text??body.output?.flatMap(item=>item.content??[]).find(part=>part.type==="output_text")?.text;
    if(!response.ok||!outputText) throw new Error(body.error?.message??`OpenAI returned HTTP ${response.status} without structured output`);
    const parsedOutput=JSON.parse(outputText) as {content_type:"Single Pane Cartoon"|"Multi-pane Cartoon"|"Carousel (seperate images)";panel_count:number;score:number;overview:string;content:string;caption:string;generation_prompt:string};
    const contentBlueprint = parsedOutput.content.trim();
    const { data: outputSourceLinks } = await supabase.from("content_sources").select("source_id").eq("content_item_id", id);
    const outputSourceIds = (outputSourceLinks ?? []).map((link) => link.source_id);
    const { data: outputSources } = outputSourceIds.length
      ? await supabase.from("sources").select("canonical_url").in("id", outputSourceIds)
      : { data: [] };
    const primarySourceUrl = outputSources?.[0]?.canonical_url ?? "";
    const output = {
      ...parsedOutput,
      content_type: savedType ?? parsedOutput.content_type,
      panel_count: savedPanels ?? parsedOutput.panel_count,
      content: contentBlueprint,
      caption: finalizeInstagramCaption(parsedOutput.caption, Boolean(primarySourceUrl)),
      first_comment: primarySourceUrl,
      generation_prompt: `${contentBlueprint}\n\nUse the GSD Voice, Image, and ICP documents for instructions on how to create the images.`,
    };
    const {data:item}=await supabase.from("content_items").select("*").eq("id",id).single();
    if(!item||item.record_version!==expectedVersion){await supabase.from("generation_runs").update({status:"succeeded",output,completed_at:new Date().toISOString(),error_message:"Output retained but not promoted because the record changed"}).eq("id",run.id);redirect(`/content/${id}?notice=${encodeURIComponent("Generation completed but was not applied because the item changed. The output remains in Generation Runs.")}`);}
    const {data:saved,error:saveError}=await supabase.rpc("save_content_item",{p_id:id,p_expected_version:expectedVersion,p_title:item.title??"",p_status:"generated",p_content_type:output.content_type,p_panel_count:output.panel_count,p_overview:output.overview,p_content:output.content,p_caption:output.caption,p_first_comment:output.first_comment,p_generation_prompt:output.generation_prompt,p_score:output.score,p_priority:item.priority,p_is_favorite:item.is_favorite,p_instagram_url:item.instagram_url??"",p_publishing_notes:item.publishing_notes??"",p_reason:"AI generation promoted"});
    const savedObject=resultObject(saved as Json); if(saveError||savedObject.result!=="saved") throw new Error(saveError?.message??String(savedObject.reason??"Could not promote output"));
    await supabase.from("generation_runs").update({status:"succeeded",output,promoted_at:new Date().toISOString(),completed_at:new Date().toISOString()}).eq("id",run.id);
    revalidatePath("/"); revalidatePath(`/content/${id}`); redirect(`/content/${id}?notice=${encodeURIComponent("Content generated and saved as a new version")}`);
  } catch(error) { unstable_rethrow(error); await supabase.from("generation_runs").update({status:"failed",error_message:error instanceof Error?error.message:"Unknown generation error",completed_at:new Date().toISOString()}).eq("id",run.id); redirect(`/content/${id}?notice=${encodeURIComponent(error instanceof Error?error.message:"Generation failed")}`); }
}
