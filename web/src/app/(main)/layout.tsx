import Footer from "../../components/layouts/footer/Footer";
import Navbar from "../../components/layouts/header/Navbar";

export default function LayoutMain({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-dvh flex-col" dir="rtl">
            <Navbar />
            <main className="min-w-0 flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-0">
                {children}
            </main>
            <Footer />
        </div>
    );
}
