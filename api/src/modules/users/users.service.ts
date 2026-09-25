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
    const role = dto.role ?? UserRole.PROFESSOR;
    const professorId =
      role === UserRole.PROFESSOR
        ? await this.findProfessorIdByEmail(email)
        : null;

    try {
      return await this.prisma.user.create({
        data: {
          email,
          role,
          professorId,
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
        throw new ConflictException('نقش آخرین مدیرکل قابل تغییر نیست.');
      }
    }

    const professorId =
      role === UserRole.PROFESSOR
        ? existing.professorId ??
          (await this.findProfessorIdByEmail(existing.email, existing.id))
        : existing.professorId;

    return this.prisma.user.update({
      where: { id },
      data: { role, professorId },
      ...managedUserQuery,
    });
  }

  private async findProfessorIdByEmail(
    email: string,
    assignedUserId?: string,
  ): Promise<string> {
    const professor = await this.prisma.professor.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        user: { select: { id: true } },
      },
    });

    if (!professor) {
      throw new BadRequestException(
        'برای نقش استاد، ابتدا باید پروفایل استادی با همین ایمیل ایجاد شود.',
      );
    }

    if (professor.user && professor.user.id !== assignedUserId) {
      throw new ConflictException(
        'پروفایل استاد با این ایمیل قبلاً به حساب دیگری متصل است.',
      );
    }

    return professor.id;
  }
}
