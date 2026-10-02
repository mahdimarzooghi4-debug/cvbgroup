import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orbitBusinesses, siteFooterSettings } from "@/db/schema";
import { siteFooterDefaults } from "@/lib/site-content";

const db = getDb();
if (!db) throw new Error("DATABASE_URL is required.");
const previousDescription = "We bring together strategy, technology, product development, and growth support to help new ventures move from concept to market.";

await db.transaction(async (tx) => {
  const [footer] = await tx.select().from(siteFooterSettings).where(eq(siteFooterSettings.id, 1)).for("update");
  if (footer?.brandDescription.trim() === previousDescription) {
    await tx.update(siteFooterSettings).set({ brandDescription: siteFooterDefaults.brandDescription, updatedAt: new Date() }).where(eq(siteFooterSettings.id, 1));
    console.log("Footer statement updated to the Persian Figma text.");
  } else {
    console.log("Footer already updated or customized; no overwrite.");
  }
});
const rows = await db.select().from(orbitBusinesses).where(eq(orbitBusinesses.visible, true));
console.log("Visible orbit members:", [1, 2, 3].map((orbit) => ({ orbit, count: rows.filter((row) => row.orbit === orbit).length })));
process.exit(0);
