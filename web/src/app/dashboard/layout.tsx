import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import DashboardSidebar from "./components/DashboardSidebar";

export const metadata: Metadata = {
    title: "داشبورد",
    openGraph: null,
    twitter: null,
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
            <div dir="rtl" className="flex min-h-dvh bg-[var(--color-bg)]">
                <DashboardSidebar />
                <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-20 sm:px-6 lg:px-10 lg:py-9">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </main>
            </div>
        </AuthProvider>
    );
}
