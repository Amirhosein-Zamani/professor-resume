import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { PrismaService } from '../../../database';

interface JwtPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) {
      throw new Error('JWT_SECRET is not configured.');
    }

    const accessCookieName = configService.get<string>(
      'COOKIE_ACCESS_NAME',
      'atkn',
    );

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          const cookies = request.cookies as Record<string, string> | undefined;

          return cookies?.[accessCookieName] ?? null;
        },
      ]),

      ignoreExpiration: false,

      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    // فقط Access Token اجازه ورود به routeهای محافظت‌شده را دارد.
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid access token.');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true, professorId: true },
    });

    if (!user) {
      throw new UnauthorizedException('Authenticated user no longer exists.');
    }

    return user;
  }
}
