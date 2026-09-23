import type { UserRole } from "@/types/auth";

export const ROLE_LABELS: Record<UserRole, string> = {
    ADMIN: "مدیر سامانه",
    EDITOR: "ویرایشگر استاد",
};

export const ROLE_OPTIONS = Object.values(ROLE_LABELS);

export const roleFromLabel = (label: string): UserRole =>
    label === ROLE_LABELS.ADMIN ? "ADMIN" : "EDITOR";
