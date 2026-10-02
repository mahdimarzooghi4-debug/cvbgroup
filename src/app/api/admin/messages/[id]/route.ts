import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/require-admin";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const parsed = z.object({ status: z.enum(["new", "read", "replied"]) }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "وضعیت پیام معتبر نیست." }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  const rows = await db.update(contactMessages).set({ status: parsed.data.status }).where(eq(contactMessages.id, id)).returning({ id: contactMessages.id });
  return rows.length ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "پیام پیدا نشد." }, { status: 404 });
}

export async function DELETE(_request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  const rows = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning({ id: contactMessages.id });
  return rows.length ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "پیام پیدا نشد." }, { status: 404 });
}
