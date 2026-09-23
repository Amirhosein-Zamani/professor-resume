import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/stores/provider/AuthProvider";
import ToastProvider from "@/providers/ToastProvider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "رزومه اساتید",
    "اساتید دانشگاه",
    "اعضای هیئت علمی",
    "سوابق علمی اساتید",
    "مقالات اساتید",
    "دانشکده‌های دانشگاه",
  ],
  creator: "دانشگاه",
  publisher: "دانشگاه",
  category: "education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/Images/image0.jpg",
        width: 600,
        height: 450,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/Images/image0.jpg"],
  },
  icons: {
    icon: "/Images/Logo.png",
    apple: "/Images/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
