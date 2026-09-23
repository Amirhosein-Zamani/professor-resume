"use client";

import { useState } from "react";
import { toast } from "react-hot-toast"; 
import { CreateProfessorPayload } from "@/types/professor";
import { createProfessor } from "@/services/professors/Professorsapi";
import { stripEmpty } from "@/lib/Stripempty";
import { FormValues } from "@/types/form-schema";
import DynamicForm from "../components/forms/DynamicForm";

const GOLESTAN_FIELD_KEYS = [
    "golestanProfessorNo",
    "employeeNo",
    "studentNo",
    "researchGroupName",
    "organizationName",
] as const;
type StepProfessorInfoProps = {
    onCreated: (professorId: string, slug: string) => void;
    onCancel: () => void;
};

export default function StepProfessorInfo({
    onCreated,
    onCancel,
}: StepProfessorInfoProps) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (values: FormValues) => {
        setIsSaving(true);

        try {
            const payload: CreateProfessorPayload = {
                slug: values.slug || "",
                firstName: values.firstName || "",
                lastName: values.lastName || "",
                displayName: values.displayName || "",
                nationalCode: values.nationalCode || "",
                rank: values.rank || "",
                facultyId: values.facultyId || "",
                specialty: values.specialty || "",
                isFaculty: values.isFaculty ?? true,
                avatar: values.avatar || "",
                email: values.email || "",
                bio: values.bio || "",
                facultyName: values.facultyName || "",
                links: {
                    scholar: values.scholar || "",
                    researchgate: values.researchgate || "",
                    scopus: values.scopus || "",
                    website: values.website || "",
                },
            };

            const cleanedPayload = stripEmpty(payload as unknown as Record<string, unknown>);
            const cvFile = values.cvFile || null;

            const res = await createProfessor(
                cleanedPayload as CreateProfessorPayload,
                cvFile
            );

            if (!res.success || !res.data) {
                // ✅ toast به جای inline error
                toast.error(res.error || "خطا در ثبت استاد");
                return;
            }

            onCreated(res.data.id, res.data.slug);
        } catch (err) {
            console.error("Error:", err);
            // ✅ toast به جای inline error
            toast.error("خطا در ارتباط با سرور");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <h2 className="mb-6 text-lg font-bold text-[var(--color-text)]">
                اطلاعات پایه استاد
            </h2>

            <DynamicForm
                target="PROFESSOR"
                excludedFieldKeys={GOLESTAN_FIELD_KEYS}
                initialValues={{}}
                onSubmit={handleSubmit}
                onCancel={onCancel}
                loading={isSaving}
                submitLabel="مرحله بعد"
                cancelLabel="انصراف"
                className="space-y-4"
            />
        </div>
    );
}
