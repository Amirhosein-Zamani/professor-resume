"use client";

import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

import Button from "@/components/ui/Button";

type ResponsiveConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    intent?: "danger" | "primary";
    onConfirm: () => void | Promise<void>;
    onClose: () => void;
};

export default function ResponsiveConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "تأیید",
    cancelLabel = "انصراف",
    isLoading = false,
    intent = "danger",
    onConfirm,
    onClose,
}: ResponsiveConfirmDialogProps) {
    const dialogRef = useRef<HTMLElement>(null);
    const Icon = intent === "danger" ? FiAlertTriangle : FiCheckCircle;

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.requestAnimationFrame(() => {
            dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
        });

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isLoading) onClose();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isLoading, onClose, open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]" dir="rtl">
            <button
                type="button"
                aria-label="بستن پنجره تأیید"
                disabled={isLoading}
                onClick={onClose}
                className="absolute inset-0 h-full w-full cursor-default bg-black/45 backdrop-blur-[1px]"
            />

            <div className="pointer-events-none absolute inset-0 flex items-end justify-center sm:items-center sm:p-4">
                <section
                    ref={dialogRef}
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="confirm-dialog-title"
                    aria-describedby="confirm-dialog-description"
                    className="pointer-events-auto w-full rounded-t-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6"
                >
                    <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[var(--color-border)] sm:hidden" />

                    <div className="flex items-start gap-3">
                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                                intent === "danger"
                                    ? "bg-red-50 text-[var(--color-danger)]"
                                    : "bg-[var(--color-base-jade-1)] text-[var(--color-base-jade-5)]"
                            }`}
                        >
                            <Icon size={21} />
                        </div>

                        <div>
                            <h2
                                id="confirm-dialog-title"
                                className="font-bold text-[var(--color-text)]"
                            >
                                {title}
                            </h2>
                            <p
                                id="confirm-dialog-description"
                                className="mt-2 text-sm leading-7 text-[var(--color-text-soft)]"
                            >
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={isLoading}
                            onClick={onClose}
                            fullWidth
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            type="button"
                            variant={intent === "danger" ? "danger" : "primary"}
                            loading={isLoading}
                            onClick={onConfirm}
                            fullWidth
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
