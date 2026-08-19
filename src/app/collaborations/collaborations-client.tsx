"use client";

import { useMemo, useState, useTransition } from "react";
import { createDmTemplate, updateCreatorStatus } from "./actions";

type Status = "new" | "contacted" | "accepted" | "rejected" | "disqualified";
type Creator = {
  id: number; rank: number; fit_score: number; priority: string; creator_name: string;
  instagram_handle: string; description: string; followers: number; engagement_rate: number;
  fit_rationale: string; status: Status;
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

export function CollaborationsClient({ initialCreators, initialTemplates, loadError }: { initialCreators: Creator[]; initialTemplates: Template[]; loadError: string | null }) {
  const [creators, setCreators] = useState(initialCreators);
  const [templates, setTemplates] = useState(initialTemplates);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [sort, setSort] = useState("rank");
  const [composer, setComposer] = useState<Creator | null>(null);
  const [templateId, setTemplateId] = useState<number | "custom">(initialTemplates[0]?.id ?? "custom");
  const [customMessage, setCustomMessage] = useState("");
  const [addingTemplate, setAddingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const visible = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return creators.filter((creator) => (filter === "all" || creator.status === filter) && (!needle || `${creator.creator_name} ${creator.instagram_handle} ${creator.description} ${creator.fit_rationale}`.toLowerCase().includes(needle)))
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
    setStatus(composer.id, "contacted");
    window.open(`https://www.instagram.com/${composer.instagram_handle.replace(/^@/, "")}/`, "_blank", "noopener,noreferrer");
    setNotice("Message copied. Paste it into Instagram to send.");
    setComposer(null);
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
        <div className="collab-table collab-head"><span>Creator</span><span>Fit</span><span>Audience</span><span>Status</span><span>Action</span></div>
        {visible.map((creator) => (
          <article className="collab-table collab-row" key={creator.id}>
            <div className="collab-creator"><span className="collab-rank">{creator.rank}</span><div><h2>{creator.creator_name}</h2><a href={`https://www.instagram.com/${creator.instagram_handle.replace(/^@/, "")}/`} target="_blank" rel="noreferrer">{creator.instagram_handle}</a><p>{creator.description}</p><small>{creator.fit_rationale}</small></div></div>
            <div><strong className="collab-score">{creator.fit_score}</strong><small>{creator.priority}</small></div>
            <div><strong>{formatFollowers(creator.followers)}</strong><small>{creator.engagement_rate}% engagement</small></div>
            <select className={`collab-status status-${creator.status}`} value={creator.status} disabled={isPending} onChange={(event) => setStatus(creator.id, event.target.value as Status)}>{statuses.map((status) => <option value={status} key={status}>{labels[status]}</option>)}</select>
            <button className="collab-dm" onClick={() => { setComposer(creator); setCustomMessage(""); }}>Send Instagram DM</button>
          </article>
        ))}
        {!visible.length && <div className="collab-empty">No creators match those filters.</div>}
      </div>

      {composer && <div className="collab-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setComposer(null)}><section className="collab-modal" role="dialog" aria-modal="true" aria-labelledby="dm-title"><button className="collab-close" onClick={() => setComposer(null)} aria-label="Close">×</button><p className="eyebrow">Instagram outreach</p><h2 id="dm-title">Message {composer.creator_name}</h2><label>Template<select value={templateId} onChange={(event) => { const value = event.target.value; setTemplateId(value === "custom" ? "custom" : Number(value)); }}><option value="custom">Write a new message</option>{templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}</select></label>{templateId === "custom" ? <label>Message<textarea rows={9} value={customMessage} onChange={(event) => setCustomMessage(event.target.value)} placeholder={`Hey ${composer.creator_name}…`} /></label> : <textarea className="collab-preview" rows={9} value={message} readOnly />}<p className="collab-help">Instagram does not support prefilled DMs. This copies the message and opens the creator’s profile.</p><div className="collab-modal-actions"><button onClick={() => setComposer(null)}>Cancel</button><button className="collab-primary" disabled={!message.trim()} onClick={sendMessage}>Copy message & open Instagram</button></div></section></div>}

      {addingTemplate && <div className="collab-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setAddingTemplate(false)}><section className="collab-modal" role="dialog" aria-modal="true" aria-labelledby="template-title"><button className="collab-close" onClick={() => setAddingTemplate(false)} aria-label="Close">×</button><p className="eyebrow">Message library</p><h2 id="template-title">Create a DM template</h2><label>Template name<input value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="Creator introduction" /></label><label>Message<textarea rows={10} value={templateBody} onChange={(event) => setTemplateBody(event.target.value)} placeholder="Use {{name}} and {{handle}} for creator details." /></label><p className="collab-help">Available variables: {"{{name}}"} and {"{{handle}}"}</p><div className="collab-modal-actions"><button onClick={() => setAddingTemplate(false)}>Cancel</button><button className="collab-primary" disabled={isPending || !templateName.trim() || !templateBody.trim()} onClick={saveTemplate}>Save template</button></div></section></div>}
    </section>
  );
}
