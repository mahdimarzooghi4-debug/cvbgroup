import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { createAdminSession } from "@/lib/admin-auth";

const loginSchema = z.object({ username: z.string().trim().min(1).max(64), password: z.string().min(1).max(256) });

export async function POST(request: Request) {
  const values = loginSchema.safeParse(await request.json().catch(() => null));
  if (!values.success) return NextResponse.json({ error: "نام کاربری یا گذرواژه معتبر نیست." }, { status: 400 });
  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUsername || !passwordHash) return NextResponse.json({ error: "ورود مدیر هنوز پیکربندی نشده است." }, { status: 503 });
  const usernameMatches = values.data.username.toLowerCase() === expectedUsername.toLowerCase();
  const passwordMatches = await compare(values.data.password, passwordHash).catch(() => false);
  if (!usernameMatches || !passwordMatches) return NextResponse.json({ error: "نام کاربری یا گذرواژه اشتباه است." }, { status: 401 });
  try {
    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "پیکربندی نشست پنل کامل نیست." }, { status: 503 });
  }
}
