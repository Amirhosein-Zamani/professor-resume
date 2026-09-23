"use client";

import { FiRefreshCw, FiSearch, FiUser } from "react-icons/fi";

import type { UserRole } from "@/types/auth";
import type { ManagedUser } from "@/types/user-management";
import { ROLE_LABELS } from "./user-management.constants";

type Props = {
    users: ManagedUser[];
    currentUserId?: string;
    search: string;
    loading: boolean;
    onSearch: (value: string) => void;
    onRefresh: () => void;
    onRoleChange: (account: ManagedUser, role: UserRole) => void;
};

function RoleActions({ account, currentUserId, onChange }: {
    account: ManagedUser;
    currentUserId?: string;
    onChange: (role: UserRole) => void;
}) {
    const isCurrent = account.id === currentUserId;
    return (
        <div className="inline-flex rounded-xl border border-border bg-base-gray-0 p-1">
            {(["EDITOR", "ADMIN"] as UserRole[]).map((role) => (
                <button
                    key={role}
                    type="button"
                    disabled={isCurrent || account.role === role}
                    onClick={() => onChange(role)}
                    className={`min-h-9 rounded-lg px-3 text-xs transition disabled:cursor-default ${
                        account.role === role
                            ? "bg-base-jade-6 font-medium text-white"
                            : "text-text-soft hover:bg-base-jade-1 disabled:opacity-60"
                    }`}
                >
                    {ROLE_LABELS[role]}
                </button>
            ))}
        </div>
    );
}

export default function UsersList(props: Props) {
    return (
        <section className="overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-[0_4px_20px_rgba(30,61,57,0.06)]">
            <div className="grid gap-3 border-b border-border p-4 sm:grid-cols-[1fr_auto]">
                <label className="relative">
                    <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="search"
                        value={props.search}
                        onChange={(event) => props.onSearch(event.target.value)}
                        placeholder="جست‌وجوی ایمیل یا نام استاد..."
                        className="h-11 w-full rounded-xl border border-border bg-base-gray-0 pr-11 pl-4 text-sm text-text outline-none focus:border-base-jade-4"
                    />
                </label>
                <button type="button" disabled={props.loading} onClick={props.onRefresh} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm text-text-soft disabled:opacity-50">
                    <FiRefreshCw className={props.loading ? "animate-spin" : ""} />
                    به‌روزرسانی
                </button>
            </div>

            <header className="flex items-center justify-between border-b border-border bg-base-gray-0 px-5 py-4">
                <div>
                    <h2 className="text-sm font-semibold text-text">فهرست کاربران</h2>
                    <p className="mt-1 text-xs text-text-muted">تغییر نقش فقط پس از تأیید مدیر انجام می‌شود.</p>
                </div>
                <span className="rounded-lg bg-base-jade-0 px-3 py-1.5 text-xs text-base-jade-5">{props.users.length} کاربر</span>
            </header>

            {props.loading ? (
                <div className="space-y-3 p-5" aria-label="در حال دریافت کاربران">
                    {[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-base-gray-1" />)}
                </div>
            ) : props.users.length === 0 ? (
                <div className="p-10 text-center text-sm text-text-muted">کاربری پیدا نشد.</div>
            ) : (
                <>
                    <div className="divide-y divide-border md:hidden">
                        {props.users.map((account) => (
                            <article key={account.id} className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-base-jade-1 text-base-jade-5"><FiUser /></div>
                                    <div className="min-w-0 flex-1">
                                        <p dir="ltr" className="truncate text-left text-sm font-semibold text-text">{account.email}</p>
                                        <p className="mt-1 text-xs text-text-muted">{account.professor?.displayName || "بدون پروفایل استاد"}</p>
                                        {account.id === props.currentUserId && <span className="mt-2 inline-block rounded-md bg-base-jade-1 px-2 py-1 text-[11px] text-base-jade-6">حساب فعلی</span>}
                                    </div>
                                </div>
                                <div className="mt-4 overflow-x-auto">
                                    <RoleActions account={account} currentUserId={props.currentUserId} onChange={(role) => props.onRoleChange(account, role)} />
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[760px]">
                            <thead className="bg-base-gray-1 text-xs text-text-soft">
                                <tr>
                                    <th className="px-5 py-3 text-right">کاربر</th>
                                    <th className="px-5 py-3 text-right">پروفایل مرتبط</th>
                                    <th className="px-5 py-3 text-right">تاریخ ایجاد</th>
                                    <th className="px-5 py-3 text-left">سطح دسترسی</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {props.users.map((account) => (
                                    <tr key={account.id}>
                                        <td className="px-5 py-4">
                                            <p dir="ltr" className="text-left text-sm font-medium text-text">{account.email}</p>
                                            {account.id === props.currentUserId && <span className="mt-1 inline-block text-[11px] text-base-jade-6">حساب فعلی</span>}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-text-soft">{account.professor?.displayName || "—"}</td>
                                        <td className="px-5 py-4 text-sm text-text-soft">{new Date(account.createdAt).toLocaleDateString("fa-IR")}</td>
                                        <td className="px-5 py-4 text-left">
                                            <RoleActions account={account} currentUserId={props.currentUserId} onChange={(role) => props.onRoleChange(account, role)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}
