import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";
import { CollaborationsClient } from "./collaborations-client";
import "./collaborations.css";

export default async function CollaborationsPage() {
  const supabase = await createClient();
  const db = supabase as any;
  const [creatorsResult, templatesResult, connectionResult] = await Promise.all([
    db.from("creator_partnerships").select("*").order("rank", { ascending: true }),
    db.from("collaboration_dm_templates").select("id, name, body").order("id", { ascending: true }),
    db.from("instagram_connections").select("granted_scopes,last_synced_at").limit(1).maybeSingle(),
  ]);

  return (
    <main className="app-shell">
      <AppHeader />
      <CollaborationsClient
        initialCreators={creatorsResult.data ?? []}
        initialTemplates={templatesResult.data ?? []}
        dmSyncEnabled={(connectionResult.data?.granted_scopes ?? []).includes("instagram_business_manage_messages")}
        dmLastSyncedAt={connectionResult.data?.last_synced_at ?? null}
        loadError={creatorsResult.error?.message ?? templatesResult.error?.message ?? null}
      />
    </main>
  );
}
