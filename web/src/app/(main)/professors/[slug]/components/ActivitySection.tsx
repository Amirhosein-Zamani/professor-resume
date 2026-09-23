"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "./Card";
import { ProfessorActivity } from "@/types/professor"; // ✅ به‌جای Activity محلی

type Props = {
  title: string;
  items: ProfessorActivity[]; // ✅
};

const ITEMS_PER_PAGE = 5;

export function ActivitySection({ title, items }: Props) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, page]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [open, page, items]);

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
                    group flex w-full items-center justify-between
                    cursor-pointer px-4 py-4 text-right sm:px-6 sm:py-5
                    transition-all duration-300 ease-out
                    hover:bg-[var(--color-base-jade-0)]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-base-jade-3)]
                    focus-visible:ring-offset-2 focus-visible:ring-offset-white
                    active:scale-[0.995]
                "
        aria-expanded={open}
      >
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[var(--color-base-jade-4)] transition-transform duration-300 group-hover:scale-125" />
            <span className="text-base font-semibold tracking-tight text-[var(--color-text)] sm:text-lg">
              {title}
            </span>
          </div>

          <span className="pr-5 text-sm text-[var(--color-text-muted)]">
            {items.length} مورد
          </span>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-base-gray-0)] transition-colors duration-300 group-hover:bg-[var(--color-base-jade-1)]">
          <ChevronDown
            size={18}
            className={`
                            text-[var(--color-base-jade-5)]
                            transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                            ${open ? "rotate-180" : "rotate-0"}
                        `}
          />
        </div>
      </button>

      {/* Animated Content Wrapper */}
      <div
        style={{
          maxHeight: open ? `${contentHeight}px` : "0px",
          opacity: open ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-height,opacity]"
      >
        <div ref={contentRef}>
          <Card>
            <div className="divide-y divide-[var(--color-border)]">
              {paginated.map((item) => (
                <article
                  key={item.id} // ✅ id واقعی از API (نه item.type-item.id)
                  className="group/item relative py-4 px-1 transition-all duration-200 hover:bg-[var(--color-base-gray-0)] rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-base-jade-3)] transition-colors duration-200 group-hover/item:bg-[var(--color-base-jade-5)]" />

                    <div className="min-w-0 flex-1">
                      {item.titleFa && (
                        <p className="text-[15px] leading-7 text-[var(--color-text)]">
                          {item.titleFa}
                        </p>
                      )}

                      {item.titleEn && (
                        <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)] italic ltr text-left">
                          {item.titleEn}
                        </p>
                      )}

                      {/* ✅ description هم نشون بده اگر بود */}
                      {item.description && (
                        <p className="mt-1.5 text-sm leading-6 text-[var(--color-text-muted)]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  const active = page === pageNumber;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`
                                                min-w-[40px] rounded-lg border px-3 py-2 text-sm font-medium
                                                cursor-pointer
                                                transition-all duration-200 ease-out
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-base-jade-3)]
                                                focus-visible:ring-offset-2
                                                active:scale-95
                                                ${active
                          ? "border-[var(--color-base-jade-6)] bg-[var(--color-base-jade-6)] text-white shadow-sm"
                          : "border-[var(--color-border)] bg-white text-[var(--color-text-soft)] hover:border-[var(--color-base-jade-3)] hover:bg-[var(--color-base-jade-0)] hover:text-[var(--color-base-jade-7)]"
                        }
                                            `}
                      aria-current={active ? "page" : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
