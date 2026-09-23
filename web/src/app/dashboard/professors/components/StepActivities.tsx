// components/professors/StepActivities.tsx

"use client";

import { useState } from "react";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { addProfessorActivity, updateProfessorActivity } from "@/services/professors/Professorsapi";
import { CreateActivityPayload, ProfessorActivity } from "@/types/professor";
import { FormValues } from "@/types/form-schema";
import Button from "@/components/ui/Button";
import DynamicForm from "./forms/DynamicForm";

type StepActivitiesProps = {
    professorId: string;
    professorSlug: string;
    onFinish: () => void;
    initialActivities?: ProfessorActivity[];
};

export default function StepActivities({
    professorId,
    onFinish,
    initialActivities = [],
}: StepActivitiesProps) {
    const [activities, setActivities] = useState<ProfessorActivity[]>(initialActivities);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleAddActivity = async (values: FormValues) => {
        setLoading(true);
        try {
            const payload: CreateActivityPayload = {
                type: values.type || "",
                titleFa: values.titleFa || "",
                titleEn: values.titleEn || "",
                description: values.description || "",
                date: values.date || "",
                sortOrder: activities.length,
            };

            const response = await addProfessorActivity(professorId, payload);

            if (response.success && response.data) {
                setActivities([...activities, response.data]);
                setShowForm(false);
            } else {
                alert(response.error || "خطا در افزودن فعالیت");
            }
        } catch (error) {
            console.error("Error adding activity:", error);
            alert("خطا در افزودن فعالیت");
        } finally {
            setLoading(false);
        }
    };

    const handleEditActivity = async (values: FormValues) => {
        if (editingIndex === null) return;

        setLoading(true);
        try {
            const activity = activities[editingIndex];
            if (!activity.id) return;

            const payload: Partial<CreateActivityPayload> = {
                type: values.type,
                titleFa: values.titleFa,
                titleEn: values.titleEn,
                description: values.description,
                date: values.date,
            };

            const response = await updateProfessorActivity(professorId, activity.id, payload);

            if (response.success && response.data) {
                const newActivities = [...activities];
                newActivities[editingIndex] = response.data;
                setActivities(newActivities);
                setEditingIndex(null);
                setShowForm(false);
            } else {
                alert(response.error || "خطا در ویرایش فعالیت");
            }
        } catch (error) {
            console.error("Error editing activity:", error);
            alert("خطا در ویرایش فعالیت");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteActivity = (index: number) => {
        if (confirm("آیا از حذف این فعالیت اطمینان دارید؟")) {
            const newActivities = activities.filter((_, i) => i !== index);
            setActivities(newActivities);
            // توجه: در حالت واقعی باید API delete هم فراخوانی شود
        }
    };

    const handleFormSubmit = (values: FormValues) => {
        if (editingIndex !== null) {
            return handleEditActivity(values);
        }
        return handleAddActivity(values);
    };

    return (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
            <div className="mb-6 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    فعالیت‌های علمی
                </h2>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingIndex(null);
                        setShowForm(!showForm);
                    }}
                    disabled={loading}
                >
                    <FiPlus className="ml-1" />
                    افزودن فعالیت
                </Button>
            </div>

            {/* لیست فعالیت‌ها */}
            {activities.length > 0 && (
                <div className="mb-6 space-y-3">
                    {activities.map((activity, index) => (
                        <div
                            key={activity.id || index}
                            className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between"
                        >
                            <div>
                                <div className="font-medium text-[var(--color-text)]">
                                    {activity.titleFa}
                                </div>
                                <div className="text-sm text-[var(--color-text-soft)]">
                                    {activity.type} {activity.date && `• ${activity.date}`}
                                </div>
                                {activity.description && (
                                    <div className="mt-1 text-sm text-[var(--color-text-muted)]">
                                        {activity.description}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => {
                                        setEditingIndex(index);
                                        setShowForm(true);
                                    }}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-base-jade-1)] text-[var(--color-base-jade-5)]"
                                >
                                    <FiEdit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteActivity(index)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[var(--color-danger)]"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="border-t border-[var(--color-border)] pt-4">
                    <DynamicForm
                        target="ACTIVITY"
                        initialValues={
                            editingIndex !== null
                                ? {
                                    type: activities[editingIndex]?.type || "",
                                    titleFa: activities[editingIndex]?.titleFa || "",
                                    titleEn: activities[editingIndex]?.titleEn || "",
                                    description: activities[editingIndex]?.description || "",
                                    date: activities[editingIndex]?.date || "",
                                }
                                : {}
                        }
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditingIndex(null);
                        }}
                        loading={loading}
                        submitLabel={editingIndex !== null ? "ویرایش" : "افزودن"}
                        cancelLabel="لغو"
                    />
                </div>
            )}

            {/* دکمه پایان */}
            <div className="mt-6 flex justify-end">
                <Button variant="primary" onClick={onFinish} disabled={loading} fullWidth className="sm:w-auto">
                    اتمام و مشاهده استاد
                </Button>
            </div>
        </div>
    );
}
