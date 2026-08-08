import { AppHeader } from "@/components/app-header";
import { requireAdmin } from "@/lib/auth";
import { saveInstructions } from "@/app/modules/actions";

const defaults = `# GSD Content Instructions

1. Review newly discovered sources in Discover.
2. Open an Auto-Added item, refine its overview and generation prompt, then generate content.
3. Review the generated output and images before changing the status to Generated.
4. Use Copy Caption and Copy Prompt when publishing or creating assets.
5. Add the Instagram URL and mark the item Posted after publication.
6. Archive ideas that will not be used. App-only items can be archived normally.

Google Sheets is not part of the V2 operational workflow.`;

export default async function Page({searchParams}:{searchParams:Promise<{notice?:string}>}) { const p=await searchParams; const {supabase}=await requireAdmin(); const {data}=await supabase.from("app_settings").select("setting_value").eq("setting_key","instructions").maybeSingle(); const value=(data?.setting_value as {markdown?:string}|null)?.markdown ?? defaults;
  return <main className="app-shell"><AppHeader/><section className="detail-head"><div><p className="eyebrow">Operating Guide</p><h1>Instructions</h1><p>This is the first navigation item and the editable source of truth for the workflow.</p></div></section>{p.notice?<div className="notice">{p.notice}</div>:null}<section className="panel"><form action={saveInstructions}><textarea name="instructions" rows={28} defaultValue={value}/><div className="save-row"><button className="primary">Save Instructions</button></div></form></section></main>;
}
