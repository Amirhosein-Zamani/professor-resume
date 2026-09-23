import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import {
    getMonthDays,
    isFutureDate,
    isSameJalaliDay,
    jalaliMoment,
    MONTH_NAMES,
    WEEK_DAYS,
    type JalaliMoment,
} from "./persian-date.utils";

type PersianCalendarPopupProps = {
    displayDate: JalaliMoment;
    selectedDate: JalaliMoment | null;
    onSelect: (date: JalaliMoment) => void;
    onChangeMonth: (delta: number) => void;
    onChangeYear: (delta: number) => void;
    onToday: () => void;
    onClose: () => void;
};

export default function PersianCalendarPopup(props: PersianCalendarPopupProps) {
    const currentYear = jalaliMoment().jYear();
    const isAtCurrentMonth =
        props.displayDate.jYear() >= currentYear &&
        props.displayDate.jMonth() >= jalaliMoment().jMonth();

    return (
        <div className="fixed inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[95] mx-auto max-h-[calc(100dvh-7rem)] w-auto max-w-sm origin-bottom overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-white p-3 shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:z-50 sm:mt-2 sm:w-[17rem] sm:origin-top">
            <div className="mb-3 flex items-center justify-between gap-1">
                <CalendarNav
                    direction="previous"
                    yearDisabled={props.displayDate.jYear() <= 1300}
                    onMonth={() => props.onChangeMonth(-1)}
                    onYear={() => props.onChangeYear(-1)}
                />
                <div className="flex min-w-0 items-center gap-2">
                    <button type="button" onClick={props.onToday} className="rounded-lg bg-[var(--color-base-jade-1)] px-2 py-1 text-[11px] font-medium text-[var(--color-base-jade-6)] hover:bg-[var(--color-base-jade-2)]">امروز</button>
                    <span className="truncate text-xs font-semibold text-[var(--color-text)]">
                        {MONTH_NAMES[props.displayDate.jMonth()]} {props.displayDate.jYear()}
                    </span>
                </div>
                <CalendarNav
                    direction="next"
                    monthDisabled={isAtCurrentMonth}
                    yearDisabled={props.displayDate.jYear() >= currentYear}
                    onMonth={() => props.onChangeMonth(1)}
                    onYear={() => props.onChangeYear(1)}
                />
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[var(--color-text-muted)]">
                {WEEK_DAYS.map((day) => <div key={day} className="py-1">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {getMonthDays(props.displayDate).map((date, index) =>
                    date ? (
                        <CalendarDay
                            key={date.format("jYYYY-jMM-jDD")}
                            date={date}
                            selected={isSameJalaliDay(date, props.selectedDate)}
                            today={isSameJalaliDay(date, jalaliMoment())}
                            future={isFutureDate(date)}
                            onSelect={props.onSelect}
                        />
                    ) : (
                        <div key={`empty-${index}`} className="h-8" />
                    ),
                )}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-2">
                <button type="button" onClick={props.onClose} className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:bg-gray-100">بستن</button>
                <span className="text-xs font-medium text-[var(--color-base-jade-5)]">{jalaliMoment().format("jYYYY/jMM/jDD")}</span>
            </div>
        </div>
    );
}

function CalendarNav({ direction, monthDisabled, yearDisabled, onMonth, onYear }: { direction: "previous" | "next"; monthDisabled?: boolean; yearDisabled: boolean; onMonth: () => void; onYear: () => void }) {
    const Icon = direction === "previous" ? FiChevronRight : FiChevronLeft;
    return (
        <div className="flex items-center gap-0.5">
            <button type="button" onClick={onYear} disabled={yearDisabled} aria-label={direction === "previous" ? "سال قبل" : "سال بعد"} className="rounded-lg p-1 text-[var(--color-text-muted)] hover:bg-gray-100 disabled:opacity-30"><Icon size={16} /></button>
            <button type="button" onClick={onMonth} disabled={monthDisabled} aria-label={direction === "previous" ? "ماه قبل" : "ماه بعد"} className="rounded-lg p-1 text-[var(--color-text-muted)] hover:bg-gray-100 disabled:opacity-30"><Icon size={14} /></button>
        </div>
    );
}

function CalendarDay({ date, selected, today, future, onSelect }: { date: JalaliMoment; selected: boolean; today: boolean; future: boolean; onSelect: (date: JalaliMoment) => void }) {
    return (
        <button type="button" onClick={() => !future && onSelect(date)} disabled={future} className={`relative h-8 rounded-lg text-xs font-medium transition sm:h-9 ${future ? "cursor-not-allowed opacity-40 grayscale" : "hover:scale-105 hover:bg-gray-100 active:scale-95"} ${selected ? "bg-[var(--color-base-jade-4)] text-white shadow-md" : ""} ${today && !selected && !future ? "border-2 border-[var(--color-base-jade-4)] text-[var(--color-base-jade-5)]" : ""}`}>
            {date.jDate()}
            {(today || future) && !selected && <span className={`absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${future ? "bg-gray-300" : "bg-[var(--color-base-jade-4)]"}`} />}
        </button>
    );
}
