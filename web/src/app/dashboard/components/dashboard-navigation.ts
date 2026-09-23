import { FiBookOpen, FiShield, FiUser, FiUsers } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";

import type { SafeUser } from "@/types/auth";

export type DashboardMenuItem = {
    title: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    disabled?: boolean;
};

export function getDashboardMenu(user: SafeUser | null): DashboardMenuItem[] {
    if (user?.role === "EDITOR") {
        return [
            { title: "داشبورد", href: "/dashboard", icon: LuLayoutDashboard },
            {
                title: "رزومه من",
                href: user.professorId ? `/dashboard/professors/${user.professorId}` : "#",
                icon: FiUser,
                disabled: !user.professorId,
            },
        ];
    }

    const menu: DashboardMenuItem[] = [
        { title: "داشبورد", href: "/dashboard", icon: LuLayoutDashboard },
        { title: "اساتید", href: "/dashboard/professors", icon: FiUsers },
    ];
    if (user?.role === "ADMIN") {
        menu.push({ title: "دانشکده‌ها", href: "/dashboard/faculties", icon: FiBookOpen });
        menu.push({ title: "کاربران", href: "/dashboard/users", icon: FiShield });
    }
    return menu;
}

export function isDashboardItemActive(pathname: string, href: string) {
    return href === "/dashboard"
        ? pathname === href
        : href !== "#" && pathname.startsWith(href);
}
