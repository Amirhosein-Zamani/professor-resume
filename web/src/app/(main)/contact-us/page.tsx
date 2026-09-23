import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FiExternalLink,
  FiHash,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

type ContactItem = {
  label: string;
  value: string;
  icon: IconType;
  href?: string;
  ltr?: boolean;
};

const contactItems: ContactItem[] = [
  {
    label: "نشانی",
    value:
      "استان سمنان، شهرستان دامغان، میدان دانشگاه، دانشگاه دامغان",
    icon: FiMapPin,
  },
  {
    label: "پست الکترونیکی",
    value: "info@du.ac.ir",
    icon: FiMail,
    href: "mailto:info@du.ac.ir",
    ltr: true,
  },
  {
    label: "تلفن",
    value: "023-31170000",
    icon: FiPhone,
    href: "tel:02331170000",
    ltr: true,
  },
  {
    label: "کدپستی",
    value: "45667-36716",
    icon: FiHash,
    ltr: true,
  },
];

const mapUrl = "https://maps.app.goo.gl/ZL3cfvwmasyvJf4c6";

export default function Contact() {
  return (
    <div dir="rtl" className="bg-bg px-4 py-7 sm:px-6 sm:py-10">
      <main className="mx-auto max-w-5xl space-y-8 md:space-y-12">
        <header className="mx-auto max-w-2xl space-y-3 text-center md:space-y-4">
          <h1 className="text-2xl font-bold text-header-bg md:text-3xl">
            تماس با ما
          </h1>
          <p className="text-sm leading-6 text-text-soft md:text-base md:leading-7">
            برای ارتباط با دانشگاه دامغان و دریافت اطلاعات بیشتر، می‌توانید از
            راه‌های زیر با ما در تماس باشید.
          </p>
        </header>

        <section
          aria-label="اطلاعات تماس دانشگاه دامغان"
          className="overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-[0_8px_30px_rgba(30,61,57,.07)] sm:p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const value = (
                <span
                  dir={item.ltr ? "ltr" : "rtl"}
                  className={`block break-words text-sm leading-7 text-text-soft md:text-base ${
                    item.ltr ? "text-right" : ""
                  }`}
                >
                  {item.value}
                </span>
              );

              return (
                <article
                  key={item.label}
                  className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-bg-soft p-4 transition-colors hover:border-base-jade-2 sm:gap-4 md:p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-base-jade-1 text-base-jade-5 sm:h-12 sm:w-12">
                    <Icon aria-hidden="true" size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1 text-sm font-semibold text-text md:text-base">
                      {item.label}
                    </h2>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="rounded-sm outline-none transition-colors hover:text-base-jade-5 focus-visible:ring-2 focus-visible:ring-base-jade-4"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 border-t border-border pt-6 md:mt-8 md:pt-8">
            <div className="overflow-hidden rounded-xl border border-border bg-bg-soft">
              <Image
                src="/Images/location/loc.png"
                alt="موقعیت دانشگاه دامغان روی نقشه"
                width={1073}
                height={765}
                sizes="(max-width: 768px) 100vw, 896px"
                className="h-[230px] w-full object-cover md:h-[300px]"
                priority
              />
            </div>

            <div className="mt-3 flex justify-center sm:mt-4">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-button-primary)] px-5 text-sm font-medium text-[var(--color-button-primary-text)] shadow-sm transition-all duration-200 hover:bg-[var(--color-button-primary-hover)] hover:shadow active:scale-[.98] sm:w-auto"
              >
                مشاهده روی نقشه
                <FiExternalLink aria-hidden="true" size={17} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
