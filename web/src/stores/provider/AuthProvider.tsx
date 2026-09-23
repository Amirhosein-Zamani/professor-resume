"use client";

import { ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthContext, User } from "../context/AuthContext";
import { getCurrentUser } from "@/services/auth/AuthApi";


interface Props {
    children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const res = await getCurrentUser();

        if (res.success && res.data) {
            setUser(res.data.user);
        } else {
            Cookies.remove("professor_resume_token");
            setUser(null);
        }

        setLoading(false);
    };

    const login = (user: User) => {
        setUser(user);
    };

    const logout = () => {
        Cookies.remove("professor_resume_token");
        setUser(null);
    };

    useEffect(() => {
        let isActive = true;

        void getCurrentUser().then((res) => {
            if (!isActive) return;

            if (res.success && res.data) {
                setUser(res.data.user);
            } else {
                Cookies.remove("professor_resume_token");
                setUser(null);
            }

            setLoading(false);
        });

        return () => {
            isActive = false;
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
