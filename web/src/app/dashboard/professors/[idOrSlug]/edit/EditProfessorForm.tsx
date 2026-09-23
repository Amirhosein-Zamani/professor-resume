"use client";

import ProfessorActivitiesSection from "./ProfessorActivitiesSection";
import ProfessorEditSection from "./ProfessorEditSection";
import { useProfessorActivities } from "./useProfessorActivities";
import { useProfessorEditor } from "./useProfessorEditor";

type EditProfessorFormProps = {
    idOrSlug: string;
};

function EditProfessorSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-xl bg-[var(--color-base-jade-1)]/60" />
            <div className="h-72 animate-pulse rounded-xl bg-[var(--color-base-jade-1)]/60" />
        </div>
    );
}

export default function EditProfessorForm({ idOrSlug }: EditProfessorFormProps) {
    const editor = useProfessorEditor(idOrSlug);
    const activityManager = useProfessorActivities({
        professorId: editor.professor?.id,
        activities: editor.activities,
        setActivities: editor.setActivities,
    });

    if (editor.isLoading || !editor.professor) {
        return <EditProfessorSkeleton />;
    }

    return (
        <div className="space-y-6">
            <ProfessorEditSection
                initialValues={editor.initialValues}
                isSaving={editor.isSaving}
                onSave={editor.saveProfessor}
                onCancel={editor.goToDetails}
            />
            <ProfessorActivitiesSection
                activities={activityManager.sortedActivities}
                editingActivity={activityManager.editingActivity}
                isFormOpen={activityManager.isFormOpen}
                isSaving={activityManager.isSaving}
                removingId={activityManager.removingId}
                onOpenCreate={activityManager.openCreate}
                onOpenEdit={activityManager.openEdit}
                onCloseForm={activityManager.closeForm}
                onSave={activityManager.saveActivity}
                onRemove={activityManager.removeActivity}
            />
        </div>
    );
}
