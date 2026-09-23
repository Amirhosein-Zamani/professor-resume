import { ROUTES } from "@/constants/Routes"
import Image from "next/image"
import Link from "next/link"

function Logo() {
    return (
        <Link href={ROUTES.DU} className="flex items-center">
            <Image
                src="/Images/Logo.png"
                alt="logo"
                width={45}
                height={45}
                className="w-auto h-12 object-contain"
                sizes="100"
                priority
            />
        </Link>
    )
}

export default Logo
