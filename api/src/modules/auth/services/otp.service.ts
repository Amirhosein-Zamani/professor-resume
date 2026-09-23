import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../../../database';

@Injectable()
export class OtpService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const smtpSecure = this.configService.get<string>('SMTP_SECURE', 'false');
    const secure =
      smtpSecure === 'true' || smtpSecure === 'ssl' || smtpSecure === 'tls';

    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async generateOtp(email: string): Promise<string> {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await this.prisma.otp.findUnique({
      where: { email: normalizedEmail },
      select: { createdAt: true },
    });
    const cooldownSeconds = this.configService.get<number>(
      'OTP_RESEND_COOLDOWN_SECONDS',
      60,
    );

    if (
      existing &&
      Date.now() - existing.createdAt.getTime() < cooldownSeconds * 1000
    ) {
      throw new HttpException(
        'Please wait before requesting another verification code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = randomInt(100000, 1000000).toString();
    const codeHash = this.hashOtp(normalizedEmail, otp);

    await this.prisma.otp.upsert({
      where: { email: normalizedEmail },
      update: {
        code: codeHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        createdAt: new Date(),
        attempts: 0,
        isUsed: false,
      },
      create: {
        email: normalizedEmail,
        code: codeHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return otp;
  }

  async sendOtpEmail(email: string, otp: string): Promise<void> {
    const from =
      this.configService.get<string>('SMTP_FROM') ??
      this.configService.get<string>('SMTP_USER');

    const mailOptions = {
      from,
      to: email,
      subject: 'کد تأیید ورود به سامانه',
      html: `
        <div style="direction: rtl; font-family: Vazir, sans-serif;">
          <h2>کد تأیید شما</h2>
          <p>برای ورود به سامانه، از کد زیر استفاده کنید:</p>
          <div style="font-size: 32px; font-weight: bold; color: #10b981; padding: 20px; background: #f0fdf4; border-radius: 8px; text-align: center;">
            ${otp}
          </div>
          <p>این کد تا ۵ دقیقه اعتبار دارد.</p>
          <p style="color: #6b7280; font-size: 14px;">اگر درخواست ورود ندادید، این ایمیل را نادیده بگیرید.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();
    const otpRecord = await this.prisma.otp.findUnique({
      where: { email: normalizedEmail },
    });

    if (!otpRecord) {
      throw new BadRequestException('کد تأیید یافت نشد.');
    }

    if (otpRecord.isUsed) {
      throw new BadRequestException('این کد قبلاً استفاده شده است.');
    }

    if (otpRecord.attempts >= 3) {
      throw new BadRequestException(
        'تعداد تلاش‌های ناموفق بیش از حد مجاز است.',
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('کد تأیید منقضی شده است.');
    }

    if (!this.isOtpValid(normalizedEmail, code, otpRecord.code)) {
      await this.prisma.otp.update({
        where: { email: normalizedEmail },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('کد تأیید اشتباه است.');
    }

    await this.prisma.otp.update({
      where: { email: normalizedEmail },
      data: { isUsed: true },
    });

    return true;
  }

  private hashOtp(email: string, code: string): string {
    const secret =
      this.configService.get<string>('OTP_HASH_SECRET') ??
      this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('OTP_HASH_SECRET or JWT_SECRET must be configured.');
    }

    return createHmac('sha256', secret)
      .update(`${email}:${code}`)
      .digest('hex');
  }

  private isOtpValid(email: string, code: string, storedHash: string): boolean {
    const candidate = Buffer.from(this.hashOtp(email, code), 'hex');
    const stored = Buffer.from(storedHash, 'hex');

    return (
      stored.length === candidate.length && timingSafeEqual(stored, candidate)
    );
  }
}
