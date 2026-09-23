import Image from "next/image";
import { FaDownload, FaEnvelope } from "react-icons/fa";

import { getAvatarSrc } from "@/lib/Avatar";
import type { Professor } from "@/types/professor";

import { StatBox } from "./StatBox";

export default function ProfessorProfileHeader({ professor }: { professor: Professor }) {
    const stats = [
        { label: "کل فعالیت‌ها", value: professor.activities?.length ?? 0 },
        { label: "مقالات", value: professor.stats?.papers ?? 0 },
        { label: "پایان‌نامه", value: professor.stats?.theses ?? 0 },
    ];

    return (
        <section className="mb-8 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-sm">
            <div className="h-2 w-full bg-[var(--color-base-jade-4)]" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 md:p-8 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-right lg:items-center">
                    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-base-gray-0)] shadow-sm">
                        <Image src={getAvatarSrc(professor.avatar)} alt={professor.displayName} width={140} height={176} sizes="140px" className="h-36 w-32 object-cover sm:h-[176px] sm:w-[140px]" />
                    </div>
                    <div className="space-y-3">
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{professor.displayName}</h2>
                            <p className="mt-1 text-[15px] text-[var(--color-text-muted)]">{professor.rank} — {professor.faculty}</p>
                        </div>
                        {professor.isFaculty && (
                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-base-jade-2)] bg-[var(--color-base-jade-0)] px-3 py-1 text-sm text-[var(--color-base-jade-7)]">
                                <span className="h-2 w-2 rounded-full bg-[var(--color-base-jade-4)]" />
                                Faculty Member
                            </div>
                        )}
                        <div className="flex flex-col items-stretch gap-3 pt-2 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
                            {professor.email && (
                                <a href={`mailto:${professor.email}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--color-base-gray-0)] px-3 text-sm text-[var(--color-text-soft)] transition hover:text-[var(--color-base-jade-6)]">
                                    <FaEnvelope className="text-[var(--color-base-jade-5)]" /> {professor.email}
                                </a>
                            )}
                            {professor.cvUrl && (
                                <a href={professor.cvUrl} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-base-jade-4)] bg-[var(--color-base-jade-0)] px-3 py-2 text-sm font-medium text-[var(--color-base-jade-7)] transition hover:bg-[var(--color-base-jade-1)]">
                                    <FaDownload /> دانلود CV استاد
                                </a>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[360px]">
                    {stats.map((item) => <StatBox key={item.label} {...item} />)}
                </div>
            </div>
        </section>
    );
}
