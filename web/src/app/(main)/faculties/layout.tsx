import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "دانشکده‌ها";
const description = "فهرست دانشکده‌های دانشگاه و اعضای هیئت علمی هر دانشکده.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/faculties",
  },
  openGraph: { title, description, url: "/faculties" },
  twitter: { card: "summary", title, description },
};

export default function FacultiesLayout({ children }: { children: ReactNode }) {
  return children;
}
