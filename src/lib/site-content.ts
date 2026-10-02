export type Startup = {
  slug: string;
  name: string;
  description: string;
  logo: string;
  websiteUrl?: string | null;
  published: boolean;
  email?: string | null;
  address?: string | null;
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
};

export type OrbitBusiness = {
  slug: string;
  name: string;
  description: string;
  logo: string;
  href: string;
  orbit: number;
};

export const approvedStartups: Startup[] = [
  {
    slug: "dena",
    name: "دنا",
    description: "فرصت‌های آموزشی را به مدرسه‌ها و جامعه نزدیک‌تر می‌کند.",
    logo: "/assets/brands/dena.png",
    published: true,
  },
  {
    slug: "negarin",
    name: "نگارین",
    description: "بازاری برای معرفی و رشد هنر و صنایع‌دستی.",
    logo: "/assets/brands/negarin.png",
    published: true,
  },
  {
    slug: "henna",
    name: "حنا",
    description: "پیوند خرید روزمره با حمایت هدفمند از خانواده‌ها.",
    logo: "/assets/brands/henna.png",
    published: true,
  },
  {
    slug: "moon",
    name: "ماه",
    description: "سرمایه‌گذاری مسئولانه برای رشد کسب‌وکارهای اثرگذار.",
    logo: "/assets/brands/moon.png",
    websiteUrl: "https://mahcsr.ir",
    published: true,
  },
  {
    slug: "parcham",
    name: "پرچم",
    description: "آموزش و پرورش مدیران و رهبران نوآوری.",
    logo: "/assets/brands/parcham.png",
    published: true,
  },
  {
    slug: "cube",
    name: "گروه مالی مکعب",
    description: "خدمات مالی و راهکارهای تأمین سرمایه برای کسب‌وکارها.",
    logo: "/assets/brands/cube.png",
    published: true,
  },
  {
    slug: "funnel",
    name: "فانل",
    description: "ابزارهای رشد برای تبدیل بازدیدکننده به مشتری.",
    logo: "/assets/brands/funnel.png",
    websiteUrl: "https://myfunnel.ir",
    published: true,
  },
  {
    slug: "mono",
    name: "مونو",
    description: "راهکارهای هوشمند برای مدیریت جابه‌جایی و سفارش‌ها.",
    logo: "/assets/brands/mono.png",
    published: true,
  },
];

export const orbitBusinesses: OrbitBusiness[] = [
  { ...approvedStartups[0], href: "/startups/dena", orbit: 1 },
  { ...approvedStartups[1], href: "/startups/negarin", orbit: 2 },
  { ...approvedStartups[2], href: "/startups/henna", orbit: 3 },
  { ...approvedStartups[3], href: "https://mahcsr.ir", orbit: 1 },
  { ...approvedStartups[4], href: "/startups/parcham", orbit: 2 },
  { ...approvedStartups[5], href: "/startups/cube", orbit: 3 },
  { ...approvedStartups[6], href: "https://myfunnel.ir", orbit: 1 },
  { ...approvedStartups[7], href: "/startups/mono", orbit: 2 },
  { slug: "teknik", name: "تکنیک", description: "", logo: "/assets/brands/teknik-placeholder.svg", href: "/#contact", orbit: 3 },
];

export const siteFooterDefaults = {
  brandDescription:
    "ما با ارائه راهکارهای نوآورانه، کسب‌وکار شما را به سطح بعدی می‌بریم",
  phone: "۰۲۱-۶۶۴۸۵۳۷۴",
  email: "info@cvbgroup.ir",
  address: "تهران، خیابان انقلاب-خیابان رازی-کوچه شهبازیان-پلاک۲۲",
  linkedinUrl: "",
  instagramUrl: "",
  copyright: "تمامی حقوق برای گروه کسب و کار نگاه خلاق محفوظ است.",
  services: ["مشاوره کسب‌وکار", "راه‌اندازی استارتاپ", "رشد و توسعه", "تیم‌سازی", "دیجیتال مارکتینگ"],
  quickLinks: ["صفحه اصلی", "خدمات", "درباره ما", "تماس با ما"],
};
