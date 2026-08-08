import { AppHeader } from "@/components/app-header";
import { requireAdmin } from "@/lib/auth";
import { createScheduledJob } from "@/app/modules/actions";

export default async function Page({searchParams}:{searchParams:Promise<{notice?:string}>}) { const p=await searchParams; const {supabase}=await requireAdmin(); const {data:jobs}=await supabase.from("scheduled_jobs").select("*").order("created_at",{ascending:false}).limit(100);
 return <main className="app-shell"><AppHeader/><section className="detail-head"><div><p className="eyebrow">Automation Queue</p><h1>Scheduled Jobs</h1><p>Recurring discovery and daily backup jobs with explicit outcomes.</p></div></section>{p.notice?<div className="notice">{p.notice}</div>:null}
 <section className="panel"><h2>Schedule Job</h2><form action={createScheduledJob} className="form-grid"><label>Job Type<select name="job_type"><option value="scheduled_discovery">Scheduled Discovery</option><option value="daily_export">Daily Export</option></select></label><label>Recurrence<select name="schedule"><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="once">Once</option></select></label><label className="wide">Discovery URLs<textarea name="urls" rows={5} placeholder="One URL per line. Not required for daily export."/></label><button className="primary">Queue Job</button></form></section>
 <section className="panel"><h2>Job History</h2><div className="timeline">{(jobs??[]).map(j=><div key={j.id}><time>{new Date(j.created_at).toLocaleString()}</time><strong>{j.job_type.replaceAll("_"," ")} · {j.status}</strong><span>{j.error_message??(j.result?JSON.stringify(j.result):JSON.stringify(j.input))}</span></div>)}</div></section></main>;
}
