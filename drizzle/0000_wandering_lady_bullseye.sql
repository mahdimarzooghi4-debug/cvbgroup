CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(254),
	"subject" varchar(180) NOT NULL,
	"message" varchar(3000) NOT NULL,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orbit_businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"logo_url" text NOT NULL,
	"website_url" text NOT NULL,
	"orbit" integer NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orbit_businesses_orbit_check" CHECK ("orbit_businesses"."orbit" between 1 and 3)
);
--> statement-breakpoint
CREATE TABLE "site_footer_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"brand_logo_url" text DEFAULT '/assets/figma/brand.png' NOT NULL,
	"brand_description" text NOT NULL,
	"phone" varchar(80) NOT NULL,
	"email" varchar(254) NOT NULL,
	"address" varchar(500) NOT NULL,
	"linkedin_url" text DEFAULT '' NOT NULL,
	"instagram_url" text DEFAULT '' NOT NULL,
	"copyright" varchar(240) NOT NULL,
	"services" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"quick_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "startups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" varchar(500) NOT NULL,
	"logo_url" text NOT NULL,
	"page_url" varchar(180) NOT NULL,
	"website_url" text,
	"email" varchar(254),
	"address" varchar(500),
	"linkedin_url" text,
	"instagram_url" text,
	"published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_messages_created_idx" ON "contact_messages" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "orbit_businesses_order_uidx" ON "orbit_businesses" USING btree ("orbit","sort_order");--> statement-breakpoint
CREATE INDEX "orbit_businesses_visible_order_idx" ON "orbit_businesses" USING btree ("visible","orbit","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "startups_slug_uidx" ON "startups" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "startups_sort_order_uidx" ON "startups" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "startups_public_order_idx" ON "startups" USING btree ("published","sort_order");