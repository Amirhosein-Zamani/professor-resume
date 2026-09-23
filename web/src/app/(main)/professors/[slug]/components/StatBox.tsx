type Props = {
  label: string;
  value: number;
};

export function StatBox({ label, value }: Props) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface px-2 py-3 text-center sm:px-4">
      <div className="text-lg font-bold">
        {value}
      </div>

      <div className="mt-0.5 truncate text-[10px] text-text-muted sm:text-xs">
        {label}
      </div>
    </div>
  );
}
