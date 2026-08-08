import { AppHeader } from "@/components/app-header";
import { requireAdmin } from "@/lib/auth";
import { addBusinessTask, deleteBusinessRecord, saveBusinessRecord, updateBusinessTask } from "@/app/modules/actions";

const labels: Record<string,string> = { collaboration: "Collaborations", channel: "Channels", retail: "Retail Plan", online_sales: "Online Sales" };
const statusOptions = ["new","research","in_process","active","disqualified","complete"];
type Module = "collaboration"|"channel"|"retail"|"online_sales";

export async function ModulePage({ module, notice }: { module: Module; notice?: string }) {
  const { supabase } = await requireAdmin();
  const { data: records } = await supabase.from("business_records").select("*").eq("module", module).order("sort_order").order("updated_at", { ascending: false });
  const ids = (records ?? []).map(r => r.id);
  const { data: tasks } = ids.length ? await supabase.from("business_tasks").select("*").in("business_record_id", ids).order("sort_order") : { data: [] };
  return <main className="app-shell"><AppHeader /><section className="detail-head"><div><p className="eyebrow">Supporting Module</p><h1>{labels[module]}</h1><p>{records?.length ?? 0} operational records</p></div></section>
    {notice ? <div className="notice">{notice}</div> : null}
    <section className="panel"><h2>Add {labels[module].replace(/s$/, "")}</h2><RecordForm module={module} /></section>
    <section className="module-grid">{(records ?? []).map(record => <article className="module-card" key={record.id}>
      <form action={saveBusinessRecord}><input type="hidden" name="id" value={record.id}/><input type="hidden" name="module" value={module}/>
        <div className="panel-title"><input className="title-input" name="name" defaultValue={record.name}/><select name="status" defaultValue={record.status}>{statusOptions.map(s => <option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select></div>
        <label>Description<textarea name="description" rows={3} defaultValue={record.description ?? ""}/></label><div className="two-col"><label>Website<input name="website_url" type="url" defaultValue={record.website_url ?? ""}/></label><label>Instagram<input name="instagram_url" type="url" defaultValue={record.instagram_url ?? ""}/></label></div>
        {module === "collaboration" ? <label>Instagram Followers<input name="follower_count" type="number" min="0" defaultValue={record.follower_count ?? ""}/></label> : null}
        <label>Notes<textarea name="notes" rows={3} defaultValue={record.notes ?? ""}/></label><div className="button-row"><button className="primary">Save</button>{record.website_url ? <a href={record.website_url} target="_blank" rel="noreferrer">Open Website</a> : null}</div>
      </form>
      <div className="task-list"><h3>Checklist</h3>{(tasks ?? []).filter(t => t.business_record_id === record.id).map(task => <form action={updateBusinessTask} key={task.id}><input type="hidden" name="id" value={task.id}/><input type="hidden" name="module" value={module}/><span>{task.title}</span><select name="status" defaultValue={task.status}>{statusOptions.map(s => <option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select><button>Update</button></form>)}<form action={addBusinessTask} className="inline-form"><input type="hidden" name="record_id" value={record.id}/><input type="hidden" name="module" value={module}/><input name="title" required placeholder="Add checklist item"/><button>Add</button></form></div>
      <form action={deleteBusinessRecord}><input type="hidden" name="id" value={record.id}/><input type="hidden" name="module" value={module}/><button className="danger">Delete</button></form>
    </article>)}</section>
  </main>;
}

function RecordForm({ module }: { module: string }) { return <form action={saveBusinessRecord} className="form-grid"><input type="hidden" name="module" value={module}/><label className="wide">Name<input name="name" required/></label><label>Status<select name="status" defaultValue="new">{statusOptions.map(s => <option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select></label><label className="wide">Description<textarea name="description" rows={3}/></label><label>Website<input name="website_url" type="url"/></label><label>Instagram<input name="instagram_url" type="url"/></label>{module === "collaboration" ? <label>Instagram Followers<input name="follower_count" type="number" min="0"/></label> : null}<label className="wide">Notes<textarea name="notes" rows={3}/></label><button className="primary">Add Record</button></form> }
