/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION ?? "v26.0";
const GRAPH_BASE = `https://graph.instagram.com/${GRAPH_VERSION}`;
const ACCOUNT_METRICS = [
  "views", "reach", "accounts_engaged", "total_interactions", "likes", "comments",
  "replies", "saves", "shares", "follows_and_unfollows", "profile_links_taps",
] as const;
const MEDIA_METRICS = ["views", "reach", "saved", "shares", "total_interactions"] as const;

export type InstagramConnection = {
  id: string;
  owner_id: string;
  instagram_user_id: string | null;
  instagram_username: string | null;
  access_token_encrypted: string | null;
  token_expires_at: string | null;
};

type MetaErrorBody = { error?: { message?: string; code?: number; error_subcode?: number; type?: string } };

function key() {
  const raw = process.env.META_TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("META_TOKEN_ENCRYPTION_KEY is not configured");
  const value = /^[a-f\d]{64}$/i.test(raw) ? Buffer.from(raw, "hex") : Buffer.from(raw, "base64");
  if (value.length !== 32) throw new Error("META_TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes");
  return value;
}

export function encryptInstagramToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(value => value.toString("base64url")).join(".");
}

function decryptInstagramToken(value: string) {
  const [iv, tag, encrypted] = value.split(".").map(part => Buffer.from(part, "base64url"));
  if (!iv || !tag || !encrypted) throw new Error("The stored Instagram token is invalid");
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

async function metaGet<T>(path: string, accessToken: string, params: Record<string, string> = {}) {
  const url = new URL(path.startsWith("http") ? path : `${GRAPH_BASE}/${path.replace(/^\//, "")}`);
  if (url.hostname !== "graph.instagram.com") throw new Error("Unexpected Meta API host");
  Object.entries(params).forEach(([name, value]) => url.searchParams.set(name, value));
  url.searchParams.set("access_token", accessToken);
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000), cache: "no-store" });
  const body = await response.json() as T & MetaErrorBody;
  if (!response.ok || body.error) {
    const error = new Error(body.error?.message ?? `Meta API returned HTTP ${response.status}`);
    Object.assign(error, { code: body.error?.code, subcode: body.error?.error_subcode });
    throw error;
  }
  return body;
}

function valueOfMetric(metric: any): number {
  const value = metric?.total_value?.value ?? metric?.values?.at?.(-1)?.value ?? metric?.value ?? 0;
  return typeof value === "number" ? value : Number(value) || 0;
}

function metricMap(payload: any) {
  return Object.fromEntries((payload?.data ?? []).map((metric: any) => [metric.name, valueOfMetric(metric)])) as Record<string, number>;
}

async function refreshTokenIfNeeded(db: SupabaseClient<any>, connection: InstagramConnection, token: string) {
  const expiry = connection.token_expires_at ? new Date(connection.token_expires_at).getTime() : 0;
  if (expiry > Date.now() + 14 * 24 * 60 * 60 * 1000) return token;
  const refreshed = await metaGet<{ access_token: string; expires_in?: number }>("https://graph.instagram.com/refresh_access_token", token, { grant_type: "ig_refresh_token" });
  const tokenExpiresAt = new Date(Date.now() + (refreshed.expires_in ?? 5_184_000) * 1000).toISOString();
  const { error } = await db.from("instagram_connections").update({
    access_token_encrypted: encryptInstagramToken(refreshed.access_token),
    token_expires_at: tokenExpiresAt,
    updated_at: new Date().toISOString(),
  }).eq("id", connection.id);
  if (error) throw error;
  return refreshed.access_token;
}

async function getAccountMetrics(token: string) {
  const until = Math.floor(Date.now() / 1000);
  const since = until - 2 * 24 * 60 * 60;
  try {
    const payload = await metaGet<any>("me/insights", token, {
      metric: ACCOUNT_METRICS.join(","), period: "day", metric_type: "total_value",
      since: String(since), until: String(until),
    });
    return { values: metricMap(payload), raw: payload.data ?? [] };
  } catch (error) {
    if ((error as { code?: number }).code === 190) throw error;
    const values: Record<string, number> = {}; const raw: any[] = [];
    for (const metric of ACCOUNT_METRICS) {
      try {
        const payload = await metaGet<any>("me/insights", token, { metric, period: "day", metric_type: "total_value", since: String(since), until: String(until) });
        values[metric] = valueOfMetric(payload.data?.[0]); raw.push(...(payload.data ?? []));
      } catch (metricError) {
        if ((metricError as { code?: number }).code === 190) throw metricError;
      }
    }
    return { values, raw };
  }
}

async function getMedia(token: string) {
  const rows: any[] = [];
  let next: string | null = `${GRAPH_BASE}/me/media?${new URLSearchParams({
    fields: "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count",
    limit: "100",
  })}`;
  const maximum = Math.max(1, Math.min(Number(process.env.META_MEDIA_SYNC_LIMIT ?? 100), 200));
  while (next && rows.length < maximum) {
    const page: { data?: any[]; paging?: { next?: string } } = await metaGet(next, token);
    rows.push(...(page.data ?? []));
    next = page.paging?.next ?? null;
  }
  return rows.slice(0, maximum);
}

async function getMediaMetrics(token: string, mediaId: string) {
  try {
    const payload = await metaGet<any>(`${mediaId}/insights`, token, { metric: MEDIA_METRICS.join(",") });
    return { values: metricMap(payload), raw: payload.data ?? [] };
  } catch (error) {
    if ((error as { code?: number }).code === 190) throw error;
    return { values: {} as Record<string, number>, raw: [] };
  }
}

async function mapInBatches<T, R>(values: T[], size: number, work: (value: T) => Promise<R>) {
  const results: R[] = [];
  for (let index = 0; index < values.length; index += size) results.push(...await Promise.all(values.slice(index, index + size).map(work)));
  return results;
}

export async function syncInstagramConnection(db: SupabaseClient<any>, connection: InstagramConnection) {
  if (!connection.access_token_encrypted) throw new Error("Instagram is not connected. Use Connect Instagram first.");
  const startedAt = new Date().toISOString();
  await db.from("instagram_connections").update({ last_sync_started_at: startedAt, last_sync_error: null }).eq("id", connection.id);
  const { data: run, error: runError } = await db.from("instagram_sync_runs").insert({ owner_id: connection.owner_id, connection_id: connection.id }).select("id").single();
  if (runError) throw runError;
  try {
    let token = decryptInstagramToken(connection.access_token_encrypted);
    token = await refreshTokenIfNeeded(db, connection, token);
    const [profile, account] = await Promise.all([
      metaGet<any>("me", token, { fields: "user_id,id,username,name,profile_picture_url,followers_count,media_count" }),
      getAccountMetrics(token),
    ]);
    const media = await getMedia(token);
    const mediaWithInsights = await mapInBatches(media, 5, async item => ({ item, insights: await getMediaMetrics(token, item.id) }));
    const snapshotDate = new Date().toISOString().slice(0, 10);
    const followsMetric = account.values.follows_and_unfollows ?? 0;

    const { error: connectionError } = await db.from("instagram_connections").update({
      instagram_user_id: String(profile.user_id ?? profile.id), instagram_username: profile.username,
      followers_count: profile.followers_count ?? 0, media_count: profile.media_count ?? media.length,
      connection_status: "connected", last_synced_at: new Date().toISOString(), last_sync_error: null,
      updated_at: new Date().toISOString(),
    }).eq("id", connection.id);
    if (connectionError) throw connectionError;

    const { error: accountError } = await db.from("instagram_account_daily").upsert({
      owner_id: connection.owner_id, connection_id: connection.id, snapshot_date: snapshotDate,
      followers_count: profile.followers_count ?? 0, media_count: profile.media_count ?? media.length,
      views: account.values.views ?? 0, reach: account.values.reach ?? 0,
      accounts_engaged: account.values.accounts_engaged ?? 0, total_interactions: account.values.total_interactions ?? 0,
      likes: account.values.likes ?? 0, comments: account.values.comments ?? 0, replies: account.values.replies ?? 0,
      saves: account.values.saves ?? 0, shares: account.values.shares ?? 0,
      follows: Math.max(followsMetric, 0), unfollows: Math.max(-followsMetric, 0),
      profile_links_taps: account.values.profile_links_taps ?? 0, raw_metrics: account.raw,
      captured_at: new Date().toISOString(),
    }, { onConflict: "owner_id,snapshot_date" });
    if (accountError) throw accountError;

    const { data: existingMedia } = await db.from("instagram_media").select("id,permalink,instagram_media_id").eq("owner_id", connection.owner_id);
    const byPermalink = new Map((existingMedia ?? []).filter((row: any) => row.permalink).map((row: any) => [row.permalink, row]));
    for (const { item, insights } of mediaWithInsights) {
      const views = insights.values.views ?? 0; const reach = insights.values.reach ?? 0;
      const likes = item.like_count ?? 0; const comments = item.comments_count ?? 0;
      const totalInteractions = insights.values.total_interactions ?? likes + comments + (insights.values.saved ?? 0) + (insights.values.shares ?? 0);
      const engagementRate = reach > 0 ? totalInteractions / reach * 100 : 0;
      const values = {
        owner_id: connection.owner_id, instagram_media_id: String(item.id), caption: item.caption ?? null,
        media_type: item.media_type ?? null, media_product_type: item.media_product_type ?? null,
        media_url: item.media_url ?? null, thumbnail_url: item.thumbnail_url ?? null, permalink: item.permalink ?? null,
        published_at: item.timestamp ?? null, views, reach, like_count: likes, comments_count: comments,
        saved: insights.values.saved ?? 0, shares: insights.values.shares ?? 0,
        total_interactions: totalInteractions, engagement_rate: engagementRate, raw_insights: insights.raw,
        updated_at: new Date().toISOString(),
      };
      const imported = item.permalink ? byPermalink.get(item.permalink) : null;
      const mediaResult = imported && !imported.instagram_media_id
        ? await db.from("instagram_media").update(values).eq("id", imported.id)
        : await db.from("instagram_media").upsert(values, { onConflict: "owner_id,instagram_media_id" });
      if (mediaResult.error) throw mediaResult.error;
      const { error: snapshotError } = await db.from("instagram_media_insights_daily").upsert({
        owner_id: connection.owner_id, instagram_media_id: String(item.id), snapshot_date: snapshotDate,
        views, reach, saved: insights.values.saved ?? 0, shares: insights.values.shares ?? 0,
        total_interactions: totalInteractions, like_count: likes, comments_count: comments,
        engagement_rate: engagementRate, raw_metrics: insights.raw, captured_at: new Date().toISOString(),
      }, { onConflict: "owner_id,instagram_media_id,snapshot_date" });
      if (snapshotError) throw snapshotError;
    }
    await db.from("instagram_sync_runs").update({ status: "succeeded", media_synced: mediaWithInsights.length, completed_at: new Date().toISOString() }).eq("id", run.id);
    return { username: profile.username as string, followers: profile.followers_count as number, mediaSynced: mediaWithInsights.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Instagram sync failed";
    await Promise.all([
      db.from("instagram_connections").update({ connection_status: "error", last_sync_error: message, updated_at: new Date().toISOString() }).eq("id", connection.id),
      db.from("instagram_sync_runs").update({ status: "failed", error_message: message, completed_at: new Date().toISOString() }).eq("id", run.id),
    ]);
    throw error;
  }
}
