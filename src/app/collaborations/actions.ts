"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const statuses = ["new", "contacted", "accepted", "rejected", "disqualified"] as const;

export async function updateCreatorStatuses(ids: number[], status: string) {
  const uniqueIds = [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))];
  if (!uniqueIds.length) throw new Error("Select at least one creator");
  if (uniqueIds.length > 500) throw new Error("Too many creators selected");
  if (!statuses.includes(status as (typeof statuses)[number])) throw new Error("Invalid status");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in");
  const { error } = await (supabase as any)
    .from("creator_partnerships")
    .update({ status, updated_at: new Date().toISOString() })
    .in("id", uniqueIds)
    .eq("owner_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/collaborations");
  return uniqueIds.length;
}

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

async function authenticatedCreator(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in");
  const { data, error } = await (supabase as any).from("creator_partnerships")
    .select("id, dm_sent_count")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();
  if (error) throw new Error(error.message);
  return { supabase, user, creator: data as { id: number; dm_sent_count: number } };
}

export async function updateCreatorFollowState(id: number, isFollowing: boolean) {
  const { supabase, user } = await authenticatedCreator(id);
  const { error } = await (supabase as any).from("creator_partnerships")
    .update({ is_following: isFollowing, followed_at: isFollowing ? new Date().toISOString() : null, updated_at: new Date().toISOString() })
    .eq("id", id).eq("owner_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/collaborations");
}

export async function updateCreatorName(id: number, creatorName: string) {
  const cleanName = creatorName.trim();
  if (!cleanName) throw new Error("Creator name is required");
  const { supabase, user } = await authenticatedCreator(id);
  const { error } = await (supabase as any).from("creator_partnerships")
    .update({ creator_name: cleanName, updated_at: new Date().toISOString() })
    .eq("id", id).eq("owner_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/collaborations");
}

export async function recordCreatorDmSent(id: number) {
  const { supabase, user, creator } = await authenticatedCreator(id);
  const { error } = await (supabase as any).from("creator_partnerships")
    .update({ dm_sent_count: creator.dm_sent_count + 1, status: "contacted", last_dm_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id).eq("owner_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/collaborations");
  return creator.dm_sent_count + 1;
}

export async function markCreatorMessagesRead(id: number) {
  const { supabase, user } = await authenticatedCreator(id);
  const { error } = await (supabase as any).from("creator_partnerships")
    .update({ unread_dm_count: 0, last_dm_read_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id).eq("owner_id", user.id);
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
