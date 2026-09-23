# گزارش Release پروژه Professor Resume v1.0.0

## مشخصات Release

| مورد | مقدار |
|---|---|
| نسخه | `v1.0.0` |
| زمان ساخت | `2026-09-18 12:24:07 +03:30` |
| نوع خروجی | Git-independent source deployment bundle |
| نام archive | `professor-resume-v1.0.0.tar.gz` |
| مسیر archive | `release/professor-resume-v1.0.0.tar.gz` |
| مسیر checksum | `release/professor-resume-v1.0.0.tar.gz.sha256` |
| اندازه | `3,925,728 bytes`، حدود `3.74 MiB` |
| تعداد فایل داخل bundle | `294` |
| SHA-256 | `c35b34d13043cba52ccfc0756caaa643fed1b34f8fc5b51003d12feead4b882e` |

## روش ساخت

Release از یک staging directory تمیز و با allowlist ساخته شد. هیچ کپی recursive از ریشه repository انجام نشد. archive داخل Linux container ساخته شد تا permission فایل‌های shell به‌صورت واقعی در tar ثبت شود.

این bundle برای build مستقیم روی Ubuntu Server دارای Docker Engine و Docker Compose آماده است و برای نصب به Git، GitHub، CI/CD یا Docker Registry خصوصی وابسته نیست. در اولین build، سرور باید برای دریافت base imageها و packageها دسترسی اینترنت داشته باشد.

## ساختار Bundle

```text
professor-resume-v1.0.0/
├── api/
│   ├── assets/
│   ├── prisma/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── pnpm-lock.yaml
├── web/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── pnpm-lock.yaml
├── docs/
│   └── deployment/
│       └── DEPLOYMENT_REPORT.md
├── docker-compose.production.yml
├── .env.production.example
├── install.sh
├── manage.sh
└── help.md
```

Archive دقیقاً یک top-level directory با نام `professor-resume-v1.0.0/` دارد؛ هنگام Extract فایل‌ها مستقیماً در `/opt` پخش نمی‌شوند.

## فایل‌های Include شده

### Root deployment

- `docker-compose.production.yml`
- `.env.production.example`
- `install.sh`
- `manage.sh`
- `help.md`
- `docs/deployment/DEPLOYMENT_REPORT.md`

### API build context

- `api/src/`
- `api/prisma/` شامل schema، modelها، 9 migration و seed
- `api/assets/` شامل فایل‌های runtime اولیه
- `api/Dockerfile` و `api/.dockerignore`
- `api/package.json` و `api/pnpm-lock.yaml`
- `nest-cli.json`
- `tsconfig.json` و `tsconfig.build.json`
- `prisma.config.ts`

### Web build context

- `web/src/`
- `web/public/` شامل تصاویر و fontها
- `web/Dockerfile` و `web/.dockerignore`
- `web/package.json` و `web/pnpm-lock.yaml`
- `next.config.ts` و `next-env.d.ts`
- `tsconfig.json`
- `postcss.config.mjs`

## موارد Exclude شده

موارد زیر به‌صورت قطعی وارد staging و archive نشدند:

- `.git/` و هر metadata مربوط به Git
- تمام `.env`های محلی و `.env.production`
- envهای API/Web، به‌جز root `.env.production.example` امن
- `node_modules/`
- `.next/`، `dist/`، coverage و cacheها
- تمام logهای محلی API/Web
- backupها و dumpهای آزمایشی
- volume data و داده PostgreSQL محلی
- پوشه `release/` برای جلوگیری از بسته‌بندی recursive
- `package-lock.json`های اضافی؛ package manager release فقط pnpm است
- `tsconfig.tsbuildinfo`
- فایل‌های تست، خروجی test و artifactهای موقت غیرلازم برای production build
- فایل‌های راهنمای agent/IDE و مستندات توسعه‌ای غیرضروری
- secret، password، token، private key یا credential واقعی

فایل `.env.production.example` داخل archive وجود دارد و فقط placeholder و defaultهای غیرحساس دارد.

## Permissionها

Permission ثبت‌شده داخل خود archive:

```text
-rwxr-xr-x ... professor-resume-v1.0.0/install.sh
-rwxr-xr-x ... professor-resume-v1.0.0/manage.sh
```

بنابراین scriptها در Linux executable هستند. با این حال `help.md` فرمان `chmod +x install.sh manage.sh` را نیز برای اطمینان ارائه می‌کند. فایل واقعی `.env.production` داخل release نیست و راهنما permission برابر `600` را پس از ساخت آن اعمال می‌کند.

## Validationهای واقعاً اجراشده

| Validation | نتیجه واقعی |
|---|---|
| staging allowlist | موفق؛ 294 فایل ضروری |
| forbidden file scan روی staging | موفق؛ تعداد موارد ممنوع صفر |
| secret scan روی staging | موفق؛ credential شناخته‌شده، private key و token pattern پیدا نشد |
| `bash -n install.sh` روی staging | موفق |
| `bash -n manage.sh` روی staging | موفق |
| ساخت archive در Linux container | موفق |
| بررسی top-level directory پس از Extract | موفق؛ فقط `professor-resume-v1.0.0/` |
| بررسی فایل‌های ضروری پس از Extract | موفق |
| exclusion scan پس از Extract | موفق؛ `.git`، env واقعی، node_modules، log، dump و backup وجود نداشت |
| secret scan پس از Extract | موفق |
| permission inspection از خود tar | موفق؛ هر دو script برابر `755` |
| shell syntax روی نسخه Extract‌شده | موفق |
| Docker Compose config روی نسخه Extract‌شده | موفق |
| Docker build از context نسخه Extract‌شده | موفق؛ `api`، `migrate` و `web` ساخته شدند |
| Next.js production build داخل Docker | موفق؛ 14 صفحه تولید شد |
| اجرای `install.sh` از نسخه Extract‌شده | موفق |
| PostgreSQL readiness | موفق؛ container healthy |
| Prisma production migration | موفق؛ هر 9 migration اجرا شد |
| Prisma seed روی دیتابیس خالی | موفق |
| API health check | موفق؛ container healthy |
| Web health check | موفق؛ container healthy |
| API smoke test | health، Swagger، faculties و professors همگی HTTP 200 |
| Web smoke test | home، faculties، professors و contact-us همگی HTTP 200 |
| شمارش داده بعد از First Run | `users=3`، `faculties=15`، `professors=1` |
| SHA-256 بعد از آخرین تغییر archive | تولید و ثبت شد |

Docker build نسخه Extract‌شده از cache معتبر BuildKit نیز استفاده کرد. با این حال contextها از مسیر Extract‌شده ارسال شدند، تمام `COPY`های موردنیاز resolve شدند و مرحله Web build واقعاً اجرا و موفق شد. اجرای کامل installer، migration، seed و runtime نیز صرفاً از همان نسخه Extract‌شده انجام شد.

## نتیجه Extract Test

- archive در یک directory موقت مستقل Extract شد.
- فقط یک top-level directory صحیح وجود داشت.
- تمام فایل‌های deployment و build context ضروری حاضر بودند.
- bundle هیچ وابستگی فایلی به repository اصلی نداشت.
- `.env.production` آزمایشی خارج از archive ساخته شد و پس از تست حذف شد.
- stack آزمایشی پس از smoke test متوقف شد.

## بررسی Checksum

پس از انتقال هر دو فایل به یک directory روی Ubuntu:

```bash
sha256sum -c professor-resume-v1.0.0.tar.gz.sha256
```

خروجی مورد انتظار:

```text
professor-resume-v1.0.0.tar.gz: OK
```

## First Run مسئول سرور

```bash
cd /opt
sha256sum -c professor-resume-v1.0.0.tar.gz.sha256
sudo tar -xzf professor-resume-v1.0.0.tar.gz
cd professor-resume-v1.0.0
sudo cp .env.production.example .env.production
sudo nano .env.production
sudo chmod 600 .env.production
sudo chmod +x install.sh manage.sh
sudo ./install.sh
```

پس از نصب:

```bash
sudo ./manage.sh status
sudo ./manage.sh health
curl -fsS http://SERVER_IP:4000/api/health
curl -I http://SERVER_IP:3000/
```

## موارد دستی باقی‌مانده

- نصب Docker Engine و Docker Compose plugin روی VPS
- انتقال archive و checksum به VPS
- جایگزینی IP واقعی در URLهای `.env.production`
- تنظیم ایمیل مدیر اولیه و SMTP واقعی
- تنظیم firewall برای پورت‌های لازم
- تنظیم DNS، reverse proxy و TLS برای انتشار عمومی
- تغییر `COOKIE_SECURE=true` هم‌زمان با HTTPS
- تنظیم Golestan فقط در صورت فعال‌بودن integration
- انتقال backupهای production به storage خارج از VPS

containerها و volumeهای validation محلی با project name `professor-resume-release-validation` پس از تست متوقف شدند اما برای جلوگیری از حذف مخرب خودکار، حذف دائمی نشدند. این منابع جزو archive نیستند.

## نتیجه نهایی

`professor-resume-v1.0.0.tar.gz` معیارهای release مستقل از Git را برآورده می‌کند و First Run کامل آن از نسخه Extract‌شده با موفقیت اعتبارسنجی شده است.
