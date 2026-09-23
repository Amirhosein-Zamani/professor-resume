import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database';
import { ProfessorsController } from './controllers/professors.controller';
import { ProfessorsService } from './services/professors.service';
import { CvStorageService } from './services/CvStorage.service';
import { AuthModule } from '../auth/auth.module';
import { FormSchemaService } from './services/form-schema.service';
import { FormSchemaController } from './controllers/schema.controller';
import { ProfessorAccessGuard } from './guards/professor-access.guard';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ProfessorsController, FormSchemaController],
  providers: [
    ProfessorsService,
    CvStorageService,
    FormSchemaService,
    ProfessorAccessGuard,
  ],
  exports: [ProfessorsService, CvStorageService],
})
export class ProfessorsModule {}
