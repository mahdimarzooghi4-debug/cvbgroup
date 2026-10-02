# استقرار روی VPS فعلی

این استقرار یک پشتهٔ جدا با Docker Compose می‌سازد: برنامهٔ Next.js، پایگاه‌دادهٔ PostgreSQL اختصاصی و یک مرحلهٔ جدا برای migration و seed. پورت برنامه فقط روی `127.0.0.1:3100` منتشر می‌شود؛ Caddy میزبان پس از آماده‌شدن برنامه درخواست‌های دامنه را به آن می‌فرستد. هیچ پورت پایگاه‌داده‌ای روی اینترنت منتشر نمی‌شود.

## آماده‌سازی محیط

فایل نمونه را به `ops/vps.env` کپی کنید و مقادیر محرمانه را روی سرور تنظیم کنید. این فایل در Git نادیده گرفته می‌شود.

- `POSTGRES_PASSWORD` و `SESSION_SECRET` را با رشته‌های تصادفی hex بسازید؛ این کار از مشکل کاراکترهای ویژه در نشانی اتصال جلوگیری می‌کند.
- برای مدیر، هش bcrypt واقعی را با `npm run admin:hash` بسازید و در `ADMIN_PASSWORD_HASH` قرار دهید. از رمز خام در فایل محیطی استفاده نکنید.
- `NEXT_PUBLIC_SITE_URL` را روی نشانی نهایی سایت تنظیم کنید.

## اولین راه‌اندازی

از ریشهٔ مخزن روی سرور اجرا کنید:

```bash
docker compose --env-file ops/vps.env -f compose.production.yaml up -d db
docker compose --env-file ops/vps.env -f compose.production.yaml run --rm migrate npm run db:migrate
docker compose --env-file ops/vps.env -f compose.production.yaml run --rm migrate npm run db:seed
docker compose --env-file ops/vps.env -f compose.production.yaml up -d --build app
docker compose --env-file ops/vps.env -f compose.production.yaml ps
curl -fsS http://127.0.0.1:3100/api/health
```

برای انتشار نسخهٔ بعدی، ابتدا از پایگاه‌داده پشتیبان بگیرید، سپس migrationها را اجرا کنید و در پایان برنامه را با `up -d --build app` بازسازی کنید. `db:seed` فقط در نصب نخست لازم است؛ seed داده‌های پایه را فقط در جدول‌های خالی وارد می‌کند.

## اتصال Caddy

پس از پاسخ موفق health check، به فایل `/etc/caddy/Caddyfile` این بلوک مستقل را اضافه کنید:

```caddyfile
cvbgroup.ir, www.cvbgroup.ir {
    reverse_proxy 127.0.0.1:3100
}
```

پیش از reload، پیکربندی Caddy را اعتبارسنجی کنید:

```bash
caddy validate --config /etc/caddy/Caddyfile
systemctl reload caddy
```

Caddy برای دامنهٔ متصل و قابل دسترس گواهی TLS صادر می‌کند. در Cloudflare، رکوردهای A ریشه و `www` باید به IP عمومی همین VPS اشاره کنند؛ رکوردهای AAAA را فقط در صورت پیکربندی IPv6 روی سرور نگه دارید. حالت رمزنگاری Cloudflare را روی **Full (strict)** بگذارید. اگر از ایمیل این دامنه استفاده می‌کنید، پیش از فعال‌کردن nameserverهای Cloudflare رکوردهای MX و TXT ایمیل (از جمله SPF، DKIM و DMARC) را هم منتقل و بررسی کنید.

## برگشت نسخه و پشتیبان

- پیش از migration یا انتشار جدید، از volume پایگاه‌داده پشتیبان بگیرید و فایل پشتیبان را خارج از سرور نگهداری کنید.
- image قبلی برنامه را نگه دارید تا در صورت نیاز همان نسخه را دوباره اجرا کنید.
- برای بازگشت، بلوک دامنه را موقتاً از Caddy بردارید یا به نسخهٔ سالم قبلی برگردانید؛ به سرویس‌های Docker دیگر دست نزنید.

این راهنما زیرساخت را آماده می‌کند؛ انتشار Production همچنان به QA، پشتیبان‌گیری زمان‌بندی‌شده و تأیید انتشار طبق `AGENTS.md` نیاز دارد.
