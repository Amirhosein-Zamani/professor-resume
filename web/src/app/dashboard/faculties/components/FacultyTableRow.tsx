"use client";

import { FiCheck, FiEdit2, FiTrash2, FiUploadCloud, FiX } from "react-icons/fi";

import FacultyIcon from "@/components/shared/FacultyIcon";

import type { FacultyRowProps } from "./faculty-table.types";

export default function FacultyTableRow({
    faculty,
    index,
    isEditing,
    editingName,
    editingIconFile,
    submitting,
    onEdit,
    onDelete,
    onEditName,
    onEditIcon,
    onUpdate,
    onCancelEdit,
}: FacultyRowProps) {
    return (
        <tr className="group transition-colors hover:bg-[var(--color-base-jade-0)]">
            <td className="px-5 py-4 text-sm text-[var(--color-text-muted)]">{index + 1}</td>
            <td className="px-5 py-4">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[var(--color-base-jade-1)] text-[var(--color-base-jade-5)]">
                    <FacultyIcon iconUrl={faculty.iconUrl} facultyName={faculty.name} alt={`آیکن ${faculty.name}`} className="h-7 w-7" fallbackSize={20} />
                </div>
            </td>
            <td className="px-5 py-4">
                {isEditing ? (
                    <FacultyInlineEditor
                        name={editingName}
                        iconFile={editingIconFile}
                        onNameChange={onEditName}
                        onIconChange={onEditIcon}
                        onSubmit={onUpdate}
                        onCancel={onCancelEdit}
                    />
                ) : (
                    <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">{faculty.name}</p>
                        <p className="mt-1 font-mono text-[10px] text-[var(--color-text-muted)]">{faculty.id}</p>
                    </div>
                )}
            </td>
            <td className="px-5 py-4 text-sm text-[var(--color-text-soft)]">
                {faculty.createdAt ? new Date(faculty.createdAt).toLocaleDateString("fa-IR") : "—"}
            </td>
            <td className="px-5 py-4">
                {isEditing ? (
                    <EditActions submitting={submitting} onUpdate={onUpdate} onCancel={onCancelEdit} />
                ) : (
                    <RowActions onEdit={() => onEdit(faculty)} onDelete={() => onDelete(faculty)} />
                )}
            </td>
        </tr>
    );
}

type EditorProps = {
    name: string;
    iconFile: File | null;
    onNameChange: (value: string) => void;
    onIconChange: (file: File | null) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

function FacultyInlineEditor({ name, iconFile, onNameChange, onIconChange, onSubmit, onCancel }: EditorProps) {
    return (
        <div>
            <input
                autoFocus
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") onSubmit();
                    if (event.key === "Escape") onCancel();
                }}
                className="h-10 w-full max-w-md rounded-xl border-2 border-[var(--color-base-jade-3)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] outline-none"
            />
            <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-[var(--color-base-jade-3)] bg-[var(--color-base-jade-0)] px-3 py-2 text-xs text-[var(--color-base-jade-6)] hover:bg-[var(--color-base-jade-1)]">
                <FiUploadCloud size={14} />
                <span className="max-w-44 truncate">{iconFile?.name || "جایگزینی آیکن SVG"}</span>
                <input type="file" accept=".svg,image/svg+xml" className="sr-only" onChange={(event) => onIconChange(event.target.files?.[0] ?? null)} />
            </label>
        </div>
    );
}

function EditActions({ submitting, onUpdate, onCancel }: { submitting: boolean; onUpdate: () => void; onCancel: () => void }) {
    return (
        <div className="flex items-center justify-end gap-2">
            <button type="button" disabled={submitting} onClick={onUpdate} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--color-base-jade-6)] px-3 text-xs font-medium text-white transition hover:bg-[var(--color-base-jade-5)] disabled:opacity-50">
                <FiCheck size={14} /> {submitting ? "ذخیره..." : "ذخیره"}
            </button>
            <button type="button" disabled={submitting} onClick={onCancel} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 text-xs text-[var(--color-text-soft)] transition hover:bg-[var(--color-base-gray-1)] disabled:opacity-50">
                <FiX size={14} /> انصراف
            </button>
        </div>
    );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
    return (
        <div className="flex items-center justify-end gap-1">
            <button type="button" onClick={onEdit} title="ویرایش" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-base-jade-4)] transition hover:bg-[var(--color-base-jade-1)] hover:text-[var(--color-base-jade-6)]"><FiEdit2 size={16} /></button>
            <button type="button" onClick={onDelete} title="حذف" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-danger)] transition hover:bg-[#ab5e5e]/10 hover:text-[#8e4b4b]"><FiTrash2 size={16} /></button>
        </div>
    );
}
