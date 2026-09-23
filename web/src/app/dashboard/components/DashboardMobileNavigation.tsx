import Link from "next/link";
import { FiHome, FiLogOut } from "react-icons/fi";

import { ROUTES } from "@/constants/Routes";

import { isDashboardItemActive, type DashboardMenuItem } from "./dashboard-navigation";

type Props = {
    menu: DashboardMenuItem[];
    pathname: string;
    email?: string;
    onLogout: () => void;
};

export default function DashboardMobileNavigation({ menu, pathname, email, onLogout }: Props) {
    return (
        <>
            <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[var(--color-base-jade-6)] px-4 text-white shadow-sm lg:hidden">
                <div>
                    <p className="text-sm font-bold">پنل مدیریت</p>
                    <p className="mt-0.5 max-w-52 truncate text-[10px] text-white/55">{email || "رزومه اساتید دانشگاه"}</p>
                </div>
                <button type="button" onClick={onLogout} aria-label="خروج از حساب" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#f0b7b7] active:scale-95">
                    <FiLogOut size={19} />
                </button>
            </header>
            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-2 pt-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(30,61,57,0.10)] backdrop-blur-xl lg:hidden">
                <div className="mx-auto flex max-w-lg gap-1">
                    {menu.map((item) => <MobileItem key={item.title} item={item} active={isDashboardItemActive(pathname, item.href)} />)}
                    <Link href={ROUTES.Home} className="flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-medium text-[var(--color-text-muted)] active:scale-95">
                        <FiHome size={19} /><span>سایت</span>
                    </Link>
                </div>
            </nav>
        </>
    );
}

function MobileItem({ item, active }: { item: DashboardMenuItem; active: boolean }) {
    const Icon = item.icon;
    if (item.disabled) {
        return <div className="flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10px] text-[var(--color-text-muted)] opacity-40"><Icon size={19} /><span>{item.title}</span></div>;
    }
    return (
        <Link href={item.href} className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-medium transition active:scale-95 ${active ? "bg-[var(--color-base-jade-1)] text-[var(--color-base-jade-6)]" : "text-[var(--color-text-muted)]"}`}>
            <Icon size={19} /><span className="truncate">{item.title}</span>
        </Link>
    );
}
