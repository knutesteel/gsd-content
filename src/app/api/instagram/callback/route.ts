/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";
import { encryptInstagramToken, syncInstagramConnection } from "@/lib/instagram";

function finish(request: Request, name: string, value: string) {
  const url = new URL("/instagram-insights", request.url);
  url.searchParams.set(name, value);
  return Response.redirect(url);
}

export async function GET(request: Request) {
  const { supabase, user } = await requireAdmin();
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("instagram_oauth_state")?.value;
  cookieStore.delete("instagram_oauth_state");
  if (url.searchParams.get("error")) return finish(request, "error", "instagram_authorization_denied");
  if (!expectedState || url.searchParams.get("state") !== expectedState) return finish(request, "error", "invalid_oauth_state");
  const code = url.searchParams.get("code");
  const appId = process.env.META_APP_ID; const appSecret = process.env.META_APP_SECRET;
  if (!code || !appId || !appSecret) return finish(request, "error", "meta_not_configured");
  const redirectUri = process.env.META_REDIRECT_URI ?? new URL("/api/instagram/callback", request.url).toString();
  try {
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST", signal: AbortSignal.timeout(20_000),
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: appId, client_secret: appSecret, grant_type: "authorization_code", redirect_uri: redirectUri, code }),
    });
    const short = await tokenResponse.json() as { access_token?: string; user_id?: string | number; permissions?: string[]; error_message?: string };
    if (!tokenResponse.ok || !short.access_token) throw new Error(short.error_message ?? "Instagram token exchange failed");
    const longUrl = new URL("https://graph.instagram.com/access_token");
    longUrl.search = new URLSearchParams({ grant_type: "ig_exchange_token", client_secret: appSecret, access_token: short.access_token }).toString();
    const longResponse = await fetch(longUrl, { signal: AbortSignal.timeout(20_000), cache: "no-store" });
    const long = await longResponse.json() as { access_token?: string; expires_in?: number; error?: { message?: string } };
    if (!longResponse.ok || !long.access_token) throw new Error(long.error?.message ?? "Instagram long-lived token exchange failed");
    const profileUrl = new URL(`https://graph.instagram.com/${process.env.META_GRAPH_API_VERSION ?? "v26.0"}/me`);
    profileUrl.search = new URLSearchParams({ fields: "user_id,id,username,followers_count,media_count", access_token: long.access_token }).toString();
    const profileResponse = await fetch(profileUrl, { signal: AbortSignal.timeout(20_000), cache: "no-store" });
    const profile = await profileResponse.json() as any;
    if (!profileResponse.ok || profile.error) throw new Error(profile.error?.message ?? "Could not read the Instagram profile");
    const expiresAt = new Date(Date.now() + (long.expires_in ?? 5_184_000) * 1000).toISOString();
    const db = supabase as any;
    const { data: connection, error } = await db.from("instagram_connections").upsert({
      owner_id: user.id, instagram_user_id: String(profile.user_id ?? profile.id ?? short.user_id),
      instagram_username: profile.username, followers_count: profile.followers_count ?? 0, media_count: profile.media_count ?? 0,
      access_token_encrypted: encryptInstagramToken(long.access_token), token_expires_at: expiresAt,
      granted_scopes: short.permissions ?? ["instagram_business_basic", "instagram_business_manage_insights"],
      connection_status: "connected", last_sync_error: null, updated_at: new Date().toISOString(),
    }, { onConflict: "owner_id" }).select("*").single();
    if (error || !connection) throw error ?? new Error("Could not save the Instagram connection");
    await syncInstagramConnection(db, connection);
    return finish(request, "connected", "1");
  } catch (error) {
    console.error("Instagram OAuth callback failed", error instanceof Error ? error.message : "Unknown error");
    return finish(request, "error", "connection_failed");
  }
}
