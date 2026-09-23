"use client";

import ResponsiveConfirmDialog from "@/components/ui/ResponsiveConfirmDialog";
import UserForm from "./UserForm";
import UsersHeader from "./UsersHeader";
import UsersList from "./UsersList";
import { ROLE_LABELS } from "./user-management.constants";
import { useUsers } from "./useUsers";

export default function UsersPage() {
    const state = useUsers();

    if (state.currentUser?.role !== "ADMIN") return null;

    const pending = state.pendingRoleChange;
    return (
        <div dir="rtl" className="min-h-full space-y-6 text-text">
            <UsersHeader onCreate={state.openCreate} />

            {state.isCreateOpen && (
                <UserForm
                    email={state.email}
                    role={state.role}
                    professorId={state.professorId}
                    professors={state.availableProfessors}
                    submitting={state.submitting}
                    onEmailChange={state.setEmail}
                    onRoleChange={(role) => {
                        state.setRole(role);
                        if (role === "ADMIN") state.setProfessorId("");
                    }}
                    onProfessorChange={state.setProfessorId}
                    onSubmit={state.submitCreate}
                    onCancel={state.closeCreate}
                />
            )}

            <UsersList
                users={state.users}
                currentUserId={state.currentUser.id}
                search={state.search}
                loading={state.loading}
                onSearch={state.setSearch}
                onRefresh={state.refresh}
                onRoleChange={(account, role) => state.setPendingRoleChange({ account, role })}
            />

            <ResponsiveConfirmDialog
                open={Boolean(pending)}
                title="تغییر سطح دسترسی"
                description={pending ? `نقش «${pending.account.email}» به «${ROLE_LABELS[pending.role]}» تغییر کند؟ این تغییر از درخواست بعدی کاربر اعمال می‌شود.` : ""}
                confirmLabel="بله، تغییر کند"
                intent="primary"
                isLoading={state.changingRole}
                onClose={() => state.setPendingRoleChange(null)}
                onConfirm={state.confirmRoleChange}
            />
        </div>
    );
}
