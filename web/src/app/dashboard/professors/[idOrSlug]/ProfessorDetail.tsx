"use client";

import ResponsiveConfirmDialog from "@/components/ui/ResponsiveConfirmDialog";

import ProfessorActivityList from "./ProfessorActivityList";
import ProfessorHeaderCard from "./ProfessorHeaderCard";
import ProfessorInformation from "./ProfessorInformation";
import ProfessorPublicationList from "./ProfessorPublicationList";
import ProfessorStats from "./ProfessorStats";
import { getProfessorStats } from "./professor-detail.utils";
import { useProfessorDetail } from "./useProfessorDetail";

type ProfessorDetailProps = {
    idOrSlug: string;
};

function ProfessorDetailSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-xl bg-[var(--color-base-jade-1)]/60" />
            <div className="h-24 animate-pulse rounded-xl bg-[var(--color-base-jade-1)]/60" />
            <div className="h-64 animate-pulse rounded-xl bg-[var(--color-base-jade-1)]/60" />
        </div>
    );
}

export default function ProfessorDetail({ idOrSlug }: ProfessorDetailProps) {
    const state = useProfessorDetail(idOrSlug);

    if (state.isLoading || !state.professor) {
        return <ProfessorDetailSkeleton />;
    }

    return (
        <div>
            <ProfessorHeaderCard professor={state.professor} user={state.user} onDelete={state.openDelete} />
            <ProfessorInformation professor={state.professor} />
            <ProfessorStats items={getProfessorStats(state.professor)} />
            <ProfessorPublicationList publications={state.professor.publications ?? []} />
            <ProfessorActivityList activities={state.professor.activities ?? []} />

            <ResponsiveConfirmDialog
                open={state.isDeleteOpen}
                title="حذف رزومه استاد"
                description={`با حذف رزومه ${state.professor.displayName}، اطلاعات استاد، فایل رزومه و حساب کاربری ورود او برای همیشه حذف می‌شوند. این عملیات قابل بازگشت نیست.`}
                confirmLabel="بله، حذف شود"
                cancelLabel="انصراف"
                isLoading={state.isDeleting}
                onClose={state.closeDelete}
                onConfirm={state.remove}
            />
        </div>
    );
}
