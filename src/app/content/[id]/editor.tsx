"use client";

import { useActionState } from "react";
import { saveItem } from "@/app/actions";
import type { ContentItem } from "@/types/database";

const initialState = { ok: false, message: "" };

export function Editor({ item }: { item: ContentItem }) {
  const [state, action, pending] = useActionState(saveItem, initialState);
  return <form action={action} className="editor">
    <input type="hidden" name="id" value={item.id} /><input type="hidden" name="record_version" value={item.record_version} />
    <div className="form-grid">
      <label className="wide">Title<input name="title" defaultValue={item.title ?? ""} /></label>
      <label>Status<select name="status" defaultValue={item.status}><option value="new">New</option><option value="auto_added">Auto-Added</option><option value="generated">Generated</option><option value="posted">Posted</option><option value="archived">Archived</option></select></label>
      <label>Type<select name="content_type" defaultValue={item.content_type ?? ""}>
        <option value="">Select type</option>
        <option value="Single Pane Cartoon">Single Pane Cartoon</option>
        <option value="Multi-pane Cartoon">Multi-pane Cartoon</option>
        <option value="Carousel (seperate images)">Carousel (seperate images)</option>
      </select></label>
      <label>Panels<input name="panel_count" type="number" min="1" defaultValue={item.panel_count ?? ""} /></label>
      <label>Score<input name="score" type="number" step="0.1" defaultValue={item.score ?? ""} /></label>
      <label>Priority<input name="priority" type="number" defaultValue={item.priority ?? ""} /></label>
      <label className="check"><input name="is_favorite" type="checkbox" defaultChecked={item.is_favorite} /> Favorite</label>
      <label className="wide">Overview<textarea name="overview" rows={5} defaultValue={item.overview ?? ""} /></label>
      <label className="wide">Content<textarea name="content" rows={12} defaultValue={item.content ?? ""} /></label>
      <label className="wide">Caption<textarea name="caption" rows={8} defaultValue={item.caption ?? ""} /></label>
      <label className="wide">Generation Prompt<textarea name="generation_prompt" rows={10} defaultValue={item.generation_prompt ?? ""} /></label>
    </div>
    <div className="save-row"><button className="primary" disabled={pending}>{pending ? "Saving…" : "Save Changes"}</button>{state.message ? <p data-ok={state.ok}>{state.message}</p> : null}</div>
  </form>;
}
