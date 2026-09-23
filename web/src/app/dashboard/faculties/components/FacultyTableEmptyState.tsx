import { FiBookOpen } from "react-icons/fi";

export default function FacultyTableEmptyState({ hasSearch }: { hasSearch: boolean }) {
    return (
        <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-base-jade-0)] text-[var(--color-base-jade-4)]">
                <FiBookOpen size={24} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[var(--color-text)]">
                {hasSearch ? "دانشکده‌ای پیدا نشد" : "هنوز دانشکده‌ای ثبت نشده است"}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {hasSearch ? "عبارت جستجو را تغییر دهید." : "اولین دانشکده را اضافه کنید."}
            </p>
        </div>
    );
}
