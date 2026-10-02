import Link from "next/link";
import Image from "next/image";

const heroLinks = [
  { href: "/", label: "صفحه نخست" },
  { href: "#services", label: "خدمات" },
  { href: "#startups", label: "کسب‌وکارهای ما" },
  { href: "#about", label: "درباره ما" },
  { href: "#contact", label: "تماس با ما" },
];

const defaultLinks = [
  { href: "#about", label: "درباره ما" },
  { href: "#services", label: "خدمات" },
  { href: "#startups", label: "استارتاپ‌ها" },
  { href: "#contact", label: "تماس با ما" },
];

export function SiteHeader({ variant = "default" }: { variant?: "default" | "hero" }) {
  const isHero = variant === "hero";
  const links = isHero ? heroLinks : defaultLinks;
  return (
    <header className="site-header">
      <Link className="brand-lockup" href="/" aria-label="صفحه اصلی گروه نگاه خلاق">
        {!isHero && <span className="brand-copy"><strong>گروه کسب‌وکار نگاه خلاق</strong><small>مادر صنعت نوآوری</small></span>}
        <Image src="/assets/figma/brand.png" alt="گروه کسب‌وکار نگاه خلاق" width={isHero ? 90 : 42} height={isHero ? 70 : 42} priority />
      </Link>
      <nav aria-label="ناوبری اصلی" className="desktop-nav">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      {!isHero && <a className="header-cta" href="#contact">شروع همکاری <span aria-hidden="true">←</span></a>}
    </header>
  );
}
