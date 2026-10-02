import { NextResponse } from "next/server";
import { z } from "zod";
import { contactMessages } from "@/db/schema";
import { getDb } from "@/db";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(40),
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).optional(),
  subject: z.string().trim().min(2).max(180),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional(),
});

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "اطلاعات واردشده را بررسی کنید." }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "فرم تماس هنوز به پایگاه داده متصل نشده است." }, { status: 503 });
  try {
    const { name, phone, email, subject, message } = parsed.data;
    await db.insert(contactMessages).values({ name, phone, email: email || null, subject, message });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "ثبت پیام انجام نشد. کمی بعد دوباره تلاش کنید." }, { status: 500 });
  }
}
