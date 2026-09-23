import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FacultyIconStorageService } from './faculty-icon-storage.service';

const MOJIBAKE_PATTERN =
  /[\u00d8\u00d9\u00da\u00db\u00c3\u0152\u0153\u02dc\u0161\u00a1\u00a2]/;

@Injectable()
export class FacultiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly iconStorage: FacultyIconStorageService,
  ) {}

  async listFaculties() {
    const faculties = await this.prisma.faculty.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { professors: true },
        },
      },
    });

    return faculties
      .filter((faculty) => !MOJIBAKE_PATTERN.test(faculty.name))
      .map((faculty) => this.toResponse(faculty));
  }

  async createFaculty(dto: CreateFacultyDto, iconFile?: Express.Multer.File) {
    const iconUrl = iconFile ? this.iconStorage.saveIcon(iconFile) : null;

    try {
      const faculty = await this.prisma.faculty.create({
        data: {
          name: dto.name,
          iconUrl,
        },
        include: {
          _count: {
            select: { professors: true },
          },
        },
      });

      return this.toResponse(faculty);
    } catch (error) {
      this.iconStorage.deleteIconIfExists(iconUrl);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Faculty name already exists.');
      }

      throw error;
    }
  }

  async updateFaculty(
    id: string,
    dto: UpdateFacultyDto,
    iconFile?: Express.Multer.File,
  ) {
    const existing = await this.prisma.faculty.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Faculty not found.');
    }

    const newIconUrl = iconFile
      ? this.iconStorage.saveIcon(iconFile)
      : existing.iconUrl;

    try {
      const faculty = await this.prisma.faculty.update({
        where: { id },
        data: {
          name: dto.name,
          iconUrl: newIconUrl,
        },
        include: {
          _count: {
            select: { professors: true },
          },
        },
      });

      if (iconFile) {
        this.iconStorage.deleteIconIfExists(existing.iconUrl);
      }

      return this.toResponse(faculty);
    } catch (error) {
      if (iconFile) {
        this.iconStorage.deleteIconIfExists(newIconUrl);
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Faculty not found.');
        }

        if (error.code === 'P2002') {
          throw new ConflictException('Faculty name already exists.');
        }
      }

      throw error;
    }
  }

  async deleteFaculty(id: string) {
    const existing = await this.prisma.faculty.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Faculty not found.');
    }

    const professorCount = await this.prisma.professor.count({
      where: { facultyId: id },
    });

    if (professorCount > 0) {
      throw new ConflictException(
        `برای این دانشکده ${professorCount} استاد ثبت شده است و امکان حذف آن وجود ندارد.`,
      );
    }

    try {
      const faculty = await this.prisma.faculty.delete({
        where: { id },
      });

      this.iconStorage.deleteIconIfExists(existing.iconUrl);

      return {
        ...faculty,
        professorCount: 0,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Faculty not found.');
        }

        if (error.code === 'P2003') {
          throw new ConflictException(
            'Faculty cannot be deleted while it has professors.',
          );
        }
      }

      throw error;
    }
  }

  private toResponse<T extends { _count: { professors: number } }>(faculty: T) {
    const { _count, ...data } = faculty;

    return {
      ...data,
      professorCount: _count.professors,
    };
  }
}
