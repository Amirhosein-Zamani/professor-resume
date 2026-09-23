"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import AuthCard from "./AuthCard";

import { requestOtp } from "@/services/auth/AuthApi";
import { ROUTES } from "@/constants/Routes";
import { requestOtpSchema } from "@/lib/validations/auth.validation";

type LoginForm = {
    email: string;
};

const initialForm: LoginForm = {
    email: "",
};

interface LoginFormProps {
    onOtpSent?: (email: string) => void;
}

export default function LoginForm({ onOtpSent }: LoginFormProps) {
    const router = useRouter();

    const [form, setForm] = useState<LoginForm>(initialForm);
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState<
        Partial<Record<keyof LoginForm, string>>
    >({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validation = requestOtpSchema.safeParse(form);

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;

            setErrors({
                email: fieldErrors.email?.[0],
            });

            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await requestOtp(validation.data);

            if (!res.success) {
                toast.error(res.message || "خطا در ارسال کد تأیید");
                return;
            }

            toast.success("کد تأیید به ایمیل شما ارسال شد");
            
            if (onOtpSent) {
                onOtpSent(form.email);
            } else {
                router.push(ROUTES.OTP(encodeURIComponent(form.email)));
            }
        } catch (err) {
            console.error(err);
            toast.error("خطایی رخ داد.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard title="ورود به داشبورد">
            <form
                onSubmit={handleSubmit}
                method="post"
                autoComplete="on"
                className="space-y-5"
            >
                <p className="text-sm text-[var(--color-text-soft)]">
                    برای ورود، ایمیل خود را وارد کنید. کد تأیید به ایمیل شما ارسال خواهد شد.
                </p>

                <Input
                    id="email"
                    label="ایمیل"
                    name="email"
                    type="email"
                    direction="ltr"
                    autoComplete="username"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="example@email.com"
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className="
                        mt-3
                        flex
                        w-full
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--color-button-primary)]
                        py-3
                        font-medium
                        text-[var(--color-button-primary-text)]
                        transition-all
                        hover:bg-[var(--color-button-primary-hover)]
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                    "
                >
                    {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
                </Button>
            </form>
        </AuthCard>
    );
}