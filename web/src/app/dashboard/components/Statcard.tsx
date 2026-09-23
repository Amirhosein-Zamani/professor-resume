import { ReactNode } from "react";

type StatCardProps = {
    label: string;
    value: string | number;
    icon: ReactNode;
    accent?: "jade" | "copper";
};

export default function StatCard({
    label,
    value,
    icon,
    accent = "jade",
}: StatCardProps) {
    const accentColor =
        accent === "copper"
            ? "var(--color-base-accent)"
            : "var(--color-base-jade-4)";

    return (
        <div
            className="
                relative overflow-hidden rounded-xl
                border border-[var(--color-card-border)]
                bg-[var(--color-card-bg)]
                p-5 shadow-[0_1px_2px_rgba(47,44,40,0.06)]
            "
        >
            <span
                aria-hidden
                className="absolute inset-y-0 right-0 w-1"
                style={{ backgroundColor: accentColor }}
            />

            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-[var(--color-text-soft)]">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[var(--color-text)]">
                        {value}
                    </p>
                </div>

                <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
                        color: accentColor,
                    }}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}