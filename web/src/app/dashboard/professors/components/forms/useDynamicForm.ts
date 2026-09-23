"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { createDynamicSchema } from "@/lib/validations/professorSchema";
import { getFaculties } from "@/services/faculties/FacultiesApi";
import { getFormSchema } from "@/services/forms/Formsapi";
import type { FormFieldDto, FormValues } from "@/types/form-schema";

import type { DynamicFormProps } from "./dynamic-form.types";
import {
    cleanFormValues,
    getInitialFormValues,
    isFieldVisible,
    withFacultyOptions,
} from "./dynamic-form.utils";

type ControllerOptions = Pick<
    DynamicFormProps,
    "target" | "excludedFieldKeys" | "initialValues" | "onSubmit"
> & {
    schemaProp?: FormFieldDto[];
};

function excludeFields(
    schema: FormFieldDto[],
    excludedFieldKeys?: readonly string[],
) {
    if (!excludedFieldKeys?.length) return schema;
    const excluded = new Set(excludedFieldKeys);
    return schema.filter((field) => !excluded.has(field.key));
}

function focusFirstError(form: HTMLFormElement | null, fallbackKey?: string) {
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            let container = form?.querySelector<HTMLElement>('[data-field-error="true"]');

            if (!container && fallbackKey) {
                container = form?.querySelector<HTMLElement>(
                    `[data-field-key="${CSS.escape(fallbackKey)}"]`,
                );
            }

            if (!container) return;
            const focusable = container.querySelector<HTMLElement>(
                'input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            );
            (focusable ?? container).focus({ preventScroll: true });
            container.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    });
}

export function useDynamicForm({
    target,
    schemaProp,
    excludedFieldKeys,
    initialValues = {},
    onSubmit,
}: ControllerOptions) {
    const initialSchema = excludeFields(schemaProp ?? [], excludedFieldKeys);
    const [schema, setSchema] = useState<FormFieldDto[]>(initialSchema);
    const [values, setValues] = useState<FormValues>(() =>
        getInitialFormValues(initialSchema, initialValues),
    );
    const [isLoading, setIsLoading] = useState(!schemaProp);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const formRef = useRef<HTMLFormElement>(null);
    const initialValuesRef = useRef(initialValues);
    const excludedFieldKeysRef = useRef(excludedFieldKeys);

    useEffect(() => {
        if (schemaProp) return;
        let active = true;

        const loadSchema = async () => {
            const [schemaResponse, facultiesResponse] = await Promise.all([
                getFormSchema(target),
                target === "PROFESSOR" ? getFaculties() : Promise.resolve(null),
            ]);

            if (!active) return;
            if (!schemaResponse.success || !schemaResponse.data?.schema) {
                console.error("Failed to load schema:", schemaResponse.error);
                toast.error("خطا در بارگذاری فرم");
                setSchema([]);
                setIsLoading(false);
                return;
            }

            let loadedSchema = schemaResponse.data.schema;
            if (target === "PROFESSOR") {
                const faculties =
                    facultiesResponse?.success && facultiesResponse.data
                        ? facultiesResponse.data
                        : [];
                loadedSchema = withFacultyOptions(loadedSchema, faculties);
                if (!facultiesResponse?.success) {
                    toast.error("دریافت فهرست دانشکده‌ها انجام نشد");
                }
            }

            loadedSchema = excludeFields(
                loadedSchema,
                excludedFieldKeysRef.current,
            );

            setSchema(loadedSchema);
            setValues(getInitialFormValues(loadedSchema, initialValuesRef.current));
            setIsLoading(false);
        };

        void loadSchema().catch((error) => {
            if (!active) return;
            console.error("Error loading form schema:", error);
            toast.error("خطا در بارگذاری فرم");
            setSchema([]);
            setIsLoading(false);
        });

        return () => {
            active = false;
        };
    }, [schemaProp, target]);

    const handleChange = (key: string, value: FormValues[string]) => {
        setValues((current) => ({ ...current, [key]: value }));
        setFieldErrors((current) => {
            if (!current[key]) return current;
            const next = { ...current };
            delete next[key];
            return next;
        });
    };

    const validate = () => {
        if (schema.length === 0) return true;

        try {
            const validator = createDynamicSchema(
                schema.map((field) => ({
                    key: field.key,
                    type: field.type,
                    label: field.label,
                    required: field.required,
                    validation: field.validation || {},
                })),
            );
            const result = validator.safeParse(cleanFormValues(schema, values));

            if (result.success) {
                setFieldErrors({});
                return true;
            }

            const errors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                const key = String(issue.path[0] ?? "");
                if (key && !errors[key]) errors[key] = issue.message;
            });
            const firstInvalid = schema.find(
                (field) =>
                    field.type !== "hidden" &&
                    isFieldVisible(field, values) &&
                    errors[field.key],
            );

            if (!firstInvalid) {
                setFieldErrors({});
                toast.error("خطا در اعتبارسنجی فرم");
                return false;
            }

            const firstError = errors[firstInvalid.key];
            setFieldErrors({ [firstInvalid.key]: firstError });
            toast.error(firstError);
            focusFirstError(formRef.current, firstInvalid.key);
            return false;
        } catch (error) {
            console.error("Unexpected validation error:", error);
            toast.error("خطا در اعتبارسنجی فرم");
            return false;
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validate()) return;

        try {
            setIsSubmitting(true);
            await onSubmit(values);
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("خطا در ارسال فرم");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        schema,
        values,
        fieldErrors,
        formRef,
        isLoading,
        isSubmitting,
        handleChange,
        handleSubmit,
    };
}
