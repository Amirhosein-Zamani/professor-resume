"use client";

import { FiCheck, FiX } from "react-icons/fi";

import Select from "@/components/ui/Select";
import type { UserRole } from "@/types/auth";
import { ROLE_LABELS, ROLE_OPTIONS, roleFromLabel } from "./user-management.constants";

type Props = {
    email: string;
    role: UserRole;
    submitting: boolean;
    onEmailChange: (value: string) => void;
    onRoleChange: (value: UserRole) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function UserForm(props: Props) {
    return (
        <section className="overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-[0_4px_20px_rgba(30,61,57,0.06)]">
            <header className="flex items-center justify-between border-b border-border bg-base-gray-0 px-5 py-4">
                <div>
                    <h2 className="text-sm font-semibold text-text">افزودن کاربر جدید</h2>
                    <p className="mt-1 text-xs text-text-muted">کاربر پس از ثبت، با کد یک‌بارمصرف ایمیلی وارد می‌شود.</p>
                </div>
                <button type="button" aria-label="بستن فرم" onClick={props.onCancel} className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-base-gray-1">
                    <FiX size={18} />
                </button>
            </header>

            <div className="grid gap-4 p-5 md:grid-cols-2">
                <label className="space-y-2">
                    <span className="text-xs font-medium text-text-soft">ایمیل <span className="text-red-500">*</span></span>
                    <input
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoFocus
                        dir="ltr"
                        value={props.email}
                        onChange={(event) => props.onEmailChange(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && props.onSubmit()}
                        placeholder="user@example.com"
                        className="h-11 w-full rounded-xl border border-border bg-base-gray-0 px-4 text-left text-sm text-text outline-none transition focus:border-base-jade-4"
                    />
                </label>

                <Select
                    label="نقش کاربر"
                    required
                    value={ROLE_LABELS[props.role]}
                    options={ROLE_OPTIONS}
                    onChange={(value) => props.onRoleChange(roleFromLabel(value))}
                />

                <p className="text-xs leading-6 text-text-muted md:col-span-2">
                    برای نقش استاد، پروفایل استاد باید از قبل با همین ایمیل ثبت شده باشد؛ اتصال حساب به پروفایل به‌صورت خودکار انجام می‌شود.
                </p>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end md:col-span-2">
                    <button type="button" disabled={props.submitting} onClick={props.onCancel} className="h-11 rounded-xl border border-border px-5 text-sm text-text-soft disabled:opacity-50">
                        انصراف
                    </button>
                    <button type="button" disabled={props.submitting} onClick={props.onSubmit} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-base-jade-6 px-5 text-sm font-medium text-white disabled:opacity-50">
                        <FiCheck size={16} />
                        {props.submitting ? "در حال ثبت..." : "ثبت کاربر"}
                    </button>
                </div>
            </div>
        </section>
    );
}
