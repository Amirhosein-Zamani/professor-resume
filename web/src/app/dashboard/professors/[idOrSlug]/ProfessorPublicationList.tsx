import { FiFileText } from "react-icons/fi";

import type { ProfessorPublication } from "@/types/professor";

import { formatProfessorActivityDate } from "./professor-detail.utils";

function MetaItem({ label, value, ltr = false }: { label: string; value?: string | number | null; ltr?: boolean }) {
    if (value === null || value === undefined || value === "") return null;
    return (
        <div className="min-w-0">
            <dt className="text-xs text-[var(--color-text-muted)]">{label}</dt>
            <dd dir={ltr ? "ltr" : "rtl"} className={`mt-0.5 break-words text-sm text-[var(--color-text-soft)] ${ltr ? "text-left" : "text-right"}`}>
                {value}
            </dd>
        </div>
    );
}

export default function ProfessorPublicationList({ publications }: { publications: ProfessorPublication[] }) {
    return (
        <section className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--color-text)]">
                <FiFileText size={18} className="text-[var(--color-base-jade-4)]" />
                مقالات همگام‌شده
                <span className="rounded-full bg-[var(--color-base-jade-1)] px-2 py-0.5 text-xs text-[var(--color-base-jade-5)]">
                    {publications.length.toLocaleString("fa-IR")}
                </span>
            </h2>

            {publications.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[var(--color-border)] p-5 text-sm text-[var(--color-text-soft)]">
                    مقاله‌ای از سامانه گلستان ثبت نشده است.
                </p>
            ) : (
                <ul className="space-y-3">
                    {publications.map((publication) => (
                        <li key={publication.id} className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] sm:p-5">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <h3 className="min-w-0 text-sm font-semibold leading-7 text-[var(--color-text)] sm:text-base">
                                    {publication.title}
                                </h3>
                                {publication.year && (
                                    <span className="w-fit shrink-0 rounded-md bg-[var(--color-base-jade-1)] px-2.5 py-1 text-xs font-medium text-[var(--color-base-jade-5)]">
                                        {publication.year.toLocaleString("fa-IR", { useGrouping: false })}
                                    </span>
                                )}
                            </div>

                            <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-[var(--color-border)] pt-4 sm:grid-cols-2 lg:grid-cols-3">
                                <MetaItem label="نویسندگان" value={publication.authors} />
                                <MetaItem label="نشریه" value={publication.journal} />
                                <MetaItem label="نوع مقاله" value={publication.journalArticleType} />
                                <MetaItem label="عنوان فارسی نشریه یا همایش" value={publication.persianJournalOrConfTitle} />
                                <MetaItem label="عنوان لاتین نشریه یا همایش" value={publication.latinJournalOrConfTitle} ltr />
                                <MetaItem label="محل چاپ" value={publication.printPlace} />
                                <MetaItem label="زبان" value={publication.language} />
                                <MetaItem label="شماره مقاله گلستان" value={publication.golestanArticleNo} ltr />
                                <MetaItem label="DOI" value={publication.doi} ltr />
                                <MetaItem label="تاریخ ثبت فعالیت" value={formatProfessorActivityDate(publication.activityRegisteredAt)} />
                            </dl>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
