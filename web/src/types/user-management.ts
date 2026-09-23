import type { UserRole } from "./auth";

export type ManagedUser = {
    id: string;
    email: string;
    role: UserRole;
    professorId: string | null;
    professor: {
        id: string;
        displayName: string;
    } | null;
    createdAt: string;
    updatedAt: string;
};

export type CreateManagedUserPayload = {
    email: string;
    role: UserRole;
    professorId?: string;
};
