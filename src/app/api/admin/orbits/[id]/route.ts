import { NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orbitBusinesses } from "@/db/schema";
import { orbitSchema } from "@/lib/admin-validation";
import { requireAdmin } from "@/lib/require-admin";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  const parsed = orbitSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "اطلاعات کسب‌وکار معتبر نیست.", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const exists = await db.transaction(async (tx) => {
      await tx.execute(sql`LOCK TABLE ${orbitBusinesses} IN EXCLUSIVE MODE`);
      const all = await tx.select().from(orbitBusinesses).orderBy(asc(orbitBusinesses.orbit), asc(orbitBusinesses.sortOrder));
      const current = all.find((row) => row.id === id);
      if (!current) return false;
      const group = all.filter((row) => row.orbit === parsed.data.orbit && row.id !== id);
      if (group.length >= 8) throw new Error("ORBIT_FULL");
      const insertAt = Math.min(parsed.data.sortOrder, group.length + 1) - 1;
      group.splice(insertAt, 0, current);
      const groups = new Map<number, typeof all>();
      for (const row of all) {
        if (row.orbit !== parsed.data.orbit && row.id !== id) {
          const values = groups.get(row.orbit) ?? [];
          values.push(row);
          groups.set(row.orbit, values);
        }
      }
      groups.set(parsed.data.orbit, group);
      await tx.update(orbitBusinesses).set({ sortOrder: sql`${orbitBusinesses.sortOrder} + 1000000`, updatedAt: new Date() });
      for (const [orbit, rows] of groups) {
        for (let i = 0; i < rows.length; i++) {
          const values = rows[i].id === id
            ? { ...parsed.data, orbit, sortOrder: i + 1, updatedAt: new Date() }
            : { orbit, sortOrder: i + 1, updatedAt: new Date() };
          await tx.update(orbitBusinesses).set(values).where(eq(orbitBusinesses.id, rows[i].id));
        }
      }
      return true;
    });
    return exists ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "کسب‌وکار پیدا نشد." }, { status: 404 });
  } catch (cause) {
    if (cause instanceof Error && cause.message === "ORBIT_FULL") return NextResponse.json({ error: "هر مدار حداکثر ۸ کسب‌وکار می‌پذیرد." }, { status: 409 });
    return NextResponse.json({ error: "ذخیره تغییرات مدار انجام نشد." }, { status: 500 });
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
      await tx.execute(sql`LOCK TABLE ${orbitBusinesses} IN EXCLUSIVE MODE`);
      const all = await tx.select().from(orbitBusinesses).orderBy(asc(orbitBusinesses.orbit), asc(orbitBusinesses.sortOrder));
      const target = all.find((row) => row.id === id);
      if (!target) return false;
      await tx.delete(orbitBusinesses).where(eq(orbitBusinesses.id, id));
      const remaining = all.filter((row) => row.id !== id && row.orbit === target.orbit);
      await tx.update(orbitBusinesses).set({ sortOrder: sql`${orbitBusinesses.sortOrder} + 1000000`, updatedAt: new Date() }).where(eq(orbitBusinesses.orbit, target.orbit));
      for (let i = 0; i < remaining.length; i++) await tx.update(orbitBusinesses).set({ sortOrder: i + 1 }).where(eq(orbitBusinesses.id, remaining[i].id));
      return true;
    });
    return removed ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "کسب‌وکار پیدا نشد." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "حذف کسب‌وکار انجام نشد." }, { status: 500 });
  }
}
