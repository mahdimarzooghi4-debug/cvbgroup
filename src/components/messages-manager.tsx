"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type ContactMessage = { id: string; name: string; phone: string; email: string | null; subject: string; message: string; status: "new" | "read" | "replied"; createdAt: string };
const statusNames = { new: "جدید", read: "خوانده‌شده", replied: "پاسخ‌داده‌شده" };

export function MessagesManager() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchItems = useCallback(async () => {
    const response = await fetch("/api/admin/messages", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result as ContactMessage[];
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await fetchItems()); setError("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "بارگذاری پیام‌ها انجام نشد."); }
    finally { setLoading(false); }
  }, [fetchItems]);
  useEffect(() => {
    let active = true;
    fetchItems().then((result) => { if (active) { setItems(result); setError(""); } }).catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "بارگذاری پیام‌ها انجام نشد."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetchItems]);

  async function setStatus(item: ContactMessage, status: ContactMessage["status"]) {
    const response = await fetch(`/api/admin/messages/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "به‌روزرسانی وضعیت انجام نشد."); else await load();
  }
  async function remove(item: ContactMessage) {
    if (!window.confirm(`پیام «${item.subject}» حذف شود؟`)) return;
    const response = await fetch(`/api/admin/messages/${item.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "حذف انجام نشد."); else await load();
  }

  return <section className="admin-panel-card manager-list-card"><div className="admin-section-heading"><div><h2>پیام‌های دریافتی</h2><p>۳۰۰ پیام تازهٔ ثبت‌شده نمایش داده می‌شوند.</p></div><span className="admin-count-pill">{loading ? "…" : items.length}</span></div>{error && <div className="admin-alert error" role="alert">{error}</div>}{loading ? <p className="admin-empty">در حال بارگذاری…</p> : items.length === 0 ? <p className="admin-empty">هنوز پیامی ثبت نشده است.</p> : <div className="message-list">{items.map((item) => <article className="message-card" key={item.id}><div className="message-main"><div className="message-title"><h3>{item.subject}</h3><time>{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt))}</time></div><p>{item.message}</p><div className="message-sender"><strong>{item.name}</strong><a href={`tel:${item.phone}`}>{item.phone}</a>{item.email && <a href={`mailto:${item.email}`}>{item.email}</a>}</div></div><div className="message-actions"><select value={item.status} onChange={(e) => void setStatus(item, e.target.value as ContactMessage["status"])} aria-label="وضعیت پیام">{Object.entries(statusNames).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><button className="icon-danger" type="button" aria-label="حذف پیام" onClick={() => void remove(item)}><Trash2 size={16} /></button></div></article>)}</div>}</section>;
}
