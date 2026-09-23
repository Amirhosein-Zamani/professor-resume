"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FiBookOpen,
    FiHome,
    FiInfo,
    FiLogIn,
    FiPhoneCall,
    FiUsers,
} from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";

import Logo from "@/components/shared/Logo";
import Title from "@/components/shared/Title";
import { ROUTES } from "@/constants/Routes";
import { useAuth } from "@/hooks/useAuth";
import { ActionButton } from "./ActionButton";
import NavLinks from "./NavLinks";

export default function Navbar() {
    const pathname = usePathname();
    const { isAuthenticated } = useAuth();

    const mobileItems = [
        { label: "خانه", href: ROUTES.Home, icon: FiHome },
        { label: "اساتید", href: ROUTES.Professors, icon: FiUsers },
        { label: "دانشکده‌ها", href: ROUTES.Faculties, icon: FiBookOpen },
        { label: "درباره", href: ROUTES.AboutUs, icon: FiInfo },
        { label: "تماس با ما", href: ROUTES.ContactUs, icon: FiPhoneCall },
        {
            label: isAuthenticated ? "داشبورد" : "ورود",
            href: isAuthenticated ? ROUTES.Dashboard : ROUTES.Login,
            icon: isAuthenticated ? LuLayoutDashboard : FiLogIn,
        },
    ];

    const isActive = (href: string) =>
        href === ROUTES.Home ? pathname === href : pathname.startsWith(href);

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-white/10 bg-header-bg text-header-text shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        <Logo />
                        <div className="min-w-0 truncate">
                            <Title />
                        </div>
                    </div>

                    <div className="hidden items-center gap-6 lg:flex">
                        <nav>
                            <NavLinks />
                        </nav>
                        <ActionButton />
                    </div>

                    <Link
                        href={isAuthenticated ? ROUTES.Dashboard : ROUTES.Login}
                        aria-label={isAuthenticated ? "ورود به داشبورد" : "ورود"}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition active:scale-95 lg:hidden"
                    >
                        {isAuthenticated ? (
                            <LuLayoutDashboard size={20} aria-hidden="true" />
                        ) : (
                            <FiLogIn size={19} aria-hidden="true" />
                        )}
                    </Link>
                </div>
            </header>

            <nav
                aria-label="ناوبری اصلی موبایل"
                className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-2 pt-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(30,61,57,0.10)] backdrop-blur-xl lg:hidden"
            >
                <ul className="mx-auto grid max-w-xl grid-cols-6 gap-0.5 sm:gap-1">
                    {mobileItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-medium transition active:scale-95 ${
                                        active
                                            ? "bg-base-jade-1 text-base-jade-6"
                                            : "text-text-muted"
                                    }`}
                                >
                                    <Icon size={19} />
                                    <span className="max-w-full truncate">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}
