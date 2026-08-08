"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

const modules = new Set(["collaboration", "channel", "retail", "online_sales"]);
const statuses = new Set(["new", "research", "in_process", "active", "disqualified", "complete"]);
const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const modulePath = (module: string) => ({ collaboration: "/collaborations", channel: "/channels", retail: "/retail", online_sales: "/online-sales" }[module] ?? "/");

export async function saveBusinessRecord(form: FormData) {
  const { supabase, user } = await requireAdmin();
  const moduleName = text(form, "module"); const status = text(form, "status"); const id = text(form, "id");
  if (!modules.has(moduleName) || !statuses.has(status) || !text(form, "name")) redirect("/?notice=Invalid%20record");
  const values = { owner_id: user.id, module: moduleName, name: text(form, "name"), description: text(form, "description") || null, status,
    website_url: text(form, "website_url") || null, instagram_url: text(form, "instagram_url") || null,
    follower_count: text(form, "follower_count") ? Number(text(form, "follower_count")) : null, notes: text(form, "notes") || null, updated_at: new Date().toISOString() };
  const operation = id ? supabase.from("business_records").update(values).eq("id", id) : supabase.from("business_records").insert(values);
  const { error } = await operation;
  const path = modulePath(moduleName); revalidatePath(path);
  redirect(`${path}?notice=${encodeURIComponent(error ? error.message : id ? "Record updated" : "Record added")}`);
}

export async function deleteBusinessRecord(form: FormData) {
  const { supabase } = await requireAdmin(); const moduleName = text(form, "module");
  const { error } = await supabase.from("business_records").delete().eq("id", text(form, "id"));
  const path = modulePath(moduleName); revalidatePath(path);
  redirect(`${path}?notice=${encodeURIComponent(error?.message ?? "Record deleted")}`);
}

export async function addBusinessTask(form: FormData) {
  const { supabase, user } = await requireAdmin(); const moduleName = text(form, "module");
  const { error } = await supabase.from("business_tasks").insert({ owner_id: user.id, business_record_id: text(form, "record_id"), title: text(form, "title"), status: "new" });
  const path = modulePath(moduleName); revalidatePath(path);
  redirect(`${path}?notice=${encodeURIComponent(error?.message ?? "Task added")}`);
}

export async function updateBusinessTask(form: FormData) {
  const { supabase } = await requireAdmin(); const moduleName = text(form, "module"); const status = text(form, "status");
  if (!statuses.has(status)) redirect(modulePath(moduleName));
  const { error } = await supabase.from("business_tasks").update({ status: status as "new"|"research"|"in_process"|"active"|"disqualified"|"complete", updated_at: new Date().toISOString() }).eq("id", text(form, "id"));
  const path = modulePath(moduleName); revalidatePath(path);
  redirect(`${path}?notice=${encodeURIComponent(error?.message ?? "Task updated")}`);
}

export async function saveInstructions(form: FormData) {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("app_settings").upsert({ owner_id: user.id, setting_key: "instructions", setting_value: { markdown: text(form, "instructions") }, updated_at: new Date().toISOString() });
  revalidatePath("/instructions"); redirect(`/instructions?notice=${encodeURIComponent(error?.message ?? "Instructions saved")}`);
}

export async function saveMetric(form: FormData) {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("metrics").insert({ owner_id: user.id, metric_name: text(form, "metric_name"), metric_value: Number(text(form, "metric_value")), measured_at: text(form, "measured_at") || new Date().toISOString(), notes: text(form, "notes") || null });
  revalidatePath("/metrics"); redirect(`/metrics?notice=${encodeURIComponent(error?.message ?? "Metric recorded")}`);
}

export async function createScheduledJob(form: FormData) {
  const { supabase, user } = await requireAdmin(); const jobType = text(form, "job_type");
  const { error } = await supabase.from("scheduled_jobs").insert({ owner_id: user.id, job_type: jobType, idempotency_key: crypto.randomUUID(), status: "queued", input: { schedule: text(form, "schedule"), urls: text(form, "urls").split(/\r?\n/).map(v => v.trim()).filter(Boolean) } });
  revalidatePath("/jobs"); redirect(`/jobs?notice=${encodeURIComponent(error?.message ?? "Job queued")}`);
}
