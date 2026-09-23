import type { FormFieldDto, FormValues } from "@/types/form-schema";

export type DynamicFormTarget = "PROFESSOR" | "ACTIVITY";

export type DynamicFormProps = {
    target: DynamicFormTarget;
    schema?: FormFieldDto[];
    excludedFieldKeys?: readonly string[];
    initialValues?: FormValues;
    onSubmit: (values: FormValues) => void | Promise<void>;
    onCancel?: () => void;
    submitLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    hideSubmit?: boolean;
    stickyActions?: boolean;
    className?: string;
};

export type DynamicFormFieldProps = {
    field: FormFieldDto;
    values: FormValues;
    error?: string;
    disabled: boolean;
    onChange: (key: string, value: FormValues[string]) => void;
};
