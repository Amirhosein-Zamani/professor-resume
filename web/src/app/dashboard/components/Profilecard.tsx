"use client";

import { FiEdit2, FiUser } from "react-icons/fi";

import ProfileEditor from "./ProfileEditor";
import { useProfileCard } from "./useProfileCard";

const ROLE_LABELS: Record<string, string> = {
    ADMIN: "مدیرکل",
    PROFESSOR: "استاد",
};

export default function ProfileCard() {
    const profile = useProfileCard();

    if (profile.isLoading) {
        return <div className="h-48 animate-pulse rounded-xl bg-[var(--color-base-jade-1)]/60" />;
    }
    if (profile.loadError || !profile.user) {
        return <div className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-5 text-sm text-[var(--color-danger)]">{profile.loadError || "اطلاعات کاربر در دسترس نیست."}</div>;
    }

    return (
        <section className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] sm:p-6">
            <header className="flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-base-jade-1)] text-[var(--color-base-jade-5)]"><FiUser size={24} /></div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--color-text)] sm:text-base" dir="ltr">{profile.user.email}</p>
                        <span className="mt-1 inline-block rounded-md bg-[var(--color-base-jade-1)] px-2 py-0.5 text-xs text-[var(--color-base-jade-5)]">{ROLE_LABELS[profile.user.role] ?? profile.user.role}</span>
                    </div>
                </div>
                {!profile.isEditing && (
                    <button type="button" onClick={profile.startEditing} className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-base-jade-4)]">
                        <FiEdit2 size={14} /> ویرایش
                    </button>
                )}
            </header>

            {profile.saveSuccess && !profile.isEditing && <div className="mt-5 rounded-lg bg-[var(--color-success)]/10 px-4 py-2.5 text-sm text-[var(--color-success)]">تغییرات با موفقیت ذخیره شد.</div>}
            {profile.isEditing && (
                <ProfileEditor
                    email={profile.email}
                    currentPassword={profile.currentPassword}
                    newPassword={profile.newPassword}
                    confirmPassword={profile.confirmPassword}
                    isSaving={profile.isSaving}
                    error={profile.saveError}
                    onEmailChange={profile.setEmail}
                    onCurrentPasswordChange={profile.setCurrentPassword}
                    onNewPasswordChange={profile.setNewPassword}
                    onConfirmPasswordChange={profile.setConfirmPassword}
                    onCancel={profile.cancelEditing}
                    onSave={profile.save}
                />
            )}
        </section>
    );
}
