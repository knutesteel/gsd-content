import { createClient } from "@supabase/supabase-js";

const ids = [
"62dbae8b-3c50-4677-a808-9edc23bdf273",
"bf9d14ea-5747-41b0-b9af-af181866b17b",
"e624c869-35ed-4350-9dad-1de03c568bfd",
"adca4d20-f1e9-4fa7-ba69-0b4ebc7999b2",
"08c9f4cb-bb34-408d-8f2f-e30a95c8d5fa",
"bbb4699f-2833-4c69-bfe0-f9f5640cafdc",
"4cffee7d-169f-405c-8149-8aabe2f300b0",
"ae754440-8daf-4b9f-aa6b-c755c70eb243",
"af1946c7-b622-44d3-a06e-a6af223f9ed7",
"ff38217e-15c4-4689-9fcf-a89895e915f1",
"eef416bf-851e-4fb9-92c7-7fd74933f590",
"eb8cc4ae-1a0d-4232-9894-3a7d951e66cc",
"8e537c49-0d7a-47aa-a8b2-8e699bfc501a",
"5bc556be-fb68-4fe2-a63d-43d6bc848373",
"49a2d2a5-c0be-4435-a9f9-d8aa86e13bdc"
];

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return Response.json({ error: "Missing Supabase server configuration" }, { status: 503 });
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.from("content_items").select("id,identifier,title,status,content_type,panel_count").in("id", ids).order("identifier", { ascending: true });
  if (error) return Response.json({ error: error.message, code: error.code }, { status: 500 });
  return Response.json({ expected: ids.length, count: data?.length ?? 0, data });
}
