# راهنمای سریع نصب Professor Resume v1.0.0

این بسته برای نصب مستقیم روی Ubuntu Server/VPS آماده شده است و به GitHub یا Git نیاز ندارد.

## پیش‌نیاز

روی سرور باید Docker Engine و Docker Compose plugin نصب باشند:

```bash
docker --version
docker compose version
```

سرور در اولین build باید به Docker Hub و npm registry دسترسی اینترنت داشته باشد.

## 1. انتقال و Extract

فایل‌های زیر را به سرور منتقل کنید:

- `professor-resume-v1.0.0.tar.gz`
- `professor-resume-v1.0.0.tar.gz.sha256`

سپس checksum و archive را بررسی و استخراج کنید:

```bash
cd /opt
sha256sum -c professor-resume-v1.0.0.tar.gz.sha256
sudo tar -xzf professor-resume-v1.0.0.tar.gz
cd professor-resume-v1.0.0
```

اگر فایل‌ها ابتدا در home کاربر آپلود شده‌اند، مسیر همان فایل‌ها را در فرمان‌های بالا استفاده کنید یا آن‌ها را به `/opt` منتقل کنید.

## 2. تنظیم Environment

```bash
sudo cp .env.production.example .env.production
sudo nano .env.production
sudo chmod 600 .env.production
```

حداقل موارد دستی:

- `SERVER_IP` را در `WEB_ORIGIN`، `NEXT_PUBLIC_API_URL` و `NEXT_PUBLIC_SITE_URL` با IP واقعی سرور جایگزین کنید.
- `SEED_ADMIN_EMAIL` را روی ایمیل مدیر قرار دهید.
- `SMTP_HOST`، `SMTP_PORT`، `SMTP_SECURE`، `SMTP_USER`، `SMTP_PASS` و `SMTP_FROM` را واقعی وارد کنید.
- برای تست اولیه با HTTP مقدار `COOKIE_SECURE=false` باقی بماند.
- تنظیمات `GOLESTAN_*` اختیاری هستند و در صورت غیرفعال بودن می‌توانند خالی بمانند.

سه secret اصلی که مقدار `CHANGE_ME_GENERATED` دارند هنگام نصب به‌صورت خودکار تولید می‌شوند. فایل `.env.production` را منتشر یا commit نکنید.

## 3. نصب

```bash
sudo chmod +x install.sh manage.sh
sudo ./install.sh
```

Installer به ترتیب imageها را build، PostgreSQL را آماده، migrationها را deploy، seed لازم را اجرا و API و Web را health-check می‌کند.

## 4. بررسی سلامت و URLها

با پورت‌های پیش‌فرض:

- Web: `http://SERVER_IP:3000`
- API health: `http://SERVER_IP:4000/api/health`
- Swagger: `http://SERVER_IP:4000/api/docs`

```bash
sudo ./manage.sh status
sudo ./manage.sh health
curl -fsS http://SERVER_IP:4000/api/health
curl -I http://SERVER_IP:3000/
```

## 5. مدیریت روزمره

```bash
sudo ./manage.sh start
sudo ./manage.sh stop
sudo ./manage.sh restart
sudo ./manage.sh status
sudo ./manage.sh logs
sudo ./manage.sh logs api
sudo ./manage.sh logs web
sudo ./manage.sh logs db
```

برای rebuild و اجرای migrationهای نسخه جدید:

```bash
sudo ./manage.sh update
```

## 6. Backup و Restore

```bash
sudo ./manage.sh backup
```

فایل‌های backup در پوشه `backups/` ایجاد می‌شوند. آن‌ها را به storage دیگری نیز منتقل کنید.

Restore نیازمند تأیید صریح است:

```bash
sudo CONFIRM_RESTORE=YES ./manage.sh restore \
  backups/database-YYYYMMDDTHHMMSSZ.dump \
  backups/assets-YYYYMMDDTHHMMSSZ.tar.gz
```

## هشدار مهم

فرمان زیر volumeهای دیتابیس و فایل‌های runtime را حذف می‌کند و نباید روی production اجرا شود:

```bash
docker compose down -v
```

برای توقف امن از این فرمان استفاده کنید:

```bash
sudo ./manage.sh stop
```

## Domain و HTTPS

راه‌اندازی اولیه با IP و HTTP امکان‌پذیر است. برای انتشار عمومی، DNS و reverse proxy مانند Nginx یا Caddy و گواهی TLS را تنظیم کنید. سپس URLها را به `https://...` تغییر دهید، `COOKIE_SECURE=true` قرار دهید و اجرا کنید:

```bash
sudo ./manage.sh update
sudo ./manage.sh health
```

راهنمای کامل‌تر در `docs/deployment/DEPLOYMENT_REPORT.md` قرار دارد.
