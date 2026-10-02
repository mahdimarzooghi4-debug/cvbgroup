"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "ورود انجام نشد.");
      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ورود انجام نشد.");
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-page" dir="rtl">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-login-brand"><Image src="/assets/figma/brand.png" alt="نشان نگاه خلاق" width={54} height={54} /><span><strong>گروه کسب‌وکار نگاه خلاق</strong><small>پنل مدیریت</small></span></div>
        <div className="admin-login-title"><span><LockKeyhole size={20} /></span><h1>ورود مدیر</h1><p>برای ادامه اطلاعات ورود را وارد کنید.</p></div>
        <label>نام کاربری<input type="text" name="username" autoComplete="username" required maxLength={64} /></label>
        <label>گذرواژه<input type="password" name="password" autoComplete="current-password" required maxLength={256} /></label>
        {error && <p className="admin-form-error" role="alert">{error}</p>}
        <button className="admin-primary-button" type="submit" disabled={busy}>{busy ? "در حال ورود…" : "ورود به پنل"}</button>
      </form>
    </main>
  );
}
