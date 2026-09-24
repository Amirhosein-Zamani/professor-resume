// src/modules/auth/services/auth.service.ts

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Response } from 'express';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { PrismaService } from '../../../database';

import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

import { OtpService } from './otp.service';

import { RequestOtpDto } from '../dto/RequestOtpDto';
import { VerifyOtpDto } from '../dto/VerifyOtpDto';

type SafeUser = {
  id: string;
  email: string;
  role: string;
  professorId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type RefreshTokenPayload = {
  sub: string;
  email: string;
  type: 'refresh';
  iat?: number;
  exp?: number;
};

@Injectable()
export class AuthService {
  private readonly otpRequestWindows = new Map<string, number[]>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  // =========================================================
  // OTP
  // =========================================================

  async requestOtp(
    dto: RequestOtpDto,
    requesterIp?: string,
  ): Promise<{ message: string }> {
    const email = dto.email.toLowerCase().trim();
    this.assertOtpRequestRateLimit(email, requesterIp);

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { email: true },
    });

    if (!user) {
      throw new BadRequestException(
        'این ایمیل در فهرست کاربران داشبورد ثبت نشده است.',
      );
    }

    const otp = await this.otpService.generateOtp(user.email);
    await this.otpService.sendOtpEmail(user.email, otp);

    return {
      message: 'Verification code has been sent.',
    };
  }

  // =========================================================
  // Login
  // =========================================================

  async verifyOtp(
    response: Response,
    dto: VerifyOtpDto,
    requesterIp?: string,
  ): Promise<{ user: SafeUser }> {
    const email = dto.email.toLowerCase().trim();
    this.assertOtpVerificationRateLimit(email, requesterIp);

    await this.otpService.verifyOtp(email, dto.code);

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Authenticated user was not found.');
    }

    const accessToken = await this.generateAccessToken(user);

    const refreshToken = await this.generateRefreshToken(user);

    // Access Token
    response.cookie(
      this.getAccessCookieName(),
      accessToken,
      this.getAccessCookieOptions(),
    );

    // Refresh Token
    response.cookie(
      this.getRefreshCookieName(),
      refreshToken,
      this.getRefreshCookieOptions(),
    );

    return {
      user: this.toSafeUser(user),
    };
  }

  // =========================================================
  // Refresh Access Token
  // =========================================================

  async refreshAccessToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.getJwtSecret(),
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid refresh token payload.');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User no longer exists.');
      }

      return this.generateAccessToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Refresh token expired or invalid.');
    }
  }

  // =========================================================
  // Refresh Endpoint
  // =========================================================

  async refresh(
    response: Response,
    refreshToken?: string,
  ): Promise<{ success: true }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    const accessToken = await this.refreshAccessToken(refreshToken);

    response.cookie(
      this.getAccessCookieName(),
      accessToken,
      this.getAccessCookieOptions(),
    );

    return {
      success: true,
    };
  }

  // =========================================================
  // Me
  // =========================================================

  async me(user: AuthenticatedUser): Promise<{ user: SafeUser }> {
    const dbUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      throw new UnauthorizedException('Authenticated user no longer exists.');
    }

    return {
      user: this.toSafeUser(dbUser),
    };
  }

  // =========================================================
  // Logout
  // =========================================================

  logout(response: Response): { success: true } {
    response.clearCookie(
      this.getAccessCookieName(),
      this.getAccessCookieOptions(),
    );

    response.clearCookie(
      this.getRefreshCookieName(),
      this.getRefreshCookieOptions(),
    );

    return {
      success: true,
    };
  }

  // =========================================================
  // Access Token
  // =========================================================

  private async generateAccessToken(user: User): Promise<string> {
    const options: JwtSignOptions = {
      secret: this.getJwtSecret(),
      expiresIn: this.getAccessExpiresIn(),
    };

    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        type: 'access',
      },
      options,
    );
  }

  // =========================================================
  // Refresh Token
  // =========================================================

  private async generateRefreshToken(user: User): Promise<string> {
    const options: JwtSignOptions = {
      secret: this.getJwtSecret(),
      expiresIn: this.getRefreshExpiresIn(),
    };

    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        type: 'refresh',
      },
      options,
    );
  }

  // =========================================================
  // JWT Config
  // =========================================================

  private getJwtSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
    }

    return secret;
  }

  private getAccessExpiresIn(): JwtSignOptions['expiresIn'] {
    return this.configService.get<string>(
      'JWT_EXPIRES_IN',
      '15m',
    ) as JwtSignOptions['expiresIn'];
  }

  private getRefreshExpiresIn(): JwtSignOptions['expiresIn'] {
    return this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    ) as JwtSignOptions['expiresIn'];
  }

  // =========================================================
  // Cookie Names
  // =========================================================

  private getAccessCookieName(): string {
    return this.configService.get<string>('COOKIE_ACCESS_NAME', 'atkn');
  }

  getRefreshCookieName(): string {
    return this.configService.get<string>('COOKIE_REFRESH_NAME', 'rtkn');
  }

  // =========================================================
  // Access Cookie
  // =========================================================

  private getAccessCookieOptions() {

    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: this.useSecureCookies(),
      path: '/',
      maxAge: this.getAccessCookieMaxAge(),
    };
  }

  // =========================================================
  // Refresh Cookie
  // =========================================================

  private getRefreshCookieOptions() {

    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: this.useSecureCookies(),
      path: '/',
      maxAge: this.getRefreshCookieMaxAge(),
    };
  }

  private useSecureCookies(): boolean {
    const configured =
      this.configService.get<boolean | string>('COOKIE_SECURE');

    if (configured !== undefined) {
      return configured === true || configured === 'true';
    }

    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  // =========================================================
  // Cookie Expiration
  // =========================================================

  private getAccessCookieMaxAge(): number {
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '15m');

    return this.parseDurationToMs(expiresIn);
  }

  private getRefreshCookieMaxAge(): number {
    const expiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d',
    );

    return this.parseDurationToMs(expiresIn);
  }

  private parseDurationToMs(value: string): number {
    const match = value.trim().match(/^(\d+)(s|m|h|d|w)$/);

    if (!match) {
      throw new Error(`Invalid JWT duration: ${value}`);
    }

    const amount = Number(match[1]);

    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
      w: 7 * 24 * 60 * 60 * 1000,
    };

    return amount * multipliers[unit];
  }

  private assertOtpRequestRateLimit(email: string, requesterIp?: string): void {
    const windowMs =
      this.configService.get<number>('OTP_RATE_LIMIT_WINDOW_SECONDS', 15 * 60) *
      1000;
    const emailLimit = this.configService.get<number>(
      'OTP_RATE_LIMIT_EMAIL_MAX',
      3,
    );
    const ipLimit = this.configService.get<number>('OTP_RATE_LIMIT_IP_MAX', 10);

    this.assertRateLimit(`email:${email}`, emailLimit, windowMs);

    if (requesterIp) {
      this.assertRateLimit(`ip:${requesterIp}`, ipLimit, windowMs);
    }
  }

  private assertOtpVerificationRateLimit(
    email: string,
    requesterIp?: string,
  ): void {
    const windowMs =
      this.configService.get<number>('OTP_RATE_LIMIT_WINDOW_SECONDS', 15 * 60) *
      1000;
    const emailLimit = this.configService.get<number>(
      'OTP_VERIFY_RATE_LIMIT_EMAIL_MAX',
      5,
    );
    const ipLimit = this.configService.get<number>(
      'OTP_VERIFY_RATE_LIMIT_IP_MAX',
      20,
    );

    this.assertRateLimit(`verify-email:${email}`, emailLimit, windowMs);

    if (requesterIp) {
      this.assertRateLimit(`verify-ip:${requesterIp}`, ipLimit, windowMs);
    }
  }

  private assertRateLimit(key: string, limit: number, windowMs: number): void {
    const now = Date.now();
    const cutoff = now - windowMs;
    const recentRequests = (this.otpRequestWindows.get(key) ?? []).filter(
      (timestamp) => timestamp > cutoff,
    );

    if (recentRequests.length >= limit) {
      throw new HttpException(
        'Too many verification-code requests. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (
      this.otpRequestWindows.size >= 10_000 &&
      !this.otpRequestWindows.has(key)
    ) {
      const oldestKey = this.otpRequestWindows.keys().next().value as
        | string
        | undefined;
      if (oldestKey) {
        this.otpRequestWindows.delete(oldestKey);
      }
    }

    recentRequests.push(now);
    this.otpRequestWindows.set(key, recentRequests);
  }

  // =========================================================
  // Safe User
  // =========================================================

  private toSafeUser(user: User): SafeUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      professorId: user.professorId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
