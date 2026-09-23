import moment from "moment-jalaali";

export type JalaliMoment = Omit<
    moment.Moment,
    "clone" | "add" | "startOf" | "endOf"
> & {
    jYear(): number;
    jMonth(): number;
    jDate(): number;
    jDate(value: number): JalaliMoment;
    clone(): JalaliMoment;
    add(amount: number, unit: "jMonth" | "jYear"): JalaliMoment;
    startOf(unit: "jMonth"): JalaliMoment;
    endOf(unit: "jMonth"): JalaliMoment;
};

type PersianMomentFactory = typeof moment & {
    loadPersian(options: { dialect: string }): void;
};

(moment as PersianMomentFactory).loadPersian({ dialect: "persian-modern" });

export const jalaliMoment = (value?: string) =>
    moment(value) as unknown as JalaliMoment;
export const MONTH_NAMES = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];
export const WEEK_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export function getMonthDays(displayDate: JalaliMoment) {
    const start = displayDate.clone().startOf("jMonth");
    const end = displayDate.clone().endOf("jMonth");
    const days: Array<JalaliMoment | null> = Array(start.day()).fill(null);
    for (let day = 1; day <= end.jDate(); day += 1) {
        days.push(start.clone().jDate(day));
    }
    return days;
}

export function isSameJalaliDay(first: JalaliMoment, second?: JalaliMoment | null) {
    return Boolean(second && first.format("jYYYY/jMM/jDD") === second.format("jYYYY/jMM/jDD"));
}

export function isFutureDate(date: JalaliMoment) {
    const today = jalaliMoment();
    if (date.jYear() !== today.jYear()) return date.jYear() > today.jYear();
    if (date.jMonth() !== today.jMonth()) return date.jMonth() > today.jMonth();
    return date.jDate() > today.jDate();
}
