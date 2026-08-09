"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
