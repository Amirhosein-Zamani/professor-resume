import { ROUTES } from "@/constants/Routes";
import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = [ROUTES.Dashboard];
const REFRESH_COOKIE_NAME = process.env.AUTH_REFRESH_COOKIE_NAME ?? "rtkn";

export function proxy(request: NextRequest) {
    const token = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route),
    );

    if (isProtected && !token) {
        return NextResponse.redirect(new URL(ROUTES.Login, request.url));
    }

    if (token && pathname === ROUTES.Login) {
        return NextResponse.redirect(new URL(ROUTES.Dashboard, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
