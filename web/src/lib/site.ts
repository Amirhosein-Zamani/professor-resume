const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = (configuredSiteUrl || "http://localhost:3001").replace(
  /\/$/,
  "",
);

export const SITE_NAME = "سامانه رزومه اساتید دانشگاه";

export const SITE_DESCRIPTION =
  "سامانه جامع مشاهده و جست‌وجوی رزومه، سوابق علمی، پژوهشی و آموزشی اساتید دانشگاه";
