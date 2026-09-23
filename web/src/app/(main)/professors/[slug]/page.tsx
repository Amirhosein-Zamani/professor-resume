import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { getAvatarSrc } from "@/lib/Avatar";
import { getProfessor } from "@/services/professors/Professorsapi";
import type { ProfessorActivity } from "@/types/professor";

import ProfessorAcademicRecord from "./components/ProfessorAcademicRecord";
import ProfessorProfileHeader from "./components/ProfessorProfileHeader";
import ProfessorProfileSidebar from "./components/ProfessorProfileSidebar";

type Props = {
    params: Promise<{ slug: string }>;
};

const getProfessorCached = cache(getProfessor);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const response = await getProfessorCached(slug);

    if (!response.success || !response.data) {
        return {
            title: "استاد یافت نشد",
            robots: { index: false, follow: false },
        };
    }

    const professor = response.data;
    const description = professor.bio
        ? professor.bio.replace(/\s+/g, " ").trim().slice(0, 160)
        : `رزومه و سوابق علمی، پژوهشی و آموزشی ${professor.displayName} از ${professor.faculty}.`;
    const canonical = `/professors/${encodeURIComponent(slug)}`;
    const avatar = getAvatarSrc(professor.avatar);
    const image = avatar.startsWith("data:") ? "/Images/image0.jpg" : avatar;

    return {
        title: professor.displayName,
        description,
        alternates: { canonical },
        openGraph: {
            type: "profile",
            locale: "fa_IR",
            url: canonical,
            title: professor.displayName,
            description,
            images: [{ url: image, alt: professor.displayName }],
        },
        twitter: {
            card: "summary",
            title: professor.displayName,
            description,
            images: [image],
        },
    };
}

function groupActivities(activities: ProfessorActivity[]) {
    return activities.reduce<Record<string, ProfessorActivity[]>>((groups, item) => {
        const key = item.type || "سایر";
        groups[key] = [...(groups[key] || []), item];
        return groups;
    }, {});
}

export default async function ProfessorPage({ params }: Props) {
    const { slug } = await params;
    const response = await getProfessorCached(slug);
    if (!response.success || !response.data) notFound();

    const professor = response.data;
    const groupedActivities = groupActivities(professor.activities || []);

    return (
        <div dir="rtl" className="bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] sm:px-6 md:py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-5 sm:mb-6">
                    <p className="text-sm text-[var(--color-text-muted)]">صفحه معرفی عضو هیئت علمی</p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">پروفایل علمی استاد</h1>
                </header>
                <ProfessorProfileHeader professor={professor} />
                <div className="grid gap-6 lg:grid-cols-12">
                    <ProfessorProfileSidebar professor={professor} />
                    <ProfessorAcademicRecord groupedActivities={groupedActivities} />
                </div>
            </div>
        </div>
    );
}
