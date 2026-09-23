import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "اساتید";
const description =
  "فهرست اساتید دانشگاه و جست‌وجو بر اساس نام و دانشکده.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/professors",
  },
  openGraph: { title, description, url: "/professors" },
  twitter: { card: "summary", title, description },
};

export default function ProfessorsLayout({ children }: { children: ReactNode }) {
  return children;
}
