# راهنمای قدم‌به‌قدم استقرار روی Ubuntu Server

این روش از Docker Compose production و اسکریپت‌های خود پروژه استفاده می‌کند. API، Web، PostgreSQL، migration و seed به‌صورت کنترل‌شده اجرا می‌شوند.

## 1. اتصال و آماده‌سازی سرور

به سرور متصل شوید:

```bash
ssh ubuntu@SERVER_IP
```

سیستم را به‌روز و ابزارهای اولیه را نصب کنید:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git openssl
```

## 2. نصب Docker Engine و Compose

مخزن رسمی Docker را اضافه کنید:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"${UBUNTU_CODENAME:-$VERSION_CODENAME}\") stable" |
  sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

سرویس و نسخه‌ها را بررسی کنید:

```bash
sudo systemctl enable --now docker
sudo docker run --rm hello-world
sudo docker compose version
```

مرجع رسمی نصب: `https://docs.docker.com/engine/install/ubuntu/`

## 3. دریافت پروژه

```bash
sudo mkdir -p /opt/professor-resume
sudo chown "$USER":"$USER" /opt/professor-resume
git clone https://github.com/Amirhosein-Zamani/professor-resume.git \
  /opt/professor-resume
cd /opt/professor-resume
```

اگر پروژه از قبل clone شده است:

```bash
cd /opt/professor-resume
git pull --ff-only
```

## 4. ساخت تنظیمات production

```bash
cp .env.production.example .env.production
nano .env.production
```

برای اجرای اولیه با IP، مقادیر زیر را تنظیم کنید:

```dotenv
WEB_ORIGIN=http://SERVER_IP:3000
NEXT_PUBLIC_API_URL=http://SERVER_IP:4000/api
NEXT_PUBLIC_SITE_URL=http://SERVER_IP:3000
COOKIE_SECURE=false

SEED_MODE=auto
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

قواعد مهم:

- `SERVER_IP` را با IP واقعی سرور جایگزین کنید.
- `NEXT_PUBLIC_API_URL` حتماً به `/api` ختم شود.
- `WEB_ORIGIN` و `NEXT_PUBLIC_SITE_URL` دقیقاً برابر باشند.
- `SEED_ADMIN_EMAIL` ایمیلی باشد که باید به داشبورد دسترسی مدیرکل داشته باشد.
- برای Gmail از App Password استفاده کنید.
- مقادیر `POSTGRES_PASSWORD`، `JWT_SECRET` و `OTP_HASH_SECRET` می‌توانند `CHANGE_ME_GENERATED` باقی بمانند؛ `install.sh` آن‌ها را امن تولید می‌کند.
- تنظیمات `GOLESTAN_*` در صورت غیرفعال‌بودن سرویس می‌توانند خالی بمانند.
- فایل `.env.production` نباید وارد Git، گزارش یا پیام عمومی شود.

دسترسی فایل را محدود کنید:

```bash
chmod 600 .env.production
chmod +x install.sh manage.sh
```

## 5. تنظیم Firewall

ابتدا SSH را مجاز کنید تا دسترسی شما قطع نشود:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 3000/tcp
sudo ufw allow 4000/tcp
sudo ufw enable
sudo ufw status
```

اگر ارائه‌دهنده سرور Firewall یا Security Group جداگانه دارد، پورت‌های `22`، `3000` و `4000` را آنجا نیز مجاز کنید. PostgreSQL نباید با پورت `5432` عمومی شود؛ Compose آن را فقط در شبکه داخلی نگه می‌دارد.

## 6. نصب و اجرای کامل پروژه

```bash
cd /opt/professor-resume
sudo ./install.sh
```

این اسکریپت به‌ترتیب کارهای زیر را انجام می‌دهد:

1. اعتبارسنجی `.env.production`
2. تولید secretهای لازم
3. build کردن imageهای API، Web و migration
4. اجرای PostgreSQL و health check
5. اجرای `prisma migrate deploy`
6. اجرای seed روی دیتابیس خالی در حالت `SEED_MODE=auto`
7. اجرای API و سپس Web

روی سرور کم‌منبع می‌توانید build را با موازی‌سازی کمتر اجرا کنید:

```bash
sudo env COMPOSE_PARALLEL_LIMIT=1 ./install.sh
```

## 7. بررسی نتیجه

```bash
sudo ./manage.sh status
sudo ./manage.sh health
curl -fsS http://127.0.0.1:4000/api/health
curl -I http://127.0.0.1:3000/
```

آدرس‌های عمومی:

- سایت: `http://SERVER_IP:3000`
- سلامت API: `http://SERVER_IP:4000/api/health`
- Swagger: `http://SERVER_IP:4000/api/docs`

## 8. مشاهده log و رفع خطا

```bash
sudo ./manage.sh logs
sudo ./manage.sh logs api
sudo ./manage.sh logs web
sudo ./manage.sh logs db
```

برای خروج از حالت دنبال‌کردن log از `Ctrl+C` استفاده کنید؛ سرویس‌ها متوقف نمی‌شوند.

اگر API بالا نمی‌آید، ابتدا خطاهای env، اتصال PostgreSQL و SMTP را بررسی کنید. اگر Web هنوز URL قدیمی API را نشان می‌دهد، بعد از اصلاح `.env.production` حتماً `manage.sh update` را اجرا کنید، زیرا `NEXT_PUBLIC_API_URL` هنگام build وارد Web می‌شود.

## 9. مدیریت روزمره

```bash
sudo ./manage.sh start
sudo ./manage.sh stop
sudo ./manage.sh restart
sudo ./manage.sh status
sudo ./manage.sh health
```

هشدار: روی production دستور `docker compose down -v` اجرا نکنید؛ گزینه `-v` volume دیتابیس و فایل‌های آپلودشده را حذف می‌کند.

## 10. آپدیت نسخه جدید

ابتدا backup بگیرید:

```bash
cd /opt/professor-resume
sudo ./manage.sh backup
```

سپس کد را دریافت و deployment را به‌روزرسانی کنید:

```bash
git pull --ff-only
sudo env COMPOSE_PARALLEL_LIMIT=1 ./manage.sh update
sudo ./manage.sh health
```

`manage.sh update` imageها را دوباره build می‌کند، migrationهای جدید را اعمال می‌کند و سرویس‌ها را با health check بالا می‌آورد.

## 11. Backup و Restore

ساخت backup دیتابیس و فایل‌ها:

```bash
sudo ./manage.sh backup
ls -lh backups/
```

فایل‌های backup را در فضایی خارج از همان VPS نیز نگهداری کنید.

Restore عملیات حساس و جایگزین‌کننده داده فعلی است:

```bash
sudo CONFIRM_RESTORE=YES ./manage.sh restore \
  backups/database-YYYYMMDDTHHMMSSZ.dump \
  backups/assets-YYYYMMDDTHHMMSSZ.tar.gz
```

## 12. Domain و HTTPS

برای انتشار واقعی، یک domain و reverse proxy مانند Nginx یا Caddy با TLS تنظیم کنید. سپس در `.env.production`:

```dotenv
WEB_ORIGIN=https://example.com
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_API_URL=https://api.example.com/api
COOKIE_SECURE=true
```

پس از تغییر URLها:

```bash
sudo ./manage.sh update
sudo ./manage.sh health
```

`COOKIE_SECURE=true` را فقط هم‌زمان با HTTPS فعال کنید. در حالت HTTP با IP باید `false` باشد.

