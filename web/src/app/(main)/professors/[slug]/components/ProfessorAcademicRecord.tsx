import type { ProfessorActivity } from "@/types/professor";

import { ActivitySection } from "./ActivitySection";

export default function ProfessorAcademicRecord({
    groupedActivities,
}: {
    groupedActivities: Record<string, ProfessorActivity[]>;
}) {
    const entries = Object.entries(groupedActivities);
    return (
        <main className="space-y-6 lg:col-span-8 xl:col-span-9">
            <header className="mb-1">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Academic Record</p>
                <h2 className="mt-1 text-xl font-bold md:text-2xl">فعالیت‌های علمی و پژوهشی</h2>
            </header>
            {entries.length === 0 ? (
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-8 text-center text-[var(--color-text-muted)]">
                    فعالیتی برای این استاد ثبت نشده است.
                </div>
            ) : (
                <div className="space-y-5">
                    {entries.map(([type, items]) => <ActivitySection key={type} title={type} items={items} />)}
                </div>
            )}
        </main>
    );
}
