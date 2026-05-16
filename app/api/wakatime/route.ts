import { NextResponse } from "next/server";
import { getWakaStats } from "@/lib/wakatime";

export const revalidate = 1800;

export async function GET() {
  const stats = await getWakaStats();
  return NextResponse.json(stats);
}
