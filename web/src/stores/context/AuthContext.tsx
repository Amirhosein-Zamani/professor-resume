"use client";

import { createContext } from "react";

export interface User {
    id: string;
    email: string;
    role: string;
    professorId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;

    login: (user: User) => void;
    logout: () => void;

    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
