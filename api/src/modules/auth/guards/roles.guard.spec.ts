import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { describe, expect, it, jest } from '@jest/globals';
import { RolesGuard } from './roles.guard';

function contextFor(role: UserRole): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user: { role } }),
    }),
    getHandler: () => function handler() {},
    getClass: () => class Controller {},
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  it('allows a user with a required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn(() => [UserRole.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(contextFor(UserRole.ADMIN))).toBe(true);
  });

  it('rejects a user without the required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn(() => [UserRole.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(() => guard.canActivate(contextFor(UserRole.EDITOR))).toThrow(
      ForbiddenException,
    );
  });
});
