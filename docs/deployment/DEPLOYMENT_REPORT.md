# گزارش و راهنمای استقرار Professor Resume

تاریخ اعتبارسنجی: 2026-09-17

## 1. تصمیم استقرار

روش نهایی، **Docker Compose Production** است. این انتخاب برای این پروژه از راهکارهای پیچیده‌تر مناسب‌تر است، چون API، Web و PostgreSQL را با یک فرمان، ترتیب شروع کنترل‌شده، health check و volume پایدار اجرا می‌کند و به Kubernetes یا نصب مستقیم Node/PostgreSQL روی سرور نیاز ندارد.

سرویس‌ها:

| سرویس | فناوری | پورت داخلی | پورت پیش‌فرض میزبان | دسترسی |
|---|---|---:|---:|---|
| `web` | Next.js 16 standalone | 3000 | 3000 | عمومی |
| `api` | NestJS 11 production build | 4000 | 4000 | عمومی |
| `db` | PostgreSQL 16 | 5432 | منتشر نمی‌شود | فقط شبکه Compose |
| `migrate` | Prisma migration/seed runner | - | - | one-shot |

داده PostgreSQL در volume به نام `postgres_data` و فایل‌های runtime شامل CV و تصاویر در `api_assets` نگهداری می‌شوند. اجرای `down` یا recreate کردن containerها این داده‌ها را حذف نمی‌کند. از `docker compose down -v` در سرور production استفاده نکنید.

## 2. نتیجه Audit مخزن

- پروژه شامل دو برنامه مستقل `api` و `web` است و workspace یکپارچه ندارد.
- package manager مبنا `pnpm@10.24.0` است؛ هر برنامه lockfile مستقل دارد.
- API با `pnpm build` ساخته و با `node dist/src/main.js` اجرا می‌شود.
- Web با `pnpm build` ساخته و به‌صورت Next standalone با `node server.js` اجرا می‌شود.
- API از PostgreSQL و Prisma 7 استفاده می‌کند و 9 migration موجود است.
- دستور production migration برابر `prisma migrate deploy` است؛ `migrate dev` در استقرار استفاده نمی‌شود.
- health endpoint برابر `/api/health` و Swagger برابر `/api/docs` است.
- CORS از `WEB_ORIGIN` و URL مرورگر از `NEXT_PUBLIC_API_URL` استفاده می‌کند.
- ورود با OTP، SMTP، JWT و cookie انجام می‌شود. Golestan اختیاری است.
- مسیر `api/assets` در runtime خوانده/نوشته می‌شود و باید پایدار باشد.

## 3. فایل‌های ایجاد یا تغییر داده‌شده

| فایل | دلیل |
|---|---|
| `docker-compose.production.yml` | تعریف PostgreSQL، migration، API، Web، شبکه، health check و volumeها |
| `api/Dockerfile` | build چندمرحله‌ای Nest/Prisma و runtime بدون dev dependency |
| `api/.dockerignore` | جلوگیری از ورود env، node_modules و خروجی‌های محلی به build context |
| `web/Dockerfile` | build چندمرحله‌ای و اجرای Next standalone |
| `web/.dockerignore` | کوچک و امن نگه‌داشتن build context |
| `.env.production.example` | فهرست امن تنظیمات production بدون secret واقعی |
| `.gitignore` | نادیده‌گرفتن `.env.production`، backupها و logها |
| `install.sh` | نصب/به‌روزرسانی idempotent، migration، seed امن و readiness check |
| `manage.sh` | start/stop/restart/status/health/logs/update/backup/restore |
| `api/package.json` و `web/package.json` | تثبیت نسخه pnpm و allowlist اسکریپت‌های native موردنیاز |
| `api/src/config/env.validation.ts` | پشتیبانی validation شده از `COOKIE_SECURE` |
| `api/src/modules/auth/services/auth.service.ts` | امکان HTTP اولیه با IP و cookie غیرsecure؛ HTTPS همچنان secure |
| `api/.env.example` | مستندسازی `COOKIE_SECURE` |
| `web/next.config.ts` | standalone output، proxy داخلی assetها و root پایدار Turbopack |
| `web/src/app/(main)/professors/page.tsx` | سازگاری type مربوط به `searchParams` با Next 16 |

## 4. پیش‌نیازهای Ubuntu Server

- Ubuntu Server 22.04 یا 24.04 با معماری x86_64
- دسترسی `sudo`
- Docker Engine و Docker Compose plugin جدید (`docker compose`)
- دسترسی خروجی به Docker Hub و npm registry هنگام اولین build
- حداقل پیشنهادی: 2 هسته CPU، 4 GB RAM و 15 GB فضای آزاد
- باز بودن پورت‌های `3000` و `4000` برای تست اولیه IP؛ در حالت نهایی HTTPS فقط `80/443`

بررسی پیش‌نیازها:

```bash
docker --version
docker compose version
openssl version
```

## 5. تنظیم Environment

ابتدا فایل نمونه را کپی و فقط فایل خصوصی را ویرایش کنید:

```bash
cp .env.production.example .env.production
nano .env.production
chmod 600 .env.production
```

برای تست اولیه با IP سرور:

```dotenv
WEB_ORIGIN=http://SERVER_IP:3000
NEXT_PUBLIC_API_URL=http://SERVER_IP:4000/api
NEXT_PUBLIC_SITE_URL=http://SERVER_IP:3000
COOKIE_SECURE=false
```

`SERVER_IP` را در هر سه مقدار جایگزین کنید. موارد زیر نیز باید واقعی باشند:

- `SEED_ADMIN_EMAIL`: ایمیل مدیر اولیه
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`: تنظیمات سرویس SMTP
- `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: حساب ارسال OTP
- `SEED_SECONDARY_ADMIN_EMAIL` و `SEED_AUTHOR_EMAIL`: اختیاری
- مقادیر Golestan: اختیاری و در صورت غیرفعال بودن خالی بمانند

`install.sh` برای `POSTGRES_PASSWORD`، `JWT_SECRET` و `OTP_HASH_SECRET` در صورت باقی‌ماندن placeholder مقدار تصادفی امن می‌سازد. اسکریپت با URLهای localhost، placeholderهای اجباری، env ناقص یا ناسازگاری HTTP/HTTPS و cookie متوقف می‌شود.

حالت seed:

| مقدار | رفتار |
|---|---|
| `auto` | فقط وقتی جدول users خالی است seed اجرا می‌شود؛ مقدار پیشنهادی |
| `always` | در هر نصب seed idempotent اجرا می‌شود |
| `never` | seed اجرا نمی‌شود |

## 6. First Run

پس از انتقال سورس به مسیر دلخواه، از ریشه همین bundle اجرا کنید:

```bash
cd /opt/professor-resume
cp .env.production.example .env.production
nano .env.production
chmod 600 .env.production
chmod +x install.sh manage.sh
sudo ./install.sh
```

اسکریپت به ترتیب config را بررسی می‌کند، imageها را می‌سازد، منتظر readiness واقعی PostgreSQL می‌ماند، migration را اجرا می‌کند، در صورت نیاز seed می‌زند، API و سپس Web را شروع می‌کند و URLهای نهایی را چاپ می‌کند.

نشانی‌های پیش‌فرض پس از جایگزینی IP:

- سایت: `http://SERVER_IP:3000`
- API health: `http://SERVER_IP:4000/api/health`
- Swagger: `http://SERVER_IP:4000/api/docs`

بررسی موفقیت:

```bash
sudo ./manage.sh status
sudo ./manage.sh health
curl -fsS http://SERVER_IP:4000/api/health
curl -I http://SERVER_IP:3000/
```

## 7. عملیات روزمره

```bash
sudo ./manage.sh start
sudo ./manage.sh stop
sudo ./manage.sh restart
sudo ./manage.sh status
sudo ./manage.sh health
sudo ./manage.sh logs
sudo ./manage.sh logs api
sudo ./manage.sh logs web
sudo ./manage.sh logs db
```

`stop` از `docker compose down` بدون `-v` استفاده می‌کند و volumeها را حفظ می‌کند.

## 8. Update امن

قبل از update از داده‌ها backup بگیرید، سورس جدید را دریافت کنید و اسکریپت را دوباره اجرا کنید:

```bash
cd /opt/professor-resume
sudo ./manage.sh backup
git pull --ff-only
sudo ./manage.sh update
sudo ./manage.sh health
```

`update` imageها را rebuild و migrationهای جدید را deploy می‌کند. volume دیتابیس و asset حذف نمی‌شود. اگر bundle با Git تحویل نشده است، فایل‌های نسخه جدید را جایگزین کنید ولی `.env.production` و پوشه `backups` را حفظ کنید، سپس `sudo ./manage.sh update` را اجرا کنید.

## 9. Backup و Restore

ساخت backup:

```bash
sudo ./manage.sh backup
```

خروجی در `backups/` شامل یک dump سفارشی PostgreSQL و یک آرشیو asset است. این پوشه را به storage دیگری نیز منتقل کنید.

restore عمداً نیازمند تأیید صریح است:

```bash
sudo CONFIRM_RESTORE=YES ./manage.sh restore \
  backups/database-YYYYMMDDTHHMMSSZ.dump \
  backups/assets-YYYYMMDDTHHMMSSZ.tar.gz
```

restore سرویس‌های Web/API را متوقف، دیتابیس را با `pg_restore --clean --if-exists` بازیابی و سپس stack را health-check می‌کند. قبل از restore از وضعیت فعلی نیز backup بگیرید.

## 10. Domain و HTTPS

راه‌اندازی اولیه با IP و HTTP پشتیبانی می‌شود. برای production عمومی، یک reverse proxy مانند Nginx یا Caddy و TLS معتبر لازم است. پس از آماده‌شدن دامنه این مقادیر را تغییر دهید:

```dotenv
WEB_ORIGIN=https://resume.example.edu
NEXT_PUBLIC_SITE_URL=https://resume.example.edu
NEXT_PUBLIC_API_URL=https://api.resume.example.edu/api
COOKIE_SECURE=true
```

سپس اجرا کنید:

```bash
sudo ./manage.sh update
```

در فایروال فقط `80/443` را عمومی نگه دارید و ترجیحاً `WEB_BIND_ADDRESS` و `API_BIND_ADDRESS` را به `127.0.0.1` تغییر دهید تا دسترسی مستقیم فقط از reverse proxy باشد. تنظیم reverse proxy و DNS عمداً مرحله جداگانه است و در این bundle ساخته نشده است.

## 11. Troubleshooting

### Docker یا Compose موجود نیست

```bash
docker --version
docker compose version
sudo systemctl status docker
sudo systemctl start docker
```

### پورت اشغال است

```bash
sudo ss -ltnp | grep -E ':3000|:4000'
```

پورت‌های `WEB_PORT` و `API_PORT` را در `.env.production` تغییر دهید و URLهای عمومی را نیز هماهنگ کنید.

### دیتابیس unhealthy است

```bash
sudo ./manage.sh status
sudo ./manage.sh logs db
```

فضای دیسک، دسترسی Docker و مقادیر `POSTGRES_*` را بررسی کنید. رمز دیتابیس یک volume موجود را خودسرانه تغییر ندهید.

### migration شکست می‌خورد

```bash
sudo ./manage.sh logs db
sudo docker compose --env-file .env.production -f docker-compose.production.yml run --rm migrate
```

از اجرای `prisma migrate dev` روی production خودداری کنید.

### API unhealthy است

```bash
sudo ./manage.sh logs api
curl -i http://127.0.0.1:4000/api/health
```

معمول‌ترین علت‌ها env ناقص، SMTP نامعتبر، secret کوتاه، DATABASE_URL ناسازگار یا permission volume است.

### Web به API وصل نمی‌شود

`NEXT_PUBLIC_API_URL` باید URL قابل‌دسترسی برای مرورگر و منتهی به `/api` باشد، نه نام داخلی `api` و نه `localhost` سرور. بعد از تغییر این متغیر باید Web rebuild شود:

```bash
sudo ./manage.sh update
```

### خطای CORS یا cookie

`WEB_ORIGIN` و `NEXT_PUBLIC_SITE_URL` باید دقیقاً یکسان باشند. برای HTTP مقدار `COOKIE_SECURE=false` و برای HTTPS مقدار `true` لازم است.

### خطای permission فایل یا volume

```bash
sudo docker compose --env-file .env.production -f docker-compose.production.yml ps
sudo docker volume ls | grep professor
sudo ./manage.sh logs api
```

volumeها را با `down -v` حذف نکنید. قبل از هر تغییر مالکیت یا permission، backup بگیرید.

### OTP یا SMTP کار نمی‌کند

`SMTP_USER` و `SMTP_FROM` باید ایمیل معتبر باشند. host، port، TLS و app password سرویس‌دهنده را بررسی کنید. log ممکن است خطای ارتباط را نشان دهد، اما credential را در ticket یا log عمومی منتشر نکنید.

### Golestan کار نمی‌کند

این integration برای بالا آمدن هسته سامانه اجباری نیست. مقادیر `GOLESTAN_*` را فقط در صورت دریافت تنظیمات معتبر وارد کنید و هرگز login/password/sec را در گزارش یا خروجی عمومی چاپ نکنید.

## 12. Validationهای واقعاً اجراشده

| بررسی | فرمان/روش | نتیجه واقعی |
|---|---|---|
| نصب lockfile API/Web | `pnpm install --frozen-lockfile` | موفق |
| Prisma schema | `pnpm prisma:validate` | معتبر |
| Prisma Client | `pnpm prisma:generate` | موفق |
| API build | `pnpm build` | موفق |
| API unit tests | `pnpm test -- --runInBand` | 5 suite و 10 test موفق |
| Web lint | `pnpm lint` | موفق، بدون خطا |
| Web TypeScript | `pnpm exec tsc --noEmit` | موفق |
| Web production build | `pnpm build` | موفق؛ 14 صفحه تولید شد |
| Bash syntax | `bash -n install.sh` و `bash -n manage.sh` | موفق |
| Compose config | `docker compose ... config --quiet` | موفق |
| Docker images | build واقعی `api`, `web`, `migrate` | هر سه موفق |
| Prisma production migration | `prisma migrate deploy` روی PostgreSQL 16 تازه | هر 9 migration موفق |
| Seed | `pnpm prisma:seed` روی DB خالی | موفق |
| startup order | DB سپس migration سپس API سپس Web | موفق |
| health checks | health داخلی هر سه container | هر سه healthy |
| API/Web smoke test | health، Swagger، faculties، professors، home، contact | همه HTTP 200 |
| CORS preflight | Origin آزمایشی Web | HTTP 204 و allow-origin صحیح |
| persistence | `down` و recreate بدون حذف volume | DB برابر `3|15|1` و assets برابر 4 قبل/بعد |
| migration تکراری | اجرای مجدد deploy | No pending migrations |
| install idempotency | اجرای کامل دوباره `install.sh` | موفق و seed به‌درستی skip شد |
| backup | `manage.sh backup` | dump دیتابیس و archive asset موفق |
| restore | `CONFIRM_RESTORE=YES manage.sh restore ...` | موفق؛ DB `3|15|1` و assets 4 |

در اولین build دو ایراد واقعی شناسایی و رفع شد: Prisma 7 در build به `DATABASE_URL` نحوی نیاز داشت و OpenSSL باید پیش از نصب/generate در image موجود می‌بود. همچنین build محلی Next روی مسیر فارسی ویندوز با خطای داخلی Turbopack مواجه شد که با تعیین `turbopack.root` رفع و build مجدد موفق شد.

## 13. موارد دستی باقی‌مانده

- تعیین IP یا domain واقعی در سه URL عمومی
- واردکردن ایمیل مدیر اولیه و credential معتبر SMTP در `.env.production`
- نصب Docker Engine/Compose روی VPS و تنظیم firewall
- اجرای First Run روی Ubuntu نهایی
- تنظیم DNS، reverse proxy و گواهی TLS برای انتشار عمومی
- تغییر `COOKIE_SECURE=true` هم‌زمان با HTTPS
- انتقال دوره‌ای backupها به فضای ذخیره‌سازی خارج از همان VPS
- واردکردن تنظیمات Golestan فقط در صورت فعال‌شدن سرویس

هیچ فایل `.env.production` یا secret واقعی نباید commit یا داخل image قرار گیرد.
