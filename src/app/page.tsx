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
    else if (sort === "status") compared = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    else if (sort === "score") compared = (a.score ?? -1) - (b.score ?? -1);
    else if (sort === "posted") compared = (a.posted_at ?? "").localeCompare(b.posted_at ?? "");
    else compared = a.created_at.localeCompare(b.created_at);
    return compared * factor;
  });
}

export default async function Home({ searchParams }: { searchParams: Promise<{ status?: string; sort?: string; direction?: string; q?: string; favorite?: string; notice?: string }> }) {
  const params = await searchParams; const supabase = await createClient();
  const { data } = await supabase.from("content_items").select("*");
  const all = (data ?? []) as ContentItem[]; const counts = Object.fromEntries(statusOrder.map((status) => [status, all.filter((item) => item.status === status).length]));
  const selectedStatus = statusOrder.includes(params.status as ContentStatus) ? params.status as ContentStatus : null;
  const query = (params.q ?? "").toLowerCase();
  const filtered = all.filter((item) => (!selectedStatus || item.status === selectedStatus) && (params.favorite !== "1" || item.is_favorite) && (!query || [item.identifier,item.title,item.overview,item.caption,item.content].some((value) => value?.toLowerCase().includes(query))));
  const items = sortItems(filtered, params.sort ?? "created", params.direction ?? "desc");
  return <main className="app-shell">
    <AppHeader />
    <section className="dashboard-head"><div><p className="eyebrow">Content Operating System</p><h1>Get Sh*t Posted.</h1><p>{all.length} migrated ideas · {all.filter((item) => item.is_favorite).length} favorites · {all.filter((item) => item.status !== "archived").length} active</p></div><form action={createItem} className="create-form"><input name="title" placeholder="New idea title" aria-label="New idea title" /><button className="primary">Add Idea</button></form></section>
    {params.notice ? <div className="notice">{params.notice}</div> : null}
    <section className="status-grid">{statusOrder.map((status) => <Link key={status} href={status === selectedStatus ? "/" : `/?status=${status}`} data-active={status === selectedStatus}><span>{labels[status]}</span><strong>{counts[status]}</strong></Link>)}</section>
    <form className="filters"><input name="q" defaultValue={params.q} placeholder="Search identifiers, captions, sources…" aria-label="Search content" /><select name="status" defaultValue={params.status ?? ""}><option value="">All Statuses</option>{statusOrder.map((s) => <option key={s} value={s}>{labels[s]}</option>)}</select><select name="sort" defaultValue={params.sort ?? "created"}><option value="created">Date Added</option><option value="identifier">Identifier</option><option value="status">Status</option><option value="score">Score</option><option value="posted">Posted Date</option></select><select name="direction" defaultValue={params.direction ?? "desc"}><option value="desc">Descending</option><option value="asc">Ascending</option></select><label className="check"><input type="checkbox" name="favorite" value="1" defaultChecked={params.favorite === "1"} /> Favorites</label><button>Apply</button><Link href="/">Clear</Link></form>
    <section className="content-list" aria-label="Content items"><div className="list-head"><span>{items.length} results</span><span>Updated</span><span>Status</span><span>Actions</span></div>{items.map((item) => <article className="content-row" key={item.id}><Link className="content-main" href={`/content/${item.id}`}><div className="identifier">#{item.identifier}{item.is_favorite ? <span aria-label="Favorite">★</span> : null}</div><div><h2>{item.title || "Untitled Idea"}</h2><p>{item.overview || item.caption || item.content || "No content added yet."}</p><small>{item.content_type || "Uncategorized"}{item.panel_count ? ` · ${item.panel_count} panels` : ""}{item.score != null ? ` · Score ${item.score}` : ""}</small></div></Link><time>{new Date(item.status === "posted" && item.posted_at ? item.posted_at : item.updated_at).toLocaleDateString()}</time><span className={`status-pill status-${item.status}`}>{labels[item.status]}</span><div className="row-actions"><Link href={`/content/${item.id}`}>Open</Link>{item.status !== "archived" ? <form action={quickStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="archived" /><button aria-label={`Archive ${item.identifier}`}>Archive</button></form> : <form action={quickStatus}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="status" value="new" /><button>Restore</button></form>}</div></article>)}{items.length === 0 ? <div className="empty">No records match these filters.</div> : null}</section>
  </main>;
}
