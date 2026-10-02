import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { FooterData } from "@/lib/public-data";

export function SiteFooter({ footer }: { footer: FooterData }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Image className="footer-brand-mark" src={footer.brandLogoUrl} alt="نشان نگاه خلاق" width={45} height={38} unoptimized />
          <div className="footer-brand-title">
            <strong>گروه کسب‌وکار نگاه خلاق</strong>
            <span>مادر صنعت نوآوری</span>
          </div>
          <p>{footer.brandDescription}</p>
          <div className="footer-socials">
            {footer.linkedinUrl && (
              <a href={footer.linkedinUrl} aria-label="LinkedIn" target="_blank" rel="noreferrer">in</a>
            )}
            {footer.instagramUrl && (
              <a href={footer.instagramUrl} aria-label="Instagram" target="_blank" rel="noreferrer">ig</a>
            )}
          </div>
        </div>
        <div className="footer-column">
          <h2>خدمات</h2>
          {footer.services.map((item) => (
            <Link href={item.href} key={item.label}>{item.label}</Link>
          ))}
        </div>
        <div className="footer-column">
          <h2>دسترسی سریع</h2>
          {footer.quickLinks.map((item) => (
            <Link href={item.href} key={item.label}>{item.label}</Link>
          ))}
        </div>
        <div className="footer-column footer-contact">
          <h2>راه‌های ارتباطی</h2>
          <a href={`tel:${footer.phone.replaceAll("-", "")}`}><Phone size={16} />{footer.phone}</a>
          <a href={`mailto:${footer.email}`}><Mail size={16} />{footer.email}</a>
          <span><MapPin size={16} />{footer.address}</span>
        </div>
      </div>
      <div className="footer-bottom"><span>{footer.copyright}</span><span>© {new Date().getFullYear()}</span></div>
    </footer>
  );
}
