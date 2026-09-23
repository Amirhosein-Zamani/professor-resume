interface Props {
    title: string;
    children: React.ReactNode;
}

export default function AuthCard({
    title,
    children,
}: Props) {
    return (
        <div className="w-full max-w-md rounded-2xl border border-border bg-bg-soft p-5 shadow-lg sm:p-8">
            <h1 className="mb-6 text-center text-xl font-bold sm:mb-8 sm:text-2xl">
                {title}
            </h1>

            {children}
        </div>
    );
}
