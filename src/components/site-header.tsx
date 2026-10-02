import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "#about", label: "درباره ما" },
  { href: "#services", label: "خدمات" },
  { href: "#startups", label: "استارتاپ‌ها" },
  { href: "#contact", label: "تماس با ما" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand-lockup" href="/" aria-label="صفحه اصلی گروه نگاه خلاق">
        <span className="brand-copy">
          <strong>گروه کسب‌وکار نگاه خلاق</strong>
          <small>مادر صنعت نوآوری</small>
        </span>
        <Image src="/assets/figma/brand.png" alt="نشان نگاه خلاق" width={42} height={42} priority />
      </Link>
      <nav aria-label="ناوبری اصلی" className="desktop-nav">
        {links.map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <a className="header-cta" href="#contact">
        شروع همکاری <span aria-hidden="true">←</span>
      </a>
    </header>
  );
}
