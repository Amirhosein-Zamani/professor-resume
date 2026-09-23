import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "تماس با ما";
const description = "راه‌های ارتباط با پشتیبانی سامانه رزومه اساتید دانشگاه.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/contact-us",
  },
  openGraph: { title, description, url: "/contact-us" },
  twitter: { card: "summary", title, description },
};

export default function ContactUsLayout({ children }: { children: ReactNode }) {
  return children;
}
