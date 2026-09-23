// src/modules/auth/auth.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

import type { AuthenticatedUser } from './interfaces/authenticated-user.interface';

import { SuccessResponseDto } from '../../common/dto/api-response.dto';
import { AuthUserEnvelopeDto } from './dto/auth-response.dto';

import { RequestOtpDto } from './dto/RequestOtpDto';
import { VerifyOtpDto } from './dto/VerifyOtpDto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // =========================================================
  // Request OTP
  // =========================================================

  @ApiOperation({
    summary: 'Request OTP',
    description: "Sends a one-time password to the user's email.",
  })
  @ApiCreatedResponse({
    type: SuccessResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User not found or invalid email.',
  })
  @ApiTooManyRequestsResponse({
    description: 'OTP request limit or resend cooldown exceeded.',
  })
  @Post('request-otp')
  requestOtp(@Req() request: Request, @Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(
      dto,
      request.ip || request.socket.remoteAddress,
    );
  }

  // =========================================================
  // Verify OTP / Login
  // =========================================================

  @ApiOperation({
    summary: 'Verify OTP and login',
    description:
      'Verifies OTP and stores access and refresh tokens in HttpOnly cookies.',
  })
  @ApiCreatedResponse({
    type: AuthUserEnvelopeDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid OTP, expired, or too many attempts.',
  })
  @ApiTooManyRequestsResponse({
    description: 'OTP verification request limit exceeded.',
  })
  @Post('verify-otp')
  verifyOtp(
    @Req()
    request: Request,

    @Res({ passthrough: true })
    response: Response,

    @Body()
    dto: VerifyOtpDto,
  ) {
    return this.authService.verifyOtp(
      response,
      dto,
      request.ip || request.socket.remoteAddress,
    );
  }

  // =========================================================
  // Refresh Access Token
  // =========================================================

  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Reads the refresh token from the configured HttpOnly cookie and creates a new access token.',
  })
  @ApiOkResponse({
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is missing, expired, or invalid.',
  })
  @Post('refresh')
  refresh(
    @Req()
    request: Request,

    @Res({ passthrough: true })
    response: Response,
  ) {
    const cookies = request.cookies as Record<string, string> | undefined;
    const refreshToken = cookies?.[this.authService.getRefreshCookieName()];

    return this.authService.refresh(response, refreshToken);
  }

  // =========================================================
  // Logout
  // =========================================================

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout',
    description: 'Clears authentication cookies.',
  })
  @ApiCreatedResponse({
    type: SuccessResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication cookie is missing or invalid.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(
    @Res({ passthrough: true })
    response: Response,
  ) {
    return this.authService.logout(response);
  }

  // =========================================================
  // Me
  // =========================================================

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Get current user',
    description: 'Reads the authenticated user from the access token cookie.',
  })
  @ApiOkResponse({
    type: AuthUserEnvelopeDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token is missing, invalid, or expired.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(
    @CurrentUser()
    user: AuthenticatedUser,
  ) {
    return this.authService.me(user);
  }
}
