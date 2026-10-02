"use client";

import { FormEvent, useState } from "react";
import { Check, Plus, Save, Trash2, X } from "lucide-react";
import type { FooterData } from "@/lib/public-data";

type LinkGroup = "services" | "quickLinks";

export function FooterSettingsForm({ initialValue }: { initialValue: FooterData }) {
  const [value, setValue] = useState(initialValue);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  function update<K extends keyof FooterData>(key: K, next: FooterData[K]) {
    setValue((current) => ({ ...current, [key]: next }));
  }
  function updateLink(group: LinkGroup, index: number, key: "label" | "href", next: string) {
    const links = [...value[group]];
    links[index] = { ...links[index], [key]: next };
    update(group, links);
  }
  function addLink(group: LinkGroup) {
    update(group, [...value[group], { label: "", href: "" }]);
  }
  function removeLink(group: LinkGroup, index: number) {
    update(group, value[group].filter((_, itemIndex) => itemIndex !== index));
  }
  function cancel() {
    setValue(initialValue);
    setMessage("");
    setIsError(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setIsError(false);
    try {
      const response = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "ذخیره تغییرات انجام نشد.");
      setMessage("تغییرات فوتر با موفقیت ذخیره شد.");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "ذخیره تغییرات انجام نشد.");
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  const linkEditor = (group: LinkGroup, title: string, description: string) => (
    <section className="admin-panel-card">
      <div className="admin-section-heading"><div><h2>{title}</h2><p>{description}</p></div></div>
      <div className="footer-link-list">
        {value[group].map((link, index) => (
          <div className="footer-link-row" key={`${group}-${index}`}>
            <button className="icon-danger" type="button" onClick={() => removeLink(group, index)} aria-label={`حذف لینک ${index + 1}`}><Trash2 size={17} /></button>
            <label>عنوان لینک<input value={link.label} onChange={(event) => updateLink(group, index, "label", event.target.value)} required maxLength={100} /></label>
            <label>نشانی URL<input value={link.href} onChange={(event) => updateLink(group, index, "href", event.target.value)} placeholder="https:// یا /مسیر" maxLength={2048} /></label>
          </div>
        ))}
      </div>
      <button className="admin-add-button" type="button" onClick={() => addLink(group)}><Plus size={17} /> افزودن ردیف</button>
    </section>
  );

  return (
    <form className="footer-settings-form" onSubmit={submit}>
      <div className="admin-form-toolbar"><span>تغییرات این فرم پس از ذخیره در سایت نمایش داده می‌شود.</span><div><button className="admin-quiet-button" type="button" onClick={cancel}><X size={16} /> لغو</button><button className="admin-primary-button" type="submit" disabled={busy}><Save size={16} />{busy ? "در حال ذخیره…" : "ذخیره تغییرات"}</button></div></div>
      {message && <div className={`admin-alert ${isError ? "error" : "success"}`} role={isError ? "alert" : "status"}>{!isError && <Check size={16} />}{message}</div>}
      <section className="admin-panel-card">
        <div className="admin-section-heading"><div><h2>هویت برند</h2><p>لوگو و توضیحی که در فوتر نمایش داده می‌شود.</p></div></div>
        <label>نشانی فایل لوگو<input value={value.brandLogoUrl} onChange={(event) => update("brandLogoUrl", event.target.value)} required maxLength={2048} /></label>
        <label>توضیح کوتاه برند<textarea value={value.brandDescription} onChange={(event) => update("brandDescription", event.target.value)} required minLength={10} maxLength={600} rows={3} /></label>
      </section>
      <div className="admin-form-grid">
        <section className="admin-panel-card">
          <div className="admin-section-heading"><div><h2>اطلاعات تماس</h2><p>اطلاعات ارتباطی گروه در فوتر اصلی.</p></div></div>
          <label>شماره تلفن<input value={value.phone} onChange={(event) => update("phone", event.target.value)} required maxLength={80} /></label>
          <label>ایمیل<input type="email" value={value.email} onChange={(event) => update("email", event.target.value)} required maxLength={254} /></label>
          <label>نشانی<textarea value={value.address} onChange={(event) => update("address", event.target.value)} required maxLength={500} rows={3} /></label>
        </section>
        <section className="admin-panel-card">
          <div className="admin-section-heading"><div><h2>شبکه‌های اجتماعی گروه</h2><p>پیوندهای سراسری سایت؛ جدا از پیوند هر استارتاپ.</p></div></div>
          <label>LinkedIn URL<input type="url" value={value.linkedinUrl} onChange={(event) => update("linkedinUrl", event.target.value)} placeholder="https://www.linkedin.com/company/..." /></label>
          <label>Instagram URL<input type="url" value={value.instagramUrl} onChange={(event) => update("instagramUrl", event.target.value)} placeholder="https://www.instagram.com/..." /></label>
        </section>
      </div>
      <div className="admin-form-grid">
        {linkEditor("services", "خدمات", "عنوان و مقصد لینک‌های بخش خدمات فوتر.")}
        {linkEditor("quickLinks", "دسترسی سریع", "عنوان و مقصد لینک‌های دسترسی سریع فوتر.")}
      </div>
      <section className="admin-panel-card">
        <div className="admin-section-heading"><div><h2>متن کپی‌رایت</h2><p>متنی که در پایین فوتر نمایش داده می‌شود.</p></div></div>
        <label>متن کپی‌رایت<input value={value.copyright} onChange={(event) => update("copyright", event.target.value)} required maxLength={240} /></label>
      </section>
      <div className="admin-form-toolbar bottom"><span>پس از ذخیره، صفحهٔ اصلی را برای بررسی تغییرات باز کنید.</span><div><button className="admin-quiet-button" type="button" onClick={cancel}><X size={16} /> لغو</button><button className="admin-primary-button" type="submit" disabled={busy}><Save size={16} />{busy ? "در حال ذخیره…" : "ذخیره تغییرات"}</button></div></div>
    </form>
  );
}
