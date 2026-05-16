import { NextResponse } from "next/server";
import { getGitHubStats } from "@/lib/github";

export const revalidate = 3600;

export async function GET() {
  const stats = await getGitHubStats();
  return NextResponse.json(stats);
}
