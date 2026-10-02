# پشته فنی وب‌سایت نگاه خلاق

| بخش | انتخاب |
|---|---|
| وب‌سایت و پنل | Next.js App Router، React و TypeScript |
| استایل | Tailwind CSS همراه CSS سفارشی و RTL |
| پایگاه داده | PostgreSQL با Drizzle ORM و Drizzle Kit |
| استیج موقت | Render Web Service و Render PostgreSQL مدیریت‌شده |
| Production | Docker Compose روی VPS گروه، PostgreSQL اختصاصی و Caddy به‌عنوان reverse proxy |

این انتخاب برای نسخهٔ نخست یک برنامهٔ یکپارچه نگه می‌دارد و بخش عمومی و مدیریت را در کنار API و منطق سمت سرور اجرا می‌کند. فایل Figma و `AGENTS.md` مرجع محصول و رابط هستند. دیتابیس Production از دیتابیس Supabase فعلی سرور جدا نگه داشته می‌شود. پیش از Production، متغیرهای محیطی، نشست مدیر، migrationها، پشتیبان‌گیری، آزمون‌ها و تأیید انتشار باید آماده باشند. دیتابیس رایگان Render فقط برای استیج موقت است.

راهنمای جزئی استقرار VPS در `docs/VPS_DEPLOYMENT.md` قرار دارد.
