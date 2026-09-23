import type { Professor } from "@/types/professor";

export const LINK_LABELS: Record<string, string> = {
    scholar: "Google Scholar",
    researchgate: "ResearchGate",
    scopus: "Scopus",
    website: "وب‌سایت شخصی",
};

export function formatProfessorActivityDate(iso?: string | null) {
    if (!iso) return null;
    try {
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

export function getProfessorCv(professor: Professor) {
    if (!professor.cvUrl) return null;
    let url = professor.cvUrl;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        if (!url.startsWith("/assets/cvs/")) {
            if (!url.includes("/")) url = `/assets/cvs/${url}`;
            else if (url.startsWith("/assets/") && !url.includes("/cvs/")) {
                url = url.replace("/assets/", "/assets/cvs/");
            }
        }
    }

    const parts = url.split("/");
    return { url, fileName: parts[parts.length - 1] || "resume.pdf" };
}

export function getProfessorStats(professor: Professor) {
    if (!professor.stats) return [];
    return [
        { label: "مقالات", value: professor.stats.papers },
        { label: "کتاب‌ها", value: professor.stats.books },
        { label: "همایش‌ها", value: professor.stats.conferences },
        { label: "پایان‌نامه‌ها", value: professor.stats.theses },
    ];
}
