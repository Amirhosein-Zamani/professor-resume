import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  Professor,
  ProfessorActivity,
  ProfessorLink,
  Publication,
  UserRole,
} from '@prisma/client';
import { PrismaService } from '../../../database';
import { OtpService } from '../../auth/services/otp.service';
import { CreateProfessorActivityDto } from '../dto/create-professor-activity.dto';
import { CreateProfessorDto } from '../dto/create-professor.dto';
import { ListProfessorsQueryDto } from '../dto/list-professors-query.dto';
import { UpsertProfessorLinksDto } from '../dto/professor-links.dto';
import { UpdateProfessorActivityDto } from '../dto/update-professor-activity.dto';
import { UpdateProfessorDto } from '../dto/update-professor.dto';
import { CvStorageService } from './CvStorage.service';

const professorInclude = {
  links: true,
  facultyRecord: {
    select: { name: true },
  },
  activities: {
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  },
  publications: {
    orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
  },
} satisfies Prisma.ProfessorInclude;

const professorListInclude = {
  links: true,
  facultyRecord: {
    select: { name: true },
  },
} satisfies Prisma.ProfessorInclude;

type ProfessorWithRelations = Prisma.ProfessorGetPayload<{
  include: typeof professorInclude;
}>;

type ProfessorListEntity = Prisma.ProfessorGetPayload<{
  include: typeof professorListInclude;
}>;

@Injectable()
export class ProfessorsService {
  private readonly logger = new Logger(ProfessorsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cvStorageService: CvStorageService,
    private readonly otpService: OtpService,
  ) {}

  async listProfessors(query: ListProfessorsQueryDto = {}) {
    const filters: Prisma.ProfessorWhereInput[] = [];

    if (query.name) {
      filters.push({
        OR: [
          {
            displayName: {
              contains: query.name,
              mode: 'insensitive',
            },
          },
          {
            firstName: {
              contains: query.name,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: query.name,
              mode: 'insensitive',
            },
          },
        ],
      });
    }

    if (query.faculty) {
      filters.push({
        facultyRecord: {
          name: {
            contains: query.faculty,
            mode: 'insensitive',
          },
        },
      });
    }

    if (query.group) {
      filters.push({
        researchGroupName: {
          contains: query.group,
          mode: 'insensitive',
        },
      });
    }

    const professors = await this.prisma.professor.findMany({
      where: filters.length > 0 ? { AND: filters } : undefined,
      include: professorListInclude,
      orderBy: [{ displayName: 'asc' }],
    });

    return professors.map((professor) => this.toProfessorListItem(professor));
  }

  async getProfessorByIdOrSlug(idOrSlug: string) {
    const professor = await this.findProfessorOrThrow(idOrSlug);
    return this.toProfessorDetail(professor);
  }

  async getProfessorActivities(idOrSlug: string) {
    const professor = await this.findProfessorOrThrow(idOrSlug);
    return {
      professorId: professor.id,
      slug: professor.slug,
      displayName: professor.displayName,
      activities: professor.activities.map((activity) =>
        this.toActivityResponse(activity),
      ),
    };
  }

  async createProfessor(dto: CreateProfessorDto, cvFile?: Express.Multer.File) {
    const faculty = await this.findFacultyOrThrow(dto.facultyId);
    await this.ensureLoginEmailAvailable(dto.email);
    const cvUrl = cvFile ? this.cvStorageService.saveCv(cvFile) : undefined;

    try {
      const professor: ProfessorWithRelations =
        await this.prisma.professor.create({
          data: this.toProfessorCreateData(dto, faculty.name, cvUrl),
          include: professorInclude,
        });

      // اگر پروفسور ایمیل داشته باشد، همزمان یک یوزر EDITOR برایش
      // ساخته و متصل می‌شود و یک کد OTP برای ورود اولیه برایش ارسال می‌شود.
      await this.createEditorUserForProfessor(professor);

      return this.toProfessorDetail(professor);
    } catch (error) {
      if (cvUrl) {
        this.cvStorageService.deleteCvIfExists(cvUrl);
      }
      this.handlePrismaConflict(error);
    }
  }

  async updateProfessor(
    id: string,
    dto: UpdateProfessorDto,
    cvFile?: Express.Multer.File,
  ) {
    const existing = await this.prisma.professor.findUnique({
      where: { id },
      select: { id: true, cvUrl: true, email: true },
    });

    if (!existing) {
      throw new NotFoundException('Professor not found.');
    }

    if (dto.email && dto.email !== existing.email) {
      await this.ensureLoginEmailAvailable(dto.email, id);
    }

    const faculty = dto.facultyId
      ? await this.findFacultyOrThrow(dto.facultyId)
      : undefined;
    const newCvUrl = cvFile ? this.cvStorageService.saveCv(cvFile) : undefined;

    try {
      const professor: ProfessorWithRelations =
        await this.prisma.professor.update({
          where: { id },
          data: this.toProfessorUpdateData(dto, faculty?.name, newCvUrl),
          include: professorInclude,
        });

      if (newCvUrl && existing.cvUrl) {
        this.cvStorageService.deleteCvIfExists(existing.cvUrl);
      }

      // اگر ایمیل پروفسور تغییر کرده یا برای اولین‌بار ثبت شده،
      // یوزر EDITOR مرتبط را هم به‌روزرسانی/ایجاد می‌کنیم.
      if (professor.email && professor.email !== existing.email) {
        await this.prisma.user.deleteMany({
          where: {
            professorId: professor.id,
            role: UserRole.EDITOR,
            email: { not: professor.email.toLowerCase().trim() },
          },
        });
        await this.createEditorUserForProfessor(professor);
      }

      return this.toProfessorDetail(professor);
    } catch (error) {
      if (newCvUrl) {
        this.cvStorageService.deleteCvIfExists(newCvUrl);
      }
      this.handlePrismaConflict(error);
    }
  }

  async deleteProfessor(id: string) {
    const existing = await this.prisma.professor.findUnique({
      where: { id },
      select: { id: true, cvUrl: true },
    });

    if (!existing) {
      throw new NotFoundException('Professor not found.');
    }

    await this.prisma.$transaction([
      this.prisma.user.deleteMany({
        where: {
          professorId: id,
          role: UserRole.EDITOR,
        },
      }),
      this.prisma.professor.delete({
        where: { id },
      }),
    ]);

    this.cvStorageService.deleteCvIfExists(existing.cvUrl);

    return { success: true };
  }

  async createActivity(professorId: string, dto: CreateProfessorActivityDto) {
    await this.ensureProfessorExistsById(professorId);

    const activity = await this.prisma.professorActivity.create({
      data: this.toActivityCreateData(professorId, dto),
    });

    return this.toActivityResponse(activity);
  }

  async updateActivity(
    professorId: string,
    activityId: string,
    dto: UpdateProfessorActivityDto,
  ) {
    await this.ensureProfessorExistsById(professorId);
    await this.ensureActivityBelongsToProfessor(professorId, activityId);

    const activity = await this.prisma.professorActivity.update({
      where: { id: activityId },
      data: this.toActivityUpdateData(dto),
    });

    return this.toActivityResponse(activity);
  }

  async deleteActivity(professorId: string, activityId: string) {
    await this.ensureProfessorExistsById(professorId);
    await this.ensureActivityBelongsToProfessor(professorId, activityId);

    await this.prisma.professorActivity.delete({
      where: { id: activityId },
    });

    return { success: true };
  }

  async upsertLinks(professorId: string, dto: UpsertProfessorLinksDto) {
    await this.ensureProfessorExistsById(professorId);

    const links = await this.prisma.professorLink.upsert({
      where: { professorId },
      create: {
        professorId,
        ...this.toLinksData(dto),
      },
      update: this.toLinksData(dto),
    });

    return this.toLinksResponse(links);
  }

  /**
   * یک یوزر با نقش EDITOR برای پروفسور می‌سازد (اگر از قبل وجود نداشته باشد)
   * و آن را به رکورد پروفسور متصل می‌کند، سپس یک کد OTP برای ورود اولیه
   * به ایمیل او ارسال می‌کند. اگر یوزری با این ایمیل از قبل وجود داشته
   * باشد، فقط به پروفسور متصل و نقشش EDITOR می‌شود (بدون overwrite نقش ADMIN
   * موجود در صورتی که از قبل ADMIN بوده — این را عمداً دست‌نخورده می‌گذاریم،
   * پایین توضیح داده شده).
   */
  private async createEditorUserForProfessor(
    professor: Pick<Professor, 'id' | 'email'>,
  ): Promise<void> {
    if (!professor.email) {
      return;
    }

    const email = professor.email.toLowerCase().trim();

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        if (
          existingUser.role === UserRole.EDITOR &&
          existingUser.professorId !== professor.id
        ) {
          await this.prisma.user.update({
            where: { id: existingUser.id },
            data: { professorId: professor.id },
          });
        }
      } else {
        await this.prisma.user.create({
          data: {
            email,
            role: UserRole.EDITOR,
            professorId: professor.id,
          },
        });
      }

      const otp = await this.otpService.generateOtp(email);
      await this.otpService.sendOtpEmail(email, otp);
    } catch (error) {
      // ساخت/ارسال OTP نباید باعث fail شدن کل عملیات ساخت پروفسور شود؛
      // فقط لاگ می‌کنیم تا بعدا قابل بررسی باشد.
      this.logger.error(
        `Failed to create editor user or send OTP for professor email ${email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private async ensureLoginEmailAvailable(
    email?: string,
    professorId?: string,
  ): Promise<void> {
    if (!email) return;

    const existingUser = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { professorId: true },
    });

    if (existingUser && existingUser.professorId !== professorId) {
      throw new ConflictException(
        'This email is already assigned to another login account.',
      );
    }
  }

  private async findProfessorOrThrow(idOrSlug: string) {
    const professor = await this.prisma.professor.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: professorInclude,
    });

    if (!professor) {
      throw new NotFoundException('Professor not found.');
    }

    return professor;
  }

  private async ensureProfessorExistsById(id: string): Promise<void> {
    const professor = await this.prisma.professor.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!professor) {
      throw new NotFoundException('Professor not found.');
    }
  }

  private async ensureActivityBelongsToProfessor(
    professorId: string,
    activityId: string,
  ): Promise<void> {
    const activity = await this.prisma.professorActivity.findFirst({
      where: { id: activityId, professorId },
      select: { id: true },
    });

    if (!activity) {
      throw new NotFoundException('Professor activity not found.');
    }
  }

  private toProfessorCreateData(
    dto: CreateProfessorDto,
    facultyName: string,
    cvUrl?: string,
  ): Prisma.ProfessorCreateInput {
    return {
      slug: dto.slug,
      firstName: dto.firstName,
      lastName: dto.lastName,
      displayName: dto.displayName,
      nationalCode: dto.nationalCode,
      rank: dto.rank,
      faculty: facultyName,
      facultyRecord: this.toFacultyRelationInput(dto.facultyId),
      specialty: dto.specialty,
      isFaculty: dto.isFaculty,
      avatar: dto.avatar,
      email: dto.email,
      cvUrl,
      bio: dto.bio,
      golestanProfessorNo: dto.golestanProfessorNo,
      employeeNo: dto.employeeNo,
      studentNo: dto.studentNo,
      facultyName,
      researchGroupName: dto.researchGroupName,
      organizationName: dto.organizationName,
      links: dto.links
        ? {
            create: this.toLinksData(dto.links),
          }
        : undefined,
    };
  }

  private toProfessorUpdateData(
    dto: UpdateProfessorDto,
    facultyName?: string,
    cvUrl?: string,
  ): Prisma.ProfessorUpdateInput {
    return {
      slug: dto.slug,
      firstName: dto.firstName,
      lastName: dto.lastName,
      displayName: dto.displayName,
      nationalCode: dto.nationalCode,
      rank: dto.rank,
      faculty: facultyName,
      facultyRecord: dto.facultyId
        ? this.toFacultyRelationInput(dto.facultyId)
        : undefined,
      specialty: dto.specialty,
      isFaculty: dto.isFaculty,
      avatar: dto.avatar,
      email: dto.email,
      cvUrl,
      bio: dto.bio,
      golestanProfessorNo: dto.golestanProfessorNo,
      employeeNo: dto.employeeNo,
      studentNo: dto.studentNo,
      facultyName,
      researchGroupName: dto.researchGroupName,
      organizationName: dto.organizationName,
      links: dto.links
        ? {
            upsert: {
              create: this.toLinksData(dto.links),
              update: this.toLinksData(dto.links),
            },
          }
        : undefined,
    };
  }

  private toLinksData(
    dto: UpsertProfessorLinksDto,
  ): Prisma.ProfessorLinkUncheckedCreateWithoutProfessorInput {
    return {
      scholar: dto.scholar,
      researchgate: dto.researchgate,
      scopus: dto.scopus,
      website: dto.website,
    };
  }

  private toFacultyRelationInput(
    facultyId: string,
  ): Prisma.FacultyCreateNestedOneWithoutProfessorsInput {
    return {
      connect: {
        id: facultyId,
      },
    };
  }

  private async findFacultyOrThrow(facultyId: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id: facultyId },
      select: { id: true, name: true },
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found.');
    }

    return faculty;
  }

  private toActivityCreateData(
    professorId: string,
    dto: CreateProfessorActivityDto,
  ): Prisma.ProfessorActivityUncheckedCreateInput {
    return {
      professorId,
      sourceId: dto.sourceId,
      type: dto.type,
      titleFa: dto.titleFa,
      titleEn: dto.titleEn,
      description: dto.description,
      date: dto.date ? new Date(dto.date) : undefined,
      sortOrder: dto.sortOrder,
    } satisfies Prisma.ProfessorActivityUncheckedCreateInput;
  }

  private toActivityUpdateData(
    dto: UpdateProfessorActivityDto,
  ): Prisma.ProfessorActivityUpdateInput {
    return {
      sourceId: dto.sourceId,
      type: dto.type,
      titleFa: dto.titleFa,
      titleEn: dto.titleEn,
      description: dto.description,
      date: dto.date ? new Date(dto.date) : undefined,
      sortOrder: dto.sortOrder,
    };
  }

  private toProfessorListItem(professor: ProfessorListEntity) {
    const facultyName = professor.facultyRecord.name;

    return {
      id: professor.id,
      slug: professor.slug,
      name: professor.displayName,
      displayName: professor.displayName,
      firstName: professor.firstName,
      lastName: professor.lastName,
      rank: professor.rank,
      facultyId: professor.facultyId,
      faculty: facultyName,
      specialty: professor.specialty,
      researchGroupName: professor.researchGroupName,
      isFaculty: professor.isFaculty,
      avatar: professor.avatar,
      email: professor.email,
      bio: professor.bio,
      links: this.toLinksResponse(professor.links),
    };
  }

  private toProfessorDetail(professor: ProfessorWithRelations) {
    const facultyName = professor.facultyRecord.name;
    const papers = professor.activities.filter(
      (activity) => activity.type === 'مقاله علمی',
    ).length;
    const theses = professor.activities.filter(
      (activity) => activity.type === 'پایان نامه / رساله',
    ).length;
    const conferences = professor.activities.filter(
      (activity) => activity.type === 'همایش',
    ).length;
    const books = professor.activities.filter(
      (activity) => activity.type === 'کتاب',
    ).length;

    return {
      id: professor.id,
      slug: professor.slug,
      name: professor.displayName,
      displayName: professor.displayName,
      firstName: professor.firstName,
      lastName: professor.lastName,
      nationalCode: professor.nationalCode,
      rank: professor.rank,
      facultyId: professor.facultyId,
      faculty: facultyName,
      specialty: professor.specialty,
      isFaculty: professor.isFaculty,
      avatar: professor.avatar,
      email: professor.email,
      cvUrl: professor.cvUrl,
      bio: professor.bio,
      golestanProfessorNo: professor.golestanProfessorNo,
      employeeNo: professor.employeeNo,
      studentNo: professor.studentNo,
      facultyName,
      researchGroupName: professor.researchGroupName,
      organizationName: professor.organizationName,
      links: this.toLinksResponse(professor.links),
      stats: {
        theses,
        papers,
        conferences,
        books,
      },
      publications: professor.publications.map((publication) =>
        this.toPublicationResponse(publication),
      ),
      activities: professor.activities.map((activity) =>
        this.toActivityResponse(activity),
      ),
      createdAt: professor.createdAt,
      updatedAt: professor.updatedAt,
    };
  }

  private toLinksResponse(links: ProfessorLink | null) {
    return {
      scholar: links?.scholar ?? null,
      researchgate: links?.researchgate ?? null,
      scopus: links?.scopus ?? null,
      website: links?.website ?? null,
    };
  }

  private toActivityResponse(activity: ProfessorActivity) {
    return {
      id: activity.id,
      sourceId: activity.sourceId,
      type: activity.type,
      titleFa: activity.titleFa,
      titleEn: activity.titleEn,
      description: activity.description,
      date: activity.date,
      sortOrder: activity.sortOrder,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    };
  }

  private toPublicationResponse(publication: Publication) {
    return {
      id: publication.id,
      title: publication.title,
      journal: publication.journal,
      year: publication.year,
      authors: publication.authors,
      doi: publication.doi,
      golestanArticleNo: publication.golestanArticleNo,
      printPlace: publication.printPlace,
      language: publication.language,
      journalArticleType: publication.journalArticleType,
      latinJournalOrConfTitle: publication.latinJournalOrConfTitle,
      persianJournalOrConfTitle: publication.persianJournalOrConfTitle,
      activityRegisteredAt: publication.activityRegisteredAt,
    };
  }

  private handlePrismaConflict(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'A record with one of these unique fields already exists.',
      );
    }

    throw error;
  }
}
