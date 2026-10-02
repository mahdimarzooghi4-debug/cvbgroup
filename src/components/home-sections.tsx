"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { OrbitBusiness, Startup } from "@/lib/site-content";
import { ORBIT_CAPACITY, ORBIT_PERIOD_SECONDS } from "@/lib/orbit-config";

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
  const orbitRadii = [98.5, 170.9, 232.85];
  const orbitPhases = [0, 60, 30];
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
          <div className="orbit-stage" style={{ "--orbit-duration": `${ORBIT_PERIOD_SECONDS}s` } as CSSProperties}>
            <Image className="orbit-ring ring-outer" src="/assets/figma/about/orbit-outer.svg" alt="" width={472} height={472} />
            <Image className="orbit-ring ring-middle" src="/assets/figma/about/orbit-middle.svg" alt="" width={348} height={348} />
            <Image className="orbit-ring ring-inner" src="/assets/figma/about/orbit-inner.svg" alt="" width={203} height={203} />
            <Image className="orbit-center" src="/assets/figma/brand.png" alt="گروه کسب و کار نگاه خلاق" width={88} height={70} />
            <div className="orbit-revolution">
            {orbitMembers.flatMap((members, index) => members.map((business, position) => {
              const external = business.href.startsWith("http");
              const style = {
                "--orbit-angle": `${orbitPhases[index] + position * (360 / ORBIT_CAPACITY)}deg`,
                "--orbit-radius": `${orbitRadii[index]}px`,
              } as CSSProperties;
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
  const diagram = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = diagram.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 944));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const assets = [
    { src: "/assets/figma/process/horizontal.svg", width: 649, height: 4, left: 152, top: 235 },
    { src: "/assets/figma/process/ascending.svg", width: 214, height: 249, left: 367.628, top: 108 },
    { src: "/assets/figma/process/descending.svg", width: 205, height: 244, left: 373.499, top: 105.5 },
    { src: "/assets/figma/process/eye.svg", width: 70, height: 70, left: 442, top: 195.5 },
    { src: "/assets/figma/process/discovery.svg", width: 50, height: 50, left: 351, top: 49.5 },
    { src: "/assets/figma/process/ideation.svg", width: 50, height: 50, left: 553, top: 52.5 },
    { src: "/assets/figma/process/prototype.svg", width: 50, height: 50, left: 351, top: 368.5 },
    { src: "/assets/figma/process/validation.svg", width: 50, height: 50, left: 553, top: 363.5 },
    { src: "/assets/figma/process/top-arc.svg", width: 182, height: 37, left: 386.5, top: 8.916 },
    { src: "/assets/figma/process/bottom-arc.svg", width: 182, height: 37, left: 386, top: 426.5 },
    { src: "/assets/figma/process/top-arrow.svg", width: 14, height: 24, left: 469.183, top: 0.255 },
    { src: "/assets/figma/process/bottom-arrow.svg", width: 14, height: 24, left: 468.683, top: 448.454 },
    { src: "/assets/figma/process/right-arrow.svg", width: 24, height: 42, left: 810.183, top: 216.683 },
    { src: "/assets/figma/process/left-arrow.svg", width: 24, height: 42, left: 129.183, top: 215.678 },
    { src: "/assets/figma/process/left-arrow-extra.svg", width: 24, height: 42, left: 108.183, top: 215.678 },
  ];
  const labels = [
    { text: "مقیاس افزایی", left: 99, top: 224.5 },
    { text: "امادگی", left: 891.87, top: 224.5 },
    { text: "ایده پردازی", left: 692, top: 62 },
    { text: "اعتبار سنجی", left: 703, top: 378 },
    { text: "نمونه اولیه", left: 343, top: 384 },
    { text: "شناخت", left: 342, top: 64 },
    { text: "زاویه دید", left: 508, top: 271 },
  ];
  return (
    <section className="section process-section" aria-labelledby="process-title">
      <div className="process-heading">
        <h2 id="process-title">ما چطوری کار می‌کنیم؟</h2>
        <p>مسیر راه‌اندازی کسب‌وکار شما</p>
      </div>
      <div className="process-diagram" ref={diagram} style={{ "--process-scale": scale } as CSSProperties}>
        <div className="process-stage">
          {assets.map((asset) => <Image className="process-asset" key={asset.src} src={asset.src} alt="" width={asset.width} height={asset.height} style={{ left: asset.left, top: asset.top }} />)}
          {labels.map((label) => <span className="process-step-label" key={label.text} style={{ left: label.left, top: label.top }}>{label.text}</span>)}
        </div>
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
