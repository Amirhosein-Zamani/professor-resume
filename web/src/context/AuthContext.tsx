"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";

import { getCurrentUser } from "@/services/auth/AuthApi";
import { SafeUser } from "@/types/auth";

type AuthContextValue = {
    user: SafeUser | null;
    isLoading: boolean;
    error: string | null;
    refetchUser: () => Promise<void>;
    clearUser: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<SafeUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await getCurrentUser();

            if (!res.success || !res.data) {
                setUser(null);
                setError(res.error || "خطا در دریافت اطلاعات کاربر");
                return;
            }

            setUser(res.data.user);
        } catch (err) {
            console.error("Error fetching current user:", err);
            setUser(null);
            setError("خطا در ارتباط با سرور");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        let isActive = true;

        getCurrentUser()
            .then((res) => {
                if (!isActive) return;

                if (!res.success || !res.data) {
                    setUser(null);
                    setError(res.error || "خطا در دریافت اطلاعات کاربر");
                    return;
                }

                setUser(res.data.user);
            })
            .catch((err: unknown) => {
                if (!isActive) return;
                console.error("Error fetching current user:", err);
                setUser(null);
                setError("خطا در ارتباط با سرور");
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, []);

    const clearUser = useCallback(() => {
        setUser(null);
        setError(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isLoading,
            error,
            refetchUser: fetchUser,
            clearUser,
        }),
        [user, isLoading, error, fetchUser, clearUser]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth باید داخل AuthProvider استفاده شود.");
    }

    return context;
}
