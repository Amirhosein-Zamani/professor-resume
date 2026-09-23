import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

type AuthenticatedRequest = Request & { user?: AuthenticatedUser };

@Injectable()
export class GolestanRateLimitGuard implements CanActivate {
  private readonly logger = new Logger(GolestanRateLimitGuard.name);
  private readonly attempts = new Map<string, number[]>();

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const windowMs =
      this.configService.get<number>(
        'GOLESTAN_RATE_LIMIT_WINDOW_SECONDS',
        300,
      ) * 1000;
    const limit = this.configService.get<number>('GOLESTAN_RATE_LIMIT_MAX', 5);
    const key =
      request.user?.id ??
      request.ip ??
      request.socket.remoteAddress ??
      'unknown';
    const now = Date.now();
    const recent = (this.attempts.get(key) ?? []).filter(
      (timestamp) => timestamp > now - windowMs,
    );

    if (recent.length >= limit) {
      this.logger.warn(
        `Blocked Golestan operation for actor=${key} path=${request.path}`,
      );
      throw new HttpException(
        'Too many Golestan operations. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    recent.push(now);
    this.attempts.set(key, recent);
    this.logger.log(
      `Golestan operation requested by actor=${key} method=${request.method} path=${request.path}`,
    );
    return true;
  }
}
