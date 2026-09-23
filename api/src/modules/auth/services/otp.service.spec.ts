import { ConfigService } from '@nestjs/config';
import { describe, expect, it, jest } from '@jest/globals';
import { OtpService } from './otp.service';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: jest.fn() })),
}));

function createService() {
  const otpStore = {
    findUnique: jest.fn<() => Promise<null>>().mockResolvedValue(null),
    upsert: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
    update: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };
  const prisma = { otp: otpStore };
  const config = {
    get: jest.fn((key: string, defaultValue?: unknown) => {
      const values: Record<string, unknown> = {
        JWT_SECRET: 'a-test-secret-that-is-long-enough-for-hmac',
        OTP_RESEND_COOLDOWN_SECONDS: 60,
      };

      return values[key] ?? defaultValue;
    }),
  };

  return {
    service: new OtpService(
      prisma as never,
      config as unknown as ConfigService,
    ),
    otpStore,
  };
}

describe('OtpService', () => {
  it('stores a hash instead of the six-digit OTP', async () => {
    const { service, otpStore } = createService();
    const otp = await service.generateOtp('User@Example.com');
    const data = otpStore.upsert.mock.calls[0][0] as {
      create: { email: string; code: string };
    };

    expect(otp).toMatch(/^\d{6}$/);
    expect(data.create.email).toBe('user@example.com');
    expect(data.create.code).toMatch(/^[a-f0-9]{64}$/);
    expect(data.create.code).not.toBe(otp);
  });
});
