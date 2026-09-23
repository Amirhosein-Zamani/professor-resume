import type { Professor } from "@/types/professor";

type DetailItem = {
    label: string;
    value: string | number | null | undefined;
    ltr?: boolean;
};

function formatDate(value?: string) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export default function ProfessorInformation({ professor }: { professor: Professor }) {
    const details: DetailItem[] = [
        { label: "نام", value: professor.firstName },
        { label: "نام خانوادگی", value: professor.lastName },
        { label: "نام نمایشی", value: professor.displayName },
        { label: "مرتبه علمی", value: professor.rank },
        { label: "دانشکده", value: professor.faculty },
        { label: "شناسه دانشکده", value: professor.facultyId, ltr: true },
        { label: "تخصص", value: professor.specialty },
        { label: "گروه پژوهشی", value: professor.researchGroupName },
        { label: "سازمان", value: professor.organizationName },
        { label: "ایمیل", value: professor.email, ltr: true },
        { label: "شناسه صفحه", value: professor.slug, ltr: true },
        { label: "کد ملی", value: professor.nationalCode, ltr: true },
        { label: "شماره پرسنلی", value: professor.employeeNo, ltr: true },
        { label: "شماره دانشجویی", value: professor.studentNo, ltr: true },
        { label: "شناسه استاد در گلستان", value: professor.golestanProfessorNo, ltr: true },
        { label: "نوع همکاری", value: professor.isFaculty ? "عضو هیئت علمی" : "مدرس مدعو" },
        { label: "تاریخ ایجاد", value: formatDate(professor.createdAt) },
        { label: "آخرین به‌روزرسانی", value: formatDate(professor.updatedAt) },
    ].filter((item) => item.value !== null && item.value !== undefined && item.value !== "");

    return (
        <section className="mt-6 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] sm:p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">اطلاعات کامل استاد</h2>
            <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 xl:grid-cols-3">
                {details.map((item) => (
                    <div key={item.label} className="min-w-0 bg-[var(--color-card-bg)] p-3.5 sm:p-4">
                        <dt className="text-xs font-medium text-[var(--color-text-muted)]">{item.label}</dt>
                        <dd
                            dir={item.ltr ? "ltr" : "rtl"}
                            className={`mt-1 break-words text-sm font-medium text-[var(--color-text)] ${
                                item.ltr ? "text-left" : "text-right"
                            }`}
                        >
                            {item.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
