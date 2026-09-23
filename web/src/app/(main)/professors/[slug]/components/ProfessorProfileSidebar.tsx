import type { Professor } from "@/types/professor";

import { LinkButton } from "./LinkButton";

const LINKS = [
    ["scholar", "Google Scholar"],
    ["researchgate", "ResearchGate"],
    ["scopus", "Scopus"],
    ["website", "وبسایت شخصی"],
] as const;

export default function ProfessorProfileSidebar({ professor }: { professor: Professor }) {
    const availableLinks = LINKS.filter(([key]) => professor.links?.[key]);
    return (
        <aside className="space-y-6 lg:col-span-4 xl:col-span-3">
            {availableLinks.length > 0 && (
                <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 shadow-sm">
                    <header className="mb-4">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Academic Links</p>
                        <h3 className="mt-1 text-lg font-bold text-[var(--color-text)]">لینک‌های علمی</h3>
                    </header>
                    <div className="space-y-3">
                        {availableLinks.map(([key, label]) => (
                            <LinkButton key={key} text={label} href={professor.links![key]!} />
                        ))}
                    </div>
                </section>
            )}
            {professor.bio && (
                <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 shadow-sm">
                    <h3 className="mb-3 text-base font-bold">درباره این استاد</h3>
                    <p className="text-sm leading-7 text-[var(--color-text-muted)]">{professor.bio}</p>
                </section>
            )}
        </aside>
    );
}
