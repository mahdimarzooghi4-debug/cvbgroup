import type { Metadata } from "next";
import "@fontsource/vazirmatn/300.css";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/vazirmatn/800.css";
import "@fontsource/vazirmatn/900.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "گروه کسب و کار نگاه خلاق",
  description:
    "نگاه خلاق، مادر صنعت نوآوری و همراه تیم‌ها برای توسعه کسب‌وکار از ایده تا بازار است.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvbgroup.ir"),
  robots: process.env.APP_ENV === "staging" ? { index: false, follow: false } : undefined,
  openGraph: {
    title: "گروه کسب و کار نگاه خلاق",
    description:
      "We bring together strategy, technology, product development, and growth support to help new ventures move from concept to market.",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
