import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";

export async function requireAdmin() {
  if (await hasAdminSession()) return null;
  return NextResponse.json({ error: "برای ادامه وارد پنل شوید." }, { status: 401 });
}
