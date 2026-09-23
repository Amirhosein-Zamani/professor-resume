"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";
import { getProfessors } from "@/services/professors/Professorsapi";
import { createUser, getUsers, updateUserRole } from "@/services/users/UsersApi";
import type { UserRole } from "@/types/auth";
import type { ProfessorListItem } from "@/types/professor";
import type { ManagedUser } from "@/types/user-management";

export type PendingRoleChange = {
    account: ManagedUser;
    role: UserRole;
};

export function useUsers() {
    const router = useRouter();
    const { user: currentUser, isLoading: isAuthLoading } = useAuth();
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [professors, setProfessors] = useState<ProfessorListItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole>("EDITOR");
    const [professorId, setProfessorId] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [changingRole, setChangingRole] = useState(false);
    const [pendingRoleChange, setPendingRoleChange] = useState<PendingRoleChange | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        const [usersResponse, professorsResponse] = await Promise.all([
            getUsers(),
            getProfessors(),
        ]);

        if (usersResponse.success && usersResponse.data) {
            setUsers(usersResponse.data);
        } else {
            toast.error(usersResponse.message || usersResponse.error || "دریافت کاربران انجام نشد.");
        }

        if (professorsResponse.success && professorsResponse.data) {
            setProfessors(professorsResponse.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isAuthLoading) return;
        if (currentUser?.role !== "ADMIN") {
            router.replace("/dashboard");
            return;
        }
        const timer = window.setTimeout(() => void load(), 0);
        return () => window.clearTimeout(timer);
    }, [currentUser?.role, isAuthLoading, load, router]);

    const visibleUsers = useMemo(() => {
        const query = search.trim().toLocaleLowerCase("fa");
        if (!query) return users;
        return users.filter((item) =>
            [item.email, item.professor?.displayName ?? ""]
                .some((value) => value.toLocaleLowerCase("fa").includes(query)),
        );
    }, [search, users]);

    const availableProfessors = useMemo(() => {
        const assignedIds = new Set(users.map((item) => item.professorId).filter(Boolean));
        return professors.filter((professor) => !assignedIds.has(professor.id));
    }, [professors, users]);

    const resetForm = () => {
        setEmail("");
        setRole("EDITOR");
        setProfessorId("");
        setIsCreateOpen(false);
    };

    const submitCreate = async () => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            toast.error("یک ایمیل معتبر وارد کنید.");
            return;
        }

        setSubmitting(true);
        const response = await createUser({
            email: normalizedEmail,
            role,
            ...(role === "EDITOR" && professorId ? { professorId } : {}),
        });
        setSubmitting(false);

        if (!response.success || !response.data) {
            toast.error(response.message || response.error || "ایجاد کاربر انجام نشد.");
            return;
        }

        setUsers((current) => [response.data!, ...current]);
        resetForm();
        toast.success("کاربر ایجاد شد و اکنون می‌تواند با کد یک‌بارمصرف وارد شود.");
    };

    const confirmRoleChange = async () => {
        if (!pendingRoleChange) return;
        setChangingRole(true);
        const response = await updateUserRole(
            pendingRoleChange.account.id,
            pendingRoleChange.role,
        );
        setChangingRole(false);

        if (!response.success || !response.data) {
            toast.error(response.message || response.error || "تغییر نقش انجام نشد.");
            return;
        }

        setUsers((current) => current.map((item) =>
            item.id === response.data!.id ? response.data! : item,
        ));
        setPendingRoleChange(null);
        toast.success("نقش کاربر با موفقیت تغییر کرد.");
    };

    return {
        currentUser,
        users: visibleUsers,
        availableProfessors,
        search,
        loading,
        isCreateOpen,
        email,
        role,
        professorId,
        submitting,
        changingRole,
        pendingRoleChange,
        setSearch,
        setEmail,
        setRole,
        setProfessorId,
        setPendingRoleChange,
        submitCreate,
        confirmRoleChange,
        refresh: load,
        openCreate: () => setIsCreateOpen(true),
        closeCreate: resetForm,
    };
}
