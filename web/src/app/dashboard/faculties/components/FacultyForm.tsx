"use client";

import {
    FiCheck,
    FiUploadCloud,
    FiX,
} from "react-icons/fi";

type FacultyFormProps = {
    name: string;
    iconFile: File | null;
    submitting: boolean;
    onChange: (value: string) => void;
    onIconChange: (file: File | null) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

export default function FacultyForm({
    name,
    iconFile,
    submitting,
    onChange,
    onIconChange,
    onSubmit,
    onCancel,
}: FacultyFormProps) {
    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-[var(--color-card-border)]
                bg-[var(--color-card-bg)]
                shadow-[0_4px_20px_rgba(30,61,57,0.06)]
            "
        >
            <div
                className="
                    border-b
                    border-[var(--color-border)]
                    bg-[var(--color-base-gray-0)]
                    px-5 py-4
                "
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-[var(--color-text)]
                            "
                        >
                            افزودن دانشکده
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                text-[var(--color-text-muted)]
                            "
                        >
                            نام دانشکده و آیکن SVG آن را وارد کنید.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-lg
                            text-[var(--color-text-muted)]
                            transition
                            hover:bg-[var(--color-base-gray-1)]
                            hover:text-[var(--color-text)]
                        "
                    >
                        <FiX size={18} />
                    </button>
                </div>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-[1fr_280px]">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--color-text-soft)]">نام دانشکده</label>
                  <input
                    value={name}
                    onChange={(event) =>
                        onChange(
                            event.target.value
                        )
                    }
                    onKeyDown={(event) => {
                        if (
                            event.key ===
                            "Enter"
                        ) {
                            onSubmit();
                        }

                        if (
                            event.key ===
                            "Escape"
                        ) {
                            onCancel();
                        }
                    }}
                    placeholder="مثلاً دانشکده مهندسی"
                    autoFocus
                    className="
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-[var(--color-base-gray-0)]
                        px-4
                        text-sm
                        text-[var(--color-text)]
                        outline-none
                        placeholder:text-[var(--color-text-muted)]
                        transition
                        focus:border-[var(--color-base-jade-4)]
                        focus:bg-[var(--color-surface)]
                        focus:ring-2
                        focus:ring-[var(--color-base-jade-1)]
                    "
                  />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-[var(--color-text-soft)]">آیکن دانشکده</label>
                    <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-base-jade-3)] bg-[var(--color-base-jade-0)] px-4 text-sm text-[var(--color-base-jade-6)] transition hover:bg-[var(--color-base-jade-1)]">
                        <FiUploadCloud size={18} />
                        <span className="max-w-[190px] truncate">{iconFile?.name || "انتخاب فایل SVG"}</span>
                        <input
                            type="file"
                            accept=".svg,image/svg+xml"
                            className="sr-only"
                            onChange={(event) => onIconChange(event.target.files?.[0] ?? null)}
                        />
                    </label>
                    <p className="text-[11px] text-[var(--color-text-muted)]">فقط SVG، حداکثر ۲۵۶ کیلوبایت</p>
                </div>

                <div className="flex gap-3 md:col-span-2 md:justify-end">

                <button
                    type="button"
                    disabled={submitting}
                    onClick={onSubmit}
                    className="
                        inline-flex w-full md:w-auto
                        h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[var(--color-base-jade-6)]
                        px-5
                        text-sm
                        font-medium
                        text-white
                        transition
                        hover:bg-[var(--color-base-jade-5)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <FiCheck size={16} />

                    {submitting
                        ? "در حال ثبت..."
                        : "ثبت دانشکده"}
                </button>
                </div>
            </div>
        </section>
    );
}
