import { Module } from '@nestjs/common';
import { GolestanClient } from './clients/golestan.client';
import { GolestanPublicationService } from './services/golestan-publication.service';
import { GolestanPublicationController } from './controllers/golestan-publication.controller';
import { AuthModule } from '../auth/auth.module';
import { GolestanRateLimitGuard } from './guards/golestan-rate-limit.guard';

@Module({
  imports: [AuthModule],
  controllers: [GolestanPublicationController],
  providers: [
    GolestanClient,
    GolestanPublicationService,
    GolestanRateLimitGuard,
  ],
  exports: [GolestanPublicationService],
})
export class GolestanModule {}
