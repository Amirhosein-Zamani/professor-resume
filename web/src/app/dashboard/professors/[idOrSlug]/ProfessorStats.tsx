type ProfessorStatsProps = {
    items: Array<{ label: string; value: number }>;
};

export default function ProfessorStats({ items }: ProfessorStatsProps) {
    if (items.length === 0) return null;
    return (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {items.map((item) => (
                <div key={item.label} className="rounded-xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 text-center shadow-[0_1px_2px_rgba(47,44,40,0.06)]">
                    <p className="text-2xl font-bold text-[var(--color-base-jade-5)]">{item.value}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-soft)]">{item.label}</p>
                </div>
            ))}
        </div>
    );
}
