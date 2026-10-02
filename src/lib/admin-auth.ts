import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

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
    .setExpirationTime(`${sessionAgeSeconds}s`)
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
  const secret = getSecret();
  if (!secret) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret, { issuer: "cvbgroup", audience: "cvbgroup-admin" });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
