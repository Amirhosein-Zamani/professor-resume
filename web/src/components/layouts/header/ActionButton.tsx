import Button from "@/components/ui/Button";
import { ROUTES } from "@/constants/Routes";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { FiLogIn } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";

export const ActionButton = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div
                className="
                    hidden lg:block
                    h-11
                    w-40
                    rounded-xl
                    animate-pulse
                    bg-[var(--color-base-jade-5)]
                    opacity-40
                "
            />
        );
    }

    if (isAuthenticated) {
        return (
            <Link href={ROUTES.Dashboard}>
                <Button
                    className="
                    inline-flex items-center gap-2
                    rounded-xl
                    border border-[var(--color-base-jade-3)]
                    bg-[var(--color-base-light)]
                    px-5 py-2
                    text-sm 
                    text-[var(--color-base-jade-6)]
                    transition-all duration-200
                    hover:bg-[var(--color-base-jade-5)]
                    hover:text-white
                    hover:border-[var(--color-base-jade-5)]
                    hover:shadow-md
                    active:scale-95
                "
                >
                    <LuLayoutDashboard size={18} aria-hidden="true" />
                    داشبورد من
                </Button>
            </Link>
        );
    }

    return (

        <Link href={ROUTES.Login}>
            <Button
                className="
                    inline-flex items-center gap-2
                    rounded-xl
                    border border-[var(--color-base-jade-3)]
                    bg-[var(--color-base-light)]
                    px-5 py-2
                    text-sm 
                    text-[var(--color-base-jade-6)]
                    transition-all duration-200
                    hover:bg-[var(--color-base-jade-5)]
                    hover:text-white
                    hover:border-[var(--color-base-jade-5)]
                    hover:shadow-md
                    active:scale-95
                "
            >
                <FiLogIn size={18} aria-hidden="true" />
                ورود به داشبورد
            </Button>
        </Link>
    );
};
