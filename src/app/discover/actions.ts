"use server";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

function isPrivateIp(ip: string) {
  if (!isIP(ip)) return true;
  return /^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip) || ip === "::1" || /^f[cd]/i.test(ip) || /^fe80:/i.test(ip);
}
async function safeUrl(raw: string) {
  const url = new URL(raw); if (!["http:","https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS URLs are allowed");
  if (url.username || url.password || url.hostname === "localhost") throw new Error("Private or credentialed URLs are not allowed");
  const addresses = await lookup(url.hostname, { all: true }); if (!addresses.length || addresses.some(a => isPrivateIp(a.address))) throw new Error("Private or internal addresses are not allowed");
  url.hash = ""; return url;
}
function articleText(html: string) {
  const article = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  return article
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12_000);
}

function metadata(html: string, fallback: string) {
  const pick = (patterns: RegExp[]) => patterns.map(p => html.match(p)?.[1]).find(Boolean)?.replace(/&amp;/g,"&").replace(/&quot;/g,'"').trim();
  return { title: pick([/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i,/<title[^>]*>([^<]+)/i]) ?? fallback,
    summary: pick([/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)/i]) ?? null };
}

export async function discoverUrls(form: FormData) {
  const { supabase, user } = await requireAdmin();
  const submitted = String(form.get("urls") ?? "").split(/\r?\n|,/).map(v => v.trim()).filter(Boolean);
  if (!submitted.length) redirect("/discover?notice=Enter%20at%20least%20one%20URL");
  const { data: batch, error: batchError } = await supabase.from("discovery_batches").insert({ owner_id: user.id, submitted_count: submitted.length }).select().single();
  if (!batch || batchError) redirect(`/discover?notice=${encodeURIComponent(batchError?.message ?? "Could not start batch")}`);
  let created=0, existing=0, failed=0;
  for (const raw of submitted) {
    try {
      const url = await safeUrl(raw); const canonical = url.toString();
      const { data: found } = await supabase.from("sources").select("id").eq("canonical_url", canonical).maybeSingle();
      if (found) { existing++; await supabase.from("discovery_results").insert({ owner_id:user.id,batch_id:batch.id,submitted_url:raw,canonical_url:canonical,status:"existing",source_id:found.id,reason:"Source already exists" }); continue; }
      const response = await fetch(canonical, { redirect:"error", signal:AbortSignal.timeout(12000), headers:{"user-agent":"GSDContentBot/2.0"} });
      if (!response.ok) throw new Error(`Website returned HTTP ${response.status}`);
      const type = response.headers.get("content-type") ?? ""; if (!type.includes("text/html")) throw new Error("URL is not an HTML page");
      const html=(await response.text()).slice(0,1_000_000); const meta=metadata(html,url.hostname); const fullText=articleText(html);
      const { data: source, error: sourceError } = await supabase.from("sources").insert({ owner_id:user.id,canonical_url:canonical,website:url.hostname,title:meta.title,summary:meta.summary }).select().single();
      if (!source || sourceError) throw new Error(sourceError?.message ?? "Could not save source");
      const { data: itemResult, error:itemError } = await supabase.rpc("create_content_item",{p_title:meta.title});
      const itemId = typeof itemResult === "object" && itemResult && !Array.isArray(itemResult) && typeof itemResult.id === "string" ? itemResult.id : null;
      if (!itemId || itemError) throw new Error(itemError?.message ?? "Could not create content item");
      await supabase.from("content_sources").insert({owner_id:user.id,content_item_id:itemId,source_id:source.id});
      await supabase.from("content_items").update({status:"auto_added",overview:meta.summary,generation_prompt:`Create a Hank and the Squirrel Instagram post based on this source: ${canonical}\n\nSource description: ${meta.summary ?? meta.title}\n\nFull article text:\n${fullText || meta.summary || meta.title}`}).eq("id",itemId);
      created++; await supabase.from("discovery_results").insert({owner_id:user.id,batch_id:batch.id,submitted_url:raw,canonical_url:canonical,status:"created",source_id:source.id,content_item_id:itemId,reason:"Source and content item created"});
    } catch (error) { failed++; await supabase.from("discovery_results").insert({owner_id:user.id,batch_id:batch.id,submitted_url:raw,status:"failed",reason:error instanceof Error?error.message:"Unknown error"}); }
  }
  await supabase.from("discovery_batches").update({status:failed===submitted.length?"failed":"succeeded",created_count:created,existing_count:existing,failed_count:failed,completed_at:new Date().toISOString()}).eq("id",batch.id);
  revalidatePath("/discover"); revalidatePath("/"); redirect(`/discover?batch=${batch.id}`);
}
