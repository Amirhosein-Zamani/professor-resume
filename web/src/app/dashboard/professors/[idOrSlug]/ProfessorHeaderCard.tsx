import Image from "next/image";
import Link from "next/link";
import { FiDownload, FiEdit2, FiExternalLink, FiMail, FiTrash2 } from "react-icons/fi";

import { getAvatarSrc } from "@/lib/Avatar";
import type { SafeUser } from "@/types/auth";
import type { Professor } from "@/types/professor";

import { getProfessorCv, LINK_LABELS } from "./professor-detail.utils";

type ProfessorHeaderCardProps = {
    professor: Professor;
    user: SafeUser | null;
    onDelete: () => void;
};

export default function ProfessorHeaderCard({ professor, user, onDelete }: ProfessorHeaderCardProps) {
    const cv = getProfessorCv(professor);
    const links = Object.entries(professor.links ?? {}).filter(([, url]) => Boolean(url)) as [string, string][];

    return (
        <section className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-base-jade-1)] text-[var(--color-base-jade-5)]">
                        <Image src={getAvatarSrc(professor.avatar)} width={64} height={64} sizes="64px" alt={professor.displayName} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="truncate text-lg font-bold text-[var(--color-text)] sm:text-xl">{professor.displayName}</h1>
                        <p className="mt-1 text-sm text-[var(--color-text-soft)]">{professor.rank} — {professor.faculty}</p>
                        {professor.specialty && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{professor.specialty}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                    <Link href={`/dashboard/professors/${professor.id}/edit`} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-base-jade-4)] bg-[var(--color-base-jade-1)] px-3.5 py-2 text-sm font-medium text-[var(--color-base-jade-6)] transition hover:bg-[var(--color-base-jade-4)] hover:text-white">
                        <FiEdit2 size={16} /> ویرایش
                    </Link>
                    {user?.role === "ADMIN" && (
                        <button type="button" onClick={onDelete} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-danger)]/40 bg-red-50 px-3.5 py-2 text-sm font-medium text-[var(--color-danger)] transition hover:bg-red-100">
                            <FiTrash2 size={16} /> حذف رزومه
                        </button>
                    )}
                    {cv && (
                        <a href={cv.url} download={cv.fileName} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-base-jade-4)] bg-[var(--color-base-jade-1)] px-3.5 py-2 text-sm font-medium text-[var(--color-base-jade-6)] transition hover:bg-[var(--color-base-jade-4)] hover:text-white">
                            <FiDownload size={16} /> دانلود رزومه
                        </a>
                    )}
                    {professor.email && (
                        <a href={`mailto:${professor.email}`} className="col-span-2 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-3.5 py-2 text-sm text-[var(--color-text)] transition hover:border-[var(--color-base-jade-4)] sm:col-span-1">
                            <FiMail size={14} /> <span dir="ltr">{professor.email}</span>
                        </a>
                    )}
                </div>
            </div>

            {professor.bio && <p className="mt-5 border-t border-[var(--color-border)] pt-5 text-sm leading-7 text-[var(--color-text)]">{professor.bio}</p>}
            {links.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-5">
                    {links.map(([key, url]) => (
                        <a key={key} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-md bg-[var(--color-base-jade-1)] px-3 py-1.5 text-xs font-medium text-[var(--color-base-jade-5)] transition hover:bg-[var(--color-base-jade-2)]">
                            <FiExternalLink size={12} /> {LINK_LABELS[key] ?? key}
                        </a>
                    ))}
                </div>
            )}
        </section>
    );
}
