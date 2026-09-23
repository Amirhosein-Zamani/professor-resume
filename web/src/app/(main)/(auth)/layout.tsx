import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "ورود",
    openGraph: null,
    twitter: null,
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

export default function AuthLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <main className="flex min-h-[calc(100dvh-9rem)] items-center justify-center px-4 py-8 sm:py-12">
            {children}
        </main>
    );
}
