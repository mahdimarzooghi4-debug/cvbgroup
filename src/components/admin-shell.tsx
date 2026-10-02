"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CircleDot, Home, LayoutDashboard, Mail, Rocket, Settings } from "lucide-react";

const navItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/startups", label: "مدیریت استارتاپ‌ها", icon: Rocket },
  { href: "/admin/messages", label: "پیام‌های تماس", icon: Mail },
  { href: "/admin/orbits", label: "مدار کسب‌وکارها", icon: CircleDot },
  { href: "/admin/settings/footer", label: "فوتر سایت", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="admin-shell" dir="rtl">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin"><span><strong>گروه کسب‌وکار نگاه خلاق</strong><small>پنل مدیریت محتوا</small></span><Image src="/assets/figma/brand.png" alt="" width={40} height={40} /></Link>
        <nav className="admin-nav" aria-label="منوی پنل">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link className={pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "active" : ""} href={href} key={href}><Icon size={18} /><span>{label}</span></Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom"><span>پنل بدون ورود</span><Link href="/" aria-label="بازگشت به سایت"><Home size={18} /></Link></div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
