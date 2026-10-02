"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "ارسال پیام انجام نشد. کمی بعد دوباره تلاش کنید.");
      }
      form.reset();
      setState("success");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "خطای نامشخص در ارسال پیام.");
      setState("error");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label className="honeypot" aria-hidden="true">وب‌سایت<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label>نام و نام خانوادگی<input name="name" autoComplete="name" required maxLength={120} /></label>
      <div className="form-two-columns">
        <label>شماره تماس<input name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={40} /></label>
        <label>ایمیل (اختیاری)<input name="email" type="email" autoComplete="email" maxLength={254} /></label>
      </div>
      <label>موضوع پیام<input name="subject" required maxLength={180} /></label>
      <label>توضیحات<textarea name="message" rows={4} required minLength={10} maxLength={3000} /></label>
      <button className="primary-button form-submit" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "در حال ارسال…" : "ارسال پیام"}
      </button>
      {state === "success" && <p className="form-success" role="status">پیام شما با موفقیت ثبت شد.</p>}
      {state === "error" && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
