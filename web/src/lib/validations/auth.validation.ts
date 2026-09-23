import { z } from "zod";

export const requestOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ایمیل الزامی است.")
    .email("ایمیل معتبر نیست."),
});

export type RequestOtpSchema = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ایمیل الزامی است.")
    .email("ایمیل معتبر نیست."),

  code: z
    .string()
    .length(6, "کد باید ۶ رقمی باشد.")
    .regex(/^\d+$/, "کد باید عدد باشد."),
});

export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ایمیل الزامی است.")
    .email("ایمیل معتبر نیست."),

  password: z
    .string()
    .min(1, "رمز عبور الزامی است.")
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
