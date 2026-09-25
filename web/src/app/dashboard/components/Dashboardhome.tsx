"use client";

import { FiMail, FiShield, FiUser } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const ROLE_LABELS: Record<string, string> = {
    ADMIN: "مدیرکل",
    PROFESSOR: "استاد",
};

function formatDate(iso?: string) {
    if (!iso) return "—";
    try {
        return new Intl.DateTimeFormat("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

export default function DashboardHome() {
    const { user, isLoading, error } = useAuth();

    return (
        <div>
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl">
                    خوش آمدید
                </h1>
                <p className="mt-1.5 text-[var(--color-text-soft)]">
                    اطلاعات حساب کاربری شما
                </p>
            </div>

            {isLoading && (
                <div className="h-52 animate-pulse rounded-xl bg-[var(--color-base-jade-1)]/60" />
            )}

            {!isLoading && error && (
                <div className="rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-6 text-sm text-[var(--color-danger)]">
                    {error}
                </div>
            )}

            {!isLoading && !error && user && (
                <div
                    className="
                        rounded-xl border border-[var(--color-card-border)]
                        bg-[var(--color-card-bg)] p-4 sm:p-6
                        shadow-[0_1px_2px_rgba(47,44,40,0.06)]
                    "
                >
                    <div className="flex min-w-0 items-center gap-3 border-b border-[var(--color-border)] pb-5 sm:gap-4 sm:pb-6">
                        <div
                            className="
                                flex h-16 w-16 items-center justify-center
                                rounded-full bg-[var(--color-base-jade-1)]
                                text-[var(--color-base-jade-5)]
                            "
                        >
                            <FiUser size={28} />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[var(--color-text)] sm:text-lg" dir="ltr">
                                {user.email}
                            </p>
                            <span
                                className="
                                    mt-1 inline-block rounded-md
                                    bg-[var(--color-base-jade-1)]
                                    px-2 py-0.5 text-xs
                                    text-[var(--color-base-jade-5)]
                                "
                            >
                                {ROLE_LABELS[user.role] ?? user.role}
                            </span>
                        </div>
                    </div>

                    <dl className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <FiMail
                                size={17}
                                className="mt-0.5 text-[var(--color-text-muted)]"
                            />
                            <div>
                                <dt className="text-xs text-[var(--color-text-soft)]">
                                    ایمیل
                                </dt>
                                <dd className="mt-0.5 break-all text-sm font-medium text-[var(--color-text)]" dir="ltr">
                                    {user.email}
                                </dd>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FiShield
                                size={17}
                                className="mt-0.5 text-[var(--color-text-muted)]"
                            />
                            <div>
                                <dt className="text-xs text-[var(--color-text-soft)]">
                                    نقش
                                </dt>
                                <dd className="mt-0.5 text-sm font-medium text-[var(--color-text)]">
                                    {ROLE_LABELS[user.role] ?? user.role}
                                </dd>
                            </div>
                        </div>

                        <div>
                            <dt className="text-xs text-[var(--color-text-soft)]">
                                تاریخ ایجاد حساب
                            </dt>
                            <dd className="mt-0.5 text-sm font-medium text-[var(--color-text)]">
                                {formatDate(user.createdAt)}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-xs text-[var(--color-text-soft)]">
                                آخرین بروزرسانی
                            </dt>
                            <dd className="mt-0.5 text-sm font-medium text-[var(--color-text)]">
                                {formatDate(user.updatedAt)}
                            </dd>
                        </div>
                    </dl>
                </div>
            )}
        </div>
    );
}
