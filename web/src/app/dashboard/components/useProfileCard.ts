"use client";

import { useEffect, useState } from "react";

import { getCurrentUser, updateCurrentUser } from "@/services/auth/AuthApi";
import type { SafeUser } from "@/types/auth";

export function useProfileCard() {
    const [user, setUser] = useState<SafeUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        let active = true;
        void getCurrentUser().then((response) => {
            if (!active) return;
            if (!response.success || !response.data) {
                setLoadError(response.error || "خطا در دریافت اطلاعات کاربر");
            } else {
                setUser(response.data.user);
                setEmail(response.data.user.email);
            }
            setIsLoading(false);
        });
        return () => {
            active = false;
        };
    }, []);

    const resetPasswords = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const startEditing = () => {
        setSaveError(null);
        setSaveSuccess(false);
        resetPasswords();
        if (user) setEmail(user.email);
        setIsEditing(true);
    };

    const save = async () => {
        setSaveError(null);
        setSaveSuccess(false);
        if (newPassword && newPassword !== confirmPassword) {
            setSaveError("رمز عبور جدید و تکرار آن یکسان نیستند.");
            return;
        }
        if (newPassword && !currentPassword) {
            setSaveError("برای تغییر رمز عبور، رمز فعلی را وارد کنید.");
            return;
        }

        const payload: { email?: string; currentPassword?: string; newPassword?: string } = {};
        if (user && email.trim() !== user.email) payload.email = email.trim();
        if (newPassword) {
            payload.currentPassword = currentPassword;
            payload.newPassword = newPassword;
        }
        if (Object.keys(payload).length === 0) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        const response = await updateCurrentUser(payload);
        if (!response.success) {
            setSaveError(response.error || "خطا در ذخیره تغییرات");
        } else {
            if (response.data) setUser(response.data.user);
            setIsEditing(false);
            setSaveSuccess(true);
        }
        setIsSaving(false);
    };

    return {
        user,
        isLoading,
        loadError,
        isEditing,
        email,
        currentPassword,
        newPassword,
        confirmPassword,
        isSaving,
        saveError,
        saveSuccess,
        setEmail,
        setCurrentPassword,
        setNewPassword,
        setConfirmPassword,
        startEditing,
        cancelEditing: () => {
            setIsEditing(false);
            setSaveError(null);
        },
        save,
    };
}
