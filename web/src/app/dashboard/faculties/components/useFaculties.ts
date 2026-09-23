"use client";

import { useEffect, useMemo, useState } from "react";

import {
    createFaculty,
    deleteFaculty,
    getFaculties,
    updateFaculty,
} from "@/services/faculties/FacultiesApi";
import type { Faculty } from "@/types/faculty";

const LOAD_ERROR = "دریافت لیست دانشکده‌ها با خطا مواجه شد.";
const sortFaculties = (items: Faculty[]) =>
    [...items].sort((a, b) => a.name.localeCompare(b.name, "fa"));

export function useFaculties() {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);
    const [name, setName] = useState("");
    const [iconFile, setIconFile] = useState<File | null>(null);

    useEffect(() => {
        let active = true;
        void getFaculties().then((response) => {
            if (!active) return;
            if (response.success && response.data) {
                setFaculties(response.data);
            } else {
                setError(response.message || response.error || LOAD_ERROR);
            }
            setLoading(false);
        });
        return () => {
            active = false;
        };
    }, []);

    const filteredFaculties = useMemo(() => {
        const query = search.trim().toLowerCase();
        return query
            ? faculties.filter((faculty) => faculty.name.toLowerCase().includes(query))
            : faculties;
    }, [faculties, search]);

    const clearForm = () => {
        setName("");
        setIconFile(null);
        setEditingId(null);
        setIsCreateOpen(false);
    };

    const refresh = async () => {
        setLoading(true);
        setError(null);
        const response = await getFaculties();
        setFaculties(response.success && response.data ? response.data : []);
        if (!response.success) setError(response.message || response.error || LOAD_ERROR);
        setLoading(false);
    };

    const create = async () => {
        const trimmedName = name.trim();
        if (!trimmedName) return setError("نام دانشکده را وارد کنید.");
        setSubmitting(true);
        setError(null);
        const response = await createFaculty({ name: trimmedName }, iconFile);
        if (response.success && response.data) {
            setFaculties((current) => sortFaculties([...current, response.data!]));
            clearForm();
        } else {
            setError("ایجاد دانشکده انجام نشد. ممکن است نام دانشکده تکراری باشد.");
        }
        setSubmitting(false);
    };

    const startEditing = (faculty: Faculty) => {
        setEditingId(faculty.id);
        setName(faculty.name);
        setIconFile(null);
        setIsCreateOpen(false);
        setError(null);
    };

    const update = async () => {
        const trimmedName = name.trim();
        if (!editingId || !trimmedName) {
            if (!trimmedName) setError("نام دانشکده را وارد کنید.");
            return;
        }
        setSubmitting(true);
        setError(null);
        const response = await updateFaculty(editingId, { name: trimmedName }, iconFile);
        if (response.success && response.data) {
            setFaculties((current) =>
                sortFaculties(current.map((item) => (item.id === editingId ? response.data! : item))),
            );
            clearForm();
        } else {
            setError("ویرایش دانشکده انجام نشد. ممکن است نام دانشکده تکراری باشد.");
        }
        setSubmitting(false);
    };

    const remove = async (faculty: Faculty) => {
        setDeleting(true);
        setError(null);
        const response = await deleteFaculty(faculty.id);
        if (response.success) {
            setFaculties((current) => current.filter((item) => item.id !== faculty.id));
            setFacultyToDelete(null);
        } else {
            setError(response.message || response.error || "حذف دانشکده انجام نشد.");
        }
        setDeleting(false);
    };

    return {
        faculties: filteredFaculties,
        search,
        loading,
        submitting,
        deleting,
        error,
        isCreateOpen,
        editingId,
        facultyToDelete,
        name,
        iconFile,
        setSearch,
        setError,
        setName,
        setIconFile,
        setFacultyToDelete,
        refresh,
        create,
        update,
        remove,
        startEditing,
        cancelEditing: clearForm,
        openCreate: () => {
            clearForm();
            setIsCreateOpen(true);
            setError(null);
        },
    };
}
