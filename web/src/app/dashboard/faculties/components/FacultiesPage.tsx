"use client";

import ResponsiveConfirmDialog from "@/components/ui/ResponsiveConfirmDialog";

import FacultyForm from "./FacultyForm";
import FacultyHeader from "./FacultyHeader";
import FacultySearch from "./FacultySearch";
import FacultyTable from "./FacultyTable";
import { useFaculties } from "./useFaculties";

export default function FacultiesPage() {
    const state = useFaculties();

    return (
        <div dir="rtl" className="min-h-full space-y-6 text-[var(--color-text)]">
            <FacultyHeader onCreate={state.openCreate} />

            {state.error && (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--color-base-danger)] bg-[#ab5e5e]/8 px-4 py-3 text-sm text-[var(--color-danger)]">
                    <span>{state.error}</span>
                    <button type="button" onClick={() => state.setError(null)} className="text-lg leading-none opacity-70 transition hover:opacity-100">
                        ×
                    </button>
                </div>
            )}

            {state.isCreateOpen && (
                <FacultyForm
                    name={state.name}
                    iconFile={state.iconFile}
                    submitting={state.submitting}
                    onChange={state.setName}
                    onIconChange={state.setIconFile}
                    onSubmit={state.create}
                    onCancel={state.cancelEditing}
                />
            )}

            <FacultySearch
                value={state.search}
                loading={state.loading}
                resultCount={state.faculties.length}
                onChange={state.setSearch}
                onRefresh={state.refresh}
            />

            <FacultyTable
                faculties={state.faculties}
                loading={state.loading}
                search={state.search}
                editingId={state.editingId}
                editingName={state.name}
                editingIconFile={state.iconFile}
                submitting={state.submitting}
                onEdit={state.startEditing}
                onDelete={state.setFacultyToDelete}
                onEditName={state.setName}
                onEditIcon={state.setIconFile}
                onUpdate={state.update}
                onCancelEdit={state.cancelEditing}
            />

            <ResponsiveConfirmDialog
                open={Boolean(state.facultyToDelete)}
                title="حذف دانشکده"
                description={`آیا از حذف «${state.facultyToDelete?.name ?? "این دانشکده"}» اطمینان دارید؟ اگر استادی به این دانشکده متصل باشد، حذف انجام نخواهد شد.`}
                confirmLabel="بله، حذف شود"
                isLoading={state.deleting}
                onClose={() => state.setFacultyToDelete(null)}
                onConfirm={async () => {
                    if (state.facultyToDelete) await state.remove(state.facultyToDelete);
                }}
            />
        </div>
    );
}
