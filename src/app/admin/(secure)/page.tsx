import Link from "next/link";
import { getDb } from "@/db";
import { contactMessages, orbitBusinesses, startups } from "@/db/schema";

export default async function AdminDashboard() {
  const db = getDb();
  let startupCount: number | null = null;
  let orbitCount: number | null = null;
  let messageCount: number | null = null;
  if (db) {
    try {
      const [s, o, m] = await Promise.all([db.select({ id: startups.id }).from(startups), db.select({ id: orbitBusinesses.id }).from(orbitBusinesses), db.select({ id: contactMessages.id }).from(contactMessages)]);
      startupCount = s.length;
      orbitCount = o.length;
      messageCount = m.length;
    } catch {
      // Migration status is shown below; do not substitute demo statistics.
    }
  }
  return (
    <div className="admin-page">
      <header className="admin-page-heading"><div><h1>داشبورد</h1><p>مدیریت محتوای سایت گروه کسب‌وکار نگاه خلاق</p></div></header>
      {!db && <div className="admin-alert">اتصال پایگاه داده انجام نشده؛ برای فعال‌شدن مدیریت، `DATABASE_URL` را تنظیم و migrationها را اجرا کنید.</div>}
      {db && startupCount === null && <div className="admin-alert">جدول‌های پایگاه داده آماده نیستند؛ migrationها را اجرا کنید.</div>}
      <div className="admin-stats-grid">
        <div className="admin-stat-card"><span>استارتاپ‌ها</span><strong>{startupCount ?? "—"}</strong><Link href="/admin/startups">مدیریت فهرست</Link></div>
        <div className="admin-stat-card"><span>کسب‌وکارهای مدار</span><strong>{orbitCount ?? "—"}</strong><Link href="/admin/orbits">مدیریت مدارها</Link></div>
        <div className="admin-stat-card"><span>پیام‌های تماس</span><strong>{messageCount ?? "—"}</strong><Link href="/admin/messages">مشاهده پیام‌ها</Link></div>
      </div>
      <section className="admin-panel-card"><h2>تنظیمات سایت</h2><p>اطلاعات تماس، شبکه‌های اجتماعی و پیوندهای فوتر سراسری سایت را مدیریت کنید.</p><Link className="admin-secondary-button" href="/admin/settings/footer">مدیریت فوتر سایت</Link></section>
    </div>
  );
}
