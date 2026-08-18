import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: Request) {
  await requireAdmin();
  const appId = process.env.META_APP_ID;
  if (!appId) return Response.redirect(new URL("/instagram-insights?error=meta_not_configured", request.url));
  const state = randomBytes(24).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set("instagram_oauth_state", state, {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 10 * 60, path: "/api/instagram/callback",
  });
  const redirectUri = process.env.META_REDIRECT_URI ?? new URL("/api/instagram/callback", request.url).toString();
  const authorize = new URL("https://www.instagram.com/oauth/authorize");
  authorize.search = new URLSearchParams({
    client_id: appId, redirect_uri: redirectUri, response_type: "code", state,
    scope: "instagram_business_basic,instagram_business_manage_insights",
    force_reauth: "true",
  }).toString();
  return Response.redirect(authorize);
}
