"use client";

import Link from "next/link";
import { FiBookOpen } from "react-icons/fi";

import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/Routes";

export default function NotFound() {
    return (
        <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
            <div className="w-full text-center">

                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-base-jade-0)] text-[var(--color-base-jade-5)]">
                    <FiBookOpen size={38} />
                </div>

                <p className="mb-2 text-7xl font-extrabold text-[var(--color-base-jade-6)]">
                    404
                </p>

                <h1 className="mb-3 text-3xl font-bold text-text">
                    صفحه مورد نظر پیدا نشد
                </h1>

                <p className="mx-auto mb-8 max-w-md leading-8 text-text-muted">
                    به نظر می‌رسد صفحه‌ای که به دنبال آن هستید وجود ندارد،
                    حذف شده یا آدرس آن به اشتباه وارد شده است.
                </p>

                <div className="flex flex-col justify-center gap-3 sm:flex-row">

                    <Link href={ROUTES.Home}>
                        <Button
                            className="
                                min-w-44
                                rounded-xl
                                bg-[var(--color-button-primary)]
                                px-6 py-3
                                text-[var(--color-button-primary-text)]
                                transition-all
                                hover:bg-[var(--color-button-primary-hover)]
                            "
                        >
                            بازگشت به صفحه اصلی
                        </Button>
                    </Link>

                </div>

            </div>
        </main>
    );
}