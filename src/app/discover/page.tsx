import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { requireAdmin } from "@/lib/auth";
import { discoverUrls } from "./actions";

export default async function Discover({searchParams}:{searchParams:Promise<{batch?:string;notice?:string}>}) {
  const p=await searchParams; const {supabase}=await requireAdmin();
  const {data:batches}=await supabase.from("discovery_batches").select("*").order("created_at",{ascending:false}).limit(20);
  const selected=p.batch ?? batches?.[0]?.id; const {data:results}=selected?await supabase.from("discovery_results").select("*").eq("batch_id",selected).order("created_at"):{data:[]};
  return <main className="app-shell"><AppHeader/><section className="detail-head"><div><p className="eyebrow">Source Ingestion</p><h1>Discover</h1><p>Submit one URL or many. Every URL receives an explicit result.</p></div></section>{p.notice?<div className="notice">{p.notice}</div>:null}
    <section className="panel"><h2>Add URLs</h2><form action={discoverUrls}><textarea name="urls" rows={8} required placeholder="One URL per line"/><div className="save-row"><button className="primary">Discover Sources</button><p className="muted">Duplicates are reported, not recreated.</p></div></form></section>
    <section className="panel"><h2>Recent Batches</h2><div className="batch-list">{(batches??[]).map(b=><Link href={`/discover?batch=${b.id}`} data-active={b.id===selected} key={b.id}><strong>{new Date(b.created_at).toLocaleString()}</strong><span>{b.submitted_count} submitted · {b.created_count} created · {b.existing_count} existing · {b.failed_count} failed</span></Link>)}</div></section>
    {selected?<section className="panel"><h2>Per-URL Results</h2><div className="result-table">{(results??[]).map(r=><div key={r.id}><span className={`status-pill status-${r.status}`}>{r.status}</span><a href={r.canonical_url??r.submitted_url} target="_blank" rel="noreferrer">{r.submitted_url}</a><span>{r.reason}</span>{r.content_item_id?<Link href={`/content/${r.content_item_id}`}>Open Item</Link>:<span/>}</div>)}</div></section>:null}
  </main>;
}
