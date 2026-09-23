export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type ProfessorLinks = {
  scholar?: string;
  researchgate?: string;
  scopus?: string;
  website?: string;
};

export type ProfessorListItem = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  firstName: string;
  lastName: string;
  rank: string;
  facultyId: string;
  faculty: string;
  specialty?: string | null;
  researchGroupName?: string | null;
  isFaculty: boolean;
  avatar: string;
  email?: string | null;
  bio?: string | null;
  links?: ProfessorLinks;
};

export type ProfessorStats = {
  theses: number;
  papers: number;
  conferences: number;
  books: number;
};

export type ProfessorPublication = {
  id: string;
  title: string;
  journal?: string | null;
  year?: number | null;
  authors?: string | null;
  doi?: string | null;
  golestanArticleNo?: string | null;
  printPlace?: string | null;
  language?: string | null;
  journalArticleType?: string | null;
  latinJournalOrConfTitle?: string | null;
  persianJournalOrConfTitle?: string | null;
  activityRegisteredAt?: string | null;
};

export type ProfessorActivity = {
  id?: string;
  sourceId?: string;
  type: string;
  titleFa: string;
  titleEn?: string;
  description?: string;
  date?: string;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Professor = ProfessorListItem & {
  nationalCode?: string | null;
  cvUrl?: string | null;
  golestanProfessorNo?: string | number | null;
  employeeNo?: string | null;
  studentNo?: string | null;
  facultyName?: string | null;
  researchGroupName?: string | null;
  organizationName?: string | null;
  stats?: ProfessorStats;
  publications?: ProfessorPublication[];
  activities?: ProfessorActivity[];
  createdAt?: string;
  updatedAt?: string;
};

export type CreateProfessorPayload = {
  slug: string;
  firstName: string;
  lastName: string;
  displayName: string;
  nationalCode?: string;
  rank: string;
  facultyId: string;
  specialty?: string;
  isFaculty: boolean;
  avatar: string;
  email?: string;
  bio?: string;
  golestanProfessorNo?: string;
  employeeNo?: string;
  studentNo?: string;
  facultyName?: string;
  researchGroupName?: string;
  organizationName?: string;
  links?: ProfessorLinks;
};

export type UpdateProfessorPayload = Partial<CreateProfessorPayload>;

export const ACTIVITY_TYPES = ["مقاله علمی", "کتاب", "پروژه"] as const;

export type CreateActivityPayload = {
  sourceId?: string;
  type: string;
  titleFa: string;
  titleEn?: string;
  description?: string;
  date?: string;
  sortOrder?: number;
};
