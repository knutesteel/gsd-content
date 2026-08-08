import { AppHeader } from "@/components/app-header";
import { requireAdmin } from "@/lib/auth";
import { saveMetric } from "@/app/modules/actions";

export default async function Page({searchParams}:{searchParams:Promise<{notice?:string}>}) { const p=await searchParams; const {supabase}=await requireAdmin(); const [{data:metrics},{data:items}] = await Promise.all([supabase.from("metrics").select("*").order("measured_at",{ascending:false}).limit(100),supabase.from("content_items").select("status,posted_at")]); const latest=new Map<string,typeof metrics extends (infer R)[]|null?R:never>(); for(const m of metrics??[]) if(!latest.has(m.metric_name)) latest.set(m.metric_name,m);
  return <main className="app-shell"><AppHeader/><section className="detail-head"><div><p className="eyebrow">Performance & Portability</p><h1>Metrics & Export</h1><p>{items?.filter(i=>i.status==="posted").length??0} posted items · {latest.size} tracked metrics</p></div><a className="primary action-link" href="/api/export/content">Download Content CSV</a></section>{p.notice?<div className="notice">{p.notice}</div>:null}
    <section className="metric-grid">{[...latest.values()].map(m=><article key={m.id}><span>{m.metric_name}</span><strong>{Number(m.metric_value).toLocaleString()}</strong><small>{new Date(m.measured_at).toLocaleDateString()}</small></article>)}</section>
    <section className="panel"><h2>Record Metric</h2><form action={saveMetric} className="form-grid"><label>Metric Name<input name="metric_name" required placeholder="Instagram Followers"/></label><label>Value<input name="metric_value" required type="number" step="any"/></label><label>Measured At<input name="measured_at" type="datetime-local"/></label><label className="wide">Notes<input name="notes"/></label><button className="primary">Record</button></form></section>
    <section className="panel"><h2>History</h2><div className="timeline">{(metrics??[]).map(m=><div key={m.id}><time>{new Date(m.measured_at).toLocaleString()}</time><strong>{m.metric_name}</strong><span>{Number(m.metric_value).toLocaleString()}{m.notes?` · ${m.notes}`:""}</span></div>)}</div></section>
  </main>;
}
