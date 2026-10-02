import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getStartupBySlug } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function StartupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [startup, footer] = await Promise.all([getStartupBySlug(slug), import("@/lib/public-data").then(({ getFooterData }) => getFooterData())]);
  if (!startup) notFound();

  return (
    <main className="site-shell startup-detail-shell">
      <div className="startup-detail-top"><SiteHeader /></div>
      <section className="startup-detail">
        <Link className="back-link" href="/#startups"><ArrowRight size={16} /> بازگشت به استارتاپ‌ها</Link>
        <div className="startup-detail-card">
          <div className="startup-detail-logo"><Image src={startup.logo} alt={startup.name} width={92} height={92} priority unoptimized /></div>
          <span className="section-label">یکی از کسب‌وکارهای نگاه خلاق</span>
          <h1>{startup.name}</h1>
          <p>{startup.description}</p>
          {startup.websiteUrl && <a className="primary-button" href={startup.websiteUrl} target="_blank" rel="noreferrer">رفتن به وب‌سایت <ExternalLink size={16} /></a>}
        </div>
      </section>
      <SiteFooter footer={footer} />
    </main>
  );
}
