import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createItem, quickStatus } from "./actions";
import { AppHeader } from "@/components/app-header";
import type { ContentItem, ContentStatus } from "@/types/database";

const statusOrder: ContentStatus[] = ["new", "auto_added", "generated", "posted", "archived"];
const labels: Record<ContentStatus, string> = { new: "New", auto_added: "Auto-Added", generated: "Generated", posted: "Posted", archived: "Archived" };

function identifierParts(value: string) { const [root, variation = "0"] = value.split("-"); return [Number(root) || 0, Number(variation) || 0]; }
function sortItems(items: ContentItem[], sort: string, direction: string) {
  const factor = direction === "asc" ? 1 : -1;
  return items.toSorted((a, b) => {
    let compared = 0;
    if (sort === "identifier") { const [ar,av] = identifierParts(a.identifier); const [br,bv] = identifierParts(b.identifier); compared = ar - br || av - bv; }
    else if (sort === "title") compared = (a.title ?? "").localeCompare(b.title ?? "", undefined, { sensitivity: "base" });
    else if (sort === "type") compared = (a.content_type ?? "").localeCompare(b.content_type ?? "", undefined, { sensitivity: "base" });
    else if (sort === "panels") compared = (a.panel_count ?? -1) - (b.panel_count ?? -1);
    else if (sort === "status") compared = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    else if (sort === "score") compared = (a.score ?? -1) - (b.score ?? -1);
    else if (sort === "favorite") compared = Number(a.is_favorite) - Number(b.is_favorite);
    else if (sort === "posted") compared = (a.posted_at ?? "").localeCompare(b.posted_at ?? "");
    else if (sort === "updated") compared = a.updated_at.localeCompare(b.updated_at);
    else compared = a.created_at.localeCompare(b.created_at);
    return compared * factor;
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<{ status?: string; sort?: string; direction?: string; q?: string; favorite?: string; notice?: string }> }) {
  const params = await searchParams; const supabase = await createClient();
  const [{ data }, { data: handoffs }] = await Promise.all([
    supabase.from("content_items").select("*"),
    supabase.from("activity_events").select("content_item_id").eq("event_type", "publishing_handoff"),
  ]);
  const all = (data ?? []) as ContentItem[]; const counts = Object.fromEntries(statusOrder.map((status) => [status, all.filter((item) => item.status === status).length]));
  const pendingHandoffs = new Set((handoffs ?? []).map((event) => event.content_item_id));
  const selectedStatus = statusOrder.includes(params.status as ContentStatus) ? params.status as ContentStatus : null;
  const query = (params.q ?? "").toLowerCase();
  const filtered = all.filter((item) => (!selectedStatus || item.status === selectedStatus) && (params.favorite !== "1" || item.is_favorite) && (!query || [item.identifier,item.title,item.overview,item.caption,item.content].some((value) => value?.toLowerCase().includes(query))));
  const items = sortItems(filtered, params.sort ?? "created", params.direction ?? "desc");
  const visibleStatuses = selectedStatus ? [selectedStatus] : statusOrder;
  const groupedItems = visibleStatuses.map((status) => ({ status, items: items.filter((item) => item.status === status) })).filter((group) => group.items.length > 0);
  const visibleItemIds = items.map((item) => item.id);
  const { data: imageAssets } = visibleItemIds.length
    ? await supabase.from("assets").select("id,content_item_id,storage_path,slide_number,kind").in("content_item_id", visibleItemIds).in("kind", ["image", "carousel_slide"]).order("slide_number", { ascending: true })
    : { data: [] };
  const imagePaths = (imageAssets ?? []).map((asset) => asset.storage_path);
  const { data: signedImages } = imagePaths.length
    ? await supabase.storage.from("content-assets").createSignedUrls(imagePaths, 3600)
    : { data: [] };
  const thumbnailsByItem = new Map<string, Array<{ id: string; url: string; slide: number | null }>>();
  (imageAssets ?? []).forEach((asset, index) => {
    if (!asset.content_item_id) return;
    const url = signedImages?.[index]?.signedUrl;
    if (!url) return;
    const current = thumbnailsByItem.get(asset.content_item_id) ?? [];
    current.push({ id: asset.id, url, slide: asset.slide_number });
    thumbnailsByItem.set(asset.content_item_id, current);
  });
  return <main className="app-shell">
    <AppHeader />
    <section className="dashboard-head"><div><p className="eyebrow">Content Operating System</p><h1>Get Sh*t Posted.</h1><p>{all.length} migrated ideas · {all.filter((item) => item.is_favorite).length} favorites · {all.filter((item) => item.status !== "archived").length} active</p></div><form action={createItem} className="create-form"><input name="title" placeholder="New idea title" aria-label="New idea title" /><button className="primary">Add Idea</button></form></section>
    {params.notice ? <div className="notice">{params.notice}</div> : null}
    <section className="status-grid">{statusOrder.map((status) => <Link key={status} href={status === selectedStatus ? "/" : `/?status=${status}`} data-active={status === selectedStatus}><span>{labels[status]}</span><strong>{counts[status]}</strong></Link>)}</section>
    <form className="filters"><input name="q" defaultValue={params.q} placeholder="Search identifiers, captions, sources…" aria-label="Search content" /><select name="status" defaultValue={params.status ?? ""}><option value="">All Statuses</option>{statusOrder.map((s) => <option key={s} value={s}>{labels[s]}</option>)}</select><select name="sort" defaultValue={params.sort ?? "created"}><option value="identifier">Identifier</option><option value="title">Title</option><option value="type">Type</option><option value="panels">Panels</option><option value="score">Score</option><option value="created">Date Added</option><option value="updated">Updated Date</option><option value="posted">Posted Date</option><option value="status">Status</option><option value="favorite">Favorite</option></select><select name="direction" defaultValue={params.direction ?? "desc"}><option value="desc">Descending</option><option value="asc">Ascending</option></select><label className="check"><input type="checkbox" name="favorite" value="1" defaultChecked={params.favorite === "1"} /> Favorites</label><button>Apply</button><Link href="/">Clear</Link></form>
    <section className="dashboard-groups" aria-label="Content items">{groupedItems.map((group) => <section className="content-group" key={group.status}><header className="group-heading"><h2>{labels[group.status]}</h2><span>{group.items.length}</span></header><div className="content-list"><div className="list-head"><span>Identifier / Title</span><span>Type</span><span>Panels</span><span>Score</span><span>Updated</span><span>Actions</span></div>{group.items.map((item) => <article className="content-row" key={item.id}><Link className="content-main" href={`/content/${item.id}`}><div className="identifier">#{item.identifier}{item.is_favorite ? <span aria-label="Favorite">★</span> : null}</div><div><h2>{item.title || "Untitled Idea"}</h2><p>{item.overview || item.caption || item.content || "No content added yet."}</p>{item.status !== "posted" && pendingHandoffs.has(item.id) ? <small>Posted?</small> : null}</div>{thumbnailsByItem.get(item.id)?.length ? <div className="dashboard-thumbnails" aria-label={`Generated images for ${item.title || `item ${item.identifier}`}`}>{thumbnailsByItem.get(item.id)?.map((thumbnail, index) => <Image key={thumbnail.id} src={thumbnail.url} alt={`${item.title || `Item ${item.identifier}`} generated image ${thumbnail.slide ?? index + 1}`} width={64} height={64} unoptimized />)}</div> : null}</Link><span>{item.content_type || "—"}</span><span>{item.panel_count ?? "—"}</span><strong className="score-value">{item.score ?? "—"}</strong><time>{new Date(item.status === "posted" && item.posted_at ? item.posted_at : item.updated_at).toLocaleDateString()}</time><div className="row-actions"><Link href={`/content/${item.id}`}>Open</Link>{item.status !== "archived" ? <form action={quickStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="archived" /><button aria-label={`Archive ${item.identifier}`}>Archive</button></form> : <form action={quickStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="new" /><input type="hidden" name="restore" value="1" /><button>Restore</button></form>}</div></article>)}</div></section>)}{items.length === 0 ? <div className="empty">No records match these filters.</div> : null}</section>
  </main>;
}
