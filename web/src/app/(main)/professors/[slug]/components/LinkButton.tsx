type Props = {
  text: string;
  href: string;
};

export function LinkButton({ text, href }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
                flex items-center justify-center
                w-full rounded-xl border
                border-[var(--color-border)]
                bg-[var(--color-surface)]
                px-4 py-2.5 text-sm font-medium
                text-[var(--color-text)]
                transition-all duration-200
                hover:border-[var(--color-base-jade-4)]
                hover:bg-[var(--color-base-jade-0)]
                hover:text-[var(--color-base-jade-7)]
                active:scale-[0.98]
            "
    >
      {text}
    </a>
  );
}