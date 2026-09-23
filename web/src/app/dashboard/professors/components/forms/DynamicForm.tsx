"use client";

import { FiLoader } from "react-icons/fi";

import DynamicFormActions from "./DynamicFormActions";
import DynamicFormField from "./DynamicFormField";
import type { DynamicFormProps } from "./dynamic-form.types";
import { useDynamicForm } from "./useDynamicForm";

export default function DynamicForm({
    target,
    schema: schemaProp,
    excludedFieldKeys,
    initialValues = {},
    onSubmit,
    onCancel,
    submitLabel = "ذخیره",
    cancelLabel = "انصراف",
    loading = false,
    hideSubmit = false,
    stickyActions = true,
    className = "",
}: DynamicFormProps) {
    const {
        schema,
        values,
        fieldErrors,
        formRef,
        isLoading,
        isSubmitting,
        handleChange,
        handleSubmit,
    } = useDynamicForm({
        target,
        schemaProp,
        excludedFieldKeys,
        initialValues,
        onSubmit,
    });
    const disabled = loading || isSubmitting;

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <FiLoader className="h-8 w-8 animate-spin text-[var(--color-base-jade-4)]" />
            </div>
        );
    }

    if (schema.length === 0) {
        return (
            <div className="rounded-lg border border-[var(--color-danger)] bg-red-50 p-4 text-center text-[var(--color-danger)]">
                خطا در بارگذاری فرم
            </div>
        );
    }

    return (
        <form ref={formRef} onSubmit={handleSubmit} className={className} noValidate>
            <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                {schema.map((field) => {
                    const fullWidth = ["textarea", "file", "image", "checkbox"].includes(field.type);
                    return (
                        <div key={field.key} className={fullWidth ? "md:col-span-2" : ""}>
                            <DynamicFormField
                                field={field}
                                values={values}
                                error={fieldErrors[field.key]}
                                disabled={disabled || Boolean(field.disabled)}
                                onChange={handleChange}
                            />
                        </div>
                    );
                })}
            </div>

            {!hideSubmit && (
                <DynamicFormActions
                    onCancel={onCancel}
                    cancelLabel={cancelLabel}
                    submitLabel={submitLabel}
                    disabled={disabled}
                    sticky={stickyActions}
                />
            )}
        </form>
    );
}
