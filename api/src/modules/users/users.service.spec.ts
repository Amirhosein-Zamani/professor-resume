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
  const professor = { findUnique: jest.fn() };
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
      service.updateRole('user-1', UserRole.EDITOR, 'user-1'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('prevents demoting the last administrator', async () => {
    const { service, user } = createService();
    user.findUnique.mockResolvedValue(makeUser({ id: 'admin-2' }));
    user.count.mockResolvedValue(1);

    await expect(
      service.updateRole('admin-2', UserRole.EDITOR, 'admin-1'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates a normalized editor account', async () => {
    const { service, user } = createService();
    const created = makeUser({
      id: 'editor-1',
      email: 'editor@example.com',
      role: UserRole.EDITOR,
    });
    user.create.mockResolvedValue(created);

    await expect(
      service.createUser({ email: ' Editor@Example.com ' }),
    ).resolves.toEqual(created);
    expect(user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'editor@example.com',
          role: UserRole.EDITOR,
        }),
      }),
    );
  });
});
