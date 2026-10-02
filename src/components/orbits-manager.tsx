"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ORBIT_CAPACITY } from "@/lib/orbit-config";
import { businessWebsite } from "@/lib/business-website";

type OrbitRecord = { id: string; name: string; logoUrl: string; websiteUrl: string; orbit: number; sortOrder: number; visible: boolean };
type OrbitForm = Omit<OrbitRecord, "id">;
const blankOrbit: OrbitForm = { name: "", logoUrl: "/assets/brands/dena.png", websiteUrl: "", orbit: 1, sortOrder: 1, visible: true };

export function OrbitsManager() {
  const [items, setItems] = useState<OrbitRecord[]>([]);
  const [form, setForm] = useState<OrbitForm>(blankOrbit);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const counts = [1, 2, 3].map((orbit) => items.filter((item) => item.orbit === orbit).length);

  const fetchItems = useCallback(async () => {
    const response = await fetch("/api/admin/orbits", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result as OrbitRecord[];
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchItems()); setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "بارگذاری مدارها انجام نشد."); }
    finally { setLoading(false); }
  }, [fetchItems]);
  useEffect(() => {
    let active = true;
    fetchItems().then((result) => { if (active) { setItems(result); setError(""); } }).catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "بارگذاری مدارها انجام نشد."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchItems]);

  function edit(item: OrbitRecord) { setEditingId(item.id); setForm({ name: item.name, logoUrl: item.logoUrl, websiteUrl: businessWebsite(item.websiteUrl) ?? "", orbit: item.orbit, sortOrder: item.sortOrder, visible: item.visible }); }
  function reset() { setEditingId(null); setForm({ ...blankOrbit, orbit: form.orbit }); setNotice(""); }
  function update<K extends keyof OrbitForm>(key: K, value: OrbitForm[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(editingId ? `/api/admin/orbits/${editingId}` : "/api/admin/orbits", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "ذخیره انجام نشد.");
      await load(); setNotice(editingId ? "تغییرات کسب‌وکار ذخیره شد." : "کسب‌وکار به مدار اضافه شد.");
      if (!editingId) setForm({ ...blankOrbit, orbit: form.orbit, sortOrder: Math.min(ORBIT_CAPACITY, (counts[form.orbit - 1] ?? 0) + 1) });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "ذخیره انجام نشد."); }
    finally { setBusy(false); }
  }

  async function remove(item: OrbitRecord) {
    if (!window.confirm(`«${item.name}» از مدار حذف شود؟`)) return;
    const response = await fetch(`/api/admin/orbits/${item.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setError(result.error ?? "حذف انجام نشد."); return; }
    if (editingId === item.id) reset();
    setNotice("کسب‌وکار حذف شد و ترتیب مدار اصلاح شد."); await load();
  }

  return (
    <div className="admin-workspace orbit-admin-workspace">
      <section className="admin-panel-card manager-form-card">
        <div className="admin-section-heading"><div><h2>{editingId ? "ویرایش عضو مدار" : "افزودن به مدار"}</h2><p>هر مدار حداکثر ۳ کسب‌وکار می‌پذیرد.</p></div><button className="manager-new-button" type="button" onClick={reset}><Plus size={16} /> جدید</button></div>
        <div className="orbit-counts">{counts.map((count, index) => <span key={index}>مدار {index + 1}<b>{count} / {ORBIT_CAPACITY}</b></span>)}</div>
        <form className="admin-data-form" onSubmit={submit}>
          <label className="span-two">نام نمایشی کسب‌وکار<input value={form.name} onChange={(e) => update("name", e.target.value)} required maxLength={160} /></label>
          <label className="span-two">نشانی لوگو<input value={form.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} required placeholder="/assets/brands/... یا https://..." dir="ltr" /></label>
          <label className="span-two">آدرس وب‌سایت کسب‌وکار<input type="url" value={form.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} dir="ltr" placeholder="https://..." /></label>
          <label>مدار<select value={form.orbit} onChange={(e) => { const orbit = Number(e.target.value); update("orbit", orbit); update("sortOrder", Math.min(ORBIT_CAPACITY, (counts[orbit - 1] ?? 0) + 1)); }}><option value={1}>مدار اول</option><option value={2}>مدار دوم</option><option value={3}>مدار سوم</option></select></label>
          <label>ترتیب گردش<input type="number" value={form.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} min={1} max={ORBIT_CAPACITY} required /></label>
          <label className="checkbox-label"><input type="checkbox" checked={form.visible} onChange={(e) => update("visible", e.target.checked)} /> نمایش در بخش درباره ما</label>
          <div className="manager-form-actions"><button className="admin-primary-button" type="submit" disabled={busy}>{busy ? "در حال ذخیره…" : editingId ? "ذخیره تغییرات" : "افزودن به مدار"}</button>{editingId && <button className="admin-quiet-button" type="button" onClick={reset}>لغو ویرایش</button>}</div>
        </form>
      </section>
      <section className="admin-panel-card manager-list-card">
        <div className="admin-section-heading"><div><h2>اعضای مدارها</h2><p>نشانی ثبت‌شده در مدیریت استارتاپ‌ها استفاده می‌شود؛ برای سایر اعضا آدرس را اینجا وارد کنید.</p></div><span className="admin-count-pill">{loading ? "…" : items.length}</span></div>
        {notice && <div className="admin-alert success">{notice}</div>}{error && <div className="admin-alert error" role="alert">{error}</div>}
        {loading ? <p className="admin-empty">در حال بارگذاری…</p> : items.length === 0 ? <p className="admin-empty">هنوز کسب‌وکاری به مدار اضافه نشده است.</p> : <div className="orbit-admin-list">{items.map((item) => <article className="orbit-admin-row" key={item.id}><div className="orbit-admin-logo"><Image src={item.logoUrl} alt="" width={40} height={40} unoptimized /></div><div className="orbit-admin-info"><strong>{item.name}</strong><small>{businessWebsite(item.websiteUrl) || "نشانی را در استارتاپ‌ها یا این بخش ثبت کنید"}</small></div><span className="orbit-badge">مدار {item.orbit} · {item.sortOrder}</span><span className={`admin-status ${item.visible ? "published" : "draft"}`}>{item.visible ? "نمایش" : "مخفی"}</span><div className="row-actions"><button type="button" onClick={() => edit(item)} aria-label={`ویرایش ${item.name}`}><Pencil size={15} /></button><button className="delete" type="button" onClick={() => void remove(item)} aria-label={`حذف ${item.name}`}><Trash2 size={15} /></button></div></article>)}</div>}
      </section>
    </div>
  );
}
