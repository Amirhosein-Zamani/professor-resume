import { PrismaClient, UserRole } from '@prisma/client';

const DEFAULT_PROFESSOR_AVATAR = '/Images/npr.png';

type ProfessorSeedItem = {
  slug: string;
  firstName: string;
  lastName: string;
  displayName: string;
  rank: string;
  email?: string;
};

type ProfessorProfileSeed = {
  faculty: string;
  specialty: string;
  avatar?: string;
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

const PROFESSOR_PROFILES: Record<string, ProfessorProfileSeed> = {
  'mehdi-farzinfar': {
    faculty: 'دانشکده مهندسی برق',
    specialty: 'سیستم‌های قدرت و شبکه‌های هوشمند',
    avatar: '/Images/professors/98780302.jpg',
  },
  'ali-mottaghi': {
    faculty: 'دانشکده مهندسی کامپیوتر',
    specialty: 'بینایی ماشین و یادگیری ماشین',
    avatar: '/Images/professors/atashinbar.jpg',
  },
  'mohammad-asyaei': {
    faculty: 'دانشکده مهندسی برق',
    specialty: 'طراحی مدارهای کم‌مصرف و VLSI',
    avatar: '/Images/professors/hakhani.jpg',
  },
  's-hamideh-erfani': {
    faculty: 'دانشکده مهندسی کامپیوتر',
    specialty: 'بینایی ماشین، یادگیری ماشین و سیستم‌های اطلاعاتی',
  },
  'fahimeh-rafiee': {
    faculty: 'دانشکده مهندسی برق',
    specialty: 'مخابرات و پردازش سیگنال',
  },
  'asghar-feizi': {
    faculty: 'دانشکده مهندسی برق',
    specialty: 'مهندسی برق و سامانه‌های الکترونیکی',
  },
  'seyed-hadi-rostamian': {
    faculty: 'دانشکده مهندسی برق',
    specialty: 'کنترل، انتقال حرارت و انرژی‌های تجدیدپذیر',
  },
  'zohre-karimi': {
    faculty: 'دانشکده مهندسی کامپیوتر',
    specialty: 'داده‌کاوی و پردازش زبان طبیعی',
  },
  'salehe-abbaspoor': {
    faculty: 'دانشکده مهندسی کامپیوتر',
    specialty: 'مهندسی نرم‌افزار',
  },
  'ahmad-gholizadeh': {
    faculty: 'دانشکده فیزیک',
    specialty: 'فیزیک ماده چگال و نانومواد',
  },
  'rashid-vali': {
    faculty: 'دانشکده فیزیک',
    specialty: 'فیزیک ماده چگال',
    avatar: '/Images/professors/hazar.jpg',
  },
  'behnam-pourhassan-tanabchi': {
    faculty: 'دانشکده فیزیک',
    specialty: 'فیزیک ذرات، میدان‌ها و گرانش',
    avatar: '/Images/professors/makhonz.jpg',
  },
  'motahareh-mohammadpour': {
    faculty: 'دانشکده مهندسی کامپیوتر',
    specialty: 'هوش مصنوعی',
  },
  's-abolghasem-aghapour': {
    faculty: 'دانشکده مهندسی کامپیوتر',
    specialty: 'شبکه‌های کامپیوتری',
  },
  'seied-ali-pourmousavi': {
    faculty: 'دانشکده فیزیک',
    specialty: 'فیزیک محاسباتی',
  },
  'ahmad-soleymanpour': {
    faculty: 'دانشکده فیزیک',
    specialty: 'فیزیک نظری',
  },
  'kobra-zarei': {
    faculty: 'دانشکده فیزیک',
    specialty: 'اپتیک و فوتونیک',
  },
  'morteza-jabbari': {
    faculty: 'دانشکده مهندسی برق',
    specialty: 'کنترل و اتوماسیون',
  },
  'ali-akbar-hassannezhad': {
    faculty: 'دانشکده مهندسی کامپیوتر',
    specialty: 'امنیت اطلاعات',
  },
  'houshang-khairy': {
    faculty: 'دانشکده فیزیک',
    specialty: 'نانوفیزیک',
  },
  'nader-taghipour': {
    faculty: 'دانشکده مهندسی کامپیوتر',
    specialty: 'علوم داده',
  },
  'ebrahim-rahimi': {
    faculty: 'دانشکده مهندسی برق',
    specialty: 'سیستم‌های قدرت',
  },
};

export async function seedProfessors(
  prisma: PrismaClient,
  adminEmails: string[] = [],
) {
  for (const item of PROFESSORS_SEED) {
    const profile = PROFESSOR_PROFILES[item.slug];
    if (!profile) {
      throw new Error(`Missing profile seed for professor: ${item.slug}`);
    }

    const facultyName = profile.faculty;
    const avatar = profile.avatar ?? DEFAULT_PROFESSOR_AVATAR;
    const bio = `عضو هیئت علمی دانشگاه دامغان در ${facultyName} با تمرکز بر ${profile.specialty}.`;
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
        specialty: profile.specialty,
        isFaculty: true,
        avatar,
        email: normalizedEmail,
        facultyName,
        researchGroupName: profile.specialty,
        organizationName: 'دانشگاه دامغان',
        bio,
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
        specialty: profile.specialty,
        isFaculty: true,
        avatar,
        email: normalizedEmail,
        facultyName,
        researchGroupName: profile.specialty,
        organizationName: 'دانشگاه دامغان',
        bio,
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
          role: adminEmails.includes(email) ? UserRole.ADMIN : UserRole.PROFESSOR,
          professorId: professor.id,
        },
      });
    }

    const sourceId = `seed-research-area:${item.slug}`;
    const activityData = {
      type: 'حوزه پژوهشی',
      titleFa: profile.specialty,
      description: `فعالیت پژوهشی در حوزه ${profile.specialty}`,
      sortOrder: 5,
    };
    const existingActivity = await prisma.professorActivity.findFirst({
      where: { professorId: professor.id, sourceId },
      select: { id: true },
    });

    if (existingActivity) {
      await prisma.professorActivity.update({
        where: { id: existingActivity.id },
        data: activityData,
      });
    } else {
      await prisma.professorActivity.create({
        data: { professorId: professor.id, sourceId, ...activityData },
      });
    }

    console.log(`Professor created/updated: ${professor.displayName}`);
  }
}
