"use client";

import { ROUTES } from "@/constants/Routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLinks() {
    const pathname = usePathname();

    const linkClass = (href: string) => `
        relative py-0.5 transition
        after:content-[''] after:absolute after:right-0 after:-bottom-[2px]
        after:w-full after:h-[2px]
        lg:after:bg-white
        after:bg-black
        after:origin-right
        after:transition-transform after:duration-300
        ${pathname === href ? "after:scale-x-100 lg:text-white" : "after:scale-x-0"}
        hover:after:scale-x-100
    `;

    const links = [
        { label: "خانه", href: ROUTES.Home },
        { label: "اساتید", href: ROUTES.Professors },
        { label: "دانشکده‌ها", href: ROUTES.Faculties },
        { label: "درباره ما", href: ROUTES.AboutUs },
        { label: "تماس با ما", href: ROUTES.ContactUs },
    ];

    return (
        <ul className="flex flex-row gap-4 lg:gap-6 items-start justify-center text-sm text-black lg:text-white">

            {links.map((item) => (
                <li key={item.href}>
                    <Link href={item.href} className={linkClass(item.href)}>
                        {item.label}
                    </Link>
                </li>
            ))}

        </ul>
    );
}

export default NavLinks;
