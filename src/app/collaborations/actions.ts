"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const statuses = ["new", "contacted", "accepted", "rejected", "disqualified"] as const;

export async function updateCreatorStatus(id: number, status: string) {
  if (!statuses.includes(status as (typeof statuses)[number])) throw new Error("Invalid status");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in");
  const { error } = await (supabase as any)
    .from("creator_partnerships")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("owner_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/collaborations");
}

export async function createDmTemplate(name: string, body: string) {
  const cleanName = name.trim();
  const cleanBody = body.trim();
  if (!cleanName || !cleanBody) throw new Error("Template name and message are required");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in");
  const { data, error } = await (supabase as any)
    .from("collaboration_dm_templates")
    .insert({ name: cleanName, body: cleanBody, owner_id: user.id })
    .select("id, name, body")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/collaborations");
  return data as { id: number; name: string; body: string };
}
