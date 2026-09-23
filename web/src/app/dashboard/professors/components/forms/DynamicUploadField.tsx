"use client";

import AvatarUploadInput from "@/components/shared/Avataruploadinput";
import CvUploadInput from "@/components/shared/Cvuploadinput";

import type { DynamicFormFieldProps } from "./dynamic-form.types";

export default function DynamicUploadField({
    field,
    values,
    error,
    disabled,
    onChange,
}: DynamicFormFieldProps) {
    const value = values[field.key];
    const displayValue = value == null ? "" : value;
    const isAvatar =
        field.accept?.includes("image") &&
        (field.label.includes("پروفایل") || field.label.includes("آواتار"));
    const isResume =
        field.accept?.includes("pdf") && field.label.includes("رزومه");

    if (isAvatar) {
        return (
            <AvatarUploadInput
                label={field.label}
                value={displayValue}
                onChange={(selected) => onChange(field.key, selected)}
                required={field.required}
                error={error}
                showErrorMessage={false}
            />
        );
    }

    if (isResume) {
        const isFile = value instanceof File;
        return (
            <CvUploadInput
                file={isFile ? value : null}
                existingCvUrl={
                    !isFile && typeof value === "string" && value ? value : null
                }
                onChange={(selected) => onChange(field.key, selected)}
                label={field.label}
                required={field.required}
                error={error}
                showErrorMessage={false}
            />
        );
    }

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[var(--color-text-soft)]">
                {field.label}
                {field.required && <span className="mr-1 text-red-500">*</span>}
            </label>
            <input
                type="file"
                accept={field.accept}
                multiple={field.multiple}
                disabled={disabled}
                onChange={(event) => {
                    const files = event.target.files;
                    if (!files) return;
                    onChange(
                        field.key,
                        field.multiple ? Array.from(files) : files[0],
                    );
                }}
                aria-invalid={Boolean(error)}
                className={`w-full rounded-lg bg-transparent px-4 py-2.5 text-[var(--color-text)] focus:outline-none ${
                    error
                        ? "border-2 border-[var(--color-danger)]"
                        : "border border-[var(--color-border)] focus:border-[var(--color-base-jade-4)]"
                }`}
            />
        </div>
    );
}
