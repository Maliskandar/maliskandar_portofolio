import { NextRequest, NextResponse } from "next/server";
import { getAnalytics, trackVisit } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getAnalytics();
  return NextResponse.json(snapshot);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { path?: string };
    const pagePath = typeof body.path === "string" ? body.path : "/";
    const entry = await trackVisit(pagePath);
    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
