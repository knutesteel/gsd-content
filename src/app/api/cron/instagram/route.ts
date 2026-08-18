/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import { syncInstagramConnection } from "@/lib/instagram";

export const maxDuration = 300;

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Instagram sync requires SUPABASE_SECRET_KEY" }, { status: 503 });
  if (!process.env.META_TOKEN_ENCRYPTION_KEY) return Response.json({ error: "Instagram token encryption is not configured" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) as any;
  const { data: connections, error } = await supabase.from("instagram_connections").select("*").eq("connection_status", "connected").not("access_token_encrypted", "is", null);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  const outcomes = [];
  for (const connection of connections ?? []) {
    try {
      const result = await syncInstagramConnection(supabase, connection);
      outcomes.push({ connectionId: connection.id, status: "succeeded", ...result });
    } catch (syncError) {
      outcomes.push({ connectionId: connection.id, status: "failed", error: syncError instanceof Error ? syncError.message : "Unknown error" });
    }
  }
  return Response.json({ processed: outcomes.length, outcomes });
}
