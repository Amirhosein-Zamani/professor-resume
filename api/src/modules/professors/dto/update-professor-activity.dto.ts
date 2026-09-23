import { PartialType } from '@nestjs/swagger';
import { CreateProfessorActivityDto } from './create-professor-activity.dto';

export class UpdateProfessorActivityDto extends PartialType(
  CreateProfessorActivityDto,
) {}
