"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { ROUTES } from "@/constants/Routes";
import { useAuth } from "@/hooks/useAuth";
import { verifyOtpSchema } from "@/lib/validations/auth.validation";
import { requestOtp, verifyOtp } from "@/services/auth/AuthApi";

export function useOtpForm(propEmail?: string) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const email = propEmail || searchParams.get("email") || "";
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const [error, setError] = useState<string>();

    useEffect(() => {
        const interval = window.setInterval(
            () => setTimer((current) => Math.max(0, current - 1)),
            1000,
        );
        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!email) router.replace(ROUTES.Login);
    }, [email, router]);

    const changeCode = (value: string) => {
        if (!/^\d*$/.test(value)) return;
        setCode(value);
        setError(undefined);
    };

    const resend = async () => {
        if (!email) return;
        setLoading(true);
        try {
            const response = await requestOtp({ email });
            if (!response.success) {
                toast.error(response.message || "خطا در ارسال مجدد کد");
                return;
            }
            toast.success("کد جدید به ایمیل شما ارسال شد");
            setTimer(120);
        } catch (error) {
            console.error(error);
            toast.error("خطایی رخ داد.");
        } finally {
            setLoading(false);
        }
    };

    const submit = async () => {
        const validation = verifyOtpSchema.safeParse({ email, code });
        if (!validation.success) {
            setError(validation.error.flatten().fieldErrors.code?.[0]);
            return;
        }

        setError(undefined);
        setLoading(true);
        try {
            const response = await verifyOtp(validation.data);
            if (!response.success || !response.data) {
                toast.error(response.message || "کد تأیید نامعتبر است");
                return;
            }
            login(response.data.user);
            toast.success("با موفقیت وارد شدید");
            window.location.replace(ROUTES.Dashboard);
        } catch (error) {
            console.error(error);
            toast.error("خطایی رخ داد.");
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        code,
        loading,
        timer,
        canResend: timer === 0,
        error,
        changeCode,
        resend,
        submit,
    };
}

export function formatOtpTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
