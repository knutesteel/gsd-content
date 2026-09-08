import { GET as ingest } from "@/app/api/automation/hank-news-20260908-9f7c3d2a/route";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  return ingest();
}
