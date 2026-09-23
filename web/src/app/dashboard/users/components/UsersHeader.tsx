"use client";

import { FiPlus, FiShield } from "react-icons/fi";

export default function UsersHeader({ onCreate }: { onCreate: () => void }) {
    return (
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-base-jade-1 text-base-jade-5">
                    <FiShield size={22} aria-hidden="true" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-text">مدیریت کاربران</h1>
                    <p className="mt-1 text-sm text-text-muted">ایجاد حساب و تعیین سطح دسترسی</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onCreate}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-button-primary px-5 text-sm font-medium text-button-primary-text shadow-sm transition hover:bg-button-primary-hover sm:w-auto"
            >
                <FiPlus size={17} aria-hidden="true" />
                افزودن کاربر
            </button>
        </header>
    );
}
