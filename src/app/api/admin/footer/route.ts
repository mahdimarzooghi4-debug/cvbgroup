import { NextResponse } from "next/server";
import { z } from "zod";
import { siteFooterSettings } from "@/db/schema";
import { getDb } from "@/db";
import { getFooterData } from "@/lib/public-data";
import { requireAdmin } from "@/lib/require-admin";

const urlOrRelative = z.string().trim().max(2048).refine((value) => !value || (value.startsWith("/") && !value.startsWith("//")) || value.startsWith("#") || /^https?:\/\//i.test(value), "نشانی لینک معتبر نیست.");
const safeAssetUrl = z.string().trim().min(1).max(2048).refine((value) => (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value), "نشانی لوگو معتبر نیست.");
const links = z.array(z.object({ label: z.string().trim().min(1).max(100), href: urlOrRelative })).max(30);
const footerSchema = z.object({
  brandLogoUrl: safeAssetUrl,
  brandDescription: z.string().trim().min(10).max(600),
  phone: z.string().trim().min(5).max(80),
  email: z.string().trim().email().max(254),
  address: z.string().trim().min(4).max(500),
  linkedinUrl: z.union([z.literal(""), z.string().regex(/^https?:\/\//i).url().max(2048)]),
  instagramUrl: z.union([z.literal(""), z.string().regex(/^https?:\/\//i).url().max(2048)]),
  copyright: z.string().trim().min(4).max(240),
  services: links,
  quickLinks: links,
});

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await getFooterData());
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const parsed = footerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "فیلدها را بررسی کنید.", issues: parsed.error.flatten() }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "پایگاه داده متصل نیست." }, { status: 503 });
  try {
    await db.insert(siteFooterSettings).values({ id: 1, ...parsed.data, updatedAt: new Date() }).onConflictDoUpdate({ target: siteFooterSettings.id, set: { ...parsed.data, updatedAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ذخیره تغییرات انجام نشد." }, { status: 500 });
  }
}
