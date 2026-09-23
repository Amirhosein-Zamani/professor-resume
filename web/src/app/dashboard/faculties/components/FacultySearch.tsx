"use client";

import {
    FiRefreshCw,
    FiSearch,
} from "react-icons/fi";

type FacultySearchProps = {
    value: string;
    loading: boolean;
    resultCount: number;
    onChange: (value: string) => void;
    onRefresh: () => void;
};

export default function FacultySearch({
    value,
    loading,
    resultCount,
    onChange,
    onRefresh,
}: FacultySearchProps) {
    return (
        <section
            className="
                rounded-2xl
                border
                border-[var(--color-card-border)]
                bg-[var(--color-card-bg)]
                p-4
                shadow-[0_4px_20px_rgba(30,61,57,0.05)]
            "
        >
            <div
                className="
                    flex flex-col gap-3
                    sm:flex-row
                    sm:items-center
                "
            >
                <div className="relative flex-1">
                    <FiSearch
                        size={18}
                        className="
                            pointer-events-none
                            absolute
                            right-4
                            top-1/2
                            -translate-y-1/2
                            text-[var(--color-text-muted)]
                        "
                    />

                    <input
                        value={value}
                        onChange={(event) =>
                            onChange(
                                event.target.value
                            )
                        }
                        placeholder="جستجوی نام دانشکده..."
                        className="
                            h-11
                            w-full
                            rounded-xl
                            border
                            border-[var(--color-border)]
                            bg-[var(--color-base-gray-0)]
                            pr-11
                            pl-4
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

                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    className="
                        inline-flex
                        h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-[var(--color-surface)]
                        px-4
                        text-sm
                        text-[var(--color-text-soft)]
                        transition
                        hover:border-[var(--color-base-jade-3)]
                        hover:bg-[var(--color-base-jade-0)]
                        hover:text-[var(--color-base-jade-5)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <FiRefreshCw
                        size={16}
                        className={
                            loading
                                ? "animate-spin"
                                : ""
                        }
                    />

                    بروزرسانی
                </button>
            </div>

            <div
                className="
                    mt-3 flex flex-col gap-1.5
                    min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between
                    text-xs
                    text-[var(--color-text-muted)]
                "
            >
                <span>
                    {resultCount} دانشکده
                </span>

                {value && (
                    <span>
                        نتیجه جستجو برای «
                        {value}
                        »
                    </span>
                )}
            </div>
        </section>
    );
}
