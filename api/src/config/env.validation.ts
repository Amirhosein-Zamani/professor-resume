import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(4000),

  WEB_ORIGIN: Joi.string().uri().required(),

  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  COOKIE_ACCESS_NAME: Joi.string().default('atkn'),
  COOKIE_REFRESH_NAME: Joi.string().default('rtkn'),
  COOKIE_SECURE: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .optional(),
  OTP_HASH_SECRET: Joi.string().min(32).optional(),
  OTP_RESEND_COOLDOWN_SECONDS: Joi.number().integer().min(10).default(60),
  OTP_RATE_LIMIT_WINDOW_SECONDS: Joi.number().integer().min(60).default(900),
  OTP_RATE_LIMIT_EMAIL_MAX: Joi.number().integer().min(1).default(3),
  OTP_RATE_LIMIT_IP_MAX: Joi.number().integer().min(1).default(10),
  OTP_VERIFY_RATE_LIMIT_EMAIL_MAX: Joi.number().integer().min(1).default(5),
  OTP_VERIFY_RATE_LIMIT_IP_MAX: Joi.number().integer().min(1).default(20),
  GOLESTAN_RATE_LIMIT_WINDOW_SECONDS: Joi.number()
    .integer()
    .min(60)
    .default(300),
  GOLESTAN_RATE_LIMIT_MAX: Joi.number().integer().min(1).default(5),
  SMTP_HOST: Joi.string().hostname().required(),
  SMTP_PORT: Joi.number().port().required(),
  SMTP_SECURE: Joi.string()
    .valid('true', 'false', 'ssl', 'tls', 'starttls', 'STARTTLS')
    .default('false'),
  SMTP_USER: Joi.string().email().required(),
  SMTP_PASS: Joi.string().min(1).required(),
  SMTP_FROM: Joi.string().email().optional(),

  GOLESTAN_BASE_URL: Joi.string().allow('').optional(),
  GOLESTAN_LOGIN: Joi.string().allow('').optional(),
  GOLESTAN_PASS: Joi.string().allow('').optional(),
  GOLESTAN_SEC: Joi.string().allow('').optional(),
});
