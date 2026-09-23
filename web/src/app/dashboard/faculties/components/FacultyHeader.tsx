"use client";

import {
    FiBookOpen,
    FiPlus,
} from "react-icons/fi";

type FacultyHeaderProps = {
    onCreate: () => void;
};

export default function FacultyHeader({
    onCreate,
}: FacultyHeaderProps) {
    return (
        <header
            className="
                flex flex-col gap-5
                sm:flex-row
                sm:items-center
                sm:justify-between
            "
        >
            <div className="flex items-center gap-4">
                <div
                    className="
                        flex h-12 w-12
                        shrink-0
                        items-center justify-center
                        rounded-2xl
                        bg-[var(--color-base-jade-1)]
                        text-[var(--color-base-jade-5)]
                    "
                >
                    <FiBookOpen size={22} />
                </div>

                <div>
                    <h1
                        className="
                            text-xl
                            font-bold
                            tracking-tight
                            text-[var(--color-text)]
                        "
                    >
                        دانشکده‌ها
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--color-text-muted)]
                        "
                    >
                        مدیریت دانشکده‌های دانشگاه
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onCreate}
                className="
                    inline-flex w-full sm:w-auto
                    h-11
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[var(--color-button-primary)]
                    px-5
                    text-sm
                    font-medium
                    text-[var(--color-button-primary-text)]
                    shadow-sm
                    transition-all
                    hover:bg-[var(--color-button-primary-hover)]
                    hover:shadow-md
                    active:scale-[0.98]
                "
            >
                <FiPlus size={17} />

                افزودن دانشکده
            </button>
        </header>
    );
}
