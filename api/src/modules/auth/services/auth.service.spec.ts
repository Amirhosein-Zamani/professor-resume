import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { describe, expect, it, jest } from '@jest/globals';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';

function createService(user: { email: string } | null) {
  const userStore = {
    findUnique: jest.fn<() => Promise<{ email: string } | null>>(),
  };
  userStore.findUnique.mockResolvedValue(user);

  const otpService = {
    generateOtp: jest.fn<() => Promise<string>>().mockResolvedValue('123456'),
    sendOtpEmail: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };
  const configService = {
    get: jest.fn((_key: string, defaultValue: unknown) => defaultValue),
  };

  return {
    service: new AuthService(
      { user: userStore } as never,
      {} as JwtService,
      configService as unknown as ConfigService,
      otpService as unknown as OtpService,
    ),
    userStore,
    otpService,
  };
}

describe('AuthService.requestOtp', () => {
  it('rejects an email that is not registered as a dashboard user', async () => {
    const { service, userStore, otpService } = createService(null);

    await expect(
      service.requestOtp({ email: ' Unknown@Example.com ' }),
    ).rejects.toThrow(BadRequestException);

    expect(userStore.findUnique).toHaveBeenCalledWith({
      where: { email: 'unknown@example.com' },
      select: { email: true },
    });
    expect(otpService.generateOtp).not.toHaveBeenCalled();
    expect(otpService.sendOtpEmail).not.toHaveBeenCalled();
  });

  it('sends an OTP only for a registered dashboard user', async () => {
    const { service, otpService } = createService({
      email: 'user@example.com',
    });

    await expect(
      service.requestOtp({ email: 'User@Example.com' }),
    ).resolves.toEqual({ message: 'Verification code has been sent.' });

    expect(otpService.generateOtp).toHaveBeenCalledWith('user@example.com');
    expect(otpService.sendOtpEmail).toHaveBeenCalledWith(
      'user@example.com',
      '123456',
    );
  });
});
