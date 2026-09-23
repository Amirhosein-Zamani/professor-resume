import Card from "@/components/shared/card";
import SearchBarHome from "@/components/shared/SearchBar";
import { getProfessors } from "@/services/professors/Professorsapi";

type ResumesPageProps = {
    searchParams?: Promise<{
        name?: string | string[];
        faculty?: string | string[];
    }>;
};

const getSingleValue = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

export default async function ResumesPage({ searchParams }: ResumesPageProps) {
    const resolvedSearchParams = searchParams ? await searchParams : undefined;

    const name = getSingleValue(resolvedSearchParams?.name) ?? "";
    const faculty = getSingleValue(resolvedSearchParams?.faculty) ?? "";
    const res = await getProfessors({ name, faculty });
    const professors = res.success && res.data ? res.data : [];

    return (
        <div className="bg-bg text-text" dir="rtl">
            <main className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:space-y-10 sm:px-6 sm:py-10 lg:px-8">
                <section>
                    <SearchBarHome
                        initialName={name}
                        initialFaculty={faculty}
                    />
                </section>

                <section className="flex items-center justify-between gap-3 border-b border-border pb-3">
                    <h1 className="text-lg font-bold text-header-bg sm:text-xl lg:text-2xl">
                        لیست رزومه اساتید
                    </h1>
                    <span className="shrink-0 rounded-full bg-base-jade-1 px-3 py-1 text-xs text-base-jade-6 sm:text-sm">
                        {professors.length} استاد
                    </span>
                </section>

                {professors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[var(--color-text-muted)]">
                        <p className="text-lg">هیچ استادی یافت نشد</p>
                    </div>
                ) : (
                    <Card professors={professors} />
                )}
            </main>
        </div>
    );
}
