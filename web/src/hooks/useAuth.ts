"use client";

import { AuthContext } from "@/stores/context/AuthContext";
import { useContext } from "react";

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}