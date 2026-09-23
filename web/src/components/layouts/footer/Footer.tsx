import Title from "@/components/shared/Title"

function Footer() {
    return (
        <footer className="mt-8 hidden shrink-0 border-t border-border bg-footer-bg text-footer-text lg:block">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row sm:px-6 sm:text-right lg:px-8">

                <Title />

                <p className="text-xs opacity-80">
                    © {new Date().getFullYear()} تمامی حقوق محفوظ است
                </p>

            </div>
        </footer>
    )
}

export default Footer
