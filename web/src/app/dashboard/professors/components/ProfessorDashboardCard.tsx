import Image from "next/image";
import Link from "next/link";

import { getAvatarSrc } from "@/lib/Avatar";
import type { ProfessorListItem } from "@/types/professor";

export default function ProfessorDashboardCard({ professor }: { professor: ProfessorListItem }) {
    return (
        <Link href={`/dashboard/professors/${professor.slug}`} className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] transition active:scale-[.985] sm:p-5 lg:hover:border-[var(--color-base-jade-4)]">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-base-jade-1)] text-[var(--color-base-jade-5)]">
                    <Image src={getAvatarSrc(professor.avatar)} width={44} height={44} sizes="44px" alt={professor.displayName} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                    <p className="truncate font-semibold text-[var(--color-text)]">{professor.displayName}</p>
                    <p className="truncate text-sm text-[var(--color-text-soft)]">{professor.rank} — {professor.faculty}</p>
                </div>
            </div>
        </Link>
    );
}
