import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  try {
    return NextResponse.json(await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(300));
  } catch {
    return NextResponse.json({ error: "جدول پیام‌ها آماده نیست؛ migrationها را اجرا کنید." }, { status: 503 });
  }
}
