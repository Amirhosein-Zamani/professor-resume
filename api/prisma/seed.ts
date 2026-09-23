import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

[
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(process.cwd(), '.env'),
].forEach((envPath) => {
  dotenv.config({
    path: envPath,
    override: false,
  });
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL must be set before running the seed.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});

const ADDITIONAL_FACULTY_NAMES = [
  'دانشکده مهندسی کامپیوتر',
  'دانشکده مهندسی برق',
  'دانشکده فناوری اطلاعات',
  'دانشکده فیزیک',
  'دانشکده شیمی',
  'دانشکده ریاضی و علوم کامپیوتر',
  'دانشکده ادبیات و زبان‌های خارجی',
  'دانشکده روانشناسی و علوم تربیتی',
  'دانشکده علوم اقتصادی و اداری',
  'دانشکده مدیریت و بازرگانی',
];

const PROFESSOR_FACULTY = 'مهندسی کامپیوتر';

const PROFESSOR_FORM_SCHEMA = [
  {
    key: 'slug',
    label: 'شناسه یکتا (Slug)',
    type: 'text',
    required: true,
    placeholder: 'مثال: reza-mortazavi',
    validation: {
      pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    },
  },
  {
    key: 'firstName',
    label: 'نام',
    type: 'text',
    required: true,
  },
  {
    key: 'lastName',
    label: 'نام خانوادگی',
    type: 'text',
    required: true,
  },
  {
    key: 'displayName',
    label: 'نام نمایشی',
    type: 'text',
    required: true,
  },
  {
    key: 'nationalCode',
    label: 'کد ملی',
    type: 'text',
    required: false,
    placeholder: 'مثال: 0012345678',
    validation: {
      pattern: '^\\d{10}$',
      message: 'کد ملی باید ۱۰ رقم باشد.',
    },
  },
  {
    key: 'rank',
    label: 'مرتبه علمی',
    type: 'select',
    required: true,
    options: [
      { label: 'استادیار', value: 'استادیار' },
      { label: 'دانشیار', value: 'دانشیار' },
      { label: 'استاد', value: 'استاد' },
    ],
  },
  {
    key: 'facultyId',
    label: 'دانشکده',
    type: 'select',
    required: true,
    helpText: 'مقادیر این فیلد از جدول faculties تامین می‌شوند.',
  },
  {
    key: 'specialty',
    label: 'تخصص',
    type: 'text',
    required: false,
  },
  {
    key: 'bio',
    label: 'بیوگرافی',
    type: 'textarea',
    required: false,
    rows: 5,
  },
  {
    key: 'email',
    label: 'ایمیل',
    type: 'email',
    required: false,
    validation: {
      isEmail: true,
    },
  },
  {
    key: 'avatar',
    label: 'تصویر پروفایل',
    type: 'file',
    required: true,
    accept: 'image/*',
    validation: {
      isBase64Image: true,
    },
  },
  {
    key: 'cv',
    label: 'فایل رزومه (CV)',
    type: 'file',
    required: false,
    accept: 'application/pdf',
  },
  {
    key: 'isFaculty',
    label: 'عضو هیئت علمی؟',
    type: 'checkbox',
    required: false,
    defaultValue: true,
  },
  {
    key: 'golestanProfessorNo',
    label: 'شماره استاد در سیستم گلستان',
    type: 'text',
    required: false,
  },
  {
    key: 'employeeNo',
    label: 'شماره پرسنلی',
    type: 'text',
    required: false,
  },
  {
    key: 'studentNo',
    label: 'شماره دانشجویی',
    type: 'text',
    required: false,
  },
  {
    key: 'researchGroupName',
    label: 'گروه پژوهشی',
    type: 'text',
    required: false,
  },
  {
    key: 'organizationName',
    label: 'نام سازمان/دانشگاه',
    type: 'text',
    required: false,
  },
  {
    key: 'scholar',
    label: 'لینک گوگل اسکالر',
    type: 'url',
    required: false,
    placeholder: 'https://scholar.google.com/...',
    validation: {
      isUrl: true,
    },
  },
  {
    key: 'researchgate',
    label: 'لینک ریسرچ‌گیت',
    type: 'url',
    required: false,
    placeholder: 'https://www.researchgate.net/...',
    validation: {
      isUrl: true,
    },
  },
  {
    key: 'scopus',
    label: 'لینک اسکوپوس',
    type: 'url',
    required: false,
    placeholder: 'https://www.scopus.com/...',
    validation: {
      isUrl: true,
    },
  },
  {
    key: 'website',
    label: 'وب‌سایت شخصی',
    type: 'url',
    required: false,
    placeholder: 'https://example.com',
    validation: {
      isUrl: true,
    },
  },
];

const ACTIVITY_FORM_SCHEMA = [
  {
    key: 'type',
    label: 'نوع فعالیت',
    type: 'select',
    required: true,
    options: [
      { label: 'مقاله علمی', value: 'مقاله علمی' },
      { label: 'کتاب', value: 'کتاب' },
      { label: 'همایش', value: 'همایش' },
      { label: 'طرح پژوهشی', value: 'طرح پژوهشی' },
      { label: 'پایان نامه / رساله', value: 'پایان نامه / رساله' },
      { label: 'خدمات اجرایی', value: 'خدمات اجرایی' },
    ],
  },
  {
    key: 'titleFa',
    label: 'عنوان (فارسی)',
    type: 'text',
    required: true,
  },
  {
    key: 'titleEn',
    label: 'عنوان (انگلیسی)',
    type: 'text',
    required: false,
  },
  {
    key: 'description',
    label: 'توضیحات',
    type: 'textarea',
    required: false,
    rows: 4,
  },
  {
    key: 'date',
    label: 'تاریخ',
    type: 'date',
    required: false,
  },
];

async function main() {
  const facultyNames = [
    'دانشکده فنی و مهندسی',
    'دانشکده علوم پایه',
    'دانشکده علوم انسانی',
    'دانشکده مدیریت',
    PROFESSOR_FACULTY,
  ];

  for (const name of facultyNames) {
    await prisma.faculty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const name of ADDITIONAL_FACULTY_NAMES) {
    await prisma.faculty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error('SEED_ADMIN_EMAIL must be set before running the seed.');
  }

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase().trim() },
    update: {
      role: UserRole.ADMIN,
    },
    create: {
      email: adminEmail.toLowerCase().trim(),
      role: UserRole.ADMIN,
    },
  });

  const secondaryAdminEmail = process.env.SEED_SECONDARY_ADMIN_EMAIL;
  if (secondaryAdminEmail) {
    await prisma.user.upsert({
      where: { email: secondaryAdminEmail.toLowerCase().trim() },
      update: { role: UserRole.ADMIN },
      create: {
        email: secondaryAdminEmail.toLowerCase().trim(),
        role: UserRole.ADMIN,
      },
    });
  }

  const adminEmails = [adminEmail, secondaryAdminEmail]
    .filter((email): email is string => Boolean(email))
    .map((email) => email.toLowerCase().trim());
  const authorEmail = process.env.SEED_AUTHOR_EMAIL || 'author@example.com';

  await prisma.user.upsert({
    where: { email: authorEmail.toLowerCase().trim() },
    update: {
      role: UserRole.ADMIN,
    },
    create: {
      email: authorEmail.toLowerCase().trim(),
      role: UserRole.EDITOR,
    },
  });

  const professor = await prisma.professor.upsert({
    where: { slug: 'reza-mortazavi' },
    update: {
      firstName: 'رضا',
      lastName: 'مرتضوی',
      displayName: 'رضا مرتضوی',
      nationalCode: '4579346718',
      rank: 'استادیار',
      faculty: PROFESSOR_FACULTY,
      facultyRecord: {
        connectOrCreate: {
          where: { name: PROFESSOR_FACULTY },
          create: { name: PROFESSOR_FACULTY },
        },
      },
      specialty: 'امنیت اطلاعات و داده‌کاوی',
      isFaculty: true,
      avatar: '/Images/mortazavi.webp',
      email: 'r_mortazavi@du.ac.ir',
      cvUrl: '/cv/reza-mortazavi-cv.pdf',
      bio: 'عضو هیئت علمی دانشگاه دامغان با تمرکز بر امنیت، داده‌کاوی و سامانه‌های نرم‌افزاری.',
      golestanProfessorNo: '380140',
      facultyName: 'دانشکده فنی و مهندسی',
      researchGroupName: 'مهندسی کامپیوتر',
      organizationName: 'دانشگاه دامغان',
    },
    create: {
      slug: 'reza-mortazavi',
      firstName: 'رضا',
      lastName: 'مرتضوی',
      displayName: 'رضا مرتضوی',
      nationalCode: '4579346718',
      rank: 'استادیار',
      faculty: PROFESSOR_FACULTY,
      facultyRecord: {
        connectOrCreate: {
          where: { name: PROFESSOR_FACULTY },
          create: { name: PROFESSOR_FACULTY },
        },
      },
      specialty: 'امنیت اطلاعات و داده‌کاوی',
      isFaculty: true,
      avatar: '/Images/mortazavi.webp',
      email: 'r_mortazavi@du.ac.ir',
      cvUrl: '/cv/reza-mortazavi-cv.pdf',
      bio: 'عضو هیئت علمی دانشگاه دامغان با تمرکز بر امنیت، داده‌کاوی و سامانه‌های نرم‌افزاری.',
      golestanProfessorNo: '380140',
      facultyName: 'دانشکده فنی و مهندسی',
      researchGroupName: 'مهندسی کامپیوتر',
      organizationName: 'دانشگاه دامغان',
    },
  });

  console.log(`Professor created/updated: ${professor.displayName}`);

  if (professor.email) {
    await prisma.user.upsert({
      where: { email: professor.email.toLowerCase().trim() },
      update: {
                role: adminEmails.includes(professor.email.toLowerCase().trim())
          ? UserRole.ADMIN
          : UserRole.EDITOR,
        professorId: professor.id,
      },
      create: {
        email: professor.email.toLowerCase().trim(),
                role: adminEmails.includes(professor.email.toLowerCase().trim())
          ? UserRole.ADMIN
          : UserRole.EDITOR,
        professorId: professor.id,
      },
    });

    console.log(`Editor user created/updated for professor email`);
  }

  await prisma.professorLink.upsert({
    where: { professorId: professor.id },
    update: {
      scholar: 'https://scholar.google.com/',
      researchgate: 'https://www.researchgate.net/',
      scopus: 'https://www.scopus.com/',
      website: 'https://du.ac.ir/',
    },
    create: {
      professorId: professor.id,
      scholar: 'https://scholar.google.com/',
      researchgate: 'https://www.researchgate.net/',
      scopus: 'https://www.scopus.com/',
      website: 'https://du.ac.ir/',
    },
  });

  const activities = [
    {
      sourceId: '27',
      type: 'طرح پژوهشی',
      titleFa:
        'طراحی تحلیل و پیاده سازی توابع درهم ساز و رمزنگاری مبتنی بر شناسه',
      sortOrder: 10,
    },
    {
      sourceId: '67',
      type: 'مقاله علمی',
      titleEn:
        'Enhancing aggregation phase of microaggregation methods for interval disclosure risk minimization',
      sortOrder: 20,
    },
    {
      sourceId: '35',
      type: 'کتاب',
      titleFa: 'آشنایی با الگوریتم ها با رویکرد خلاقانه',
      sortOrder: 30,
    },
    {
      sourceId: '123',
      type: 'خدمات اجرایی',
      titleFa:
        'مدیر گروه مهندسی کامپیوتر از تاریخ 1394.03.20 تا تاریخ 1395.03.30',
      sortOrder: 40,
    },
    {
      sourceId: '20591595',
      type: 'پایان نامه / رساله',
      titleFa:
        'وبسایت رزومه جامع برای اساتید دانشگاه دامغان با استفاده از تکنولوژی های وب مدرن',
      titleEn:
        'Comprehensive resume website for professors of Damghan University using modern web technologies.',
      sortOrder: 50,
    },
  ];

  for (const activity of activities) {
    const existingActivity = await prisma.professorActivity.findFirst({
      where: {
        professorId: professor.id,
        sourceId: activity.sourceId,
        type: activity.type,
      },
      select: { id: true },
    });

    if (existingActivity) {
      await prisma.professorActivity.update({
        where: { id: existingActivity.id },
        data: activity,
      });
      continue;
    }

    await prisma.professorActivity.create({
      data: {
        professorId: professor.id,
        ...activity,
      },
    });
  }

  await prisma.formSchema.upsert({
    where: { target: 'PROFESSOR' },
    update: {
      title: 'فرم اطلاعات استاد',
      schema: PROFESSOR_FORM_SCHEMA,
    },
    create: {
      target: 'PROFESSOR',
      title: 'فرم اطلاعات استاد',
      schema: PROFESSOR_FORM_SCHEMA,
    },
  });

  await prisma.formSchema.upsert({
    where: { target: 'ACTIVITY' },
    update: {
      title: 'فرم فعالیت پژوهشی',
      schema: ACTIVITY_FORM_SCHEMA,
    },
    create: {
      target: 'ACTIVITY',
      title: 'فرم فعالیت پژوهشی',
      schema: ACTIVITY_FORM_SCHEMA,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
