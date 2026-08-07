"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const adminEmail = () => (process.env.ADMIN_EMAIL ?? "knutesteel@gmail.com").toLowerCase();

function credentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (email !== adminEmail() || password.length < 12) redirect("/login?error=invalid");
  return { email, password };
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(credentials(formData));
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/");
}

export async function createAdmin(formData: FormData) {
  const supabase = await createClient();
  const values = credentials(formData);
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    ...values,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/login?created=1");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
