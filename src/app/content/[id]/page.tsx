import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { duplicateItem, generateContent, quickStatus, recordGeneration } from "@/app/actions";
import { Editor } from "./editor";
import { CopyButton } from "./copy-button";
import { PublishingButton } from "./publishing-button";
import { DeleteButton } from "./delete-button";
import { GenerateImagesButton } from "./generate-images-button";
import { GenerateContentButton } from "./generate-content-button";
import type { ContentItem } from "@/types/database";

export default async function ContentDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ notice?: string }> }) {
  const { id } = await params; const { notice } = await searchParams; const supabase = await createClient();
  const [{ data: item }, { data: assets }, { data: history }, { data: events }, { data: sourceLinks }, { data: runs }] = await Promise.all([
    supabase.from("content_items").select("*").eq("id", id).single(),
    supabase.from("assets").select("*").eq("content_item_id", id).order("slide_number"),
    supabase.from("status_history").select("*").eq("content_item_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("activity_events").select("*").eq("content_item_id", id).order("created_at", { ascending: false }).limit(20),
    supabase.from("content_sources").select("source_id").eq("content_item_id", id),
    supabase.from("generation_runs").select("*").eq("content_item_id", id).order("created_at", { ascending: false }).limit(20),
  ]);
  if (!item) notFound();
  const sourceIds = sourceLinks?.map((link) => link.source_id) ?? [];
  const { data: sources } = sourceIds.length ? await supabase.from("sources").select("*").in("id", sourceIds) : { data: [] };
  const signedAssets = await Promise.all((assets ?? []).map(async (asset) => ({ ...asset, url: (await supabase.storage.from("content-assets").createSignedUrl(asset.storage_path, 3600)).data?.signedUrl ?? null })));
  const hasPendingHandoff = item.status !== "posted" && (events ?? []).some((event) => event.event_type === "publishing_handoff");
  return <main className="app-shell">
    <header className="topbar"><Link className="brand" href="/">GSD Content</Link><Link href="/">← Dashboard</Link></header>
    <section className="detail-head"><div><p className="eyebrow">Content {item.identifier}</p><h1>{item.title || "Untitled Idea"}</h1><p>Version {item.record_version} · Updated {new Date(item.updated_at).toLocaleString()}</p></div><div className="button-row"><form action={duplicateItem}><input type="hidden" name="id" value={item.id} /><button>Duplicate Idea</button></form>{item.status !== "archived" ? <form action={quickStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="archived" /><button className="danger">Archive</button></form> : <form action={quickStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="new" /><input type="hidden" name="restore" value="1" /><button>Restore</button></form>}<DeleteButton id={item.id} identifier={item.identifier} /></div></section>
    {notice ? <div className="notice">{notice}</div> : null}
    {signedAssets.length ? <section className="panel"><h2>Assets ({signedAssets.length})</h2><div className="asset-grid">{signedAssets.map((asset) => asset.url ? <a href={asset.url} target="_blank" rel="noreferrer" key={asset.id}><Image src={asset.url} alt={`Content ${item.identifier}${asset.slide_number ? ` slide ${asset.slide_number}` : " image"}`} width={360} height={360} unoptimized /><span>{asset.slide_number ? `Slide ${asset.slide_number}` : asset.kind}</span></a> : null)}</div></section> : null}
    <section className="panel"><div className="panel-title"><h2>Content Tools</h2><div className="button-row"><form action={generateContent}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="record_version" value={item.record_version}/><input type="hidden" name="prompt" value={item.generation_prompt ?? ""}/><GenerateContentButton /></form><GenerateImagesButton id={item.id} identifier={item.identifier} prompt={item.generation_prompt ?? ""} /><CopyButton value={item.generation_prompt ?? ""} label="Copy Prompt" /><CopyButton value={item.caption ?? ""} label="Copy Caption" /><form action={recordGeneration}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="prompt" value={item.generation_prompt ?? ""} /><button disabled={!item.generation_prompt}>Record Manual Generation</button></form><PublishingButton id={item.id} caption={item.caption ?? ""} />{item.status !== "posted" ? <form action={quickStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="posted" /><button className="primary">Mark Posted</button></form> : null}</div></div>{hasPendingHandoff ? <p className="notice">Publishing started but this item is not marked Posted yet.</p> : null}</section>
    <section className="panel"><h2>Edit Content</h2><Editor item={item as ContentItem} /></section>
    {sources?.length ? <section className="panel"><h2>Sources</h2>{sources.map((source) => <article className="source" key={source.id}><a href={source.canonical_url} target="_blank" rel="noreferrer">{source.title || source.website || source.canonical_url}</a>{source.summary ? <p>{source.summary}</p> : null}{source.strongest_comment ? <blockquote>{source.strongest_comment}</blockquote> : null}</article>)}</section> : null}
    <section className="panel"><h2>Generation Runs ({runs?.length ?? 0})</h2>{runs?.length ? <div className="timeline">{runs.map((run) => <div key={run.id}><time>{new Date(run.created_at).toLocaleString()}</time><strong>{run.status}</strong><span>{run.error_message || run.prompt}</span></div>)}</div> : <p className="muted">No generation runs recorded yet.</p>}</section>
    <section className="panel"><h2>Activity History</h2><div className="timeline">{[...(history ?? []).map((row) => ({ id: row.id, at: row.created_at, label: `Status: ${row.from_status ?? "created"} → ${row.to_status}`, detail: row.reason })), ...(events ?? []).map((row) => ({ id: String(row.id), at: row.created_at, label: row.event_type.replaceAll("_", " "), detail: null }))].sort((a,b) => b.at.localeCompare(a.at)).slice(0,30).map((row) => <div key={`${row.id}-${row.label}`}><time>{new Date(row.at).toLocaleString()}</time><strong>{row.label}</strong>{row.detail ? <span>{row.detail}</span> : null}</div>)}</div></section>
  </main>;
}
