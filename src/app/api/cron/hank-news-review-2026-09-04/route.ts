import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const target = new URL("/api/cron/hank-news-2026-09-04", request.url);
  const replay = await fetch(target, {
    headers: { authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  const body = await replay.json() as { results?: Array<Record<string, unknown>>; error?: string };
  if (!replay.ok) return Response.json({ error: body.error ?? "Replay failed" }, { status: replay.status });

  const results = Array.isArray(body.results) ? body.results : [];
  for (const row of results) console.log("HANK_NEWS_2026_09_04_ROW", JSON.stringify(row));

  const ids = results.map((row) => String(row.content_item_id ?? "")).filter(Boolean);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Supabase server credentials unavailable", results }, { status: 503 });

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: verified, error: verifyError } = ids.length
    ? await supabase.from("content_items").select("id,identifier,title,status,content_type,panel_count,score").in("id", ids).order("identifier")
    : { data: [], error: null };

  for (const row of verified ?? []) console.log("HANK_NEWS_2026_09_04_VERIFY", JSON.stringify(row));
  if (verifyError) console.error("HANK_NEWS_2026_09_04_VERIFY_ERROR", verifyError.message);

  return Response.json({ count: results.length, results, verified: verified ?? [], verify_error: verifyError?.message ?? null });
}
