import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database';
import { FacultiesController } from './faculties.controller';
import { FacultyIconStorageService } from './faculty-icon-storage.service';
import { FacultiesService } from './faculties.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [FacultiesController],
  providers: [FacultiesService, FacultyIconStorageService],
  exports: [FacultiesService],
})
export class FacultiesModule {}
