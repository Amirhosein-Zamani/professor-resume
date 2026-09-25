"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";
import { getProfessor, removeProfessor } from "@/services/professors/Professorsapi";
import type { Professor } from "@/types/professor";

export function useProfessorDetail(idOrSlug: string) {
    const router = useRouter();
    const { user, isLoading: isAuthLoading } = useAuth();
    const [professor, setProfessor] = useState<Professor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isAuthLoading) return;
        let active = true;

        void getProfessor(idOrSlug).then((response) => {
            if (!active) return;
            if (
                !response.success ||
                !response.data ||
                (user?.role === "PROFESSOR" && user.professorId !== response.data.id)
            ) {
                router.replace("/dashboard");
                return;
            }
            setProfessor(response.data);
            setIsLoading(false);
        });

        return () => {
            active = false;
        };
    }, [idOrSlug, isAuthLoading, router, user?.professorId, user?.role]);

    const remove = async () => {
        if (!professor || isDeleting) return;
        setIsDeleting(true);
        const response = await removeProfessor(professor.id);

        if (!response.success) {
            toast.error(response.error || "حذف رزومه استاد انجام نشد");
            setIsDeleting(false);
            return;
        }

        toast.success("رزومه و حساب کاربری استاد حذف شدند");
        setIsDeleteOpen(false);
        router.replace("/dashboard/professors");
        router.refresh();
    };

    return {
        professor,
        user,
        isLoading: isLoading || isAuthLoading,
        isDeleteOpen,
        isDeleting,
        openDelete: () => setIsDeleteOpen(true),
        closeDelete: () => setIsDeleteOpen(false),
        remove,
    };
}
