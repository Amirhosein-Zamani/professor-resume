import { FiCalendar, FiEdit2, FiTrash2 } from "react-icons/fi";

import Button from "@/components/ui/Button";
import type { ProfessorActivity } from "@/types/professor";

import { formatActivityDate } from "./activity-form.config";

type ProfessorActivityItemProps = {
    activity: ProfessorActivity;
    removing: boolean;
    onEdit: () => void;
    onRemove: () => void;
};

export default function ProfessorActivityItem({
    activity,
    removing,
    onEdit,
    onRemove,
}: ProfessorActivityItemProps) {
    return (
        <li className="flex flex-col gap-4 rounded-xl border border-[var(--color-card-border)] bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-[var(--color-base-jade-1)] px-2.5 py-1 text-xs font-semibold text-[var(--color-base-jade-5)]">
                        {activity.type}
                    </span>
                    {activity.date && (
                        <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                            <FiCalendar size={13} />
                            {formatActivityDate(activity.date)}
                        </span>
                    )}
                </div>
                <p className="font-semibold text-[var(--color-text)]">
                    {activity.titleFa || "بدون عنوان"}
                </p>
                {activity.titleEn && (
                    <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                        {activity.titleEn}
                    </p>
                )}
                {activity.description && (
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                        {activity.description}
                    </p>
                )}
            </div>

            <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
                <Button type="button" variant="secondary" size="sm" icon={<FiEdit2 size={15} />} onClick={onEdit}>
                    ویرایش
                </Button>
                <Button type="button" variant="danger" size="sm" icon={<FiTrash2 size={15} />} loading={removing} onClick={onRemove}>
                    حذف
                </Button>
            </div>
        </li>
    );
}
