import { NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { startups } from "@/db/schema";
import { startupSchema } from "@/lib/admin-validation";
import { requireAdmin } from "@/lib/require-admin";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  const data = await request.json().catch(() => null);
  const parsed = startupSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "اطلاعات استارتاپ معتبر نیست.", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`LOCK TABLE ${startups} IN EXCLUSIVE MODE`);
      const rows = await tx.select().from(startups).orderBy(asc(startups.sortOrder));
      const index = rows.findIndex((row) => row.id === id);
      if (index < 0) return null;
      if (rows.some((row) => row.id !== id && row.slug === parsed.data.slug)) throw new Error("SLUG_TAKEN");
      const target = Math.min(parsed.data.sortOrder, rows.length);
      const [item] = rows.splice(index, 1);
      rows.splice(target - 1, 0, item);
      await tx.update(startups).set({ sortOrder: sql`${startups.sortOrder} + 1000000`, updatedAt: new Date() });
      for (let i = 0; i < rows.length; i++) {
        const values = rows[i].id === id
          ? { ...parsed.data, sortOrder: i + 1, pageUrl: "", updatedAt: new Date() }
          : { sortOrder: i + 1, updatedAt: new Date() };
        await tx.update(startups).set(values).where(eq(startups.id, rows[i].id));
      }
      return rows.find((row) => row.id === id);
    });
    if (!result) return NextResponse.json({ error: "استارتاپ پیدا نشد." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (cause) {
    if (cause instanceof Error && cause.message === "SLUG_TAKEN") return NextResponse.json({ error: "این نشانی قبلاً استفاده شده است." }, { status: 409 });
    return NextResponse.json({ error: "ذخیره استارتاپ انجام نشد." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  try {
    const removed = await db.transaction(async (tx) => {
      await tx.execute(sql`LOCK TABLE ${startups} IN EXCLUSIVE MODE`);
      const rows = await tx.select().from(startups).orderBy(asc(startups.sortOrder));
      const target = rows.find((row) => row.id === id);
      if (!target) return false;
      await tx.delete(startups).where(eq(startups.id, id));
      const remaining = rows.filter((row) => row.id !== id);
      await tx.update(startups).set({ sortOrder: sql`${startups.sortOrder} + 1000000`, updatedAt: new Date() });
      for (let i = 0; i < remaining.length; i++) await tx.update(startups).set({ sortOrder: i + 1 }).where(eq(startups.id, remaining[i].id));
      return true;
    });
    return removed ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "استارتاپ پیدا نشد." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "حذف استارتاپ انجام نشد." }, { status: 500 });
  }
}
