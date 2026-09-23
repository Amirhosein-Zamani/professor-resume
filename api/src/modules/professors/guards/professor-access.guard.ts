import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

type ProfessorRequest = Request & {
  user?: AuthenticatedUser;
};

@Injectable()
export class ProfessorAccessGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<ProfessorRequest>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication is required.');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const professorId = request.params.id;

    if (
      user.role === UserRole.EDITOR &&
      user.professorId &&
      professorId === user.professorId
    ) {
      return true;
    }

    throw new ForbiddenException(
      'Editors can only modify their own professor profile.',
    );
  }
}
