"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";
import { getProfessor, updateProfessor } from "@/services/professors/Professorsapi";
import type { FormValues } from "@/types/form-schema";
import type { Professor, ProfessorActivity } from "@/types/professor";

import { toProfessorFormValues, toProfessorUpdate } from "./professor-form.mapper";

export function useProfessorEditor(idOrSlug: string) {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [professor, setProfessor] = useState<Professor | null>(null);
    const [activities, setActivities] = useState<ProfessorActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isAuthLoading) return;
        let active = true;

        void getProfessor(idOrSlug).then((response) => {
            if (!active) return;
            if (!response.success || !response.data) {
                toast.error(response.error || "خطا در دریافت اطلاعات استاد");
                router.replace("/dashboard/professors");
                return;
            }

            const canEdit =
                user?.role === "ADMIN" ||
                (user?.role === "EDITOR" && user.professorId === response.data.id);
            if (!canEdit) {
                router.replace("/dashboard");
                return;
            }

            setProfessor(response.data);
            setActivities(response.data.activities ?? []);
            setIsLoading(false);
        });

        return () => {
            active = false;
        };
    }, [idOrSlug, isAuthLoading, router, user?.professorId, user?.role]);

    const initialValues = useMemo(
        () => (professor ? toProfessorFormValues(professor) : {}),
        [professor],
    );

    const saveProfessor = async (values: FormValues) => {
        if (!professor) return;
        setIsSaving(true);

        try {
            const cvFile = values.cv instanceof File ? values.cv : null;
            const response = await updateProfessor(
                professor.id,
                toProfessorUpdate(values),
                cvFile,
            );

            if (!response.success || !response.data) {
                toast.error(response.error || "خطا در ویرایش اطلاعات استاد");
                return;
            }

            toast.success("اطلاعات استاد با موفقیت به‌روزرسانی شد");
            router.push(`/dashboard/professors/${response.data.slug}`);
        } finally {
            setIsSaving(false);
        }
    };

    return {
        professor,
        activities,
        setActivities,
        initialValues,
        isLoading: isLoading || isAuthLoading,
        isSaving,
        saveProfessor,
        goToDetails: () =>
            professor && router.push(`/dashboard/professors/${professor.slug}`),
    };
}
