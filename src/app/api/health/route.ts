import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ status: "unavailable", database: "not_configured" }, { status: 503 });
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch {
    return NextResponse.json({ status: "unavailable", database: "disconnected" }, { status: 503 });
  }
}
