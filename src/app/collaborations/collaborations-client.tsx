"use client";

import { useMemo, useState, useTransition } from "react";
import { createDmTemplate, markCreatorMessagesRead, updateCreatorFollowState, updateCreatorName, updateCreatorNotes, updateCreatorSources, updateCreatorStatus, updateCreatorStatuses, updateDmTemplate } from "./actions";

type Status = "new" | "contacted" | "in_process" | "active" | "rejected" | "disqualified";
type Creator = {
  id: number; rank: number; fit_score: number; priority: string; creator_name: string;
  instagram_handle: string; description: string; followers: number; engagement_rate: number;
  fit_rationale: string; notes: string; source: string; status: Status; is_following: boolean; followed_at: string | null;
  dm_sent_count: number; dm_received_count: number; unread_dm_count: number;
  last_dm_sent_at: string | null; last_dm_received_at: string | null; last_dm_read_at: string | null; created_at: string; updated_at: string;
};
type Template = { id: number; name: string; body: string };
type SortKey = "rank" | "creator_name" | "instagram_handle" | "description" | "followers" | "engagement_rate" | "fit_score" | "priority" | "fit_rationale" | "status" | "is_following" | "dm_sent_count" | "dm_received_count" | "unread_dm_count" | "notes" | "source" | "created_at" | "updated_at";
const sortOptions: Array<[SortKey,string]> = [
  ["rank","Rank"],["creator_name","Name"],["instagram_handle","Instagram handle"],["description","Description"],
  ["followers","Followers"],["engagement_rate","Engagement rate"],["fit_score","Fit score"],["priority","Priority"],
  ["fit_rationale","Fit rationale"],["status","Status"],["is_following","Following"],["dm_sent_count","DMs sent"],
  ["dm_received_count","DMs received"],["unread_dm_count","Unread DMs"],["notes","Notes"],["source","Source"],["created_at","Date added"],["updated_at","Last updated"],
];
function compareValues(left: unknown, right: unknown) {
  if (typeof left === "number" && typeof right === "number") return left - right;
  if (typeof left === "boolean" && typeof right === "boolean") return Number(left) - Number(right);
  return String(left ?? "").localeCompare(String(right ?? ""), undefined, { numeric: true, sensitivity: "base" });
}
const statuses: Status[] = ["new", "contacted", "in_process", "active", "rejected", "disqualified"];
const labels: Record<Status, string> = { new: "New", contacted: "Contacted", in_process: "In Process", active: "Active", rejected: "Rejected", disqualified: "Disqualified" };

function formatFollowers(value: number) {
  return new Intl.NumberFormat("en", { notation: value >= 1000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
}
function mergeMessage(body: string, creator: Creator) {
  return body.replaceAll("{{name}}", creator.creator_name).replaceAll("{{handle}}", creator.instagram_handle);
}
function templatizeMessage(body: string, creator: Creator) {
  let template = body;
  if (creator.creator_name) template = template.replaceAll(creator.creator_name, "{{name}}");
  if (creator.instagram_handle) template = template.replaceAll(creator.instagram_handle, "{{handle}}");
  return template;
}
function displayName(creator: Creator) {
  const importedNameIsIncomplete = creator.creator_name.includes("...") || creator.creator_name.includes("…");
  return importedNameIsIncomplete && creator.instagram_handle ? creator.instagram_handle.replace(/^@/, "") : creator.creator_name;
}

export function CollaborationsClient({ initialCreators, initialTemplates, dmSyncEnabled, dmLastSyncedAt, loadError }: { initialCreators: Creator[]; initialTemplates: Template[]; dmSyncEnabled: boolean; dmLastSyncedAt: string | null; loadError: string | null }) {
  const [creators, setCreators] = useState(initialCreators);
  const [templates, setTemplates] = useState(initialTemplates);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [sort, setSort] = useState<SortKey>("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<Status>("contacted");
  const [bulkSource, setBulkSource] = useState("SocialCat");
  const [newSource, setNewSource] = useState("");
  const [composer, setComposer] = useState<Creator | null>(null);
  const [selected, setSelected] = useState<Creator | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [templateId, setTemplateId] = useState<number | "custom">(initialTemplates[0]?.id ?? "custom");
  const [customMessage, setCustomMessage] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [newTemplateName, setNewTemplateName] = useState("");
  const [addingTemplate, setAddingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return creators.filter((creator) => (filter === "all" || creator.status === filter) && (!needle || `${creator.creator_name} ${creator.instagram_handle} ${creator.description} ${creator.fit_rationale} ${creator.notes} ${creator.source}`.toLowerCase().includes(needle)))
      .sort((a, b) => compareValues(a[sort], b[sort]) * (sortDirection === "asc" ? 1 : -1));
  }, [creators, filter, query, sort, sortDirection]);

  const counts = useMemo(() => Object.fromEntries(statuses.map((status) => [status, creators.filter((creator) => creator.status === status).length])) as Record<Status, number>, [creators]);
  const sourceOptions = useMemo(() => [...new Set(creators.map((creator) => creator.source.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [creators]);
  const allVisibleSelected = visible.length > 0 && visible.every((creator) => selectedIds.has(creator.id));

  function toggleCreator(id: number) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function sortByColumn(key: SortKey) {
    if (sort === key) setSortDirection((current) => current === "asc" ? "desc" : "asc");
    else { setSort(key); setSortDirection("asc"); }
  }

  function sortLabel(key: SortKey, label: string) {
    return `${label}${sort === key ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}`;
  }

  function filterByStatus(status: Status | "all") {
    setFilter(status);
    if (status === "contacted") {
      setSort("updated_at");
      setSortDirection("desc");
    }
  }

  function toggleAllVisible() {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (allVisibleSelected) visible.forEach((creator) => next.delete(creator.id));
      else visible.forEach((creator) => next.add(creator.id));
      return next;
    });
  }

  function applyBulkStatus() {
    const ids = [...selectedIds];
    if (!ids.length) return;
    const previous = creators;
    setCreators((current) => current.map((creator) => selectedIds.has(creator.id) ? { ...creator, status: bulkStatus } : creator));
    startTransition(async () => {
      try {
        const updated = await updateCreatorStatuses(ids, bulkStatus);
        setSelectedIds(new Set());
        setNotice(`${updated} creator${updated === 1 ? "" : "s"} updated to ${labels[bulkStatus]}.`);
      } catch (error) {
        setCreators(previous);
        setNotice(error instanceof Error ? error.message : "Could not update selected creators");
      }
    });
  }

  function applyBulkSource() {
    const ids = [...selectedIds];
    const source = bulkSource === "__new__" ? newSource.trim() : bulkSource.trim();
    if (!ids.length || !source) return;
    const previous = creators;
    setCreators((current) => current.map((creator) => selectedIds.has(creator.id) ? { ...creator, source } : creator));
    startTransition(async () => {
      try {
        const updated = await updateCreatorSources(ids, source);
        setSelectedIds(new Set());
        setBulkSource(source);
        setNewSource("");
        setNotice(`${updated} creator${updated === 1 ? "" : "s"} updated to source “${source}”.`);
      } catch (error) {
        setCreators(previous);
        setNotice(error instanceof Error ? error.message : "Could not update selected creators");
      }
    });
  }
  const activeTemplate = templates.find((template) => template.id === templateId);
  const originalMessage = composer && activeTemplate ? mergeMessage(activeTemplate.body, composer) : "";
  const messageEdited = Boolean(composer && dmMessage.trim() && dmMessage !== originalMessage);

  function openComposer(creator: Creator) {
    const template = templates.find((item) => item.id === templateId);
    setComposer(creator);
    setDmMessage(templateId === "custom" ? "" : mergeMessage(template?.body ?? "", creator));
    setCustomMessage("");
    setNewTemplateName("");
  }

  function chooseTemplate(value: string) {
    if (!composer) return;
    const nextId = value === "custom" ? "custom" : Number(value);
    setTemplateId(nextId);
    setNewTemplateName("");
    if (nextId === "custom") {
      setDmMessage(customMessage);
      return;
    }
    const template = templates.find((item) => item.id === nextId);
    setDmMessage(mergeMessage(template?.body ?? "", composer));
  }

  function editDmMessage(value: string) {
    setDmMessage(value);
    if (templateId === "custom") setCustomMessage(value);
  }

  function updateSelectedTemplate() {
    if (!composer || templateId === "custom" || !dmMessage.trim()) return;
    const body = templatizeMessage(dmMessage, composer);
    startTransition(async () => {
      try {
        const updated = await updateDmTemplate(templateId, body);
        setTemplates((current) => current.map((template) => template.id === updated.id ? updated : template));
        setNotice(`Template “${updated.name}” updated.`);
      } catch (error) { setNotice(error instanceof Error ? error.message : "Could not update template"); }
    });
  }

  function saveEditedAsNewTemplate() {
    if (!composer || !newTemplateName.trim() || !dmMessage.trim()) return;
    const body = templatizeMessage(dmMessage, composer);
    startTransition(async () => {
      try {
        const created = await createDmTemplate(newTemplateName, body);
        setTemplates((current) => [...current, created]);
        setTemplateId(created.id);
        setNewTemplateName("");
        setNotice(`Template “${created.name}” saved.`);
      } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save new template"); }
    });
  }

  function setStatus(id: number, status: Status) {
    const previous = creators;
    setCreators((current) => current.map((creator) => creator.id === id ? { ...creator, status } : creator));
    startTransition(async () => {
      try { await updateCreatorStatus(id, status); }
      catch (error) { setCreators(previous); setNotice(error instanceof Error ? error.message : "Could not update status"); }
    });
  }

  async function sendMessage() {
    if (!composer || !dmMessage.trim()) return;
    await navigator.clipboard.writeText(dmMessage);
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

  function changeNotes(id: number, notes: string) {
    setCreators((current) => current.map((creator) => creator.id === id ? { ...creator, notes } : creator));
    setSelected((current) => current?.id === id ? { ...current, notes } : current);
  }

  function saveCreatorNotes(id: number, notes: string, showConfirmation = false) {
    const cleanNotes = notes.trim();
    changeNotes(id, cleanNotes);
    startTransition(async () => {
      try {
        const saved = await updateCreatorNotes(id, cleanNotes);
        if (showConfirmation) setNotice("Notes saved.");
        if (showConfirmation) setDraftNotes(saved);
      } catch (error) { setNotice(error instanceof Error ? error.message : "Could not save notes"); }
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
      {!dmSyncEnabled && <div className="collab-alert">Reconnect Instagram once to enable real sent and received DM counts. <a href="/api/instagram/connect">Reconnect Instagram</a></div>}
      {dmSyncEnabled && dmLastSyncedAt && <p className="collab-dm-sync">DM counts synced from Instagram {new Date(dmLastSyncedAt).toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" })} ET.</p>}
      {notice && <button className="collab-notice" onClick={() => setNotice("")}>{notice} ×</button>}

      <div className="collab-metrics">
        <button data-active={filter === "all"} onClick={() => filterByStatus("all")}><span>All creators</span><strong>{creators.length}</strong></button>
        {statuses.map((status) => <button key={status} data-active={filter === status} onClick={() => filterByStatus(status)}><span>{labels[status]}</span><strong>{counts[status]}</strong></button>)}
      </div>

      <div className="collab-toolbar">
        <label><span className="sr-only">Search creators</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, handle, audience, or rationale…" /></label>
        <label>Sort <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>{sortOptions.map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></label>
        <label>Direction <select value={sortDirection} onChange={(event) => setSortDirection(event.target.value as "asc" | "desc")}><option value="asc">Ascending</option><option value="desc">Descending</option></select></label>
        <span>{visible.length} shown</span>
      </div>
      {selectedIds.size > 0 && <div className="collab-bulk"><strong>{selectedIds.size} selected</strong><div className="collab-bulk-control"><label>Set status <select value={bulkStatus} onChange={(event) => setBulkStatus(event.target.value as Status)}>{statuses.map((status) => <option value={status} key={status}>{labels[status]}</option>)}</select></label><button className="collab-primary" disabled={isPending} onClick={applyBulkStatus}>Apply status</button></div><div className="collab-bulk-control"><label>Set source <select value={bulkSource} onChange={(event) => { setBulkSource(event.target.value); if (event.target.value !== "__new__") setNewSource(""); }}>{sourceOptions.map((source) => <option value={source} key={source}>{source}</option>)}<option value="__new__">+ Add new source</option></select></label>{bulkSource === "__new__" && <label>New source<input value={newSource} maxLength={100} onChange={(event) => setNewSource(event.target.value)} placeholder="Enter source name" autoFocus /></label>}<button className="collab-primary" disabled={isPending || (bulkSource === "__new__" && !newSource.trim())} onClick={applyBulkSource}>Apply source</button></div><button onClick={() => setSelectedIds(new Set())}>Clear selection</button></div>}

      <div className="collab-table-wrap">
        <div className="collab-table collab-head"><label className="collab-check"><input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} aria-label="Select all visible creators" /></label><button onClick={() => sortByColumn("creator_name")}>{sortLabel("creator_name", "Creator")}</button><button onClick={() => sortByColumn("fit_score")}>{sortLabel("fit_score", "Fit")}</button><div className="collab-head-dual"><button onClick={() => sortByColumn("dm_received_count")}>{sortLabel("dm_received_count", "Rec’d")}</button><button onClick={() => sortByColumn("dm_sent_count")}>{sortLabel("dm_sent_count", "Sent")}</button></div><button onClick={() => sortByColumn("notes")}>{sortLabel("notes", "Notes")}</button><button onClick={() => sortByColumn("source")}>{sortLabel("source", "Source")}</button><button onClick={() => sortByColumn("created_at")}>{sortLabel("created_at", "Date Added")}</button><button onClick={() => sortByColumn("status")}>{sortLabel("status", "Status & Action")}</button></div>
        {visible.map((creator) => (
          <article className="collab-table collab-row" data-selected={selectedIds.has(creator.id)} key={creator.id} role="button" tabIndex={0} onClick={() => { setSelected(creator); setEditingName(false); setDraftName(creator.creator_name); setDraftNotes(creator.notes); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { setSelected(creator); setEditingName(false); setDraftName(creator.creator_name); setDraftNotes(creator.notes); } }}>
            <label className="collab-check" onClick={(event) => event.stopPropagation()}><input type="checkbox" checked={selectedIds.has(creator.id)} onChange={() => toggleCreator(creator.id)} aria-label={`Select ${displayName(creator)}`} /></label>
            <div className="collab-creator"><span className="collab-rank">{creator.rank}</span><div><div className="collab-name-line"><h2><a href={`https://www.instagram.com/${creator.instagram_handle.replace(/^@/, "")}/`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{displayName(creator)}</a></h2>{creator.is_following ? <span className="collab-row-followed">✓ Followed</span> : <button className="collab-row-follow" disabled={!creator.instagram_handle} onClick={(event) => { event.stopPropagation(); followCreator(creator); }}>Instagram Follow</button>}</div><a href={`https://www.instagram.com/${creator.instagram_handle.replace(/^@/, "")}/`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>{creator.instagram_handle || "No handle listed"}</a><p>{creator.description}</p><small>{creator.fit_rationale}</small></div></div>
            <div><strong className="collab-score">{creator.fit_score}</strong><small>{creator.priority}</small></div>
            <div className="collab-dm-counts"><a href={`https://ig.me/m/${creator.instagram_handle.replace(/^@/, "")}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><strong>Rec’d {creator.dm_received_count}{creator.unread_dm_count > 0 && <sup className="collab-unread" aria-label={`${creator.unread_dm_count} unread messages`}>*</sup>}</strong></a><a href={`https://ig.me/m/${creator.instagram_handle.replace(/^@/, "")}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><small>Sent {creator.dm_sent_count}</small></a></div>
            <textarea className="collab-notes" rows={3} maxLength={5000} value={creator.notes} placeholder="Add notes…" aria-label={`Notes for ${displayName(creator)}`} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()} onChange={(event) => changeNotes(creator.id, event.target.value)} onBlur={(event) => saveCreatorNotes(creator.id, event.target.value)} />
            <span className="collab-source">{creator.source || "SocialCat"}</span>
            <time className="collab-date-added" dateTime={creator.created_at}>{new Date(creator.created_at).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" })}</time>
            <div className="collab-row-actions"><select className={`collab-status status-${creator.status}`} value={creator.status} disabled={isPending} onClick={(event) => event.stopPropagation()} onChange={(event) => setStatus(creator.id, event.target.value as Status)}>{statuses.map((status) => <option value={status} key={status}>{labels[status]}</option>)}</select><button className="collab-dm" onClick={(event) => { event.stopPropagation(); openComposer(creator); }}>Send Instagram DM</button></div>
          </article>
        ))}
        {!visible.length && <div className="collab-empty">No creators match those filters.</div>}
      </div>

      {selected && <div className="collab-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}><section className="collab-modal collab-detail" role="dialog" aria-modal="true" aria-labelledby="creator-title"><button className="collab-close" onClick={() => setSelected(null)} aria-label="Close">×</button><p className="eyebrow">Creator #{selected.rank}</p>{editingName ? <div className="collab-name-editor"><input value={draftName} onChange={(event) => setDraftName(event.target.value)} aria-label="Full creator name" autoFocus /><button className="collab-primary" disabled={!draftName.trim() || isPending} onClick={() => saveCreatorName(selected)}>Save name</button><button onClick={() => setEditingName(false)}>Cancel</button></div> : <div className="collab-detail-name"><h2 id="creator-title">{displayName(selected)}</h2><button onClick={() => { setDraftName(selected.creator_name); setEditingName(true); }}>Edit full name</button></div>}<a className="collab-handle" href={`https://www.instagram.com/${selected.instagram_handle.replace(/^@/, "")}/`} target="_blank" rel="noreferrer">{selected.instagram_handle || "No Instagram handle listed"}</a><div className="collab-detail-actions">{selected.is_following ? <span className="collab-following">✓ Followed</span> : <button className="collab-primary" disabled={!selected.instagram_handle} onClick={() => followCreator(selected)}>Follow on Instagram</button>}<button onClick={() => openComposer(selected)}>Send Instagram DM</button></div><div className="collab-detail-metrics"><div><span>Fit score</span><strong>{selected.fit_score}</strong><small>{selected.priority}</small></div><div><span>Followers</span><strong>{formatFollowers(selected.followers)}</strong><small>{selected.engagement_rate}% engagement</small></div><div><span>DMs sent</span><strong>{selected.dm_sent_count}</strong><small>{selected.last_dm_sent_at ? `Last ${new Date(selected.last_dm_sent_at).toLocaleDateString()}` : "None yet"}</small></div><div><span>DMs received</span><strong>{selected.dm_received_count}{selected.unread_dm_count > 0 && <sup className="collab-unread">*</sup>}</strong><small>{selected.unread_dm_count > 0 ? `${selected.unread_dm_count} unread` : "No unread messages"}</small></div></div>{selected.unread_dm_count > 0 && <button className="collab-mark-read" onClick={() => markRead(selected)}>Mark messages read</button>}<section className="collab-detail-notes"><h3>Notes</h3><textarea rows={5} maxLength={5000} value={draftNotes} onChange={(event) => setDraftNotes(event.target.value)} placeholder="Add notes about this creator…" /><div><small>{draftNotes.length.toLocaleString()} / 5,000</small><button className="collab-primary" disabled={isPending || draftNotes.trim() === selected.notes} onClick={() => saveCreatorNotes(selected.id, draftNotes, true)}>Save notes</button></div></section><section className="collab-detail-copy"><h3>Source</h3><p>{selected.source || "SocialCat"}</p><h3>About</h3><p>{selected.description || "No description available."}</p><h3>Why this creator fits</h3><p>{selected.fit_rationale}</p></section><label>Status<select className={`collab-status status-${selected.status}`} value={selected.status} onChange={(event) => { const status = event.target.value as Status; setStatus(selected.id, status); setSelected({ ...selected, status }); }}>{statuses.map((status) => <option value={status} key={status}>{labels[status]}</option>)}</select></label></section></div>}

      {composer && <div className="collab-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setComposer(null)}><section className="collab-modal" role="dialog" aria-modal="true" aria-labelledby="dm-title"><button className="collab-close" onClick={() => setComposer(null)} aria-label="Close">×</button><p className="eyebrow">Instagram outreach</p><h2 id="dm-title">Message {composer.creator_name}</h2><label>Template<select value={templateId} onChange={(event) => chooseTemplate(event.target.value)}><option value="custom">Write a new message</option>{templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}</select></label><label>Message<textarea className="collab-preview" rows={9} value={dmMessage} onChange={(event) => editDmMessage(event.target.value)} placeholder={`Hey ${composer.creator_name}…`} /></label>{messageEdited && templateId !== "custom" && <div className="collab-template-edits"><p>You changed this message. Save the changes to the selected template or create a new one.</p><div><button disabled={isPending} onClick={updateSelectedTemplate}>Update template</button><label><span>New template name</span><input value={newTemplateName} onChange={(event) => setNewTemplateName(event.target.value)} placeholder="Alternate creator intro" /></label><button disabled={isPending || !newTemplateName.trim()} onClick={saveEditedAsNewTemplate}>Save as new template</button></div></div>}{templateId === "custom" && dmMessage.trim() && <div className="collab-template-edits"><p>Save this message to use it again.</p><div><label><span>New template name</span><input value={newTemplateName} onChange={(event) => setNewTemplateName(event.target.value)} placeholder="Creator introduction" /></label><button disabled={isPending || !newTemplateName.trim()} onClick={saveEditedAsNewTemplate}>Save as new template</button></div></div>}<p className="collab-help">Instagram does not support prefilled DMs. This copies the message and opens the creator’s profile.</p><div className="collab-modal-actions"><button onClick={() => setComposer(null)}>Cancel</button><button className="collab-primary" disabled={!dmMessage.trim()} onClick={sendMessage}>Copy message & open Instagram</button></div></section></div>}

      {addingTemplate && <div className="collab-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setAddingTemplate(false)}><section className="collab-modal" role="dialog" aria-modal="true" aria-labelledby="template-title"><button className="collab-close" onClick={() => setAddingTemplate(false)} aria-label="Close">×</button><p className="eyebrow">Message library</p><h2 id="template-title">Create a DM template</h2><label>Template name<input value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="Creator introduction" /></label><label>Message<textarea rows={10} value={templateBody} onChange={(event) => setTemplateBody(event.target.value)} placeholder="Use {{name}} and {{handle}} for creator details." /></label><p className="collab-help">Available variables: {"{{name}}"} and {"{{handle}}"}</p><div className="collab-modal-actions"><button onClick={() => setAddingTemplate(false)}>Cancel</button><button className="collab-primary" disabled={isPending || !templateName.trim() || !templateBody.trim()} onClick={saveTemplate}>Save template</button></div></section></div>}
    </section>
  );
}
