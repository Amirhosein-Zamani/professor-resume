import { Injectable, NotFoundException } from '@nestjs/common';
import { FormSchema, FormTarget, Prisma } from '@prisma/client';
import { PrismaService } from '../../../database';
import { FormFieldDto } from '../dto/form-schema.dto';
import { UpsertFormSchemaDto } from '../dto/upsert-form-schema.dto';

@Injectable()
export class FormSchemaService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllForms() {
    const forms = await this.prisma.formSchema.findMany({
      orderBy: { target: 'asc' },
    });

    return forms.map((form) => this.toResponse(form));
  }

  async getFormByTarget(target: FormTarget) {
    const form = await this.prisma.formSchema.findUnique({
      where: { target },
    });

    if (!form) {
      throw new NotFoundException(
        `Form schema for target "${target}" not found.`,
      );
    }

    return this.toResponse(form);
  }

  async upsertForm(dto: UpsertFormSchemaDto) {
    const form = await this.prisma.formSchema.upsert({
      where: { target: dto.target },
      create: {
        target: dto.target,
        title: dto.title,
        schema: dto.schema as unknown as Prisma.InputJsonArray,
      },
      update: {
        title: dto.title,
        schema: dto.schema as unknown as Prisma.InputJsonArray,
      },
    });

    return this.toResponse(form);
  }

  private toResponse(form: FormSchema) {
    return {
      id: form.id,
      target: form.target,
      title: form.title,
      schema: (form.schema as unknown as FormFieldDto[]) ?? [],
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
    };
  }
}
