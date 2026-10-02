import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orbitBusinesses } from "@/db/schema";
import { ORBIT_CAPACITY } from "@/lib/orbit-config";

const db = getDb();
if (!db) throw new Error("DATABASE_URL is required.");

// Run explicitly on staging; do not replace any existing admin-managed content.
const result = await db.transaction(async (tx) => {
  await tx.execute(sql`LOCK TABLE ${orbitBusinesses} IN EXCLUSIVE MODE`);
  const rows = await tx.select().from(orbitBusinesses);
  if (rows.some((row) => row.name === "تکنیک" || row.logoUrl === "/assets/brands/teknik-placeholder.svg")) {
    return "Teknik already exists; no changes made.";
  }
  const outer = rows.filter((row) => row.orbit === 3);
  if (outer.length >= ORBIT_CAPACITY) throw new Error("Orbit 3 is full; move a member in the admin before adding Teknik.");
  const slot = Array.from({ length: ORBIT_CAPACITY }, (_, index) => index + 1)
    .find((order) => !outer.some((row) => row.sortOrder === order));
  if (slot === undefined) throw new Error("No free slot in orbit 3.");
  await tx.insert(orbitBusinesses).values({
    name: "تکنیک",
    logoUrl: "/assets/brands/teknik-placeholder.svg",
    websiteUrl: "",
    orbit: 3,
    sortOrder: slot,
    visible: true,
  });
  const count = await tx.select({ id: orbitBusinesses.id }).from(orbitBusinesses).where(eq(orbitBusinesses.orbit, 3));
  return `Teknik added to orbit 3; ${count.length} members. Logo and destination are editable in the admin.`;
});

console.log(result);
process.exit(0);
