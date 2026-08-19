"use client";

import { useMemo, useState, useTransition } from "react";
import { createDmTemplate, markCreatorMessagesRead, recordCreatorDmSent, updateCreatorFollowState, updateCreatorName, updateCreatorStatus } from "./actions";

type Status = "new" | "contacted" | "accepted" | "rejected" | "disqualified";
type Creator = {
  id: number; rank: number; fit_score: number; priority: string; creator_name: string;
  instagram_handle: string; description: string; followers: number; engagement_rate: number;
  fit_rationale: string; notes: string; status: Status; is_following: boolean; followed_at: string | null;
  dm_sent_count: number; dm_received_count: number; unread_dm_count: number;
  last_dm_sent_at: string | null; last_dm_received_at: string | null; last_dm_read_at: string | null;
};
type Template = { id: number; name: string; body: string };
const statuses: Status[] = ["new", "contacted", "accepted", "rejected", "disqualified"];
const labels: Record<Status, string> = { new: "New", contacted: "Contacted", accepted: "Accepted", rejected: "Rejected", disqualified: "Disqualified" };

function formatFollowers(value: number) {
  return new Intl.NumberFormat("en", { notation: value >= 1000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}
function mergeMessage(body: string, creator: Creator) {
  return body.replaceAll("{{name}}", creator.creator_name).replaceAll("{{handle}}", creator.instagram_handle);
}
function displayName(creator: Creator) {
  const importedNameIsIncomplete = creator.creator_name.includes("...") || creator.creator_name.includes("…");
  return importedNameIsIncomplete && creator.instagram_handle ? creator.instagram_handle.replace(/^@/, "") : creator.creator_name;
}

export function CollaborationsClient({ initialCreators, initialTemplates, loadError }: { initialCreators: Creator[]; initialTemplates: Template[]; loadError: string | null }) {
  const [creators, setCreators] = useState(initialCreators);
  const [templates, setTemplates] = useState(initialTemplates);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [sort, setSort] = useState("rank");
  const [composer, setComposer] = useState<Creator | null>(null);
  const [selected, setSelected] = useState<Creator | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [templateId, setTemplateId] = useState<number | "custom">(initialTemplates[0]?.id ?? "custom");
  const [customMessage, setCustomMessage] = useState("");
  const [addingTemplate, setAddingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return creators.filter((creator) => (filter === "all" || creator.status === filter) && (!needle || `${creator.creator_name} ${creator.instagram_handle} ${creator.description} ${creator.fit_rationale} ${creator.notes}`.toLowerCase().includes(needle)))
      .sort((a, b) => sort === "score" ? b.fit_score - a.fit_score : sort === "followers" ? b.followers - a.followers : a.rank - b.rank);
  }, [creators, filter, query, sort]);

  const counts = useMemo(() => Object.fromEntries(statuses.map((status) => [status, creators.filter((creator) => creator.status === status).length])) as Record<Status, number>, [creators]);
  const activeTemplate = templates.find((template) => template.id === templateId);
  const message = composer ? (templateId === "custom" ? customMessage : mergeMessage(activeTemplate?.body ?? "", composer)) : "";

  function setStatus(id: number, status: Status) {
    const previous = creators;
    setCreators((current) => current.map((creator) => creator.id === id ? { ...creator, status } : creator));
    startTransition(async () => {
      try { await updateCreatorStatus(id, status); }
      catch (error) { setCreators(previous); setNotice(error instanceof Error ? error.message : "Could not update status"); }
    });
  }

  async function sendMessage() {
    if (!composer || !message.trim()) return;
    await navigator.clipboard.writeText(message);
    const creatorId = composer.id;
    setCreators((current) => current.map((creator) => creator.id === creatorId ? { ...creator, status: "contacted", dm_sent_count: creator.dm_sent_count + 1, last_dm_sent_at: new Date().toISOString() } : creator));
    setSelected((current) => current?.id === creatorId ? { ...current, status: "contacted", dm_sent_count: current.dm_sent_count + 1, last_dm_sent_at: new Date().toISOString() } : current);
    startTransition(async () => {
      try { await recordCreatorDmSent(creatorId); }
      catch (error) { setNotice(error instanceof Error ? error.message : "Could not record the message"); }
    });
    window.open(`https://www.instagram.com/${composer.instagram_handle.replace(/^@/, "")}/`, "_blank", "noopener,noreferrer");
    setNotice("Message copied. Paste it into Instagram to send.");
    setComposer(null);
  }

  function followCreator(creator: Creator) {
    if (!creator.instagram_handle) return;
    const updated = { ...creator, is_following: true, followed_at: new Date().toISOString() };
    setCreators((current) => current.map((item) => item.id === creator.id ? updated : item));
    setSelected(updated);
    window.open(`https://www.instagram.com/${creator.instagram_handle.replace(/^@/, "")}/`, "_blank", "noopener,noreferrer");
    startTransition(async () => {
      try { await updateCreatorFollowState(creator.id, true); }
      catch (error) { setNotice(error instanceof Error ? error.message : "Could not update follow status"); }
    });
  }

  function markRead(creator: Creator) {
    const updated = { ...creator, unread_dm_count: 0, last_dm_read_at: new Date().toISOString() };
    setCreators((current) => current.map((item) => item.id === creator.id ? updated : item));
    setSelected(updated);
    startTransition(async () => {
      try { await markCreatorMessagesRead(creator.id); }
      catch (error) { setNotice(error instanceof Error ? error.message : "Could not mark messages read"); }
    });
  }

  function saveCreatorName(creator: Creator) {
    const cleanName = draftName.trim();
    if (!cleanName) return;
    const updated = { ...creator, creator_name: cleanName };
    setCreators((current) => current.map((item) => item.id === creator.id ? updated : item));
    setSelected(updated);
    setEditingName(false);
    startTransition(async () => {
      try { await updateCreatorName(creator.id, cleanName); }
      catch (error) { setNotice(error instanceof Error ? error.message : "Could not update the creator name"); }
    });
  }

  function saveTemplate() {
    startTransition(async () => {
      try {
        const created = await createDmTemplate(templateName, templateBody);
        setTemplates((current) => [...current, created]);
        setTemplateId(created.id);
        setTemplateName(""); setTemplateBody(""); setAddingTemplate(false);
      } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save template"); }
    });
  }

  return (
    <section className="collab-page">
      <header className="collab-hero">
        <div><p className="eyebrow">Creator partnerships</p><h1>Collaborations</h1><p>Prioritize high-fit creators, move outreach through the pipeline, and send an Instagram DM without losing the plot.</p></div>
        <button className="collab-primary" onClick={() => setAddingTemplate(true)}>+ New DM template</button>
      </header>
      {loadError && <div className="collab-alert">Could not load collaborations: {loadError}</div>}
      {notice && <button className="collab-notice" onClick={() => setNotice("")}>{notice} ×</button>}

      <div className="collab-metrics">
        <button data-active={filter === "all"} onClick={() => setFilter("all")}><span>All creators</span><strong>{creators.length}</strong></button>
        {statuses.map((status) => <button key={status} data-active={filter === status} onClick={() => setFilter(status)}><span>{labels[status]}</span><strong>{counts[status]}</strong></button>)}
      </div>

      <div className="collab-toolbar">
        <label><span className="sr-only">Search creators</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, handle, audience, or rationale…" /></label>
        <label>Sort <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="rank">Best rank</option><option value="score">Fit score</option><option value="followers">Followers</option></select></label>
        <span>{visible.length} shown</span>
      </div>

      <div className="collab-table-wrap">
        <div className="collab-table collab-head"><span>Creator</span><span>Fit</span><span>DMs</span><span>Notes</span><span>Status &amp; Action</span></div>
        {visible.map((creator) => (
          <article className="collab-table collab-row" key={creator.id} role="button" tabIndex={0} onClick={() => { setSelected(creator); setEditingName(false); setDraftName(creator.creator_name); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { setSelected(creator); setEditingName(false); setDraftName(creator.creator_name); } }}>
            <div className="collab-creator"><span className="collab-rank">{creator.rank}</span><div><div className="collab-name-line"><h2><a href={`https://www.instagram.com/${creator.instagram_handle.replace(/^@/, "")}/`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{displayName(creator)}</a></h2>{creator.is_following ? <span className="collab-row-followed">✓ Followed</span> : <button className="collab-row-follow" disabled={!creator.instagram_handle} onClick={(event) => { event.stopPropagation(); followCreator(creator); }}>Instagram Follow</button>}</div><a href={`https://www.instagram.com/${creator.instagram_handle.replace(/^@/, "")}/`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{creator.instagram_handle || "No handle listed"}</a><p>{creator.description}</p><small>{creator.fit_rationale}</small></div></div>
            <div><strong className="collab-score">{creator.fit_score}</strong><small>{creator.priority}</small></div>
            <div className="collab-dm-counts"><strong>Sent {creator.dm_sent_count}</strong><small>Rec’d {creator.dm_received_count}{creator.unread_dm_count > 0 && <sup className="collab-unread" aria-label={`${creator.unread_dm_count} unread messages`}>*</sup>}</small></div>
            <p className="collab-notes">{creator.notes || "—"}</p>
            <div className="collab-row-actions"><select className={`collab-status status-${creator.status}`} value={creator.status} disabled={isPending} onClick={(event) => event.stopPropagation()} onChange={(event) => setStatus(creator.id, event.target.value as Status)}>{statuses.map((status) => <option value={status} key={status}>{labels[status]}</option>)}</select><button className="collab-dm" onClick={(event) => { event.stopPropagation(); setComposer(creator); setCustomMessage(""); }}>Send Instagram DM</button></div>
          </article>
        ))}
        {!visible.length && <div className="collab-empty">No creators match those filters.</div>}
      </div>

      {selected && <div className="collab-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section className="collab-modal collab-detail" role="dialog" aria-modal="true" aria-labelledby="creator-title"><button className="collab-close" onClick={() => setSelected(null)} aria-label="Close">×</button><p className="eyebrow">Creator #{selected.rank}</p>{editingName ? <div className="collab-name-editor"><input value={draftName} onChange={(event) => setDraftName(event.target.value)} aria-label="Full creator name" autoFocus /><button className="collab-primary" disabled={!draftName.trim() || isPending} onClick={() => saveCreatorName(selected)}>Save name</button><button onClick={() => setEditingName(false)}>Cancel</button></div> : <div className="collab-detail-name"><h2 id="creator-title">{displayName(selected)}</h2><button onClick={() => { setDraftName(selected.creator_name); setEditingName(true); }}>Edit full name</button></div>}<a className="collab-handle" href={`https://www.instagram.com/${selected.instagram_handle.replace(/^@/, "")}/`} target="_blank" rel="noreferrer">{selected.instagram_handle || "No Instagram handle listed"}</a><div className="collab-detail-actions">{selected.is_following ? <span className="collab-following">✓ Followed</span> : <button className="collab-primary" disabled={!selected.instagram_handle} onClick={() => followCreator(selected)}>Follow on Instagram</button>}<button onClick={() => { setComposer(selected); setCustomMessage(""); }}>Send Instagram DM</button></div><div className="collab-detail-metrics"><div><span>Fit score</span><strong>{selected.fit_score}</strong><small>{selected.priority}</small></div><div><span>Followers</span><strong>{formatFollowers(selected.followers)}</strong><small>{selected.engagement_rate}% engagement</small></div><div><span>DMs sent</span><strong>{selected.dm_sent_count}</strong><small>{selected.last_dm_sent_at ? `Last ${new Date(selected.last_dm_sent_at).toLocaleDateString()}` : "None yet"}</small></div><div><span>DMs received</span><strong>{selected.dm_received_count}{selected.unread_dm_count > 0 && <sup className="collab-unread">*</sup>}</strong><small>{selected.unread_dm_count > 0 ? `${selected.unread_dm_count} unread` : "No unread messages"}</small></div></div>{selected.unread_dm_count > 0 && <button className="collab-mark-read" onClick={() => markRead(selected)}>Mark messages read</button>}<section className="collab-detail-copy"><h3>About</h3><p>{selected.description || "No description available."}</p><h3>Why this creator fits</h3><p>{selected.fit_rationale}</p></section><label>Status<select className={`collab-status status-${selected.status}`} value={selected.status} onChange={(event) => { const status = event.target.value as Status; setStatus(selected.id, status); setSelected({ ...selected, status }); }}>{statuses.map((status) => <option value={status} key={status}>{labels[status]}</option>)}</select></label></section></div>}

      {composer && <div className="collab-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setComposer(null)}><section className="collab-modal" role="dialog" aria-modal="true" aria-labelledby="dm-title"><button className="collab-close" onClick={() => setComposer(null)} aria-label="Close">×</button><p className="eyebrow">Instagram outreach</p><h2 id="dm-title">Message {composer.creator_name}</h2><label>Template<select value={templateId} onChange={(event) => { const value = event.target.value; setTemplateId(value === "custom" ? "custom" : Number(value)); }}><option value="custom">Write a new message</option>{templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}</select></label>{templateId === "custom" ? <label>Message<textarea rows={9} value={customMessage} onChange={(event) => setCustomMessage(event.target.value)} placeholder={`Hey ${composer.creator_name}…`} /></label> : <textarea className="collab-preview" rows={9} value={message} readOnly />}<p className="collab-help">Instagram does not support prefilled DMs. This copies the message and opens the creator’s profile.</p><div className="collab-modal-actions"><button onClick={() => setComposer(null)}>Cancel</button><button className="collab-primary" disabled={!message.trim()} onClick={sendMessage}>Copy message & open Instagram</button></div></section></div>}

      {addingTemplate && <div className="collab-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setAddingTemplate(false)}><section className="collab-modal" role="dialog" aria-modal="true" aria-labelledby="template-title"><button className="collab-close" onClick={() => setAddingTemplate(false)} aria-label="Close">×</button><p className="eyebrow">Message library</p><h2 id="template-title">Create a DM template</h2><label>Template name<input value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="Creator introduction" /></label><label>Message<textarea rows={10} value={templateBody} onChange={(event) => setTemplateBody(event.target.value)} placeholder="Use {{name}} and {{handle}} for creator details." /></label><p className="collab-help">Available variables: {"{{name}}"} and {"{{handle}}"}</p><div className="collab-modal-actions"><button onClick={() => setAddingTemplate(false)}>Cancel</button><button className="collab-primary" disabled={isPending || !templateName.trim() || !templateBody.trim()} onClick={saveTemplate}>Save template</button></div></section></div>}
    </section>
  );
}
