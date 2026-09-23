import { FiPlus } from "react-icons/fi";

import DynamicForm from "@/app/dashboard/professors/components/forms/DynamicForm";
import Button from "@/components/ui/Button";
import type { FormValues } from "@/types/form-schema";
import type { ProfessorActivity } from "@/types/professor";

import { ACTIVITY_SCHEMA, toActivityFormValues } from "./activity-form.config";
import ProfessorActivityItem from "./ProfessorActivityItem";

type ProfessorActivitiesSectionProps = {
    activities: ProfessorActivity[];
    editingActivity: ProfessorActivity | null;
    isFormOpen: boolean;
    isSaving: boolean;
    removingId: string | null;
    onOpenCreate: () => void;
    onOpenEdit: (activity: ProfessorActivity) => void;
    onCloseForm: () => void;
    onSave: (values: FormValues) => Promise<void>;
    onRemove: (activity: ProfessorActivity) => Promise<void>;
};

export default function ProfessorActivitiesSection({
    activities,
    editingActivity,
    isFormOpen,
    isSaving,
    removingId,
    onOpenCreate,
    onOpenEdit,
    onCloseForm,
    onSave,
    onRemove,
}: ProfessorActivitiesSectionProps) {
    return (
        <section className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] sm:p-6">
            <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold text-[var(--color-text)]">فعالیت‌های استاد</h2>
                    <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                        فعالیت‌ها را اضافه، ویرایش یا حذف کنید.
                    </p>
                </div>
                {!isFormOpen && (
                    <Button type="button" variant="outline" icon={<FiPlus size={16} />} onClick={onOpenCreate} fullWidth className="sm:w-auto">
                        افزودن فعالیت
                    </Button>
                )}
            </header>

            {isFormOpen && (
                <div className="mb-6 rounded-xl border border-[var(--color-base-jade-3)] bg-[var(--color-base-jade-1)]/40 p-4 sm:p-5">
                    <h3 className="mb-4 text-base font-semibold text-[var(--color-text)]">
                        {editingActivity ? "ویرایش فعالیت" : "افزودن فعالیت جدید"}
                    </h3>
                    <DynamicForm
                        key={editingActivity?.id ?? "new-activity"}
                        target="ACTIVITY"
                        schema={ACTIVITY_SCHEMA}
                        initialValues={toActivityFormValues(editingActivity)}
                        onSubmit={onSave}
                        onCancel={onCloseForm}
                        loading={isSaving}
                        stickyActions={false}
                        submitLabel={editingActivity ? "ذخیره ویرایش" : "افزودن فعالیت"}
                        cancelLabel="انصراف"
                        className="space-y-4"
                    />
                </div>
            )}

            {activities.length === 0 && !isFormOpen ? (
                <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-white/60 p-6 text-center text-sm text-[var(--color-text-soft)]">
                    هنوز فعالیتی برای این استاد ثبت نشده است.
                </div>
            ) : (
                <ul className="space-y-3">
                    {activities.map((activity) => (
                        <ProfessorActivityItem
                            key={activity.id}
                            activity={activity}
                            removing={removingId === activity.id}
                            onEdit={() => onOpenEdit(activity)}
                            onRemove={() => void onRemove(activity)}
                        />
                    ))}
                </ul>
            )}
        </section>
    );
}
