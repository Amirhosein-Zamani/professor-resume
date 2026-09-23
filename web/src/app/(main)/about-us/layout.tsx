import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "درباره سامانه";
const description =
  "با سامانه جامع رزومه، سوابق علمی، پژوهشی و آموزشی اساتید دانشگاه آشنا شوید.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/about-us",
  },
  openGraph: { title, description, url: "/about-us" },
  twitter: { card: "summary", title, description },
};

export default function AboutUsLayout({ children }: { children: ReactNode }) {
  return children;
}
