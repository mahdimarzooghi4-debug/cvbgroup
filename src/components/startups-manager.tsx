"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

type StartupRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  pageUrl: string;
  websiteUrl: string | null;
  email: string | null;
  address: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  published: boolean;
  sortOrder: number;
};
type StartupForm = Omit<StartupRecord, "id" | "pageUrl">;

const blankForm: StartupForm = { name: "", slug: "", description: "", logoUrl: "/assets/brands/dena.png", websiteUrl: "", email: "", address: "", linkedinUrl: "", instagramUrl: "", published: false, sortOrder: 1 };

export function StartupsManager() {
  const [items, setItems] = useState<StartupRecord[]>([]);
  const [form, setForm] = useState<StartupForm>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const fetchItems = useCallback(async () => {
    const response = await fetch("/api/admin/startups", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result as StartupRecord[];
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchItems()); setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "بارگذاری استارتاپ‌ها انجام نشد.");
    } finally {
      setLoading(false);
    }
  }, [fetchItems]);

  useEffect(() => {
    let active = true;
    fetchItems().then((result) => { if (active) { setItems(result); setError(""); } }).catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "بارگذاری استارتاپ‌ها انجام نشد."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchItems]);

  function selectItem(item: StartupRecord) {
    setEditingId(item.id);
    setForm({ name: item.name, slug: item.slug, description: item.description, logoUrl: item.logoUrl, websiteUrl: item.websiteUrl ?? "", email: item.email ?? "", address: item.address ?? "", linkedinUrl: item.linkedinUrl ?? "", instagramUrl: item.instagramUrl ?? "", published: item.published, sortOrder: item.sortOrder });
    setNotice("");
  }

  function resetForm() { setEditingId(null); setForm(blankForm); setNotice(""); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setNotice(""); setError("");
    try {
      const response = await fetch(editingId ? `/api/admin/startups/${editingId}` : "/api/admin/startups", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "ذخیره استارتاپ انجام نشد.");
      await load();
      setNotice(editingId ? "تغییرات استارتاپ ذخیره شد." : "استارتاپ جدید اضافه شد و در جایگاه اول قرار گرفت.");
      if (!editingId) setForm(blankForm);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "ذخیره استارتاپ انجام نشد.");
    } finally { setBusy(false); }
  }

  async function remove(item: StartupRecord) {
    if (!window.confirm(`استارتاپ «${item.name}» حذف شود؟`)) return;
    const response = await fetch(`/api/admin/startups/${item.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "حذف انجام نشد."); return; }
    if (editingId === item.id) resetForm();
    setNotice("استارتاپ حذف شد و ترتیب بقیه به‌روزرسانی شد.");
    await load();
  }

  function change<K extends keyof StartupForm>(key: K, value: StartupForm[K]) { setForm((current) => ({ ...current, [key]: value })); }

  return (
    <div className="admin-workspace">
      <section className="admin-panel-card manager-form-card">
        <div className="admin-section-heading"><div><h2>{editingId ? "ویرایش استارتاپ" : "افزودن استارتاپ"}</h2><p>استارتاپ تازه پس از ذخیره در رتبهٔ اول فهرست قرار می‌گیرد.</p></div><button className="manager-new-button" type="button" onClick={resetForm}><Plus size={16} /> جدید</button></div>
        <form className="admin-data-form" onSubmit={submit}>
          <label>نام استارتاپ<input value={form.name} onChange={(e) => change("name", e.target.value)} required maxLength={160} /></label>
          <label>شناسهٔ کسب‌وکار<input value={form.slug} onChange={(e) => change("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={100} dir="ltr" /></label>
          <label className="span-two">توضیح کوتاه<textarea value={form.description} onChange={(e) => change("description", e.target.value)} required rows={3} maxLength={500} /></label>
          <label className="span-two">نشانی لوگو<input value={form.logoUrl} onChange={(e) => change("logoUrl", e.target.value)} required placeholder="/assets/brands/... یا https://..." dir="ltr" /></label>
          <label>آدرس وب‌سایت کسب‌وکار<input value={form.websiteUrl ?? ""} onChange={(e) => change("websiteUrl", e.target.value)} type="url" dir="ltr" /></label>
          <label>ایمیل کسب‌وکار<input value={form.email ?? ""} onChange={(e) => change("email", e.target.value)} type="email" dir="ltr" /></label>
          <label>نشانی فیزیکی<input value={form.address ?? ""} onChange={(e) => change("address", e.target.value)} maxLength={500} /></label>
          <label>LinkedIn<input value={form.linkedinUrl ?? ""} onChange={(e) => change("linkedinUrl", e.target.value)} type="url" dir="ltr" /></label>
          <label>Instagram<input value={form.instagramUrl ?? ""} onChange={(e) => change("instagramUrl", e.target.value)} type="url" dir="ltr" /></label>
          <label>ترتیب نمایش<input value={form.sortOrder} onChange={(e) => change("sortOrder", Number(e.target.value))} type="number" min="1" max={Math.max(1, items.length)} disabled={!editingId} /></label>
          <label className="checkbox-label"><input checked={form.published} onChange={(e) => change("published", e.target.checked)} type="checkbox" /> انتشار در سایت</label>
          <div className="manager-form-actions"><button className="admin-primary-button" disabled={busy} type="submit">{busy ? "در حال ذخیره…" : editingId ? "ذخیره تغییرات" : "افزودن استارتاپ"}</button>{editingId && <button className="admin-quiet-button" type="button" onClick={resetForm}>لغو ویرایش</button>}</div>
        </form>
      </section>
      <section className="admin-panel-card manager-list-card">
        <div className="admin-section-heading"><div><h2>فهرست استارتاپ‌ها</h2><p>تعداد کل محدودیت ندارد؛ جدیدترین مورد در رتبهٔ اول نمایش داده می‌شود.</p></div><span className="admin-count-pill">{loading ? "…" : items.length}</span></div>
        {notice && <div className="admin-alert success">{notice}</div>}
        {error && <div className="admin-alert error" role="alert">{error}</div>}
        {loading ? <p className="admin-empty">در حال بارگذاری…</p> : items.length === 0 ? <p className="admin-empty">هنوز استارتاپی ثبت نشده است.</p> : (
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ترتیب</th><th>نام</th><th>وب‌سایت</th><th>انتشار</th><th>عملیات</th></tr></thead><tbody>
            {items.map((item) => <tr key={item.id}><td>{item.sortOrder}</td><td><strong>{item.name}</strong><small>{item.slug}</small></td><td dir="ltr">{item.websiteUrl || "—"}</td><td><span className={`admin-status ${item.published ? "published" : "draft"}`}>{item.published ? "منتشرشده" : "پیش‌نویس"}</span></td><td><div className="row-actions"><button onClick={() => selectItem(item)} type="button" aria-label={`ویرایش ${item.name}`}><Pencil size={15} /></button><button className="delete" onClick={() => void remove(item)} type="button" aria-label={`حذف ${item.name}`}><Trash2 size={15} /></button></div></td></tr>)}
          </tbody></table></div>
        )}
      </section>
    </div>
  );
}
