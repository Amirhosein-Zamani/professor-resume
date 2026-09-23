"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import toast from "react-hot-toast";

import { stripEmpty } from "@/lib/Stripempty";
import {
    addProfessorActivity,
    removeProfessorActivity,
    updateProfessorActivity,
} from "@/services/professors/Professorsapi";
import type { FormValues } from "@/types/form-schema";
import type { CreateActivityPayload, ProfessorActivity } from "@/types/professor";

type Options = {
    professorId?: string;
    activities: ProfessorActivity[];
    setActivities: Dispatch<SetStateAction<ProfessorActivity[]>>;
};

export function useProfessorActivities({ professorId, activities, setActivities }: Options) {
    const [editingActivity, setEditingActivity] = useState<ProfessorActivity | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);
    const sortedActivities = useMemo(
        () => [...activities].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
        [activities],
    );

    const openCreate = () => {
        setEditingActivity(null);
        setIsFormOpen(true);
    };
    const openEdit = (activity: ProfessorActivity) => {
        setEditingActivity(activity);
        setIsFormOpen(true);
    };
    const closeForm = () => {
        setEditingActivity(null);
        setIsFormOpen(false);
    };

    const saveActivity = async (values: FormValues) => {
        if (!professorId) return;
        const payload = stripEmpty({
            type: values.type || "مقاله علمی",
            titleFa: values.titleFa || "",
            titleEn: values.titleEn || "",
            description: values.description || "",
            date: values.date || "",
            sortOrder: editingActivity?.sortOrder ?? activities.length,
        }) as CreateActivityPayload;
        setIsSaving(true);

        try {
            const response = editingActivity?.id
                ? await updateProfessorActivity(professorId, editingActivity.id, payload)
                : await addProfessorActivity(professorId, payload);

            if (!response.success || !response.data) {
                toast.error(
                    response.error ||
                        (editingActivity ? "خطا در ویرایش فعالیت" : "خطا در افزودن فعالیت"),
                );
                return;
            }

            setActivities((current) =>
                editingActivity?.id
                    ? current.map((item) =>
                          item.id === editingActivity.id ? response.data! : item,
                      )
                    : [...current, response.data!],
            );
            toast.success(editingActivity ? "فعالیت با موفقیت ویرایش شد" : "فعالیت با موفقیت اضافه شد");
            closeForm();
        } finally {
            setIsSaving(false);
        }
    };

    const removeActivity = async (activity: ProfessorActivity) => {
        if (!professorId || !activity.id) return;
        if (!window.confirm(`آیا از حذف فعالیت «${activity.titleFa || activity.type}» مطمئن هستید؟`)) return;
        setRemovingId(activity.id);

        try {
            const response = await removeProfessorActivity(professorId, activity.id);
            if (!response.success) {
                toast.error(response.error || "خطا در حذف فعالیت");
                return;
            }
            setActivities((current) => current.filter((item) => item.id !== activity.id));
            toast.success("فعالیت حذف شد");
        } finally {
            setRemovingId(null);
        }
    };

    return {
        sortedActivities,
        editingActivity,
        isFormOpen,
        isSaving,
        removingId,
        openCreate,
        openEdit,
        closeForm,
        saveActivity,
        removeActivity,
    };
}
