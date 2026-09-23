"use client";

import type { ChangeEvent, ReactNode } from "react";

import Input from "@/components/ui/Input";
import PersianDatePicker from "@/components/ui/PersianDatePicker";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";

import type { DynamicFormFieldProps } from "./dynamic-form.types";
import {
    getLocalizedFieldProps,
    isFieldVisible,
    sanitizeLocalizedFieldValue,
} from "./dynamic-form.utils";
import DynamicUploadField from "./DynamicUploadField";

export default function DynamicFormField(props: DynamicFormFieldProps) {
    const { field, values, error, disabled, onChange } = props;
    if (!isFieldVisible(field, values)) return null;

    const value = values[field.key];
    const displayValue = value == null ? "" : value;
    const commonProps = {
        id: field.key,
        name: field.key,
        label: field.label,
        placeholder: field.placeholder,
        required: field.required,
        disabled,
        error,
        showErrorMessage: false,
    };
    let element: ReactNode;

    switch (field.type) {
        case "textarea":
            element = (
                <Textarea
                    {...commonProps}
                    value={displayValue}
                    rows={field.rows || 4}
                    hint={field.helpText}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                        onChange(field.key, event.target.value)
                    }
                />
            );
            break;
        case "select": {
            const options = field.options || [];
            element = (
                <Select
                    label={field.label}
                    options={options.map((option) => option.label)}
                    value={options.find((option) => option.value === displayValue)?.label || ""}
                    id={field.key}
                    error={error}
                    showErrorMessage={false}
                    disabled={disabled}
                    required={field.required}
                    searchable={field.key === "facultyId" || options.length > 6}
                    searchPlaceholder={`جست‌وجوی ${field.label}...`}
                    onChange={(selectedLabel) => {
                        const selected = options.find(
                            (option) => option.label === selectedLabel,
                        );
                        onChange(field.key, selected?.value ?? selectedLabel);
                    }}
                    wrapperClassName="w-full"
                />
            );
            break;
        }
        case "multiselect": {
            const options = field.options?.map((option) => option.label) || [];
            element = (
                <Select
                    label={field.label}
                    options={options}
                    value={displayValue || ""}
                    id={field.key}
                    error={error}
                    showErrorMessage={false}
                    disabled={disabled}
                    required={field.required}
                    searchable={options.length > 6}
                    searchPlaceholder={`جست‌وجوی ${field.label}...`}
                    onChange={(selected) => onChange(field.key, selected)}
                    wrapperClassName="w-full"
                />
            );
            break;
        }
        case "date":
            element = (
                <PersianDatePicker
                    value={displayValue}
                    onChange={(selected) => onChange(field.key, selected || "")}
                    label={field.label}
                    placeholder={field.placeholder}
                    required={field.required}
                    disabled={disabled}
                    error={error}
                    showErrorMessage={false}
                />
            );
            break;
        case "file":
        case "image":
            element = <DynamicUploadField {...props} />;
            break;
        case "checkbox":
            element = (
                <label className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                    <input
                        type="checkbox"
                        id={field.key}
                        checked={Boolean(value)}
                        onChange={(event) => onChange(field.key, event.target.checked)}
                        disabled={disabled}
                        aria-invalid={Boolean(error)}
                        className={`h-4 w-4 rounded text-[var(--color-base-jade-4)] outline-none ${
                            error ? "border-2 border-[var(--color-danger)]" : "border border-[var(--color-border)]"
                        }`}
                    />
                    <span>
                        {field.label}
                        {field.required && <span className="mr-1 text-red-500">*</span>}
                    </span>
                </label>
            );
            break;
        default:
            element = (
                <Input
                    {...commonProps}
                    type={field.type === "hidden" ? "hidden" : field.type}
                    value={displayValue}
                    {...getLocalizedFieldProps(field.key)}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        onChange(
                            field.key,
                            sanitizeLocalizedFieldValue(field.key, event.target.value),
                        )
                    }
                    hint={field.helpText}
                />
            );
    }

    return (
        <div
            data-field-key={field.key}
            data-field-error={error ? "true" : undefined}
            tabIndex={-1}
            className="mb-4 outline-none"
        >
            {element}
        </div>
    );
}
