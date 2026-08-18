/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";
import { refreshInstagramInsights, updateInstagramStatus } from "./actions";

const tabs = [["performance","Performance"],["saved","Saved Items"],["following","Following"],["followers","Followers"]] as const;
const n = (value: unknown) => Number(value ?? 0).toLocaleString();
const delta = (current: unknown, previous: unknown) => Number(current ?? 0) - Number(previous ?? 0);
const signed = (value: number) => `${value > 0 ? "+" : ""}${n(value)}`;
const messages: Record<string,string> = {
  meta_not_configured: "Meta connection settings still need to be added to Vercel.",
  instagram_authorization_denied: "Instagram authorization was cancelled.",
  invalid_oauth_state: "The Instagram authorization expired. Please connect again.",
  connection_failed: "Instagram could not be connected. Check the Meta app settings and try again.",
  not_connected: "Connect Instagram before refreshing insights.",
  sync_failed: "The Instagram refresh failed. The previous data is still shown below.",
};

export default async function InstagramInsights({ searchParams }: { searchParams: Promise<{ tab?:string; error?:string; refreshed?:string; connected?:string }> }) {
  const params = await searchParams; const tab = tabs.some(([key]) => key === params.tab) ? params.tab! : "performance";
  const supabase = await createClient(); const db = supabase as any;
  const [{ data:connections },{ data:posts },{ data:profiles },{ data:saved },{ data:history },{ data:runs }] = await Promise.all([
    db.from("instagram_connections").select("id,instagram_username,followers_count,media_count,last_synced_at,connection_status,last_sync_error,token_expires_at").limit(1),
    db.from("instagram_media").select("*").order("published_at",{ ascending:false }),
    db.from("instagram_profiles").select("*").order("fit_score",{ ascending:false }),
    db.from("instagram_saved_items").select("*").order("saved_at",{ ascending:false }),
    db.from("instagram_account_daily").select("*").order("snapshot_date",{ ascending:false }).limit(31),
    db.from("instagram_sync_runs").select("status,media_synced,error_message,started_at,completed_at").order("started_at",{ ascending:false }).limit(1),
  ]);
  const connection = connections?.[0]; const allPosts = posts ?? []; const allProfiles = profiles ?? []; const savedItems = saved ?? [];
  const snapshots = history ?? []; const latest = snapshots[0]; const previous = snapshots[1]; const latestRun = runs?.[0];
  const fallbackReach = allPosts.reduce((sum:number,row:any)=>sum+Number(row.reach||0),0);
  const fallbackInteractions = allPosts.reduce((sum:number,row:any)=>sum+Number(row.total_interactions||0),0);
  const reach = latest?.reach ?? fallbackReach; const interactions = latest?.total_interactions ?? fallbackInteractions;
  const rows = tab === "followers" ? allProfiles.filter((r:any)=>r.relationship_type === "followers") : allProfiles.filter((r:any)=>r.relationship_type === "following");
  const chartRows = [...snapshots].reverse(); const maxReach = Math.max(1,...chartRows.map((row:any)=>Number(row.reach||0)));
  const configured = Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET && process.env.META_TOKEN_ENCRYPTION_KEY);
  return <main className="app-shell"><AppHeader />
    <section className="dashboard-head insights-head"><div><p className="eyebrow">Audience & Performance</p><h1>Instagram Insights</h1><p>{connection ? `@${connection.instagram_username ?? "Instagram"} · ${n(connection.followers_count)} followers · Last updated ${connection.last_synced_at ? new Date(connection.last_synced_at).toLocaleString() : "not yet"}` : "Connect Instagram to automatically track performance and audience growth."}</p></div><div className="button-row"><Link href="/api/instagram/connect">{connection?.connection_status === "connected" ? "Reconnect Instagram" : "Connect Instagram"}</Link><form action={refreshInstagramInsights}><button className="primary" disabled={!configured || connection?.connection_status === "disconnected"}>Refresh Now</button></form></div></section>
    {!configured ? <div className="notice">Automatic sync is installed. Add the three Meta environment settings in Vercel to activate Connect Instagram.</div> : null}
    {params.connected ? <div className="notice success-notice">Instagram connected and the first sync completed.</div> : null}
    {params.refreshed ? <div className="notice success-notice">Instagram insights refreshed successfully.</div> : null}
    {params.error ? <div className="notice">{messages[params.error] ?? "Instagram could not be updated."}</div> : null}
    {connection?.last_sync_error ? <div className="notice"><strong>Last Sync Failed</strong><span>{connection.last_sync_error}</span></div> : null}
    <nav className="insight-tabs">{tabs.map(([key,label])=><Link key={key} href={`/instagram-insights?tab=${key}`} data-active={tab===key}>{label}<span>{key==="performance"?allPosts.length:key==="saved"?savedItems.length:allProfiles.filter((r:any)=>r.relationship_type===key).length}</span></Link>)}</nav>
    {tab === "performance" ? <>
      <section className="metric-grid">
        <article><span>Followers</span><strong>{n(connection?.followers_count)}</strong>{previous ? <small data-positive={delta(latest?.followers_count,previous.followers_count)>=0}>{signed(delta(latest?.followers_count,previous.followers_count))} since prior snapshot</small>:null}</article>
        <article><span>Views</span><strong>{n(latest?.views)}</strong>{previous?<small>{signed(delta(latest?.views,previous.views))} vs prior</small>:null}</article>
        <article><span>Reach</span><strong>{n(reach)}</strong>{previous?<small>{signed(delta(latest?.reach,previous.reach))} vs prior</small>:null}</article>
        <article><span>Interactions</span><strong>{n(interactions)}</strong>{previous?<small>{signed(delta(latest?.total_interactions,previous.total_interactions))} vs prior</small>:null}</article>
        <article><span>Published Posts</span><strong>{n(connection?.media_count ?? allPosts.length)}</strong><small>{latestRun ? `${n(latestRun.media_synced)} refreshed in latest run` : `${n(allPosts.length)} records available`}</small></article>
      </section>
      {chartRows.length ? <section className="panel trend-panel"><div className="panel-title"><div><h2>30-Day Reach History</h2><p className="muted">Daily snapshots retained independently of Meta&apos;s reporting window.</p></div></div><div className="reach-chart">{chartRows.map((row:any)=><div className="reach-bar-wrap" key={row.snapshot_date} title={`${new Date(`${row.snapshot_date}T12:00:00`).toLocaleDateString()}: ${n(row.reach)} reach`}><div className="reach-bar" style={{height:`${Math.max(4,Number(row.reach||0)/maxReach*100)}%`}}/><small>{new Date(`${row.snapshot_date}T12:00:00`).toLocaleDateString(undefined,{month:"numeric",day:"numeric"})}</small></div>)}</div></section>:null}
      <section className="panel insights-table"><div className="insight-row insight-row-head"><span>Post</span><span>Views</span><span>Reach</span><span>Likes</span><span>Comments</span><span>Saved</span><span>Shares</span><span>Engagement</span></div>{allPosts.map((post:any)=><a className="insight-row" key={post.id} href={post.permalink ?? "#"} target="_blank" rel="noreferrer"><span><strong>{String(post.caption||"Untitled post").slice(0,90)}</strong><small>{post.published_at?new Date(post.published_at).toLocaleDateString():"—"} · {post.media_product_type||post.media_type||"Post"}</small></span><span>{n(post.views)}</span><span>{n(post.reach)}</span><span>{n(post.like_count)}</span><span>{n(post.comments_count)}</span><span>{n(post.saved)}</span><span>{n(post.shares)}</span><span>{Number(post.engagement_rate||0).toFixed(2)}%</span></a>)}</section>
    </> : tab === "saved" ? <section className="panel"><div className="panel-title"><div><h2>Saved Instagram Items</h2><p className="muted">Review inspiration saved from Instagram.</p></div><button>Import HTML Export</button></div><div className="profile-grid">{savedItems.map((item:any)=><article className="profile-card" key={item.id}><a href={item.instagram_url} target="_blank" rel="noreferrer"><h3>{item.title||item.shortcode||"Saved item"}</h3><p>{item.content_overview||item.media_type||"No overview available."}</p></a><form action={updateInstagramStatus}><input type="hidden" name="table" value="instagram_saved_items"/><input type="hidden" name="id" value={item.id}/><select name="value" defaultValue={item.review_status}><option value="not_reviewed">Not Reviewed</option><option value="keep">Keep</option><option value="delete">Delete</option></select><button>Update</button></form></article>)}</div></section> : <section className="panel"><div className="panel-title"><div><h2>{tab === "followers" ? "Followers" : "Following & Collaboration Prospects"}</h2><p className="muted">Follower totals, fit analysis, and outreach status from V1.</p></div><button>Import Instagram HTML</button></div><div className="profile-grid">{rows.map((profile:any)=><article className="profile-card" key={profile.id}><div><a href={profile.profile_url} target="_blank" rel="noreferrer"><h3>@{profile.username}</h3></a><strong>{profile.followers_count == null ? "Unavailable" : `${n(profile.followers_count)} followers`}</strong><p>{profile.biography||profile.content_analysis||"No profile summary available."}</p><small>{profile.fit_label||"Not analyzed"}{profile.fit_score!=null?` · Score ${profile.fit_score}`:""}</small></div><form action={updateInstagramStatus}><input type="hidden" name="table" value="instagram_profiles"/><input type="hidden" name="id" value={profile.id}/><select name="value" defaultValue={profile.collaboration_status}><option value="explore">Explore</option><option value="reached_out">Reached Out</option><option value="in_discussions">In Discussions</option><option value="in_place">In Place</option><option value="disqualified">Disqualified</option></select><button>Update</button></form></article>)}</div></section>}
  </main>;
}
