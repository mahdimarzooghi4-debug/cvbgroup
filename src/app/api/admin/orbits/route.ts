import { NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orbitBusinesses } from "@/db/schema";
import { orbitSchema } from "@/lib/admin-validation";
import { ORBIT_CAPACITY } from "@/lib/orbit-config";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  try {
    return NextResponse.json(await db.select().from(orbitBusinesses).orderBy(asc(orbitBusinesses.orbit), asc(orbitBusinesses.sortOrder)));
  } catch {
    return NextResponse.json({ error: "جدول مدارها آماده نیست؛ migrationها را اجرا کنید." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  const parsed = orbitSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "اطلاعات کسب‌وکار معتبر نیست.", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const row = await db.transaction(async (tx) => {
      await tx.execute(sql`LOCK TABLE ${orbitBusinesses} IN EXCLUSIVE MODE`);
      const sameOrbit = await tx.select().from(orbitBusinesses).where(eq(orbitBusinesses.orbit, parsed.data.orbit)).orderBy(asc(orbitBusinesses.sortOrder));
      if (sameOrbit.length >= ORBIT_CAPACITY) throw new Error("ORBIT_FULL");
      const sortOrder = Math.min(parsed.data.sortOrder, sameOrbit.length + 1);
      await tx.update(orbitBusinesses).set({ sortOrder: sql`${orbitBusinesses.sortOrder} + 1000000`, updatedAt: new Date() }).where(eq(orbitBusinesses.orbit, parsed.data.orbit));
      for (let i = 0; i < sameOrbit.length; i++) {
        const order = i < sortOrder - 1 ? i + 1 : i + 2;
        await tx.update(orbitBusinesses).set({ sortOrder: order }).where(eq(orbitBusinesses.id, sameOrbit[i].id));
      }
      const [created] = await tx.insert(orbitBusinesses).values({ ...parsed.data, sortOrder }).returning();
      return created;
    });
    return NextResponse.json(row, { status: 201 });
  } catch (cause) {
    if (cause instanceof Error && cause.message === "ORBIT_FULL") return NextResponse.json({ error: "هر مدار حداکثر ۳ کسب‌وکار می‌پذیرد." }, { status: 409 });
    return NextResponse.json({ error: "افزودن کسب‌وکار به مدار انجام نشد." }, { status: 500 });
  }
}
