// lib/validations/professorSchema.ts

import { z } from "zod";

// Validation برای لینک‌ها
export const professorLinksSchema = z.object({
  scholar: z.string().url("لینک Google Scholar معتبر نیست").optional().or(z.literal("")),
  researchgate: z.string().url("لینک ResearchGate معتبر نیست").optional().or(z.literal("")),
  scopus: z.string().url("لینک Scopus معتبر نیست").optional().or(z.literal("")),
  website: z.string().url("لینک وب‌سایت معتبر نیست").optional().or(z.literal("")),
}).partial();

// Validation برای استاد
export const professorSchema = z.object({
  slug: z.string().min(1, "Slug الزامی است"),
  firstName: z.string().min(1, "نام الزامی است"),
  lastName: z.string().min(1, "نام خانوادگی الزامی است"),
  displayName: z.string().min(1, "نام نمایشی الزامی است"),
  nationalCode: z.string().optional(),
  rank: z.string().min(1, "مرتبه علمی الزامی است"),
  facultyId: z.string().uuid("دانشکده انتخاب‌شده معتبر نیست"),
  specialty: z.string().optional(),
  isFaculty: z.boolean().default(true),
  avatar: z.string().min(1, "تصویر پروفایل الزامی است"),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  cvUrl: z.string().optional(),
  bio: z.string().optional(),
  golestanProfessorNo: z.string().optional(),
  employeeNo: z.string().optional(),
  studentNo: z.string().optional(),
  facultyName: z.string().optional(),
  researchGroupName: z.string().optional(),
  organizationName: z.string().optional(),
  links: professorLinksSchema.optional(),
});

// Validation برای فعالیت
export const activitySchema = z.object({
  type: z.string().min(1, "نوع فعالیت الزامی است"),
  titleFa: z.string().min(1, "عنوان فارسی الزامی است"),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  sortOrder: z.number().optional(),
});

// تابع validation پویا بر اساس target
export const getValidationSchema = (target: "PROFESSOR" | "ACTIVITY") => {
  switch (target) {
    case "PROFESSOR":
      return professorSchema;
    case "ACTIVITY":
      return activitySchema;
    default:
      return z.object({});
  }
};

type DynamicField = {
  key: string;
  type: string;
  label: string;
  required?: boolean;
  validation?: {
    isEmail?: boolean;
    isUrl?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    isBase64Image?: boolean;
    isBoolean?: boolean;
  };
};

function createStringFieldSchema(field: DynamicField): z.ZodType<unknown> {
  let validator = z.string();

  if (field.type === "email" || field.validation?.isEmail) {
    validator = validator.email(`${field.label} معتبر نیست`);
  }
  if (field.type === "url" || field.validation?.isUrl) {
    validator = validator.url(`${field.label} معتبر نیست`);
  }
  if (field.validation?.minLength !== undefined) {
    validator = validator.min(
      field.validation.minLength,
      `${field.label} باید حداقل ${field.validation.minLength} کاراکتر باشد`,
    );
  }
  if (field.validation?.maxLength !== undefined) {
    validator = validator.max(
      field.validation.maxLength,
      `${field.label} باید حداکثر ${field.validation.maxLength} کاراکتر باشد`,
    );
  }
  if (field.validation?.pattern) {
    validator = validator.regex(
      new RegExp(field.validation.pattern),
      `${field.label} معتبر نیست`,
    );
  }
  if (field.validation?.isBase64Image) {
    validator = validator.regex(
      /^[A-Za-z0-9+/]+={0,2}$/,
      `${field.label} معتبر نیست`,
    );
  }

  return field.required
    ? validator.min(1, `${field.label} الزامی است`)
    : validator.optional().or(z.literal(""));
}

// تابع برای ساخت schema از فیلدهای داینامیک
export const createDynamicSchema = (fields: DynamicField[]) => {
  const shape: Record<string, z.ZodType<unknown>> = {};

  fields.forEach((field) => {
    if (field.type === "checkbox" || field.validation?.isBoolean) {
      shape[field.key] = field.required
        ? z.boolean().refine((value) => value, {
            message: `${field.label} الزامی است`,
          })
        : z.boolean().optional();
      return;
    }

    if (field.type === "file" || field.type === "image") {
      const fileValidator = z.unknown();
      shape[field.key] = field.required
        ? fileValidator.refine(
            (value) => value !== undefined && value !== null && value !== "",
            { message: `${field.label} الزامی است` },
          )
        : fileValidator.optional();
      return;
    }

    if (field.type === "number") {
      shape[field.key] = field.required
        ? z.coerce.number()
        : z.union([z.literal(""), z.undefined(), z.coerce.number()]);
      return;
    }

    shape[field.key] = createStringFieldSchema(field);
  });

  return z.object(shape);
};
