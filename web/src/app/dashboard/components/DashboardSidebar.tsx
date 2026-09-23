"use client";

import { usePathname, useRouter } from "next/navigation";

import { ROUTES } from "@/constants/Routes";
import { useAuth as useCurrentUser } from "@/context/AuthContext";
import { useAuth as useAuthActions } from "@/hooks/useAuth";
import { logout } from "@/services/auth/AuthApi";

import DashboardDesktopSidebar from "./DashboardDesktopSidebar";
import DashboardMobileNavigation from "./DashboardMobileNavigation";
import { getDashboardMenu } from "./dashboard-navigation";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout: clearGlobalAuth } = useAuthActions();
    const { user, clearUser } = useCurrentUser();
    const menu = getDashboardMenu(user);

    const handleLogout = () => {
        void logout();
        clearGlobalAuth();
        clearUser();
        router.replace(ROUTES.Home);
    };

    return (
        <>
            <DashboardMobileNavigation
                menu={menu}
                pathname={pathname}
                email={user?.email}
                onLogout={handleLogout}
            />
            <DashboardDesktopSidebar
                menu={menu}
                pathname={pathname}
                onLogout={handleLogout}
            />
        </>
    );
}
