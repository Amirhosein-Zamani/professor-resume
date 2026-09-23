import { PrismaClient, UserRole } from '@prisma/client';

const DEFAULT_PROFESSOR_AVATAR = '/Images/image0.jpg';
const UNASSIGNED_FACULTY = 'تخصیص‌نیافته';

type ProfessorSeedItem = {
  slug: string;
  firstName: string;
  lastName: string;
  displayName: string;
  rank: string;
  email?: string;
  faculty?: string;
  specialty?: string;
  researchGroupName?: string;
};

export const PROFESSORS_SEED: ProfessorSeedItem[] = [
  {
    slug: 'mehdi-farzinfar',
    firstName: 'Mehdi',
    lastName: 'Farzinfar',
    displayName: 'Mehdi Farzinfar',
    rank: 'استادیار',
    email: 'm.farzinfar@du.ac.ir',
  },
  {
    slug: 'ali-mottaghi',
    firstName: 'Ali',
    lastName: 'Mottaghi',
    displayName: 'Ali Mottaghi',
    rank: 'استادیار',
    email: 'mottaghi@du.ac.ir',
  },
  {
    slug: 'mohammad-asyaei',
    firstName: 'Mohammad',
    lastName: 'Asyaei',
    displayName: 'Mohammad Asyaei',
    rank: 'استادیار',
    email: 'm.asyaei@du.ac.ir',
    specialty: 'مهندسی الکترونیک',
    researchGroupName: 'مهندسی الکترونیک',
  },
  {
    slug: 's-hamideh-erfani',
    firstName: 'S. Hamideh',
    lastName: 'Erfani',
    displayName: 'S. Hamideh Erfani',
    rank: 'مربی',
    email: 'sh.erfani@du.ac.ir',
  },
  {
    slug: 'fahimeh-rafiee',
    firstName: 'Fahimeh',
    lastName: 'Rafiee',
    displayName: 'Dr. Fahimeh Rafiee',
    rank: 'استادیار',
    email: 'f.rafiee@du.ac.ir',
  },
  {
    slug: 'asghar-feizi',
    firstName: 'Asghar',
    lastName: 'Feizi',
    displayName: 'Asghar Feizi',
    rank: 'استادیار',
    email: 'a.feizi@du.ac.ir',
    faculty: 'دانشکده مهندسی برق',
    specialty: 'مهندسی برق',
    researchGroupName: 'مهندسی برق',
  },
  {
    slug: 'seyed-hadi-rostamian',
    firstName: 'Seyed Hadi',
    lastName: 'Rostamian',
    displayName: 'Seyed Hadi Rostamian',
    rank: 'استادیار',
    email: 'h.rostamian@du.ac.ir',
  },
  {
    slug: 'zohre-karimi',
    firstName: 'Zohre',
    lastName: 'Karimi',
    displayName: 'Dr. Zohre Karimi',
    rank: 'استادیار',
    email: 'z.karimi@du.ac.ir',
  },
  {
    slug: 'salehe-abbaspoor',
    firstName: 'Salehe',
    lastName: 'Abbaspoor',
    displayName: 'Dr. Salehe Abbaspoor',
    rank: 'استادیار',
    email: 's.abbaspoor@du.ac.ir',
  },
  {
    slug: 'ahmad-gholizadeh',
    firstName: 'Ahmad',
    lastName: 'Gholizadeh',
    displayName: 'Ahmad Gholizadeh',
    rank: 'استادیار',
    email: 'gholizadeh@du.ac.ir',
  },
  {
    slug: 'rashid-vali',
    firstName: 'Rashid',
    lastName: 'Vali',
    displayName: 'Rashid Vali',
    rank: 'استاد',
    email: 'vali@du.ac.ir',
  },
  {
    slug: 'behnam-pourhassan-tanabchi',
    firstName: 'Behnam',
    lastName: 'Pourhassan Tanabchi',
    displayName: 'Behnam Pourhassan Tanabchi',
    rank: 'استاد',
    email: 'b.pourhassan@du.ac.ir',
    specialty: 'فیزیک ذرات و میدان‌ها',
    researchGroupName: 'ذرات و میدان‌ها',
  },
  {
    slug: 'motahareh-mohammadpour',
    firstName: 'Motahareh',
    lastName: 'Mohammadpour',
    displayName: 'Motahareh Mohammadpour',
    rank: 'استادیار',
  },
  {
    slug: 's-abolghasem-aghapour',
    firstName: 'S. Abolghasem',
    lastName: 'Aghapour',
    displayName: 'S. Abolghasem Aghapour',
    rank: 'دانشیار',
  },
  {
    slug: 'seied-ali-pourmousavi',
    firstName: 'Seied Ali',
    lastName: 'Pourmousavi',
    displayName: 'Seied Ali Pourmousavi',
    rank: 'استاد',
    specialty: 'شیمی آلی',
    researchGroupName: 'شیمی آلی',
  },
  {
    slug: 'ahmad-soleymanpour',
    firstName: 'Ahmad',
    lastName: 'Soleymanpour',
    displayName: 'Ahmad Soleymanpour',
    rank: 'دانشیار',
  },
  {
    slug: 'kobra-zarei',
    firstName: 'Kobra',
    lastName: 'Zarei',
    displayName: 'Kobra Zarei',
    rank: 'استاد',
    email: 'zarei@du.ac.ir',
  },
  {
    slug: 'morteza-jabbari',
    firstName: 'Morteza',
    lastName: 'Jabbari',
    displayName: 'Morteza Jabbari',
    rank: 'دانشیار',
    email: 'm_jabari@du.ac.ir',
  },
  {
    slug: 'ali-akbar-hassannezhad',
    firstName: 'Ali Akbar',
    lastName: 'Hassannezhad',
    displayName: 'Ali Akbar Hassannezhad',
    rank: 'استادیار',
    email: 'hassannezhad@du.ac.ir',
  },
  {
    slug: 'houshang-khairy',
    firstName: 'Houshang',
    lastName: 'Khairy',
    displayName: 'Houshang Khairy',
    rank: 'دانشیار',
    email: 'h.khairy@du.ac.ir',
  },
  {
    slug: 'nader-taghipour',
    firstName: 'Nader',
    lastName: 'Taghipour',
    displayName: 'Nader Taghipour',
    rank: 'دانشیار',
    email: 'taghipour@du.ac.ir',
  },
  {
    slug: 'ebrahim-rahimi',
    firstName: 'Ebrahim',
    lastName: 'Rahimi',
    displayName: 'Ebrahim Rahimi',
    rank: 'استادیار',
    email: 'rahimi_e@du.ac.ir',
  },
];

export async function seedProfessors(
  prisma: PrismaClient,
  adminEmails: string[] = [],
) {
  for (const item of PROFESSORS_SEED) {
    const facultyName = item.faculty ?? UNASSIGNED_FACULTY;
    const normalizedEmail = item.email?.toLowerCase().trim() ?? null;

    const professor = await prisma.professor.upsert({
      where: { slug: item.slug },
      update: {
        firstName: item.firstName,
        lastName: item.lastName,
        displayName: item.displayName,
        rank: item.rank,
        faculty: facultyName,
        facultyRecord: {
          connectOrCreate: {
            where: { name: facultyName },
            create: { name: facultyName },
          },
        },
        specialty: item.specialty ?? null,
        isFaculty: true,
        avatar: DEFAULT_PROFESSOR_AVATAR,
        email: normalizedEmail,
        facultyName: item.faculty ?? null,
        researchGroupName: item.researchGroupName ?? null,
        organizationName: 'دانشگاه دامغان',
      },
      create: {
        slug: item.slug,
        firstName: item.firstName,
        lastName: item.lastName,
        displayName: item.displayName,
        rank: item.rank,
        faculty: facultyName,
        facultyRecord: {
          connectOrCreate: {
            where: { name: facultyName },
            create: { name: facultyName },
          },
        },
        specialty: item.specialty ?? null,
        isFaculty: true,
        avatar: DEFAULT_PROFESSOR_AVATAR,
        email: normalizedEmail,
        facultyName: item.faculty ?? null,
        researchGroupName: item.researchGroupName ?? null,
        organizationName: 'دانشگاه دامغان',
      },
    });

    if (professor.email) {
      const email = professor.email.toLowerCase().trim();

      await prisma.user.upsert({
        where: { email },
        update: {
          professorId: professor.id,
          ...(adminEmails.includes(email) ? { role: UserRole.ADMIN } : {}),
        },
        create: {
          email,
          role: adminEmails.includes(email) ? UserRole.ADMIN : UserRole.EDITOR,
          professorId: professor.id,
        },
      });
    }

    console.log(`Professor created/updated: ${professor.displayName}`);
  }
}
