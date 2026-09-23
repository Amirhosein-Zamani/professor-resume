"use client";

import Link from "next/link";
import { FiPlus, FiUser } from "react-icons/fi";

import DashboardProfessorFilters from "./DashboardProfessorFilters";
import ProfessorDashboardCard from "./ProfessorDashboardCard";
import { useProfessorsList } from "./useProfessorsList";

export default function ProfessorsList() {
    const list = useProfessorsList();
    const hasFilters = Boolean(list.filters.name || list.filters.faculty);

    return (
        <div>
            <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">اساتید</h1>
                    <p className="mt-1.5 text-[var(--color-text-soft)]">مدیریت رزومه‌های اعضای هیئت علمی</p>
                </div>
                <Link href="/dashboard/professors/new" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-button-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-button-primary-text)] transition hover:bg-[var(--color-button-primary-hover)] sm:w-auto">
                    <FiPlus size={16} /> افزودن استاد جدید
                </Link>
            </header>

            <DashboardProfessorFilters onChange={list.setFilters} />

            {list.isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-[var(--color-base-jade-1)]/60" />)}
                </div>
            ) : list.error ? (
                <div className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-6 text-[var(--color-danger)]">{list.error}</div>
            ) : list.professors.length === 0 ? (
                <EmptyProfessors />
            ) : (
                <>
                    <div className="mb-4 flex items-center justify-between text-sm text-[var(--color-text-soft)]">
                        <span>{list.filtered.length} استاد</span>
                        {hasFilters && <span>نتیجه فیلترهای اعمال‌شده</span>}
                    </div>
                    {list.filtered.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[var(--color-border)] py-12 text-center text-[var(--color-text-soft)]">هیچ استادی با این فیلترها پیدا نشد.</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {list.visible.map((professor) => <ProfessorDashboardCard key={professor.id} professor={professor} />)}
                        </div>
                    )}
                    {list.filtered.length > list.visibleCount && (
                        <div className="mt-6 flex justify-center">
                            <button type="button" onClick={list.showMore} className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] hover:border-[var(--color-base-jade-4)]">نمایش بیشتر</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function EmptyProfessors() {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center text-[var(--color-text-soft)]">
            <FiUser size={32} className="mb-3 opacity-40" />
            <p>هنوز استادی ثبت نشده است.</p>
            <Link href="/dashboard/professors/new" className="mt-4 font-medium text-[var(--color-link)]">افزودن اولین استاد</Link>
        </div>
    );
}
