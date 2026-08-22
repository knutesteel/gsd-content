import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.112.2";

type SyncPayload = {
  affiliate_id?: string;
  name?: string;
  slug?: string;
  status?: string;
};

const statusMap: Record<string, string | null> = {
  pending: "contacted",
  active: "active",
  paused: null,
  rejected: "rejected",
};

function normalize(value: string | null | undefined) {
  return (value ?? "").toLowerCase().replace(/^@/, "").replace(/[^a-z0-9]/g, "");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

Deno.serve(async (request: Request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const syncSecret = request.headers.get("x-hank-sync-secret") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Server configuration error" }, 500);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: authorized, error: authError } = await supabase.rpc(
    "verify_hank_affiliate_sync_secret",
    { candidate: syncSecret },
  );
  if (authError || authorized !== true) return json({ error: "Unauthorized" }, 401);

  let payload: SyncPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const affiliateId = String(payload.affiliate_id ?? "").trim();
  const hankStatus = String(payload.status ?? "").trim().toLowerCase();
  if (!/^[0-9a-f-]{36}$/i.test(affiliateId) || !(hankStatus in statusMap)) {
    return json({ error: "Invalid affiliate update" }, 400);
  }
  const mappedStatus = statusMap[hankStatus];
  if (mappedStatus === null) return json({ status: "skipped", reason: "paused_has_no_mapping" });

  const { data: linked, error: linkedError } = await supabase
    .from("creator_partnerships")
    .select("id")
    .eq("hank_affiliate_id", affiliateId)
    .maybeSingle();
  if (linkedError) return json({ error: linkedError.message }, 500);

  let creatorId = linked?.id as number | undefined;
  if (!creatorId) {
    const { data: creators, error: listError } = await supabase
      .from("creator_partnerships")
      .select("id,creator_name,instagram_handle");
    if (listError) return json({ error: listError.message }, 500);

    const slug = normalize(payload.slug);
    const name = normalize(payload.name);
    const matches = (creators ?? []).filter((creator) =>
      (slug && normalize(creator.instagram_handle) === slug) ||
      (name && normalize(creator.creator_name) === name)
    );
    if (matches.length === 0) return json({ status: "not_found" }, 202);
    if (matches.length > 1) return json({ error: "Multiple collaboration matches" }, 409);
    creatorId = Number(matches[0].id);
  }

  const { error: updateError } = await supabase
    .from("creator_partnerships")
    .update({
      status: mappedStatus,
      hank_affiliate_id: affiliateId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", creatorId);
  if (updateError) return json({ error: updateError.message }, 500);

  return json({ status: "updated", creator_id: creatorId, collaboration_status: mappedStatus });
});
