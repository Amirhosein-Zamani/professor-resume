import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { describe, expect, it } from '@jest/globals';
import { ProfessorAccessGuard } from './professor-access.guard';

function contextFor(
  role: UserRole,
  professorId: string | null,
  routeProfessorId: string,
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        user: { role, professorId },
        params: { id: routeProfessorId },
      }),
    }),
  } as unknown as ExecutionContext;
}

describe('ProfessorAccessGuard', () => {
  const guard = new ProfessorAccessGuard();

  it('allows administrators to modify any professor', () => {
    expect(guard.canActivate(contextFor(UserRole.ADMIN, null, 'p-2'))).toBe(
      true,
    );
  });

  it('allows an editor to modify only the linked professor', () => {
    expect(guard.canActivate(contextFor(UserRole.EDITOR, 'p-1', 'p-1'))).toBe(
      true,
    );
  });

  it('rejects an editor attempting to modify another professor', () => {
    expect(() =>
      guard.canActivate(contextFor(UserRole.EDITOR, 'p-1', 'p-2')),
    ).toThrow(ForbiddenException);
  });
});
