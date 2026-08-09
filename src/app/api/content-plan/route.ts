import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const labels: Record<string,string> = { new:"New", auto_added:"Auto-Added", generated:"Generated", posted:"Posted", archived:"Archived" };

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Sign in required." }, { status:401 });
  const { data, error } = await supabase.from("content_items").select("id,identifier,status,title,overview").like("overview", "Content Plan #%");
  if (error) return NextResponse.json({ error:error.message }, { status:500 });
  return NextResponse.json({ items:(data ?? []).map((row) => ({ articleId:row.id, planId:String(row.overview ?? "").match(/^Content Plan #([^:]+)/)?.[1] ?? "", status:labels[row.status] ?? row.status, identifier:row.identifier, title:row.title })) });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error:"Sign in required." }, { status:401 });
  const body = await request.json();
  const planId = String(body.planId ?? "").trim();
  const title = String(body.title ?? "").trim();
  if (!planId || !title) return NextResponse.json({ error:"A plan item and title are required." }, { status:400 });
  const marker = `Content Plan #${planId}:`;
  const { data: existing } = await supabase.from("content_items").select("id,identifier,status").like("overview", `${marker}%`).maybeSingle();
  if (existing) return NextResponse.json({ articleId:existing.id, identifier:existing.identifier, status:labels[existing.status] ?? existing.status, alreadyExists:true });
  const { data: all } = await supabase.from("content_items").select("identifier");
  const numeric = (all ?? []).map((row) => Number(String(row.identifier).split("-")[0])).filter(Number.isFinite);
  const identifier = String((numeric.length ? Math.max(...numeric) : 0) + 1);
  const format = String(body.format ?? "");
  const contentType = /single/i.test(format) ? "Single Pane Cartoon" : /multi|panel/i.test(format) ? "Multi-pane Cartoon" : "Carousel (seperate images)";
  const { data, error } = await supabase.from("content_items").insert({ owner_id:user.id, identifier, title, status:"new", overview:`${marker} ${String(body.concept ?? "")}`, content:String(body.concept ?? ""), caption:String(body.cta ?? ""), content_type:contentType, panel_count:contentType === "Single Pane Cartoon" ? 1 : 4, score:80 }).select("id,identifier,status").single();
  if (error) return NextResponse.json({ error:error.message }, { status:500 });
  return NextResponse.json({ articleId:data.id, identifier:data.identifier, status:"New", alreadyExists:false }, { status:201 });
}
