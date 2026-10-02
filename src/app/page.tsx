import Image from "next/image";
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
        <Image className="hero-earth" src="/assets/figma/hero-earth.png" alt="" width={1440} height={462} priority />
        <SiteHeader variant="hero" />
        <div className="hero-content">
          <div className="hero-introduction">
            <span className="hero-eyebrow">گروه کسب و کار نگاه خلاق</span>
            <h1 id="hero-title">کارخانه تولید کسب‌وکار</h1>
            <p>با استفاده از جدیدترین تکنولوژی‌ها و تیم متخصص، ایده‌های شما را به کسب‌وکارهای پرسود و موفق تبدیل می‌کنیم</p>
          </div>
          <div className="hero-actions">
            <a className="primary-button" href="#contact">شروع همکاری</a>
          </div>
          <div className="hero-stats" dir="rtl">
            <div><strong dir="ltr">+۵۰</strong><span>پروژه موفق</span></div>
            <div><strong>۹۵٪</strong><span>رضایت مشتری</span></div>
            <div><strong>۲۴/۷</strong><span>پشتیبانی</span></div>
          </div>
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
            <h2>تماس با ما</h2>
            <p>برای مشاوره رایگان و شروع همکاری با ما در تماس باشید.</p>
            <div className="contact-details">
              <a href={`tel:${footer.phone.replaceAll("-", "")}`}><Image className="contact-icon" src="/assets/figma/contact/phone.svg" alt="" width={53} height={52} /><span><small>تلفن تماس</small>{footer.phone}</span></a>
              <a href={`mailto:${footer.email}`}><Image className="contact-icon" src="/assets/figma/contact/email.svg" alt="" width={53} height={52} /><span><small>ایمیل</small>{footer.email}</span></a>
              <div><Image className="contact-icon" src="/assets/figma/contact/location.svg" alt="" width={53} height={52} /><span><small>آدرس</small>{footer.address}</span></div>
            </div>
          </div>
          <div className="contact-form-panel">
            <div className="contact-form-heading">
              <h3>فرم تماس با ما</h3>
              <span>پیام خود را برای ما ارسال کنید.</span>
            </div>
            <ContactForm />
          </div>
        </section>
      </div>
      <SiteFooter footer={footer} />
    </main>
  );
}
