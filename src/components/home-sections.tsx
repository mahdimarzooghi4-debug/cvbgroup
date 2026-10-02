"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, Blocks, FlaskConical, Lightbulb, Search } from "lucide-react";
import type { OrbitBusiness, Startup } from "@/lib/site-content";

const solutions = [
  { title: "تیم‌سازی", description: "ساخت تیم حرفه‌ای برای کسب‌وکار شما", icon: "team", tint: "rgba(239,68,68,.35)" },
  { title: "مشاوره کسب‌وکار", description: "راهنمایی حرفه‌ای برای تبدیل ایده به کسب‌وکار", icon: "consulting", tint: "rgba(104,174,255,.35)" },
  { title: "راه‌اندازی استارتاپ", description: "از صفر تا صد راه‌اندازی کسب‌وکار دیجیتال", icon: "startup", tint: "rgba(236,72,153,.35)" },
  { title: "رشد و توسعه", description: "استراتژی‌های رشد و بهینه‌سازی کسب‌وکار", icon: "growth", tint: "rgba(16,185,129,.35)" },
  { title: "تدوین سند استراتژیک", description: "تعیین اهداف کلان و ترسیم مسیر رشد", icon: "strategy", tint: "rgba(59,130,246,.08)" },
  { title: "تحلیل داده‌ها", description: "استفاده از داده‌های کلان برای تصمیم‌گیری", icon: "data-analysis", tint: "rgba(245,158,11,.35)" },
  { title: "سرمایه گذاری هدفمند", description: "سرمایه‌گذاری هوشمند در محدوده استراتژیک", icon: "investment", tint: "rgba(249,115,22,.35)" },
  { title: "مدیریت ریسک", description: "شناسایی و مدیریت ریسک‌های کسب‌وکار", icon: "risk", tint: "rgba(168,85,247,.35)" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="section-label">{children}</span>;
}

export function SolutionsSection() {
  return (
    <section className="section solutions-section" id="services">
      <div className="section-heading centered">
        <SectionLabel>خدمات ما</SectionLabel>
        <div className="services-introduction">
          <h2>راهکارهای جامع برای موفقیت</h2>
          <p>تیم ما با بهره‌گیری از جدیدترین متدها، کسب‌وکار شما را به سطح بعدی می‌برد</p>
        </div>
      </div>
      <div className="solutions-grid">
        {solutions.map(({ title, description, icon, tint }) => (
          <article className={`solution-card${icon === "startup" ? " solution-card-startup" : ""}`} key={title}>
            <span className="solution-icon" aria-hidden="true">
              <span className="solution-icon-back" />
              <span className="solution-icon-tile" style={{ backgroundColor: tint }}>
                <Image src={`/assets/figma/services/${icon}.svg`} alt="" width={24} height={24} />
              </span>
            </span>
            <h3>{title}</h3>
            <p title={description}>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function OrbitSection({ businesses }: { businesses: OrbitBusiness[] }) {
  return (
    <section className="section about-section" id="about">
      <div className="orbit-layout">
        <div className="orbit-visual" aria-label="کسب‌وکارهای گروه نگاه خلاق در مدارهای نوآوری">
          <div className="orbit-ring ring-outer" />
          <div className="orbit-ring ring-middle" />
          <div className="orbit-ring ring-inner" />
          <div className="orbit-center"><Image src="/assets/figma/brand.png" alt="نگاه خلاق" width={50} height={50} /></div>
          {businesses.map((business) => {
            const external = business.href.startsWith("http");
            const membersOnOrbit = businesses.filter((item) => item.orbit === business.orbit);
            const position = membersOnOrbit.findIndex((item) => item.slug === business.slug);
            const className = `orbit-node orbit-track-${business.orbit}`;
            const style = { "--orbit-angle": `${position * (360 / Math.max(1, membersOnOrbit.length))}deg` } as CSSProperties;
            const content = (
              <span className="orbit-logo">
                <Image src={business.logo} alt={business.name} width={40} height={40} unoptimized />
              </span>
            );
            return (
              <div className={className} style={style} key={business.slug}>
                {external ? (
                  <a href={business.href} aria-label={`رفتن به ${business.name}`} target="_blank" rel="noreferrer">{content}</a>
                ) : (
                  <Link href={business.href} aria-label={`مشاهده ${business.name}`}>{content}</Link>
                )}
              </div>
            );
          })}
        </div>
        <div className="about-copy">
          <SectionLabel>درباره ما</SectionLabel>
          <h2>مادر صنعت نوآوری</h2>
          <p className="about-lead">کارخانه تولید کسب‌وکارهای جسور</p>
          <p className="about-description">ما یک تیم متخصص و حرفه‌ای هستیم که با بهره‌گیری از جدیدترین تکنولوژی‌ها و متدهای روز دنیا، ایده‌های شما را به کسب‌وکارهای موفق و پرسود تبدیل می‌کنیم. با بیش از یک دهه تجربه در حوزه راه‌اندازی و توسعه کسب‌وکار، ما همراه شما در مسیر موفقیت هستیم. تیم ما متشکل از متخصصان برتر در زمینه‌های مختلف از جمله توسعه نرم‌افزار، بازاریابی دیجیتال، مدیریت پروژه و مشاوره کسب‌وکار است.</p>
          <div className="about-stats" dir="rtl">
            <div><strong>+۵۰</strong><span>پروژه موفق</span></div>
            <div><strong>۹۵٪</strong><span>رضایت مشتری</span></div>
            <div><strong>۲۴/۷</strong><span>پشتیبانی</span></div>
          </div>
          <Link href="#startups" className="text-link">آشنایی با کسب‌وکارهای ما <ArrowLeft size={17} /></Link>
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const steps = [
    { label: "شناخت", icon: Search, position: "process-northwest" },
    { label: "ایده‌پردازی", icon: Lightbulb, position: "process-northeast" },
    { label: "آمادگی", icon: Blocks, position: "process-southwest" },
    { label: "اعتبارسنجی", icon: FlaskConical, position: "process-southeast" },
  ];
  return (
    <section className="section process-section">
      <div className="section-heading centered">
        <SectionLabel>مسیر راه‌اندازی کسب‌وکار شما</SectionLabel>
        <h2>ما چطوری کار می‌کنیم؟</h2>
      </div>
      <div className="process-diagram" aria-label="شناخت، ایده‌پردازی، آمادگی، اعتبارسنجی، نمونه اولیه و زاویه دید">
        <span className="process-caption caption-top">نمونه اولیه</span>
        <span className="process-caption caption-bottom">زاویه دید</span>
        <div className="process-links" aria-hidden="true"><i /><i /><i /><i /></div>
        {steps.map(({ label, icon: Icon, position }) => (
          <div className={`process-node ${position}`} key={label}>
            <span><Icon size={22} strokeWidth={1.7} /></span>
            <small>{label}</small>
          </div>
        ))}
        <div className="process-center"><Image src="/assets/figma/brand.png" alt="نگاه خلاق" width={28} height={28} /></div>
      </div>
    </section>
  );
}

export function StartupsSection({ startups }: { startups: Startup[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  function scroll(direction: number) {
    scroller.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  }
  return (
    <section className="section startups-section" id="startups">
      <div className="startup-heading-row">
        <div className="section-heading">
          <SectionLabel>کسب‌وکارهای ما</SectionLabel>
          <h2>استارتاپ‌های جدید</h2>
          <p>با کسب‌وکارهایی که در گروه کسب و کار نگاه خلاق ساخته‌ایم آشنا شوید.</p>
        </div>
        <div className="scroll-buttons" aria-label="پیمایش استارتاپ‌ها">
          <button type="button" onClick={() => scroll(1)} aria-label="حرکت به کارت‌های بعدی"><ArrowRight size={18} /></button>
          <button type="button" onClick={() => scroll(-1)} aria-label="حرکت به کارت‌های قبلی"><ArrowLeft size={18} /></button>
        </div>
      </div>
      <div className="startup-scroller" ref={scroller} dir="rtl" tabIndex={0} aria-label="فهرست قابل پیمایش استارتاپ‌ها">
        {startups.filter((startup) => startup.published).map((startup) => (
          <Link className="startup-card" href={`/startups/${startup.slug}`} key={startup.slug}>
            <div className="startup-logo"><Image src={startup.logo} alt="" width={54} height={54} unoptimized /><strong>{startup.name}</strong></div>
            <p>{startup.description}</p>
            <span className="startup-card-link">مشاهده کسب‌وکار <ArrowLeft size={15} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
