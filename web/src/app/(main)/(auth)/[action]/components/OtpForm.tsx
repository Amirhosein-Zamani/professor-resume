"use client";

import type { FormEvent } from "react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import AuthCard from "./AuthCard";
import { formatOtpTime, useOtpForm } from "./useOtpForm";

export default function OtpForm({ email }: { email?: string }) {
    const otp = useOtpForm(email);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        void otp.submit();
    };

    return (
        <AuthCard title="تأیید کد ورود">
            <form onSubmit={handleSubmit} method="post" autoComplete="off" className="space-y-5">
                <p className="text-sm text-[var(--color-text-soft)]">
                    کد ۶ رقمی ارسال شده به ایمیل زیر را وارد کنید:
                </p>
                <div className="rounded-lg bg-[var(--color-base-jade-1)] p-3 text-center">
                    <span className="text-sm font-medium text-[var(--color-base-jade-6)]" dir="ltr">{otp.email}</span>
                </div>
                <Input
                    id="code"
                    label="کد تأیید"
                    name="code"
                    type="text"
                    direction="ltr"
                    autoComplete="one-time-code"
                    value={otp.code}
                    onChange={(event) => otp.changeCode(event.target.value)}
                    error={otp.error}
                    placeholder="مثال: ۱۲۳۴۵۶"
                    maxLength={6}
                    className="text-center font-mono text-2xl tracking-[0.5em]"
                />
                <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-soft)]">
                        {otp.canResend ? "کد منقضی شده است" : `زمان باقی‌مانده: ${formatOtpTime(otp.timer)}`}
                    </span>
                    <button type="button" onClick={() => void otp.resend()} disabled={!otp.canResend || otp.loading} className="text-[var(--color-base-jade-5)] transition hover:text-[var(--color-base-jade-6)] disabled:cursor-not-allowed disabled:opacity-40">
                        ارسال مجدد کد
                    </button>
                </div>
                <Button
                    type="submit"
                    disabled={otp.loading || otp.code.length !== 6}
                    className="mt-3 flex w-full items-center justify-center rounded-xl bg-[var(--color-button-primary)] py-3 font-medium text-[var(--color-button-primary-text)] transition hover:bg-[var(--color-button-primary-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {otp.loading ? "در حال تأیید..." : "تأیید و ورود"}
                </Button>
            </form>
        </AuthCard>
    );
}
