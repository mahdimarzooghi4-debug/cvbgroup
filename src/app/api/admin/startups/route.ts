import { NextResponse } from "next/server";
import { asc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { startups } from "@/db/schema";
import { startupSchema } from "@/lib/admin-validation";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  try {
    return NextResponse.json(await db.select().from(startups).orderBy(asc(startups.sortOrder)));
  } catch {
    return NextResponse.json({ error: "جدول استارتاپ‌ها آماده نیست؛ migrationها را اجرا کنید." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  const data = await request.json().catch(() => null);
  const parsed = startupSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: "اطلاعات استارتاپ معتبر نیست.", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const created = await db.transaction(async (tx) => {
      await tx.execute(sql`LOCK TABLE ${startups} IN EXCLUSIVE MODE`);
      const existing = await tx.select().from(startups).orderBy(asc(startups.sortOrder));
      if (existing.some((item) => item.slug === parsed.data.slug)) throw new Error("SLUG_TAKEN");
      await tx.update(startups).set({ sortOrder: sql`${startups.sortOrder} + 1000000`, updatedAt: new Date() });
      const [row] = await tx.insert(startups).values({ ...parsed.data, sortOrder: 1, pageUrl: "" }).returning();
      for (let i = 0; i < existing.length; i++) {
        await tx.update(startups).set({ sortOrder: i + 2 }).where(sql`${startups.id} = ${existing[i].id}`);
      }
      return row;
    });
    return NextResponse.json(created, { status: 201 });
  } catch (cause) {
    if (cause instanceof Error && cause.message === "SLUG_TAKEN") return NextResponse.json({ error: "این نشانی قبلاً استفاده شده است." }, { status: 409 });
    return NextResponse.json({ error: "افزودن استارتاپ انجام نشد." }, { status: 500 });
  }
}
