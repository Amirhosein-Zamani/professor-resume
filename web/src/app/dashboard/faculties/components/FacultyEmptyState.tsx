import { FiBookOpen } from "react-icons/fi";

type Props = {
    hasSearch: boolean;
};

export default function FacultyEmptyState({
    hasSearch,
}: Props) {
    return (
        <div className="px-5 py-16 text-center">
            <div
                className="
                    mx-auto flex h-14 w-14
                    items-center justify-center
                    rounded-2xl bg-slate-100
                    text-slate-400
                "
            >
                <FiBookOpen size={24} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-700">
                {hasSearch
                    ? "دانشکده‌ای پیدا نشد"
                    : "هنوز دانشکده‌ای ثبت نشده است"}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
                {hasSearch
                    ? "عبارت جستجو را تغییر دهید."
                    : "اولین دانشکده را اضافه کنید."}
            </p>
        </div>
    );
}