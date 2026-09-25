import { BadRequestException, ConflictException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { describe, expect, it, jest } from '@jest/globals';

import { UsersService } from './users.service';

function makeUser(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'user-1',
    email: 'user@example.com',
    role: UserRole.ADMIN,
    professorId: null,
    professor: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function createService() {
  const user = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  };
  const professor = { findFirst: jest.fn() };
  return {
    service: new UsersService({ user, professor } as never),
    user,
    professor,
  };
}

describe('UsersService', () => {
  it('prevents an administrator from changing their own role', async () => {
    const { service, user } = createService();
    user.findUnique.mockResolvedValue(makeUser());

    await expect(
      service.updateRole('user-1', UserRole.PROFESSOR, 'user-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('prevents demoting the last administrator', async () => {
    const { service, user } = createService();
    user.findUnique.mockResolvedValue(makeUser({ id: 'admin-2' }));
    user.count.mockResolvedValue(1);

    await expect(
      service.updateRole('admin-2', UserRole.PROFESSOR, 'admin-1'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates a normalized professor account linked by email', async () => {
    const { service, user, professor } = createService();
    const created = makeUser({
      id: 'professor-user-1',
      email: 'professor@example.com',
      role: UserRole.PROFESSOR,
      professorId: 'professor-1',
    });
    professor.findFirst.mockResolvedValue({ id: 'professor-1', user: null });
    user.create.mockResolvedValue(created);

    await expect(
      service.createUser({ email: ' Professor@Example.com ' }),
    ).resolves.toEqual(created);
    expect(professor.findFirst).toHaveBeenCalledWith({
      where: {
        email: { equals: 'professor@example.com', mode: 'insensitive' },
      },
      select: { id: true, user: { select: { id: true } } },
    });
    expect(user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'professor@example.com',
          role: UserRole.PROFESSOR,
          professorId: 'professor-1',
        }),
      }),
    );
  });

  it('rejects a professor account when no profile has the same email', async () => {
    const { service, professor } = createService();
    professor.findFirst.mockResolvedValue(null);

    await expect(
      service.createUser({ email: 'missing@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
