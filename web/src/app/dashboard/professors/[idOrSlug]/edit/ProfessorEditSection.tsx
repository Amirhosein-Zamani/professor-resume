import DynamicForm from "@/app/dashboard/professors/components/forms/DynamicForm";
import type { FormValues } from "@/types/form-schema";

type ProfessorEditSectionProps = {
    initialValues: FormValues;
    isSaving: boolean;
    onSave: (values: FormValues) => Promise<void>;
    onCancel: () => void;
};

export default function ProfessorEditSection({
    initialValues,
    isSaving,
    onSave,
    onCancel,
}: ProfessorEditSectionProps) {
    return (
        <section className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] sm:p-6">
            <header className="mb-6">
                <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                    ویرایش اطلاعات استاد
                </h1>
                <p className="mt-1.5 text-[var(--color-text-soft)]">
                    اطلاعات پایه، گروه آموزشی و لینک‌های پژوهشی را به‌روزرسانی کنید.
                </p>
            </header>

            <DynamicForm
                target="PROFESSOR"
                initialValues={initialValues}
                onSubmit={onSave}
                onCancel={onCancel}
                loading={isSaving}
                submitLabel="ذخیره تغییرات"
                cancelLabel="بازگشت"
                className="space-y-4"
            />
        </section>
    );
}
