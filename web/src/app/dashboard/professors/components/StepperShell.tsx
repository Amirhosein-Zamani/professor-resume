"use client";

import { FiCheck } from "react-icons/fi";

type NewProfessorStepperProps = {
    currentStep: 0 | 1;
};

const STEPS = [
    { title: "اطلاعات استاد" },
    { title: "فعالیت‌های علمی" },
];

export default function NewProfessorStepper({
    currentStep,
}: NewProfessorStepperProps) {
    return (
        <ol className="mb-8 flex items-center">
            {STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                    <li
                        key={step.title}
                        className="flex flex-1 items-center last:flex-none"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className={`
                                    flex h-9 w-9 items-center justify-center
                                    rounded-full border-2 text-sm font-bold
                                    transition-colors
                                    ${
                                        isCompleted
                                            ? "border-[var(--color-base-jade-4)] bg-[var(--color-base-jade-4)] text-white"
                                            : isCurrent
                                              ? "border-[var(--color-base-jade-4)] text-[var(--color-base-jade-5)]"
                                              : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                                    }
                                `}
                            >
                                {isCompleted ? <FiCheck size={16} /> : index + 1}
                            </div>
                            <span
                                className={`
                                    whitespace-nowrap text-xs
                                    ${
                                        isCurrent
                                            ? "font-semibold text-[var(--color-text)]"
                                            : "text-[var(--color-text-soft)]"
                                    }
                                `}
                            >
                                {step.title}
                            </span>
                        </div>

                        {index < STEPS.length - 1 && (
                            <div
                                className={`
                                    mx-3 h-0.5 flex-1
                                    ${
                                        isCompleted
                                            ? "bg-[var(--color-base-jade-4)]"
                                            : "bg-[var(--color-border)]"
                                    }
                                `}
                            />
                        )}
                    </li>
                );
            })}
        </ol>
    );
}