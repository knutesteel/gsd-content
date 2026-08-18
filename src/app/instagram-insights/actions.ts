"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { syncInstagramConnection } from "@/lib/instagram";

export async function updateInstagramStatus(formData: FormData) {
  const table = String(formData.get("table"));
  const id = String(formData.get("id"));
  const field = table === "instagram_saved_items" ? "review_status" : "collaboration_status";
  const value = String(formData.get("value"));
  if (!['instagram_profiles','instagram_saved_items'].includes(table)) throw new Error('Invalid Instagram record.');
  const supabase = await createClient();
  const { error } = await (supabase as any).from(table).update({ [field]:value }).eq("id",id);
  if (error) throw new Error(error.message);
  revalidatePath("/instagram-insights");
}

export async function refreshInstagramInsights() {
  const { supabase } = await requireAdmin(); const db = supabase as any;
  const { data: connection, error } = await db.from("instagram_connections").select("*").limit(1).maybeSingle();
  if (error || !connection?.access_token_encrypted) redirect("/instagram-insights?error=not_connected");
  try {
    await syncInstagramConnection(db, connection);
    revalidatePath("/instagram-insights");
  } catch {
    redirect("/instagram-insights?error=sync_failed");
  }
  redirect("/instagram-insights?refreshed=1");
}
