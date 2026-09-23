"use client";

import { useRouter, useSearchParams } from "next/navigation";

import NewProfessorStepper from "./NewProfessorStepper";
import StepActivities from "./StepActivities";
import StepProfessorInfo from "./StepProfessorInfo";

export default function NewProfessorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const professorIdFromUrl = searchParams.get("professorId");
    const professorSlugFromUrl = searchParams.get("slug");

    const step: 0 | 1 = professorIdFromUrl ? 1 : 0;

    const handleCreated = (professorId: string, slug: string) => {
        const params = new URLSearchParams();
        params.set("professorId", professorId);
        params.set("slug", slug);

        console.log("[NewProfessorForm] professor created:", { professorId, slug });

        // ✅ باگ syntax درست شد
        router.replace(`/dashboard/professors/new?${params.toString()}`);
    };

    const handleFinish = () => {
        if (professorSlugFromUrl) {
            // ✅ باگ syntax درست شد
            router.push(`/dashboard/professors/${professorSlugFromUrl}`);
        } else {
            router.push("/dashboard/professors");
        }
    };

    return (
        <div>
            <h1 className="mb-6 text-xl font-bold text-[var(--color-text)] sm:mb-8 sm:text-2xl">
                افزودن استاد جدید
            </h1>

            <NewProfessorStepper currentStep={step} />

            {step === 0 && (
                <StepProfessorInfo
                    onCreated={handleCreated}
                    onCancel={() => router.push("/dashboard/professors")}
                />
            )}

            {step === 1 && professorIdFromUrl && professorSlugFromUrl && (
                <StepActivities
                    professorId={professorIdFromUrl}
                    professorSlug={professorSlugFromUrl}
                    onFinish={handleFinish}
                />
            )}
        </div>
    );
}
