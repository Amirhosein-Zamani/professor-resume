"use client";

import { useEffect, useRef, useState } from "react";

import PersianCalendarPopup from "./PersianCalendarPopup";
import { jalaliMoment, type JalaliMoment } from "./persian-date.utils";

type PersianDatePickerProps = {
    value: string;
    onChange: (isoDate: string | null) => void;
    placeholder?: string;
    className?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    showErrorMessage?: boolean;
};

export default function PersianDatePicker({
    value,
    onChange,
    placeholder = "انتخاب تاریخ",
    className = "",
    label,
    required = false,
    disabled = false,
    error,
    showErrorMessage = true,
}: PersianDatePickerProps) {
    const selectedDate = value ? jalaliMoment(value) : null;
    const [displayDate, setDisplayDate] = useState<JalaliMoment>(() =>
        value ? jalaliMoment(value) : jalaliMoment(),
    );
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", closeOnOutsideClick);
        return () => document.removeEventListener("mousedown", closeOnOutsideClick);
    }, []);

    const selectDate = (date: JalaliMoment) => {
        setDisplayDate(date);
        onChange(date.toISOString());
        setIsOpen(false);
    };

    const changeDisplayDate = (delta: number, unit: "jMonth" | "jYear") => {
        const next = displayDate.clone().add(delta, unit);
        const currentYear = jalaliMoment().jYear();
        if (next.jYear() > currentYear || next.jYear() < 1300) return;
        setDisplayDate(next);
    };

    const hasError = Boolean(error && !disabled);
    const inputValue = selectedDate?.isValid()
        ? selectedDate.format("jYYYY/jMM/jDD")
        : "";

    return (
        <div ref={containerRef} className="relative w-full">
            {label && (
                <label className="mb-2 block text-sm font-medium text-[var(--color-text-soft)]">
                    {label}
                    {required && <span className="mr-1 text-red-500">*</span>}
                </label>
            )}
            <input
                type="text"
                value={inputValue}
                placeholder={placeholder}
                disabled={disabled}
                readOnly
                onClick={() => !disabled && setIsOpen((current) => !current)}
                dir="ltr"
                className={`h-11 w-full rounded-xl bg-white px-4 text-base outline-none transition sm:text-sm ${className} ${
                    hasError
                        ? "border-2 border-[var(--color-danger)]"
                        : "border border-[var(--color-border)] shadow-sm focus:border-[var(--color-base-jade-4)]"
                } ${
                    disabled
                        ? "cursor-not-allowed bg-gray-50/50 opacity-60"
                        : "cursor-pointer hover:border-[var(--color-base-jade-3)]"
                }`}
            />
            {hasError && showErrorMessage && (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
            )}
            {isOpen && !disabled && (
                <PersianCalendarPopup
                    displayDate={displayDate}
                    selectedDate={selectedDate}
                    onSelect={selectDate}
                    onChangeMonth={(delta) => changeDisplayDate(delta, "jMonth")}
                    onChangeYear={(delta) => changeDisplayDate(delta, "jYear")}
                    onToday={() => selectDate(jalaliMoment())}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
