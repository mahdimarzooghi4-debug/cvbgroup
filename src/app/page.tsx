import Image from "next/image";
import { ArrowLeft, ArrowDown } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { OrbitSection, ProcessSection, SolutionsSection, StartupsSection } from "@/components/home-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFooterData, getPublicOrbits, getPublicStartups } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [startups, businesses, footer] = await Promise.all([getPublicStartups(), getPublicOrbits(), getFooterData()]);
  return (
    <main className="site-shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-stars" aria-hidden="true" />
        <Image className="hero-earth" src="/assets/figma/earth-transparent.png" alt="" width={1100} height={355} priority />
        <SiteHeader />
        <div className="hero-content">
          <span className="hero-eyebrow">نگاه خلاق؛ مادر صنعت نوآوری</span>
          <h1 id="hero-title">کارخانهٔ تولید<br /><span>کسب‌وکار</span></h1>
          <p>از ایده تا بازار، برای ساخت و رشد کسب‌وکارهای آینده کنار شما هستیم.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#startups">دیدن کسب‌وکارها <ArrowLeft size={17} /></a>
            <a className="secondary-button" href="#about">درباره نگاه خلاق</a>
          </div>
          <a className="hero-scroll" href="#services" aria-label="رفتن به بخش بعدی"><ArrowDown size={16} /></a>
        </div>
      </section>

      <div className="main-content">
        <SolutionsSection />
        <OrbitSection businesses={businesses} />
        <ProcessSection />
        <StartupsSection startups={startups} />

        <section className="section contact-section" id="contact">
          <div className="contact-intro">
            <span className="section-label">ارتباط با ما</span>
            <h2>با هم شروع کنیم</h2>
            <p>برای آشنایی بیشتر یا گفت‌وگو دربارهٔ همکاری، برای ما پیام بگذارید.</p>
            <div className="contact-details">
              <a href={`tel:${footer.phone.replaceAll("-", "")}`}><span className="contact-icon">☎</span><span><small>تلفن تماس</small>{footer.phone}</span></a>
              <a href={`mailto:${footer.email}`}><span className="contact-icon">✉</span><span><small>پست الکترونیکی</small>{footer.email}</span></a>
              <div><span className="contact-icon">⌖</span><span><small>نشانی</small>{footer.address}</span></div>
            </div>
          </div>
          <div className="contact-form-panel">
            <div className="contact-form-heading">
              <h3>فرم تماس</h3>
              <span>در اولین فرصت پاسخ می‌دهیم.</span>
            </div>
            <ContactForm />
          </div>
        </section>
      </div>
      <SiteFooter footer={footer} />
    </main>
  );
}
