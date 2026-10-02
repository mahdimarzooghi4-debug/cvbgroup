import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orbitBusinesses as orbitTable, siteFooterSettings, startups as startupsTable } from "@/db/schema";
import { approvedStartups, orbitBusinesses, siteFooterDefaults, type OrbitBusiness, type Startup } from "@/lib/site-content";
import { businessWebsite } from "@/lib/business-website";

export type FooterData = {
  brandLogoUrl: string;
  brandDescription: string;
  phone: string;
  email: string;
  address: string;
  linkedinUrl: string;
  instagramUrl: string;
  copyright: string;
  services: { label: string; href: string }[];
  quickLinks: { label: string; href: string }[];
};

const footerFallback: FooterData = {
  brandLogoUrl: "/assets/figma/brand.png",
  brandDescription: siteFooterDefaults.brandDescription,
  phone: siteFooterDefaults.phone,
  email: siteFooterDefaults.email,
  address: siteFooterDefaults.address,
  linkedinUrl: siteFooterDefaults.linkedinUrl,
  instagramUrl: siteFooterDefaults.instagramUrl,
  copyright: siteFooterDefaults.copyright,
  services: siteFooterDefaults.services.map((label) => ({ label, href: "#services" })),
  quickLinks: siteFooterDefaults.quickLinks.map((label, i) => ({ label, href: ["/", "#services", "#about", "#contact"][i] })),
};

export async function getPublicStartups(): Promise<Startup[]> {
  const db = getDb();
  if (!db) return approvedStartups;
  try {
    const rows = await db.select().from(startupsTable).where(eq(startupsTable.published, true)).orderBy(asc(startupsTable.sortOrder));
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      description: row.description,
      logo: row.logoUrl,
      websiteUrl: row.websiteUrl,
      email: row.email,
      address: row.address,
      linkedinUrl: row.linkedinUrl,
      instagramUrl: row.instagramUrl,
      published: row.published,
    }));
  } catch {
    return approvedStartups;
  }
}

export async function getPublicOrbits(): Promise<OrbitBusiness[]> {
  const db = getDb();
  if (!db) return orbitBusinesses;
  try {
    const [rows, websites] = await Promise.all([
      db.select().from(orbitTable).where(eq(orbitTable.visible, true)).orderBy(asc(orbitTable.orbit), asc(orbitTable.sortOrder)),
      db.select({ name: startupsTable.name, slug: startupsTable.slug, websiteUrl: startupsTable.websiteUrl }).from(startupsTable),
    ]);
    const byName = new Map(websites.map((item) => [item.name, item.websiteUrl]));
    const byLegacyPath = new Map(websites.map((item) => [`/startups/${item.slug}`, item.websiteUrl]));
    return rows.map((row) => ({
      slug: row.id, name: row.name, description: "", logo: row.logoUrl, orbit: row.orbit,
      href: businessWebsite(byName.get(row.name)) ?? businessWebsite(byLegacyPath.get(row.websiteUrl)) ?? businessWebsite(row.websiteUrl) ?? "",
    }));
  } catch {
    return orbitBusinesses;
  }
}

export async function getFooterData(): Promise<FooterData> {
  const db = getDb();
  if (!db) return footerFallback;
  try {
    const [row] = await db.select().from(siteFooterSettings).where(eq(siteFooterSettings.id, 1)).limit(1);
    if (!row) return footerFallback;
    return { ...row };
  } catch {
    return footerFallback;
  }
}
