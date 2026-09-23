import { FiBookOpen } from "react-icons/fi";

import type { ProfessorActivity } from "@/types/professor";

import { formatProfessorActivityDate } from "./professor-detail.utils";

export default function ProfessorActivityList({ activities }: { activities: ProfessorActivity[] }) {
    return (
        <section className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--color-text)]">
                <FiBookOpen size={18} className="text-[var(--color-base-jade-4)]" />
                فعالیت‌ها
                <span className="rounded-full bg-[var(--color-base-jade-1)] px-2 py-0.5 text-xs text-[var(--color-base-jade-5)]">
                    {activities.length.toLocaleString("fa-IR")}
                </span>
            </h2>
            {activities.length === 0 ? (
                <p className="text-sm text-[var(--color-text-soft)]">فعالیتی ثبت نشده است.</p>
            ) : (
                <ul className="space-y-3">
                    {activities.map((activity) => (
                        <li key={activity.id ?? activity.sourceId} className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] sm:p-5">
                            <span className="mb-1.5 inline-block rounded-md bg-[var(--color-base-jade-1)] px-2 py-0.5 text-xs text-[var(--color-base-jade-5)]">{activity.type}</span>
                            <p className="font-medium text-[var(--color-text)]">{activity.titleFa}</p>
                            {activity.titleEn && <p className="mt-0.5 text-sm text-[var(--color-text-soft)]" dir="ltr">{activity.titleEn}</p>}
                            {activity.description && <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{activity.description}</p>}
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-muted)]">
                                {formatProfessorActivityDate(activity.date) && <span>تاریخ فعالیت: {formatProfessorActivityDate(activity.date)}</span>}
                                {activity.sourceId && <span dir="ltr">Source ID: {activity.sourceId}</span>}
                                {activity.sortOrder !== undefined && activity.sortOrder !== null && (
                                    <span>ترتیب نمایش: {activity.sortOrder.toLocaleString("fa-IR")}</span>
                                )}
                                {formatProfessorActivityDate(activity.createdAt) && <span>ثبت: {formatProfessorActivityDate(activity.createdAt)}</span>}
                                {formatProfessorActivityDate(activity.updatedAt) && <span>به‌روزرسانی: {formatProfessorActivityDate(activity.updatedAt)}</span>}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
