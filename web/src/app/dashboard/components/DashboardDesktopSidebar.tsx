import Link from "next/link";
import { FiHome, FiLogOut } from "react-icons/fi";

import { ROUTES } from "@/constants/Routes";

import { isDashboardItemActive, type DashboardMenuItem } from "./dashboard-navigation";

export default function DashboardDesktopSidebar({ menu, pathname, onLogout }: { menu: DashboardMenuItem[]; pathname: string; onLogout: () => void }) {
    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[var(--color-base-jade-6)] text-[var(--color-header-text)] lg:flex">
            <div className="px-6 pb-5 pt-7"><h2 className="text-lg font-bold tracking-tight">پنل مدیریت</h2><p className="mt-1 text-xs text-white/45">رزومه اساتید دانشگاه</p></div>
            <div className="mx-6 h-px bg-white/10" />
            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
                {menu.map((item) => <DesktopItem key={item.title} item={item} active={isDashboardItemActive(pathname, item.href)} />)}
            </nav>
            <div className="mx-6 h-px bg-white/10" />
            <div className="space-y-0.5 px-3 py-5">
                <Link href={ROUTES.Home} className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-white/60 transition hover:bg-white/[0.04] hover:text-white/90"><FiHome size={17} /><span>بازگشت به سایت</span></Link>
                <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-[#e39a9a] transition hover:bg-[#ab5e5e]/15"><FiLogOut size={17} /><span>خروج از حساب</span></button>
            </div>
        </aside>
    );
}

function DesktopItem({ item, active }: { item: DashboardMenuItem; active: boolean }) {
    const Icon = item.icon;
    if (item.disabled) {
        return <div className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-white/30" title="رزومه‌ای برای شما ثبت نشده است"><Icon size={17} /><span>{item.title}</span></div>;
    }
    return (
        <Link href={item.href} className={`group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm transition ${active ? "bg-white/[0.07] font-medium text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white/90"}`}>
            <span aria-hidden className={`absolute inset-y-1.5 right-0 w-[3px] rounded-full ${active ? "bg-[var(--color-base-accent)]" : "bg-transparent"}`} />
            <Icon size={17} className={active ? "text-[var(--color-base-accent)]" : "opacity-70"} />
            <span>{item.title}</span>
        </Link>
    );
}
