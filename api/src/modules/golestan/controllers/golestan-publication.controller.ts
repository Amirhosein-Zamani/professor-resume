import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { GolestanRateLimitGuard } from '../guards/golestan-rate-limit.guard';
import { GolestanPublicationService } from '../services/golestan-publication.service';
import { GolestanXmlSerializationMode } from '../types/golestan.type';

@ApiTags('Golestan Publications')
@ApiCookieAuth()
@Roles(UserRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard, GolestanRateLimitGuard)
@ApiForbiddenResponse({ description: 'Only administrators can use Golestan.' })
@ApiTooManyRequestsResponse({
  description: 'Golestan operation rate limit exceeded.',
})
@Controller('golestan/publications')
export class GolestanPublicationController {
  constructor(
    private readonly golestanPublicationService: GolestanPublicationService,
  ) {}

  @Post('sync')
  async syncPublications(): Promise<{ synced: number }> {
    return this.golestanPublicationService.syncPublications();
  }

  @Post('probe')
  async probePublications(
    @Body()
    body?: {
      xmlMode?: GolestanXmlSerializationMode | 'both';
    },
  ): Promise<{
    baseUrl: string;
    results: Array<{
      mode: GolestanXmlSerializationMode;
      classification:
        | 'ok'
        | 'timeout'
        | 'network'
        | 'http'
        | 'soap_fault'
        | 'empty_root'
        | 'parse_error'
        | 'unknown';
      durationMs: number;
      status?: number;
      rowCount?: number;
      soapFault?: string;
    }>;
  }> {
    return this.golestanPublicationService.probePublications(
      body?.xmlMode ?? 'both',
    );
  }
}
