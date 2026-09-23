import type { Faculty } from "@/types/faculty";
import type { FormFieldDto, FormValues } from "@/types/form-schema";

const TEXT_FIELD_TYPES = new Set([
    "text", "textarea", "select", "date", "multiselect", "email", "tel", "url",
]);

export function withFacultyOptions(schema: FormFieldDto[], faculties: Faculty[]) {
    const options = faculties.map((faculty) => ({
        label: faculty.name,
        value: faculty.id,
    }));

    return schema
        .filter((field) => field.key !== "facultyName")
        .map((field): FormFieldDto =>
            field.key === "faculty" || field.key === "facultyId"
                ? {
                      ...field,
                      key: "facultyId",
                      type: "select",
                      options,
                      helpText: "دانشکده را از فهرست ثبت‌شده انتخاب کنید.",
                  }
                : field,
        );
}

export function getInitialFormValues(
    schema: FormFieldDto[],
    initialValues: FormValues,
): FormValues {
    const defaults = Object.fromEntries(
        schema.map((field) => [field.key, field.defaultValue]),
    );
    return { ...defaults, ...initialValues };
}

export function cleanFormValues(schema: FormFieldDto[], values: FormValues) {
    return Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
            const field = schema.find((item) => item.key === key);
            const cleaned =
                field && TEXT_FIELD_TYPES.has(field.type) && value == null
                    ? ""
                    : value;
            return [key, cleaned];
        }),
    ) as FormValues;
}

export function isFieldVisible(field: FormFieldDto, values: FormValues) {
    return !field.dependsOn || values[field.dependsOn.field] === field.dependsOn.value;
}

export function sanitizeLocalizedFieldValue(key: string, value: string) {
    if (key === "titleFa") return value.replace(/[A-Za-z]/g, "");
    if (key === "titleEn") return value.replace(/[\u0600-\u06FF]/g, "");
    return value;
}

export function getLocalizedFieldProps(key: string) {
    if (key === "titleEn") {
        return { direction: "ltr" as const, lang: "en", inputMode: "text" as const };
    }
    if (key === "titleFa") {
        return { direction: "rtl" as const, lang: "fa", inputMode: "text" as const };
    }
    return { direction: "rtl" as const };
}
