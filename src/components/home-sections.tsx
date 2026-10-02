"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpLeft, Blocks, Compass, Lightbulb, Rocket, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import type { OrbitBusiness, Startup } from "@/lib/site-content";

const solutions = [
  { title: "استراتژی و طراحی کسب‌وکار", icon: Compass },
  { title: "فناوری و توسعه محصول", icon: Blocks },
  { title: "راه‌اندازی استارتاپ", icon: Rocket },
  { title: "رشد و توسعه بازار", icon: Sparkles },
  { title: "تیم‌سازی و سرمایه انسانی", icon: UsersRound },
  { title: "نوآوری مسئولانه", icon: Lightbulb },
  { title: "همراهی تا ورود به بازار", icon: ArrowUpLeft },
  { title: "زیرساخت پایدار کسب‌وکار", icon: ShieldCheck },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <span className="section-label">{children}</span>;
}

export function SolutionsSection() {
  return (
    <section className="section solutions-section" id="services">
      <div className="section-heading centered">
        <SectionLabel>توانمندسازی کسب‌وکار</SectionLabel>
        <h2>راهکارهای جامع برای موفقیت</h2>
        <p>از شکل‌گیری ایده تا رسیدن به بازار، در کنار تیم‌ها و کسب‌وکارها هستیم.</p>
      </div>
      <div className="solutions-grid">
        {solutions.map(({ title, icon: Icon }, index) => (
          <article className="solution-card" key={title}>
            <span className={`solution-icon tone-${index % 4}`}><Icon size={21} strokeWidth={1.8} /></span>
            <h3>{title}</h3>
            <span className="card-arrow" aria-hidden="true"><ArrowLeft size={16} /></span>
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
            const className = `orbit-logo orbit-track-${business.orbit} orbit-speed-${business.orbit}`;
            const style = { "--orbit-angle": `${position * (360 / Math.max(1, membersOnOrbit.length))}deg` } as CSSProperties;
            const content = <Image src={business.logo} alt={business.name} width={40} height={40} unoptimized />;
            return external ? (
              <a className={className} style={style} href={business.href} key={business.slug} aria-label={`رفتن به ${business.name}`} target="_blank" rel="noreferrer">{content}</a>
            ) : (
              <Link className={className} style={style} href={business.href} key={business.slug} aria-label={`مشاهده ${business.name}`}>{content}</Link>
            );
          })}
        </div>
        <div className="about-copy">
          <SectionLabel>درباره ما</SectionLabel>
          <h2>مادر صنعت نوآوری</h2>
          <p className="about-lead">کارخانهٔ تولید و توسعهٔ کسب‌وکار؛ از ایده تا بازار، کنار سازندگان آینده.</p>
          <p className="about-english">We bring together strategy, technology, product development, and growth support to help new ventures move from concept to market.</p>
          <Link href="#startups" className="text-link">آشنایی با کسب‌وکارهای ما <ArrowLeft size={17} /></Link>
        </div>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const steps = ["ایده", "تیم", "محصول", "بازار"];
  return (
    <section className="section process-section">
      <div className="section-heading centered">
        <SectionLabel>از ایده تا بازار</SectionLabel>
        <h2>ما چطور کنار شما هستیم؟</h2>
      </div>
      <div className="process-path" aria-label="فرآیند توسعه کسب‌وکار">
        <div className="process-line" />
        {steps.map((step, index) => (
          <div className={`process-step step-${index + 1}`} key={step}>
            <span className="process-dot">{index + 1}</span>
            <span className="process-name">{step}</span>
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
          <SectionLabel>همراهان نوآوری</SectionLabel>
          <h2>استارتاپ‌های نگاه خلاق</h2>
          <p>کسب‌وکارهایی که با همراهی هم رشد می‌کنند.</p>
        </div>
        <div className="scroll-buttons" aria-label="پیمایش استارتاپ‌ها">
          <button type="button" onClick={() => scroll(1)} aria-label="حرکت به کارت‌های بعدی"><ArrowRight size={18} /></button>
          <button type="button" onClick={() => scroll(-1)} aria-label="حرکت به کارت‌های قبلی"><ArrowLeft size={18} /></button>
        </div>
      </div>
      <div className="startup-scroller" ref={scroller} dir="rtl" tabIndex={0} aria-label="فهرست قابل پیمایش استارتاپ‌ها">
        {startups.filter((startup) => startup.published).map((startup) => (
          <Link className="startup-card" href={`/startups/${startup.slug}`} key={startup.slug}>
            <div className="startup-logo"><Image src={startup.logo} alt="" width={54} height={54} unoptimized /></div>
            <h3>{startup.name}</h3>
            <p>{startup.description}</p>
            <span className="startup-card-link">مشاهده کسب‌وکار <ArrowLeft size={15} /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
