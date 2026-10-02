# گروه کسب‌وکار نگاه خلاق

وب‌سایت عمومی و پنل مدیریت سبک گروه نگاه خلاق. طرح مصوب در Figma مرجع پیاده‌سازی رابط است.

## فناوری‌ها

- Next.js App Router، React و TypeScript
- Tailwind CSS و CSS سفارشی برای جزئیات بصری
- PostgreSQL و Drizzle ORM
- Render Web Service و Render PostgreSQL

## اجرای محلی

```bash
npm install
cp .env.example .env.local
npm run dev
```

برای اتصال به PostgreSQL، `DATABASE_URL` را در `.env.local` بگذارید. گذرواژه مدیر را با `npm run admin:hash` هش کنید و مقدار `ADMIN_PASSWORD_HASH` را در محیط امن برنامه قرار دهید. مقدار `SESSION_SECRET` باید حداقل ۳۲ نویسه تصادفی داشته باشد. هیچ اعتبارنامه‌ای را در Git ثبت نکنید.

بعد از ساخت پایگاه داده:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

`db:seed` فقط وقتی جدول‌ها خالی باشند، محتوای پایهٔ مطابق با طرح تأییدشدهٔ Figma را وارد می‌کند.

## دستورات کیفیت

```bash
npm run lint
npm run typecheck
npm run build
```

## استیج روی Render

فایل `render.yaml` یک Web Service و PostgreSQL رایگان برای بررسی موقت نسخهٔ استیج می‌سازد. سرویس پس از راه‌اندازی، migrationها را اجرا می‌کند، داده‌های پایهٔ تأییدشده را فقط در جدول‌های خالی وارد می‌کند و سپس Next.js را بالا می‌آورد. مقادیر `ADMIN_EMAIL` و `ADMIN_PASSWORD_HASH` هنگام ساخت Blueprint باید در پنل Render وارد شوند؛ هش را با `npm run admin:hash` بسازید. مسیر `/api/health` اتصال دیتابیس را برای health check بررسی می‌کند.

سرویس و دیتابیس رایگان فقط برای تست‌اند. دیتابیس رایگان Render پس از ۳۰ روز منقضی می‌شود؛ برای Production باید پیش از انتشار یک دیتابیس پولی پایدار و پلن سرویس مناسب انتخاب شود. مهاجرت خودکار دیتابیس برای Production نیز باید به مرحلهٔ پیش از انتشار منتقل شود.

## موارد باقی‌مانده برای Sprint 0

- افزودن تست‌های واحد و یکپارچه برای APIهای مدیریت و فرم تماس.
- افزودن آزمون مرورگر برای ورود، ذخیرهٔ تنظیمات فوتر، مدیریت استارتاپ‌ها و تخصیص مدارها.
- بازبینی بصری موبایل و دسکتاپ در برابر فریم‌های نهایی Figma.
- تنظیم بکاپ دیتابیس و پایش خطاها پیش از Production.
