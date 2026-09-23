import type { FormFieldDto, FormValues } from "@/types/form-schema";
import type { ProfessorActivity } from "@/types/professor";

export const ACTIVITY_SCHEMA: FormFieldDto[] = [
    {
        key: "type",
        type: "select",
        label: "نوع فعالیت",
        required: true,
        options: ["مقاله علمی", "کتاب", "پروژه", "کنفرانس", "پایان‌نامه"].map(
            (value) => ({ label: value, value }),
        ),
        order: 1,
    },
    {
        key: "titleFa",
        type: "text",
        label: "عنوان فارسی",
        placeholder: "عنوان فعالیت را وارد کنید",
        required: true,
        order: 2,
    },
    {
        key: "titleEn",
        type: "text",
        label: "عنوان انگلیسی",
        placeholder: "English title",
        order: 3,
    },
    { key: "date", type: "date", label: "تاریخ فعالیت", order: 4 },
    {
        key: "description",
        type: "textarea",
        label: "توضیحات",
        placeholder: "توضیحات تکمیلی فعالیت",
        rows: 4,
        order: 5,
    },
];

export function toActivityFormValues(activity: ProfessorActivity | null): FormValues {
    return {
        type: activity?.type || "مقاله علمی",
        titleFa: activity?.titleFa || "",
        titleEn: activity?.titleEn || "",
        date: activity?.date || "",
        description: activity?.description || "",
    };
}

export function formatActivityDate(date?: string) {
    if (!date) return "";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(parsed);
}
