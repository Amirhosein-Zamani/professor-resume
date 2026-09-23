import { API_ROUTES } from "@/constants/Api_Routes";
import api from "@/lib/api";
import { handleRequest } from "@/lib/api-helpers";
import type { UserRole } from "@/types/auth";
import type { CreateManagedUserPayload, ManagedUser } from "@/types/user-management";

export const getUsers = async () =>
    handleRequest<ManagedUser[]>(api.get(API_ROUTES.Users.list));

export const createUser = async (payload: CreateManagedUserPayload) =>
    handleRequest<ManagedUser>(api.post(API_ROUTES.Users.create, payload));

export const updateUserRole = async (id: string, role: UserRole) =>
    handleRequest<ManagedUser>(
        api.patch(API_ROUTES.Users.updateRole(id), { role }),
    );
