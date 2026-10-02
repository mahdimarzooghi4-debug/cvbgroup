"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
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
  const visual = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = visual.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 520));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const orbitMembers = [1, 2, 3].map((orbit) => businesses.filter((business) => business.orbit === orbit));
  const logoSizes: Record<string, [number, number]> = {
    "/assets/brands/moon.png": [38, 38], "/assets/brands/henna.png": [38, 38],
    "/assets/brands/negarin.png": [32, 38], "/assets/brands/dena.png": [38, 38],
    "/assets/brands/parcham.png": [55.06, 55.06], "/assets/brands/mono.png": [35.238, 37],
    "/assets/brands/cube.png": [31.4, 38], "/assets/brands/funnel.png": [36, 38],
  };
  return (
    <section className="section about-section" id="about">
      <div className="orbit-layout">
        <div className="orbit-visual" ref={visual} style={{ "--orbit-scale": scale } as CSSProperties} aria-label="کسب‌وکارهای گروه نگاه خلاق در مدارهای نوآوری">
          <div className="orbit-stage">
            <Image className="orbit-ring ring-outer" src="/assets/figma/about/orbit-outer.svg" alt="" width={472} height={472} />
            <Image className="orbit-ring ring-middle" src="/assets/figma/about/orbit-middle.svg" alt="" width={348} height={348} />
            <Image className="orbit-ring ring-inner" src="/assets/figma/about/orbit-inner.svg" alt="" width={203} height={203} />
            <Image className="orbit-center" src="/assets/figma/about/orbit-center.svg" alt="نگاه خلاق" width={72} height={64} />
            {orbitMembers.flatMap((members, index) => members.map((business, position) => {
              const external = business.href.startsWith("http");
              const style = { "--orbit-angle": `${position * (360 / members.length)}deg` } as CSSProperties;
              const [width, height] = logoSizes[business.logo] ?? [38, 38];
              const content = <Image src={business.logo} alt={business.name} width={Math.ceil(width)} height={Math.ceil(height)} style={{ width, height }} unoptimized />;
              return (
                <div className={`orbit-node orbit-track-${index + 1}`} style={style} key={business.slug}>
                  {external ? (
                    <a className="orbit-logo" href={business.href} aria-label={`رفتن به ${business.name}`} target="_blank" rel="noreferrer">{content}</a>
                  ) : (
                    <Link className="orbit-logo" href={business.href} aria-label={`مشاهده ${business.name}`}>{content}</Link>
                  )}
                </div>
              );
            }))}
          </div>
        </div>
        <div className="about-copy">
          <div className="about-heading">
            <h2>درباره ما</h2>
            <p className="about-lead">کارخانه تولید کسب و کارهای جسور</p>
          </div>
          <p className="about-description">ما یک تیم متخصص و حرفه‌ای هستیم که با بهره‌گیری از جدیدترین تکنولوژی‌ها و متدهای روز دنیا، ایده‌های شما را به کسب‌وکارهای موفق و پرسود تبدیل می‌کنیم. با بیش از یک دهه تجربه در حوزه راه‌اندازی و توسعه کسب‌وکار، ما همراه شما در مسیر موفقیت هستیم. تیم ما متشکل از متخصصان برتر در زمینه‌های مختلف از جمله توسعه نرم‌افزار، بازاریابی دیجیتال، مدیریت پروژه و مشاوره کسب‌وکار است.</p>
          <div className="about-stats" dir="rtl">
            <div className="about-stat about-stat-projects"><Image src="/assets/figma/about/metric-projects.svg" alt="" width={43} height={43} /><div><strong dir="ltr">+۵۰</strong><span>پروژه موفق</span></div></div>
            <div className="about-stat"><Image src="/assets/figma/about/metric-satisfaction.svg" alt="" width={43} height={43} /><div><strong>۹۵٪</strong><span>رضایت مشتری</span></div></div>
            <div className="about-stat"><Image src="/assets/figma/about/metric-support.svg" alt="" width={43} height={43} /><div><strong>۲۴/۷</strong><span>پشتیبانی</span></div></div>
          </div>
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
