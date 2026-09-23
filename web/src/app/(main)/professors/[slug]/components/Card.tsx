type Props = {
  title?: string;
  children: React.ReactNode;
};

export function Card({ title, children }: Props) {
  return (
    <div className="border-t border-[var(--color-border)] bg-[var(--color-card-bg)] px-6 pb-6 pt-3">
      {title && (
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-[var(--color-base-jade-5)]">
          {title}
        </h3>
      )}

      {children}
    </div>
  );
}
