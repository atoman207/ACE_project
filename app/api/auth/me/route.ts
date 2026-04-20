import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const member = await getCurrentMember();
  return NextResponse.json({ member });
}
