import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export type FooterLink = { label: string; href: string };

export const startups = pgTable(
  "startups",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    logoUrl: text("logo_url").notNull(),
    pageUrl: varchar("page_url", { length: 180 }).notNull(),
    websiteUrl: text("website_url"),
    email: varchar("email", { length: 254 }),
    address: varchar("address", { length: 500 }),
    linkedinUrl: text("linkedin_url"),
    instagramUrl: text("instagram_url"),
    published: boolean("published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("startups_slug_uidx").on(table.slug),
    uniqueIndex("startups_sort_order_uidx").on(table.sortOrder),
    index("startups_public_order_idx").on(table.published, table.sortOrder),
  ],
);

export const orbitBusinesses = pgTable(
  "orbit_businesses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    logoUrl: text("logo_url").notNull(),
    websiteUrl: text("website_url").notNull(),
    orbit: integer("orbit").notNull(),
    sortOrder: integer("sort_order").notNull().default(1),
    visible: boolean("visible").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("orbit_businesses_orbit_check", sql`${table.orbit} between 1 and 3`),
    uniqueIndex("orbit_businesses_order_uidx").on(table.orbit, table.sortOrder),
    index("orbit_businesses_visible_order_idx").on(table.visible, table.orbit, table.sortOrder),
  ],
);

export const siteFooterSettings = pgTable("site_footer_settings", {
  id: integer("id").primaryKey().default(1),
  brandLogoUrl: text("brand_logo_url").notNull().default("/assets/figma/brand.png"),
  brandDescription: text("brand_description").notNull(),
  phone: varchar("phone", { length: 80 }).notNull(),
  email: varchar("email", { length: 254 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  instagramUrl: text("instagram_url").notNull().default(""),
  copyright: varchar("copyright", { length: 240 }).notNull(),
  services: jsonb("services").$type<FooterLink[]>().notNull().default(sql`'[]'::jsonb`),
  quickLinks: jsonb("quick_links").$type<FooterLink[]>().notNull().default(sql`'[]'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 40 }).notNull(),
    email: varchar("email", { length: 254 }),
    subject: varchar("subject", { length: 180 }).notNull(),
    message: varchar("message", { length: 3000 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("contact_messages_created_idx").on(table.createdAt)],
);
