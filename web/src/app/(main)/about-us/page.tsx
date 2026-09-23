export default function About() {
    return (
        <div className="bg-bg px-4 py-7 sm:px-6 sm:py-10">
            <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">

                {/* Header */}
                <div className="text-center space-y-3 md:space-y-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-header-bg">
                        درباره سامانه رزومه اساتید
                    </h1>
                    <p className="text-text-soft max-w-2xl mx-auto text-sm md:text-base leading-6 md:leading-7">
                        این سامانه با هدف دسترسی سریع و یکپارچه به اطلاعات علمی، پژوهشی
                        و آموزشی اعضای هیئت علمی دانشگاه طراحی شده است.
                    </p>
                </div>

                {/* معرفی سامانه */}
                <div className="space-y-3 rounded-2xl border border-border bg-surface p-5 md:space-y-4 md:p-8">
                    <h2 className="text-lg md:text-xl font-bold text-text">معرفی سامانه</h2>
                    <p className="text-text-soft text-sm md:text-base leading-6 md:leading-8">
                        سامانه جامع رزومه اساتید بستری برای معرفی سوابق علمی، پژوهشی
                        و آموزشی اعضای هیئت علمی دانشگاه است. در این سامانه کاربران
                        می‌توانند اطلاعاتی مانند حوزه‌های تخصصی، مقالات علمی،
                        فعالیت‌های پژوهشی و سوابق آموزشی اساتید را مشاهده کرده و
                        به راحتی استاد مورد نظر خود را جستجو کنند.
                    </p>
                </div>

                {/* اهداف سامانه */}
                <div className="space-y-4 rounded-2xl border border-border bg-surface p-5 md:space-y-6 md:p-8">
                    <h2 className="text-lg md:text-xl font-bold text-text">اهداف سامانه</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                        <div className="p-4 md:p-5 rounded-lg bg-bg-soft">
                            <h3 className="font-semibold text-text text-sm md:text-base mb-1.5">
                                دسترسی سریع به اطلاعات اساتید
                            </h3>
                            <p className="text-xs md:text-sm text-text-muted leading-5">
                                فراهم کردن بستری برای مشاهده سریع سوابق علمی و تخصصی
                                اعضای هیئت علمی دانشگاه.
                            </p>
                        </div>

                        <div className="p-4 md:p-5 rounded-lg bg-bg-soft">
                            <h3 className="font-semibold text-text text-sm md:text-base mb-1.5">
                                معرفی توانمندی‌های علمی
                            </h3>
                            <p className="text-xs md:text-sm text-text-muted leading-5">
                                معرفی فعالیت‌های علمی، پژوهشی و آموزشی اساتید به
                                دانشجویان و پژوهشگران.
                            </p>
                        </div>

                        <div className="p-4 md:p-5 rounded-lg bg-bg-soft">
                            <h3 className="font-semibold text-text text-sm md:text-base mb-1.5">
                                تسهیل همکاری‌های علمی
                            </h3>
                            <p className="text-xs md:text-sm text-text-muted leading-5">
                                کمک به ایجاد ارتباط و همکاری بین اساتید، پژوهشگران
                                و دانشجویان.
                            </p>
                        </div>

                        <div className="p-4 md:p-5 rounded-lg bg-bg-soft">
                            <h3 className="font-semibold text-text text-sm md:text-base mb-1.5">
                                جستجوی پیشرفته اساتید
                            </h3>
                            <p className="text-xs md:text-sm text-text-muted leading-5">
                                امکان جستجوی اساتید بر اساس دانشکده، گروه آموزشی
                                و حوزه تخصصی.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
