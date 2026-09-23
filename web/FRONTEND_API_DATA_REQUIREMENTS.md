# نیازمندی داده‌های API برای فرانت‌اند

این سند بر اساس بررسی فایل‌های داخل `src/app`، `src/components` و `src/constants` نوشته شده است. در وضعیت فعلی پروژه هیچ `fetch`، `axios` یا API call واقعی وجود ندارد و داده‌ها به صورت hardcode یا از فایل local خوانده می‌شوند.

## Layout عمومی همه صفحات

فایل‌ها:

- `src/app/layout.tsx`
- `src/components/layouts/layout.tsx`
- `src/components/layouts/header/Navbar.tsx`
- `src/components/layouts/header/NavLinks.tsx`
- `src/components/shared/Logo.tsx`
- `src/components/shared/Title.tsx`
- `src/components/layouts/footer/Footer.tsx`

داده‌های نمایش داده شده در همه صفحات:

- لوگوی سایت:
  - `src`: مسیر تصویر لوگو، فعلاً `/Images/Logo.png`
  - `alt`: متن جایگزین لوگو، فعلاً `logo`
  - `href`: لینک مقصد لوگو، فعلاً `https://du.ac.ir/fa`
- عنوان سامانه:
  - متن عنوان، فعلاً «سامانه رزومه اساتید دانشگاه»
- لینک‌های منوی اصلی:
  - خانه: `/`
  - اساتید: `/professors`
  - دانشکده‌ها: `/faculties`
  - درباره ما: `/about-us`
  - تماس با ما: `/contact-us`
- متن کپی‌رایت فوتر:
  - سال جاری از سمت کلاینت ساخته می‌شود.
  - متن ثابت «تمامی حقوق محفوظ است»

API لازم برای این بخش، اگر قرار است داینامیک شود:

```ts
type SiteLayoutData = {
  logo: {
    imageUrl: string;
    alt: string;
    href: string;
  };
  title: string;
  navigation: Array<{
    label: string;
    href: string;
  }>;
  footer: {
    copyrightText: string;
  };
};
```

## صفحه اصلی `/`

فایل‌ها:

- `src/app/page.tsx`
- `src/app/(Home)/components/Hero.tsx`
- `src/components/shared/SearchBar.tsx`
- `src/app/(Home)/components/Faculty.tsx`

بخش Hero:

- تیتر اصلی صفحه
- بخش برجسته داخل تیتر
- متن توضیحی زیر تیتر
- تصویر Hero:
  - `src`: فعلاً `/Images/image0.jpg`
  - `alt`: فعلاً `univercity`

بخش جستجو:

- ورودی نام و نام خانوادگی استاد:
  - `name` یا `query`
  - placeholder
- فیلتر دانشکده:
  - مقدار انتخاب‌شده
  - لیست گزینه‌ها، فعلاً:
    - همه دانشکده‌ها
    - مهندسی کامپیوتر
    - علوم پایه
- فیلتر گروه آموزشی:
  - مقدار انتخاب‌شده
  - لیست گزینه‌ها، فعلاً:
    - همه گروه‌ها
    - هوش مصنوعی
    - نرم‌افزار

بخش دانشکده‌های صفحه اصلی:

- عنوان بخش
- لینک مشاهده همه به `/faculties`
- لیست ۴ آیتم دانشکده. در کد فعلی این ۴ آیتم از `[1, 2, 3, 4]` ساخته می‌شوند و برای همه آن‌ها داده‌های زیر نمایش داده می‌شود:
  - آیکن ثابت کتاب
  - نام دانشکده با الگوی «دانشکده مهندسی {شماره}»
  - تعداد استاد، فعلاً «۳۲ استاد عضو هیئت علمی»

API لازم برای این صفحه:

```ts
type HomePageData = {
  hero: {
    title: string;
    highlightedTitle: string;
    description: string;
    image: {
      src: string;
      alt: string;
    };
  };
  searchFilters: {
    faculties: Array<{
      id: string | number;
      name: string;
    }>;
    groups: Array<{
      id: string | number;
      name: string;
      facultyId?: string | number;
    }>;
  };
  featuredFaculties: Array<{
    id: string | number;
    name: string;
    professorCount: number;
    icon?: string;
  }>;
};
```

پارامترهای مورد نیاز برای API جستجوی استاد از این صفحه:

```ts
type ProfessorSearchQuery = {
  name?: string;
  facultyId?: string | number;
  groupId?: string | number;
};
```

## صفحه لیست اساتید `/professors`

فایل‌ها:

- `src/app/professors/page.tsx`
- `src/components/shared/SearchBar.tsx`
- `src/components/shared/card.tsx`

بخش جستجو:

- همان داده‌های فیلتر صفحه اصلی:
  - نام و نام خانوادگی استاد
  - لیست دانشکده‌ها
  - لیست گروه‌های آموزشی

بخش لیست رزومه اساتید:

- عنوان صفحه، فعلاً «لیست رزومه اساتید»
- لیست کارت استادها

هر کارت استاد این داده‌ها را نمایش می‌دهد:

- `id`: شناسه استاد، برای لینک به `/professors/{id}`
- `name`: نام کامل استاد
- `rank`: مرتبه علمی
- `faculty`: دانشکده یا گروه/رشته نمایش داده شده زیر کارت
- `isFaculty`: اگر `true` باشد برچسب «عضو هیئت علمی» نمایش داده می‌شود
- `avatar`: تصویر استاد
- `links.scholar`: لینک Google Scholar، اگر مقدار داشته باشد دکمه Scholar نمایش داده می‌شود
- `links.researchgate`: لینک ResearchGate، اگر مقدار داشته باشد دکمه RG نمایش داده می‌شود
- `links.scopus`: لینک Scopus، اگر مقدار داشته باشد دکمه Scopus نمایش داده می‌شود

API لازم برای این صفحه:

```ts
type ProfessorsListResponse = {
  filters: {
    faculties: Array<{
      id: string | number;
      name: string;
    }>;
    groups: Array<{
      id: string | number;
      name: string;
      facultyId?: string | number;
    }>;
  };
  professors: Array<{
    id: string | number;
    name: string;
    rank: string;
    faculty: string;
    isFaculty: boolean;
    avatar: string;
    links?: {
      scholar?: string;
      researchgate?: string;
      scopus?: string;
    };
  }>;
};
```

پارامترهای مورد نیاز برای API لیست اساتید:

```ts
type ProfessorsListQuery = {
  name?: string;
  facultyId?: string | number;
  groupId?: string | number;
};
```

## صفحه جزئیات استاد `/professors/[Id]`

فایل‌ها:

- `src/app/professors/[Id]/page.tsx`
- `src/app/professors/[Id]/components/ActivitySection.tsx`
- `src/app/professors/[Id]/components/StatBox.tsx`
- `src/app/professors/[Id]/components/LinkButton.tsx`
- `src/app/professors/[Id]/components/Card.tsx`
- `src/app/data/mortazaviActivities.ts`

نکته مهم:

- در وضعیت فعلی این صفحه از پارامتر `Id` استفاده نمی‌کند.
- همیشه داده‌های `rezaMortazavi` از فایل local نمایش داده می‌شود.
- تصویر استاد، ایمیل، لینک CV و لینک‌های علمی در خود صفحه hardcode شده‌اند.

بخش هدر پروفایل:

- عنوان کوچک صفحه
- عنوان اصلی صفحه
- تصویر استاد:
  - `src`: فعلاً `/Images/mortazavi.webp`
  - `alt`: از `firstName + lastName` ساخته می‌شود
- `firstName`: نام استاد
- `lastName`: نام خانوادگی استاد
- عنوان/وضعیت عضویت، فعلاً «عضو هیئت علمی»
- badge انگلیسی، فعلاً `Faculty Member`
- ایمیل:
  - مقدار نمایشی، فعلاً `test@test.com`
  - لینک `mailto:test@test.com`
- فایل CV:
  - لینک دانلود، فعلاً `/cv/reza-mortazavi-cv.pdf`

بخش آمار:

- کل فعالیت‌ها:
  - از `activities.length` محاسبه می‌شود
- تعداد مقالات:
  - تعداد activityهایی که `type` برابر «مقاله علمی» دارند
- تعداد پایان‌نامه/رساله:
  - تعداد activityهایی که `type` برابر «پایان نامه / رساله» دارند

بخش لینک‌های علمی:

- Google Scholar:
  - متن دکمه `Google Scholar`
  - لینک فعلاً `#`
- ResearchGate:
  - متن دکمه `ResearchGate`
  - لینک فعلاً `#`

بخش درباره پروفایل:

- متن توضیحی ثابت درباره پروفایل استاد

بخش فعالیت‌های علمی و پژوهشی:

- فعالیت‌ها بر اساس فیلد `type` گروه‌بندی می‌شوند.
- برای هر گروه فعالیت این داده‌ها نمایش داده می‌شود:
  - عنوان گروه: `type`
  - تعداد موارد گروه: `items.length`
  - لیست فعالیت‌ها، صفحه‌بندی‌شده با ۵ آیتم در هر صفحه

هر activity این داده‌ها را دارد:

- `id`: شناسه فعالیت
- `type`: نوع فعالیت
- `titleFa`: عنوان فارسی، اختیاری
- `titleEn`: عنوان انگلیسی، اختیاری

نوع‌های activity موجود در داده فعلی:

- طرح پژوهشی
- مقاله علمی
- کتاب
- سایر فعالیت‌های پژوهشی
- خدمات اجرایی
- پایان نامه / رساله

API لازم برای این صفحه:

```ts
type ProfessorDetailResponse = {
  id: string | number;
  firstName: string;
  lastName: string;
  fullName?: string;
  nationalCode?: string;
  avatar: string;
  academicTitle?: string;
  rank?: string;
  faculty?: string;
  department?: string;
  isFaculty: boolean;
  email?: string;
  cvUrl?: string;
  links?: {
    scholar?: string;
    researchgate?: string;
    scopus?: string;
  };
  about?: string;
  activities: Array<{
    id: string | number;
    type: string;
    titleFa?: string;
    titleEn?: string;
  }>;
};
```

پارامتر لازم برای API جزئیات استاد:

```ts
type ProfessorDetailParams = {
  id: string | number;
};
```

## صفحه دانشکده‌ها `/faculties`

فایل:

- `src/app/faculties/page.tsx`

داده‌های نمایش داده شده:

- عنوان صفحه، فعلاً «تمامی دانشکده‌ها»
- توضیح صفحه، فعلاً متن معرفی لیست دانشکده‌ها
- لیست دانشکده‌ها

هر کارت دانشکده این داده‌ها را نمایش می‌دهد:

- `id`: شناسه دانشکده
- `name`: نام دانشکده
- `count`: تعداد استاد عضو هیئت علمی
- `icon`: آیکن نمایشی

لیست فعلی شامل ۸ دانشکده است:

- دانشکده مهندسی، تعداد ۳۲
- دانشکده علوم پایه، تعداد ۲۵
- دانشکده علوم انسانی، تعداد ۴۰
- دانشکده هنر و معماری، تعداد ۱۸
- دانشکده کشاورزی، تعداد ۲۲
- دانشکده مدیریت، تعداد ۳۰
- دانشکده پزشکی، تعداد ۵۵
- دانشکده حقوق، تعداد ۲۰

API لازم برای این صفحه:

```ts
type FacultiesPageResponse = {
  title: string;
  description: string;
  faculties: Array<{
    id: string | number;
    name: string;
    professorCount: number;
    icon?: string;
  }>;
};
```

## صفحه درباره ما `/about-us`

فایل:

- `src/app/about-us/page.tsx`

داده‌های نمایش داده شده:

- عنوان صفحه
- توضیح کوتاه زیر عنوان
- بخش معرفی سامانه:
  - عنوان بخش
  - متن توضیحی
- بخش اهداف سامانه:
  - عنوان بخش
  - لیست ۴ هدف
- هر هدف شامل این داده‌ها است:
  - عنوان هدف
  - توضیح هدف
- بخش تماس با ما:
  - عنوان بخش
  - نام دانشگاه/سازمان
  - نام مرکز
  - ایمیل
  - تلفن

API لازم برای این صفحه، اگر محتوا قرار است داینامیک شود:

```ts
type AboutPageResponse = {
  title: string;
  subtitle: string;
  intro: {
    title: string;
    body: string;
  };
  goals: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  contact: {
    title: string;
    organizationName: string;
    centerName: string;
    email: string;
    phone: string;
  };
};
```

## صفحه تماس با ما `/contact-us`

فایل:

- `src/app/contact-us/page.tsx`

داده‌های نمایش داده شده:

- عنوان صفحه
- اطلاعات تماس:
  - نام دانشگاه/مرکز
  - ایمیل
  - تلفن
  - آدرس
- فرم تماس
- پیام موفقیت بعد از ارسال فرم

فیلدهای فرم تماس:

- `name`: نام کامل، اجباری
- `email`: ایمیل، اجباری
- `subject`: موضوع، اختیاری
- `message`: پیام، اجباری

در وضعیت فعلی submit فرم فقط در کلاینت انجام می‌شود، مقدار `status` را `success` می‌کند و داده‌های فرم را خالی می‌کند. هیچ درخواست API ارسال نمی‌شود.

API لازم برای محتوای صفحه:

```ts
type ContactPageResponse = {
  title: string;
  contactInfo: {
    organizationName: string;
    email: string;
    phone: string;
    address: string;
  };
  successMessage: string;
};
```

API لازم برای ارسال فرم:

```ts
type ContactFormRequest = {
  name: string;
  email: string;
  subject?: string;
  message: string;
};

type ContactFormResponse = {
  success: boolean;
  message: string;
};
```

## کامپوننت جستجوی لیست اساتید

فایل:

- `src/app/professors/components/SearchBarList.tsx`

این کامپوننت در صفحه فعلی `/professors` استفاده نشده است، اما اگر استفاده شود داده‌های زیر را نیاز دارد:

- `name`: متن جستجوی نام استاد
- `faculty`: دانشکده انتخاب‌شده
- `group`: گروه آموزشی انتخاب‌شده
- لیست دانشکده‌ها
- لیست گروه‌های آموزشی

خروجی تغییرات فیلترها به شکل زیر است:

```ts
type SearchBarListChange = {
  name: string;
  faculty: string;
  group: string;
};
```

## جمع‌بندی endpointهای لازم

حداقل APIهای مورد نیاز بر اساس وضعیت فعلی UI:

- `GET /site-layout`
  - داده‌های لوگو، عنوان سایت، navigation و footer
- `GET /home`
  - داده‌های Hero، فیلترهای جستجو و دانشکده‌های منتخب صفحه اصلی
- `GET /professors`
  - لیست استادها
  - ورودی query: `name`, `facultyId`, `groupId`
- `GET /professors/{id}`
  - جزئیات کامل استاد، لینک‌ها، CV و activityها
- `GET /faculties`
  - لیست دانشکده‌ها همراه تعداد استاد
- `GET /about-us`
  - محتوای صفحه درباره ما
- `GET /contact-us`
  - محتوای اطلاعات تماس صفحه تماس با ما
- `POST /contact-us`
  - ارسال فرم تماس

اگر محتواهای ثابت مثل درباره ما، Hero، footer و navigation قرار نیست از بک‌اند مدیریت شوند، endpointهای ضروری فقط این‌ها هستند:

- `GET /professors`
- `GET /professors/{id}`
- `GET /faculties`
- `POST /contact-us`

