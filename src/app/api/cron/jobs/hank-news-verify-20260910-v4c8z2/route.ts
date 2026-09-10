import { createClient } from "@supabase/supabase-js";

const identifiers = ["556","557","558","559","560","561","562","563","564","565","566","567","568","569","570"];

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Missing Supabase server configuration" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.from("content_items").select("id,identifier,title,status,content_type,panel_count").in("identifier", identifiers).order("identifier", { ascending: true });
  if (error) return Response.json({ error: error.message, details: error.details, hint: error.hint, code: error.code }, { status: 500 });
  return Response.json({ count: data?.length ?? 0, data });
}
