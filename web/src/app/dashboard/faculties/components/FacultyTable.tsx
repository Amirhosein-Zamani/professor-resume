"use client";

import FacultyMobileCard from "./FacultyMobileCard";
import FacultyTableEmptyState from "./FacultyTableEmptyState";
import FacultyTableRow from "./FacultyTableRow";
import FacultyTableSkeleton from "./FacultyTableSkeleton";
import type { FacultyTableProps } from "./faculty-table.types";

const HEADERS = ["#", "آیکن", "نام دانشکده", "تاریخ ایجاد", "عملیات"];

export default function FacultyTable(props: FacultyTableProps) {
    const { faculties, loading, search, editingId } = props;
    const itemActions = {
        editingName: props.editingName,
        editingIconFile: props.editingIconFile,
        submitting: props.submitting,
        onEdit: props.onEdit,
        onDelete: props.onDelete,
        onEditName: props.onEditName,
        onEditIcon: props.onEditIcon,
        onUpdate: props.onUpdate,
        onCancelEdit: props.onCancelEdit,
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] shadow-[0_4px_20px_rgba(30,61,57,0.06)]">
            <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-base-gray-0)] px-5 py-4">
                <div>
                    <h2 className="text-sm font-semibold text-[var(--color-text)]">لیست دانشکده‌ها</h2>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">مدیریت، ویرایش و حذف دانشکده‌ها</p>
                </div>
                <span className="rounded-lg bg-[var(--color-base-jade-0)] px-3 py-1.5 text-xs font-medium text-[var(--color-base-jade-5)]">
                    {faculties.length} مورد
                </span>
            </header>

            {loading ? (
                <FacultyTableSkeleton />
            ) : faculties.length === 0 ? (
                <FacultyTableEmptyState hasSearch={Boolean(search.trim())} />
            ) : (
                <>
                    <div className="divide-y divide-[var(--color-border)] md:hidden">
                        {faculties.map((faculty) => (
                            <FacultyMobileCard
                                key={faculty.id}
                                {...itemActions}
                                faculty={faculty}
                                isEditing={editingId === faculty.id}
                            />
                        ))}
                    </div>
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="border-b border-[var(--color-border)] bg-[var(--color-base-gray-1)]">
                                    {HEADERS.map((header) => (
                                        <th key={header} className="px-5 py-3 text-right text-xs font-semibold text-[var(--color-text-soft)] last:text-left">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-border)]">
                                {faculties.map((faculty, index) => (
                                    <FacultyTableRow
                                        key={faculty.id}
                                        {...itemActions}
                                        faculty={faculty}
                                        index={index}
                                        isEditing={editingId === faculty.id}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}
