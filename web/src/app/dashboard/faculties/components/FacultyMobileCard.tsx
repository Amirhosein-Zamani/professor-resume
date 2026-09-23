"use client";

import { FiCheck, FiEdit2, FiTrash2, FiUploadCloud, FiX } from "react-icons/fi";

import FacultyIcon from "@/components/shared/FacultyIcon";
import type { Faculty } from "@/types/faculty";

type FacultyMobileCardProps = {
    faculty: Faculty;
    isEditing: boolean;
    editingName: string;
    editingIconFile: File | null;
    submitting: boolean;
    onEdit: (faculty: Faculty) => void;
    onDelete: (faculty: Faculty) => void;
    onEditName: (value: string) => void;
    onEditIcon: (file: File | null) => void;
    onUpdate: () => void;
    onCancelEdit: () => void;
};

export default function FacultyMobileCard({
    faculty,
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
}: FacultyMobileCardProps) {
    return (
        <article className="p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-base-jade-1 text-base-jade-5">
                    <FacultyIcon
                        iconUrl={faculty.iconUrl}
                        facultyName={faculty.name}
                        alt={`آیکن ${faculty.name}`}
                        className="h-7 w-7"
                        fallbackSize={21}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    {isEditing ? (
                        <div className="space-y-3">
                            <input
                                autoFocus
                                value={editingName}
                                onChange={(event) => onEditName(event.target.value)}
                                className="h-11 w-full rounded-xl border-2 border-base-jade-3 bg-surface px-3 text-sm text-text outline-none"
                            />
                            <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-base-jade-3 bg-base-jade-0 px-3 text-xs text-base-jade-6">
                                <FiUploadCloud size={15} />
                                <span className="max-w-44 truncate">
                                    {editingIconFile?.name || "جایگزینی آیکن SVG"}
                                </span>
                                <input
                                    type="file"
                                    accept=".svg,image/svg+xml"
                                    className="sr-only"
                                    onChange={(event) => onEditIcon(event.target.files?.[0] ?? null)}
                                />
                            </label>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-semibold text-text">{faculty.name}</h3>
                            <p className="mt-1 text-xs text-text-muted">
                                ایجاد: {new Date(faculty.createdAt!).toLocaleDateString("fa-IR")}
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
                {isEditing ? (
                    <>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={onUpdate}
                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-base-jade-6 text-sm font-medium text-white disabled:opacity-50"
                        >
                            <FiCheck size={16} />
                            {submitting ? "ذخیره..." : "ذخیره"}
                        </button>
                        <button
                            type="button"
                            disabled={submitting}
                            onClick={onCancelEdit}
                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border text-sm text-text-soft disabled:opacity-50"
                        >
                            <FiX size={16} />
                            انصراف
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={() => onEdit(faculty)}
                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-base-jade-1 text-sm font-medium text-base-jade-6"
                        >
                            <FiEdit2 size={16} />
                            ویرایش
                        </button>
                        <button
                            type="button"
                            onClick={() => onDelete(faculty)}
                            className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-medium text-danger"
                        >
                            <FiTrash2 size={16} />
                            حذف
                        </button>
                    </>
                )}
            </div>
        </article>
    );
}
