import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data } = await supabase.auth.getUser();
      const email = data.user?.email?.toLowerCase();
      const adminEmail = (process.env.ADMIN_EMAIL ?? "knutesteel@gmail.com").toLowerCase();

      if (email === adminEmail) {
        return NextResponse.redirect(new URL("/", url.origin));
      }

      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?error=unauthorized", url.origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=confirmation_failed", url.origin));
}
