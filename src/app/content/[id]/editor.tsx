"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveItem } from "@/app/actions";
import type { ContentItem } from "@/types/database";

const initialState: { ok: boolean; message: string; version?: number } = { ok: false, message: "" };

export function Editor({ item }: { item: ContentItem }) {
  const [state, action, pending] = useActionState(saveItem, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const versionRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);
  const pendingRef = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  function scheduleSave(delay = 3000) {
    dirtyRef.current = true;
    setHasUnsavedChanges(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (pendingRef.current) return;
      dirtyRef.current = false;
      setHasUnsavedChanges(false);
      formRef.current?.requestSubmit();
    }, delay);
  }

  useEffect(() => {
    pendingRef.current = pending;
    if (pending) return;

    if (state.ok && state.version && versionRef.current) {
      versionRef.current.value = String(state.version);
    }
    if (dirtyRef.current) {
      timerRef.current = setTimeout(() => {
        dirtyRef.current = false;
        setHasUnsavedChanges(false);
        formRef.current?.requestSubmit();
      }, 0);
    }
  }, [pending, state]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return <form ref={formRef} action={action} className="editor" onInput={() => scheduleSave()} onChange={() => scheduleSave()}>
    <input type="hidden" name="id" value={item.id} /><input ref={versionRef} type="hidden" name="record_version" defaultValue={item.record_version} />
    <div className="form-grid">
      <label className="wide">Title<input name="title" defaultValue={item.title ?? ""} /></label>
      <label>Status<select name="status" defaultValue={item.status}><option value="new">New</option><option value="auto_added">Auto-Added</option><option value="generated">Prompt Generated</option><option value="images_generated">Images Generated</option><option value="posted">Posted</option><option value="archived">Archived</option></select></label>
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
      <label className="wide">First Comment<textarea name="first_comment" rows={3} defaultValue={item.first_comment ?? ""} /></label>
      <label className="wide">Generation Prompt<textarea name="generation_prompt" rows={10} defaultValue={item.generation_prompt ?? ""} /></label>
    </div>
    <div className="save-row"><p className="autosave-status" data-ok={state.ok && !hasUnsavedChanges && !pending}>
      {pending ? "Saving…" : hasUnsavedChanges ? "Unsaved changes" : state.message || "All changes saved"}
    </p></div>
  </form>;
}
