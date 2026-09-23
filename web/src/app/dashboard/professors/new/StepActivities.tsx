"use client";

import { useState } from "react";
import { FiCheck, FiTrash2, FiCalendar, FiPlus } from "react-icons/fi";
import moment from "moment-jalaali";

import { addProfessorActivity } from "@/services/professors/Professorsapi";
import { CreateActivityPayload } from "@/types/professor";
import { stripEmpty } from "@/lib/Stripempty";
import { FormValues } from "@/types/form-schema";
import Button from "@/components/ui/Button";
import ResponsiveConfirmDialog from "@/components/ui/ResponsiveConfirmDialog";
import DynamicForm from "../components/forms/DynamicForm";
import toast from "react-hot-toast";

type StepActivitiesProps = {
    professorId: string;
    professorSlug: string;
    onFinish: () => void;
};

export default function StepActivities({
    professorId,
    onFinish,
}: StepActivitiesProps) {
    const [pendingActivities, setPendingActivities] = useState<CreateActivityPayload[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const handleAddActivity = (values: FormValues) => {
        const newActivity: CreateActivityPayload = {
            type: values.type || "مقاله علمی",
            titleFa: values.titleFa || "",
            titleEn: values.titleEn || "",
            description: values.description || "",
            date: values.date || moment().toISOString(),
            sortOrder: pendingActivities.length,
        };

        setPendingActivities((prev) => [...prev, newActivity]);
        setShowForm(false);
    };

    const handleRemove = (index: number) => {
        setPendingActivities((prev) => prev.filter((_, i) => i !== index));
    };

    const handleFinishClick = () => {
        setShowFinishConfirm(true);
    };

    const handleFinish = async () => {
        setShowFinishConfirm(false);
        setIsSubmitting(true);

        for (const activity of pendingActivities) {
            const payload = stripEmpty(
                activity as unknown as Record<string, unknown>,
            ) as CreateActivityPayload;

            const res = await addProfessorActivity(professorId, payload);

            if (!res.success) {
                // ✅ باگ syntax درست شد + toast به جای inline error
                toast.error(
                    `فعالیت «${activity.titleFa}» ثبت نشد: ${res.error || "خطای ناشناخته"}`
                );
                setIsSubmitting(false);
                return;
            }
        }

        toast.success(
            pendingActivities.length > 0
                ? "فعالیت‌ها با موفقیت ثبت شدند"
                : "اطلاعات استاد با موفقیت نهایی شد",
        );
        onFinish();
    };

    const formatPersianDate = (isoDate: string) => {
        if (!isoDate) return "";
        const m = moment(isoDate);
        return m.isValid() ? m.format("jYYYY/jMM/jDD") : "";
    };

    return (
        <div className="space-y-6">
            {/* ✅ کامنت JSX درست شد */}
            <div className="rounded-2xl bg-[var(--color-base-jade-1)] px-5 py-4 text-sm text-[var(--color-base-jade-6)]">
                رزومه استاد با موفقیت ساخته شد. حالا می‌توانید فعالیت‌های علمی
                (مقاله، کتاب، پروژه) را اضافه کنید.
            </div>

            <div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">
                    فعالیت‌های علمی
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                    این بخش اختیاری است؛ می‌توانید بدون افزودن فعالیت هم فرآیند را نهایی کنید.
                </p>
            </div>

            {showForm ? (
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-6">
                    <DynamicForm
                        target="ACTIVITY"
                        initialValues={{}}
                        onSubmit={handleAddActivity}
                        submitLabel="افزودن به لیست"
                        cancelLabel="انصراف"
                        hideSubmit={false}
                        stickyActions={false}
                        className="space-y-4"
                    />
                    <div className="mt-4 flex justify-end border-t border-[var(--color-border)] pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowForm(false)}
                        >
                            بستن فرم
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(true)}
                        icon={<FiPlus size={18} />}
                    >
                        افزودن فعالیت جدید
                    </Button>
                </div>
            )}

            {/* ✅ کامنت JSX درست شد */}
            {pendingActivities.length > 0 && (
                <div>
                    <h3 className="mb-3 text-sm font-semibold text-[var(--color-text)]">
                        فعالیت‌های اضافه شده ({pendingActivities.length})
                    </h3>
                    <ul className="space-y-3">
                        {pendingActivities.map((activity, index) => (
                            <li
                                key={index}
                                className="group flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm transition-all duration-200 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between hover:border-[var(--color-base-jade-3)] hover:shadow-md"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                        <span className="inline-block rounded-lg bg-[var(--color-base-jade-1)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-base-jade-5)]">
                                            {activity.type}
                                        </span>
                                        {activity.date && (
                                            <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                                                <FiCalendar size={12} />
                                                {formatPersianDate(activity.date)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="font-medium text-[var(--color-text)]">{activity.titleFa}</p>
                                    {activity.titleEn && (
                                        <p className="mt-0.5 text-sm text-[var(--color-text-soft)]">{activity.titleEn}</p>
                                    )}
                                    {activity.description && (
                                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{activity.description}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="flex min-h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-50 px-3 text-sm text-[var(--color-danger)] transition-all duration-200 min-[420px]:w-10 min-[420px]:px-0"
                                    aria-label="حذف"
                                >
                                    <FiTrash2 size={18} />
                                    <span className="min-[420px]:hidden">حذف فعالیت</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="relative z-10 mt-6 flex justify-end border-t border-[var(--color-border)] pt-4 sm:pt-6">
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={handleFinishClick}
                    disabled={isSubmitting}
                    icon={<FiCheck size={18} />}
                    fullWidth
                    className="sm:w-auto"
                >
                    {isSubmitting ? "در حال ثبت..." : "تایید نهایی"}
                </Button>
            </div>

            <ResponsiveConfirmDialog
                open={showFinishConfirm}
                intent="primary"
                title="تأیید ثبت اطلاعات استاد"
                description={
                    pendingActivities.length > 0
                        ? `پس از تأیید، ${pendingActivities.length.toLocaleString("fa-IR")} فعالیت در رزومه استاد ذخیره می‌شود. آیا از ثبت نهایی مطمئن هستید؟`
                        : "هنوز فعالیتی به فهرست اضافه نشده است. آیا می‌خواهید رزومه استاد را بدون فعالیت علمی نهایی کنید؟"
                }
                confirmLabel={pendingActivities.length > 0 ? "تأیید و ذخیره" : "ثبت بدون فعالیت"}
                cancelLabel="بازگشت"
                isLoading={isSubmitting}
                onClose={() => setShowFinishConfirm(false)}
                onConfirm={handleFinish}
            />
        </div>
    );
}
