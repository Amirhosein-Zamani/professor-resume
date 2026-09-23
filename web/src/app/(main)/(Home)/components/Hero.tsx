import Image from "next/image";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";

import { ROUTES } from "@/constants/Routes";

export default function Hero() {
    return (
        <section className="grid items-center gap-6 py-7 sm:gap-10 sm:py-10 lg:grid-cols-2 lg:py-14">
            <div className="order-2 text-center lg:order-1 lg:text-right">
                <h1 className="text-2xl font-extrabold leading-[1.65] text-header-bg sm:text-3xl lg:text-4xl lg:leading-[1.5]">
                    سامانه جامع رزومه و
                    <span className="block text-base-accent sm:inline"> سوابق علمی اساتید</span>
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-text-soft sm:text-base sm:leading-8 lg:mx-0">
                    سوابق علمی، پژوهشی و آموزشی اعضای هیئت علمی را یک‌جا ببینید و استاد موردنظر خود را سریع پیدا کنید.
                </p>

                <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:justify-center lg:justify-start">
                    <Link
                        href={ROUTES.Professors}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-button-primary px-5 text-sm font-medium text-button-primary-text shadow-sm transition active:scale-[.98]"
                    >
                        <FiSearch size={17} />
                        جست‌وجوی استاد
                    </Link>
                    <Link
                        href={ROUTES.Faculties}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-surface px-5 text-sm font-medium text-text transition active:scale-[.98]"
                    >
                        مشاهده دانشکده‌ها
                    </Link>
                </div>
            </div>

            <div className="order-1 hidden w-full justify-end lg:order-2 lg:flex lg:-mt-10">
                <div className="aspect-4/3 w-full overflow-hidden rounded-2xl">
                    <div className="flex h-full w-full items-center justify-center">
                    <Image
                        src="/Images/image0.jpg"
                        alt="نمای دانشگاه"
                        width={600}
                        height={450}
                        priority
                        quality={75}
                        sizes="100vw"
                        className="-mt-50 h-full w-full object-contain mix-blend-multiply lg:mt-20 xl:mt-10"
                    />
                    </div>
                </div>
            </div>
        </section>
    );
}
