import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfessorLinksResponseDto {
  @ApiPropertyOptional({
    example: 'https://scholar.google.com/citations?user=example',
    nullable: true,
  })
  scholar!: string | null;

  @ApiPropertyOptional({
    example: 'https://www.researchgate.net/profile/Reza-Mortazavi',
    nullable: true,
  })
  researchgate!: string | null;

  @ApiPropertyOptional({
    example: 'https://www.scopus.com/authid/detail.uri?authorId=12345678900',
    nullable: true,
  })
  scopus!: string | null;

  @ApiPropertyOptional({
    example: 'https://example.edu/faculty/reza-mortazavi',
    nullable: true,
  })
  website!: string | null;
}

export class ProfessorActivityResponseDto {
  @ApiProperty({ example: 'clxactivity1234567890abcdef' })
  id!: string;

  @ApiPropertyOptional({
    example: 'golestan-activity-42',
    nullable: true,
  })
  sourceId!: string | null;

  @ApiProperty({ example: 'مقاله علمی' })
  type!: string;

  @ApiPropertyOptional({
    example: 'طراحی سامانه های هوشمند در آموزش',
    nullable: true,
  })
  titleFa!: string | null;

  @ApiPropertyOptional({
    example: 'Intelligent Systems Design in Education',
    nullable: true,
  })
  titleEn!: string | null;

  @ApiPropertyOptional({
    example: 'A peer-reviewed journal article.',
    nullable: true,
  })
  description!: string | null;

  @ApiPropertyOptional({
    example: '2024-09-01T00:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  date!: string | null;

  @ApiPropertyOptional({
    example: 0,
    nullable: true,
  })
  sortOrder!: number | null;

  @ApiProperty({
    example: '2026-06-21T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-06-21T10:30:00.000Z',
    format: 'date-time',
  })
  updatedAt!: string;
}

export class PublicationResponseDto {
  @ApiProperty({ example: 'clxpublication1234567890abc' })
  id!: string;

  @ApiProperty({
    example: 'Machine Learning Applications in Higher Education',
  })
  title!: string;

  @ApiPropertyOptional({
    example: 'Journal of Educational Technology',
    nullable: true,
  })
  journal!: string | null;

  @ApiPropertyOptional({
    example: 2025,
    nullable: true,
  })
  year!: number | null;

  @ApiPropertyOptional({
    example: 'Reza Mortazavi; Coauthor Example',
    nullable: true,
  })
  authors!: string | null;

  @ApiPropertyOptional({
    example: '10.1000/example-doi',
    nullable: true,
  })
  doi!: string | null;

  @ApiPropertyOptional({
    example: '1304-77',
    nullable: true,
  })
  golestanArticleNo!: string | null;

  @ApiPropertyOptional({
    example: 'Tehran',
    nullable: true,
  })
  printPlace!: string | null;

  @ApiPropertyOptional({
    example: 'fa',
    nullable: true,
  })
  language!: string | null;

  @ApiPropertyOptional({
    example: 'Journal Article',
    nullable: true,
  })
  journalArticleType!: string | null;

  @ApiPropertyOptional({
    example: 'International Conference on AI in Education',
    nullable: true,
  })
  latinJournalOrConfTitle!: string | null;

  @ApiPropertyOptional({
    example: 'کنفرانس هوش مصنوعی در آموزش',
    nullable: true,
  })
  persianJournalOrConfTitle!: string | null;

  @ApiPropertyOptional({
    example: '2025-11-20T08:00:00.000Z',
    format: 'date-time',
    nullable: true,
  })
  activityRegisteredAt!: string | null;
}

export class ProfessorStatsResponseDto {
  @ApiProperty({ example: 2 })
  theses!: number;

  @ApiProperty({ example: 12 })
  papers!: number;

  @ApiProperty({ example: 3 })
  conferences!: number;

  @ApiProperty({ example: 1 })
  books!: number;
}

export class ProfessorListItemResponseDto {
  @ApiProperty({ example: 'clxprofessor1234567890abcd' })
  id!: string;

  @ApiProperty({ example: 'reza-mortazavi' })
  slug!: string;

  @ApiProperty({ example: 'دکتر رضا مرتضوی' })
  name!: string;

  @ApiProperty({ example: 'دکتر رضا مرتضوی' })
  displayName!: string;

  @ApiProperty({ example: 'رضا' })
  firstName!: string;

  @ApiProperty({ example: 'مرتضوی' })
  lastName!: string;

  @ApiProperty({ example: 'استادیار' })
  rank!: string;

  @ApiProperty({ example: 'مهندسی کامپیوتر' })
  faculty!: string;

  @ApiProperty({ example: 'e7b27ec5-dff3-4b8c-b7a7-4f6e4f3c0e9f' })
  facultyId!: string;

  @ApiPropertyOptional({
    example: 'هوش مصنوعی و سیستم های نرم افزاری',
    nullable: true,
  })
  specialty!: string | null;

  @ApiProperty({ example: true })
  isFaculty!: boolean;

  @ApiProperty({ example: '/Images/professors/reza-mortazavi.jpg' })
  avatar!: string;

  @ApiPropertyOptional({
    example: 'reza.mortazavi@example.com',
    nullable: true,
  })
  email!: string | null;

  @ApiPropertyOptional({
    example: 'عضو هیئت علمی دانشکده مهندسی کامپیوتر.',
    nullable: true,
  })
  bio!: string | null;

  @ApiProperty({ type: ProfessorLinksResponseDto })
  links!: ProfessorLinksResponseDto;
}

export class ProfessorDetailResponseDto {
  @ApiProperty({ example: 'clxprofessor1234567890abcd' })
  id!: string;

  @ApiProperty({ example: 'reza-mortazavi' })
  slug!: string;

  @ApiProperty({ example: 'دکتر رضا مرتضوی' })
  name!: string;

  @ApiProperty({ example: 'دکتر رضا مرتضوی' })
  displayName!: string;

  @ApiProperty({ example: 'رضا' })
  firstName!: string;

  @ApiProperty({ example: 'مرتضوی' })
  lastName!: string;

  @ApiPropertyOptional({
    example: '0012345678',
    nullable: true,
  })
  nationalCode!: string | null;

  @ApiProperty({ example: 'استادیار' })
  rank!: string;

  @ApiProperty({ example: 'مهندسی کامپیوتر' })
  faculty!: string;

  @ApiProperty({ example: 'e7b27ec5-dff3-4b8c-b7a7-4f6e4f3c0e9f' })
  facultyId!: string;

  @ApiPropertyOptional({
    example: 'هوش مصنوعی و سیستم های نرم افزاری',
    nullable: true,
  })
  specialty!: string | null;

  @ApiProperty({ example: true })
  isFaculty!: boolean;

  @ApiProperty({ example: '/Images/professors/reza-mortazavi.jpg' })
  avatar!: string;

  @ApiPropertyOptional({
    example: 'reza.mortazavi@example.com',
    nullable: true,
  })
  email!: string | null;

  @ApiPropertyOptional({
    example: 'https://example.edu/cv/reza-mortazavi.pdf',
    nullable: true,
  })
  cvUrl!: string | null;

  @ApiPropertyOptional({
    example: 'عضو هیئت علمی دانشکده مهندسی کامپیوتر با تمرکز بر هوش مصنوعی.',
    nullable: true,
  })
  bio!: string | null;

  @ApiPropertyOptional({
    example: '1304',
    nullable: true,
  })
  golestanProfessorNo!: string | null;

  @ApiPropertyOptional({
    example: 'EMP-1024',
    nullable: true,
  })
  employeeNo!: string | null;

  @ApiPropertyOptional({
    example: 'STU-2048',
    nullable: true,
  })
  studentNo!: string | null;

  @ApiPropertyOptional({
    example: 'دانشکده مهندسی',
    nullable: true,
  })
  facultyName!: string | null;

  @ApiPropertyOptional({
    example: 'گروه هوش مصنوعی',
    nullable: true,
  })
  researchGroupName!: string | null;

  @ApiPropertyOptional({
    example: 'دانشگاه دامغان',
    nullable: true,
  })
  organizationName!: string | null;

  @ApiProperty({ type: ProfessorLinksResponseDto })
  links!: ProfessorLinksResponseDto;

  @ApiProperty({ type: ProfessorStatsResponseDto })
  stats!: ProfessorStatsResponseDto;

  @ApiProperty({ type: [PublicationResponseDto] })
  publications!: PublicationResponseDto[];

  @ApiProperty({ type: [ProfessorActivityResponseDto] })
  activities!: ProfessorActivityResponseDto[];

  @ApiProperty({
    example: '2026-06-21T10:30:00.000Z',
    format: 'date-time',
  })
  createdAt!: string;

  @ApiProperty({
    example: '2026-06-21T10:30:00.000Z',
    format: 'date-time',
  })
  updatedAt!: string;
}

export class ProfessorActivitiesResponseDto {
  @ApiProperty({ example: 'clxprofessor1234567890abcd' })
  professorId!: string;

  @ApiProperty({ example: 'reza-mortazavi' })
  slug!: string;

  @ApiProperty({ example: 'دکتر رضا مرتضوی' })
  displayName!: string;

  @ApiProperty({ type: [ProfessorActivityResponseDto] })
  activities!: ProfessorActivityResponseDto[];
}
