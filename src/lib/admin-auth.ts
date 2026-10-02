import { cookies } from "next/headers";
import { SignJWT } from "jose";

const cookieName = "cvb_admin_session";
const sessionAgeSeconds = 60 * 60 * 8;

function getSecret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) return null;
  return new TextEncoder().encode(value);
}

export async function createAdminSession() {
  const secret = getSecret();
  if (!secret) throw new Error("SESSION_SECRET must contain at least 32 characters.");
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("cvbgroup")
    .setAudience("cvbgroup-admin")
    .setExpirationTime(String(sessionAgeSeconds) + "s")
    .sign(secret);
  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: sessionAgeSeconds,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.set(cookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 0 });
}

export async function hasAdminSession() {
  // Public mode: the owner explicitly requested access without sign-in.
  // Keep cookies() so admin routes remain dynamically rendered.
  await cookies();
  return true;
}
