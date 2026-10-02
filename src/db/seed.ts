import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { orbitBusinesses as orbitTable, siteFooterSettings, startups as startupsTable, type FooterLink } from "@/db/schema";
import { approvedStartups, orbitBusinesses, siteFooterDefaults } from "@/lib/site-content";

const db = getDb();
if (!db) throw new Error("DATABASE_URL is required to seed the database.");

await db.transaction(async (tx) => {
  const existingStartups = await tx.select({ id: startupsTable.id }).from(startupsTable).limit(1);
  if (existingStartups.length === 0) {
    for (let i = 0; i < approvedStartups.length; i++) {
      const item = approvedStartups[i];
      await tx.insert(startupsTable).values({
        name: item.name,
        slug: item.slug,
        description: item.description,
        logoUrl: item.logo,
        pageUrl: "",
        websiteUrl: item.websiteUrl ?? null,
        email: item.email ?? null,
        address: item.address ?? null,
        linkedinUrl: item.linkedinUrl ?? null,
        instagramUrl: item.instagramUrl ?? null,
        published: item.published,
        sortOrder: i + 1,
      });
    }
  }

  const existingOrbits = await tx.select({ id: orbitTable.id }).from(orbitTable).limit(1);
  if (existingOrbits.length === 0) {
    const counters = new Map<number, number>();
    for (const item of orbitBusinesses) {
      const order = (counters.get(item.orbit) ?? 0) + 1;
      counters.set(item.orbit, order);
      await tx.insert(orbitTable).values({
        name: item.name,
        logoUrl: item.logo,
        websiteUrl: item.href,
        orbit: item.orbit,
        sortOrder: order,
        visible: true,
      });
    }
  }

  const existingFooter = await tx.select({ id: siteFooterSettings.id }).from(siteFooterSettings).limit(1);
  if (existingFooter.length === 0) {
    const services: FooterLink[] = siteFooterDefaults.services.map((label) => ({ label, href: "#services" }));
    const quickLinks: FooterLink[] = siteFooterDefaults.quickLinks.map((label, index) => ({ label, href: ["/", "#services", "#about", "#contact"][index] }));
    await tx.insert(siteFooterSettings).values({
      id: 1,
      brandLogoUrl: "/assets/figma/brand.png",
      brandDescription: siteFooterDefaults.brandDescription,
      phone: siteFooterDefaults.phone,
      email: siteFooterDefaults.email,
      address: siteFooterDefaults.address,
      linkedinUrl: siteFooterDefaults.linkedinUrl,
      instagramUrl: siteFooterDefaults.instagramUrl,
      copyright: siteFooterDefaults.copyright,
      services,
      quickLinks,
    });
  }
});

const [startupCount, orbitCount] = await Promise.all([
  db.select({ id: startupsTable.id }).from(startupsTable).orderBy(asc(startupsTable.sortOrder)),
  db.select({ id: orbitTable.id }).from(orbitTable),
]);
console.log(`Seed complete: ${startupCount.length} startups, ${orbitCount.length} orbit businesses.`);
process.exit(0);
