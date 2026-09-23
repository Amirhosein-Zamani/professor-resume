"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { IconType } from "react-icons";

interface SelectProps {
  id?: string;
  label?: string;
  labelIcon?: IconType;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  error?: string;
  showErrorMessage?: boolean;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  label,
  labelIcon: LabelIcon,
  options = [],
  value,
  onChange,
  className = "",
  wrapperClassName = "",
  labelClassName = "",
  error,
  showErrorMessage = true,
  disabled = false,
  required = false,
  searchable = false,
  searchPlaceholder = "جست‌وجو...",
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open || !searchable) return;

    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [open, searchable]);

  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 639px)").matches) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase("fa");
  const filteredOptions = normalizedSearch
    ? options.filter((option) =>
        option.toLocaleLowerCase("fa").includes(normalizedSearch),
      )
    : options;

  const baseStyles = `
    w-full
    h-10 sm:h-11
    px-3 sm:px-4
    rounded-md sm:rounded-lg
    border cursor-pointer
    bg-bg-soft text-text
    text-base sm:text-sm flex items-center justify-between
    transition-all duration-200
    outline-none
    disabled:cursor-not-allowed disabled:opacity-60
  `;

  return (
    <div className={`space-y-1.5 sm:space-y-2 ${wrapperClassName}`} ref={ref}>
      {label && (
        <label
          htmlFor={id}
          className={`
            flex items-center gap-1.5 sm:gap-2
            text-xs sm:text-sm font-medium
            text-text-soft
            ${labelClassName}
          `}
        >
          {LabelIcon && (
            <LabelIcon className="text-sm sm:text-base" />
          )}
          {label}
          {required && (
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {/* Fake Select */}
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={`
            ${baseStyles} ${className}
            ${error
              ? "border-2 border-[var(--color-danger)]"
              : open
                ? "border-[var(--color-base-jade-4)]"
                : "border-border"}
          `}
          onClick={() => !disabled && setOpen((prev) => !prev)}
        >
          <span className="truncate">{value || "انتخاب..."}</span>

          <FaChevronDown
            className={`
              text-text-soft
              transition-transform duration-300
              ${open ? "rotate-180" : ""}
            `}
          />
        </button>

        {open && (
          <button
            type="button"
            aria-label="بستن فهرست انتخاب"
            onClick={() => {
              setOpen(false);
              setSearchTerm("");
            }}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-[1px] sm:hidden"
          />
        )}

        {/* Options List */}
        <div
          className={`
            fixed inset-x-0 bottom-0 z-[90] max-h-[80dvh] overflow-hidden rounded-t-3xl shadow-2xl
            border border-border bg-bg-soft text-sm sm:text-base
            transform origin-bottom transition-all duration-200
            sm:absolute sm:bottom-auto sm:top-full sm:z-20 sm:mt-1 sm:max-h-none
            sm:rounded-lg sm:shadow-md sm:origin-top
            ${open
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "hidden"}
          `}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:hidden">
            <span className="font-semibold text-text">
              {label || "انتخاب گزینه"}
            </span>
            <button
              type="button"
              aria-label="بستن"
              onClick={() => {
                setOpen(false);
                setSearchTerm("");
              }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--color-base-jade-1)] text-text-soft"
            >
              <FaTimes size={14} />
            </button>
          </div>

          {searchable && (
            <div className="border-b border-border p-2">
              <input
                ref={searchInputRef}
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setOpen(false);
                    setSearchTerm("");
                  }
                }}
                placeholder={searchPlaceholder}
                className="h-11 w-full rounded-xl border border-border bg-white px-3 text-base text-text outline-none placeholder:text-text-muted focus:border-base-jade-4 sm:h-9 sm:rounded-md sm:text-sm"
              />
            </div>
          )}

          <ul className="max-h-[55dvh] overflow-y-auto py-1 sm:max-h-60">
            {filteredOptions.map((opt) => {
              const selected = opt === value;
              return (
                <li
                  key={opt}
                  className={`
                    px-3 py-2 sm:px-4 sm:py-2.5 cursor-pointer select-none
                    transition-colors duration-200
                    ${selected
                      ? "bg-base-jade-2 text-base-dark font-medium"
                      : "text-text hover:bg-base-jade-1"}
                  `}
                  onClick={() => {
                    onChange?.(opt);
                    setOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {opt}
                </li>
              );
            })}

            {filteredOptions.length === 0 && (
              <li className="px-4 py-5 text-center text-sm text-text-muted">
                نتیجه‌ای پیدا نشد
              </li>
            )}
          </ul>
        </div>
      </div>

      {error && showErrorMessage && (
        <p className="text-xs text-[var(--color-danger)]">{error}</p>
      )}
    </div>
  );
};

export default Select;
