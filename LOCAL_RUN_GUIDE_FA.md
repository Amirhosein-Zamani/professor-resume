# راهنمای ساده اجرای پروژه در لوکال

این راهنما برای اجرای پروژه در Windows و PowerShell نوشته شده است. ساختار پروژه شامل `api` با NestJS، `web` با Next.js و PostgreSQL است.

## 1. پیش‌نیازها

- Node.js 22
- pnpm 10.24.0
- Docker Desktop
- Git

بررسی نصب:

```powershell
node --version
pnpm --version
docker --version
docker compose version
```

اگر pnpm نصب نیست:

```powershell
corepack enable
corepack prepare pnpm@10.24.0 --activate
```

## 2. اجرای PostgreSQL

Docker Desktop را باز کنید. برای اولین اجرا، کانتینر دیتابیس را بسازید:

```powershell
docker run --name professor-resume-local `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=professor_resume_local `
  -p 55435:5432 `
  -v professor_resume_local_data:/var/lib/postgresql/data `
  -d postgres:16-alpine
```

در اجراهای بعدی فقط این دستور لازم است:

```powershell
docker start professor-resume-local
```

وضعیت دیتابیس:

```powershell
docker ps --filter "name=professor-resume-local"
```

## 3. تنظیم و اجرای API

وارد پوشه API شوید:

```powershell
cd "D:\DU\project\فاینال\apps\apps\api"
```

اگر فایل `.env` وجود ندارد، آن را بسازید:

```powershell
Copy-Item .env.example .env
```

مقادیر مهم `api/.env` باید به شکل زیر تنظیم شوند. secretها و اطلاعات SMTP را با مقادیر واقعی خودتان جایگزین کنید:

```dotenv
NODE_ENV=development
PORT=4000
WEB_ORIGIN=http://localhost:3001
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55435/professor_resume_local

JWT_SECRET=PUT_A_LONG_RANDOM_SECRET_HERE
OTP_HASH_SECRET=PUT_ANOTHER_LONG_RANDOM_SECRET_HERE
COOKIE_SECURE=false

SEED_ADMIN_EMAIL=admin@example.com
SEED_SECONDARY_ADMIN_EMAIL=
SEED_AUTHOR_EMAIL=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=YOUR_GMAIL_APP_PASSWORD
SMTP_FROM=your-email@gmail.com
```

نکته: برای Gmail از App Password استفاده کنید، نه رمز اصلی حساب. فایل `.env` را commit یا منتشر نکنید.

وابستگی‌ها، Prisma، migration و seed را اجرا کنید:

```powershell
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm exec prisma migrate deploy --schema prisma
pnpm prisma:seed
pnpm start:dev
```

API روی آدرس زیر در دسترس است:

- Health: `http://localhost:4000/api/health`
- Swagger: `http://localhost:4000/api/docs`

## 4. تنظیم و اجرای Web

یک PowerShell جدید باز کنید:

```powershell
cd "D:\DU\project\فاینال\apps\apps\web"
```

اگر `.env.local` وجود ندارد:

```powershell
Copy-Item .env.example .env.local
```

محتوای اصلی آن:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3001
AUTH_REFRESH_COOKIE_NAME=rtkn
```

سپس:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

سایت در `http://localhost:3001` باز می‌شود.

## اجرای روزمره

بعد از نصب اولیه، هر بار فقط این سه بخش را اجرا کنید:

```powershell
docker start professor-resume-local
```

در ترمینال API:

```powershell
cd "D:\DU\project\فاینال\apps\apps\api"
pnpm start:dev
```

در ترمینال Web:

```powershell
cd "D:\DU\project\فاینال\apps\apps\web"
pnpm dev
```

برای توقف API و Web در هر ترمینال `Ctrl+C` بزنید. توقف دیتابیس اختیاری است:

```powershell
docker stop professor-resume-local
```

## خطاهای رایج

### خطای `P1001` یا عدم اتصال به دیتابیس

```powershell
docker start professor-resume-local
docker ps --filter "name=professor-resume-local"
```

همچنین بررسی کنید `DATABASE_URL` از پورت `55435` استفاده کند.

### خطای `EADDRINUSE` برای پورت 3001 یا 4000

```powershell
Get-NetTCPConnection -LocalPort 3001,4000 -ErrorAction SilentlyContinue |
  Select-Object LocalPort,State,OwningProcess
```

پردازش قدیمی همان پروژه را متوقف کنید یا ترمینال قبلی را ببندید.

### خطای OTP یا ارسال‌نشدن ایمیل

- ایمیل باید از قبل در جدول کاربران توسط seed یا مدیرکل ثبت شده باشد.
- `SMTP_USER`، `SMTP_FROM` و Gmail App Password را بررسی کنید.
- پس از تغییر `.env`، API را متوقف و دوباره اجرا کنید.
- درخواست‌های پشت سر هم مشمول cooldown و rate limit می‌شوند.

### تغییر schema دیتابیس

در توسعه، بعد از تغییر Prisma schema یک migration نام‌دار بسازید:

```powershell
cd "D:\DU\project\فاینال\apps\apps\api"
pnpm exec prisma migrate dev --schema prisma --name describe_change
pnpm prisma:generate
```

