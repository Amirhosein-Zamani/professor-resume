import Button from "@/components/ui/Button";

type DynamicFormActionsProps = {
    onCancel?: () => void;
    cancelLabel: string;
    submitLabel: string;
    disabled: boolean;
    sticky: boolean;
};

export default function DynamicFormActions({
    onCancel,
    cancelLabel,
    submitLabel,
    disabled,
    sticky,
}: DynamicFormActionsProps) {
    return (
        <div
            className={`${
                sticky
                    ? "sticky bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-20 -mx-4 border-t border-[var(--color-border)] bg-[var(--color-card-bg)]/95 px-4 py-3 shadow-[0_-10px_25px_rgba(30,61,57,.08)] backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none"
                    : "relative z-10 border-t border-[var(--color-border)] pt-4"
            } mt-6 grid ${onCancel ? "grid-cols-2" : "grid-cols-1"} gap-3 sm:flex sm:flex-wrap sm:justify-end`}
        >
            {onCancel && (
                <Button type="button" variant="secondary" onClick={onCancel} disabled={disabled} fullWidth className="sm:w-auto">
                    {cancelLabel}
                </Button>
            )}
            <Button type="submit" variant="primary" loading={disabled} disabled={disabled} fullWidth className="sm:w-auto">
                {submitLabel}
            </Button>
        </div>
    );
}
