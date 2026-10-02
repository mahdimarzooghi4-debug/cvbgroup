import { z } from "zod";
import { ORBIT_CAPACITY } from "@/lib/orbit-config";

const safeUrl = z.union([z.literal(""), z.string().trim().url().max(2048)]).transform((value) => value || null);
const assetUrl = z.string().trim().min(1).max(2048).refine((value) => value.startsWith("/") || /^https?:\/\//i.test(value), "نشانی لوگو باید مسیر محلی یا URL معتبر باشد.");
const businessLink = z.string().trim().min(1).max(2048).refine((value) => (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value), "نشانی باید URL یا مسیر داخلی معتبر باشد.");

export const startupSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  description: z.string().trim().min(5).max(500),
  logoUrl: assetUrl,
  websiteUrl: safeUrl,
  email: z.union([z.literal(""), z.string().trim().email().max(254)]).transform((value) => value || null),
  address: z.union([z.literal(""), z.string().trim().max(500)]).transform((value) => value || null),
  linkedinUrl: safeUrl,
  instagramUrl: safeUrl,
  published: z.boolean(),
  sortOrder: z.number().int().positive().max(100000),
});

export const orbitSchema = z.object({
  name: z.string().trim().min(2).max(160),
  logoUrl: assetUrl,
  websiteUrl: businessLink,
  orbit: z.number().int().min(1).max(3),
  sortOrder: z.number().int().positive().max(ORBIT_CAPACITY),
  visible: z.boolean(),
});
