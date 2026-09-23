import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { PrismaService } from '../../database';
import { CreateUserDto } from './dto/create-user.dto';

const managedUserQuery = {
  include: {
    professor: {
      select: {
        id: true,
        displayName: true,
      },
    },
  },
} satisfies Prisma.UserDefaultArgs;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  listUsers() {
    return this.prisma.user.findMany({
      ...managedUserQuery,
      orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async createUser(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();

    if (dto.professorId) {
      const [professor, assignedUser] = await Promise.all([
        this.prisma.professor.findUnique({
          where: { id: dto.professorId },
          select: { id: true },
        }),
        this.prisma.user.findUnique({
          where: { professorId: dto.professorId },
          select: { id: true },
        }),
      ]);

      if (!professor) {
        throw new BadRequestException('پروفایل استاد انتخاب‌شده وجود ندارد.');
      }

      if (assignedUser) {
        throw new ConflictException(
          'پروفایل استاد انتخاب‌شده قبلاً به یک حساب متصل است.',
        );
      }
    }

    try {
      return await this.prisma.user.create({
        data: {
          email,
          role: dto.role ?? UserRole.EDITOR,
          professorId: dto.professorId ?? null,
        },
        ...managedUserQuery,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('این ایمیل قبلاً در سامانه ثبت شده است.');
      }

      throw error;
    }
  }

  async updateRole(id: string, role: UserRole, currentAdminId: string) {
    const existing = await this.prisma.user.findUnique({
      where: { id },
      ...managedUserQuery,
    });

    if (!existing) {
      throw new NotFoundException('کاربر پیدا نشد.');
    }

    if (existing.id === currentAdminId && existing.role !== role) {
      throw new BadRequestException(
        'برای جلوگیری از قطع دسترسی، نمی‌توانید نقش حساب فعلی خود را تغییر دهید.',
      );
    }

    if (existing.role === role) {
      return existing;
    }

    if (existing.role === UserRole.ADMIN && role !== UserRole.ADMIN) {
      const adminCount = await this.prisma.user.count({
        where: { role: UserRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new ConflictException('نقش آخرین مدیر سامانه قابل تغییر نیست.');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      ...managedUserQuery,
    });
  }
}
