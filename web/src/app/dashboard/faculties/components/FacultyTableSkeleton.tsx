export default function FacultyTableSkeleton() {
    return (
        <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4].map((item) => (
                <div
                    key={item}
                    className="
                        flex items-center gap-4
                        px-5 py-4
                    "
                >
                    <div
                        className="
                            h-10 w-10 animate-pulse
                            rounded-lg bg-slate-100
                        "
                    />

                    <div className="flex-1 space-y-2">
                        <div
                            className="
                                h-3 w-48 animate-pulse
                                rounded bg-slate-100
                            "
                        />

                        <div
                            className="
                                h-2.5 w-32 animate-pulse
                                rounded bg-slate-100
                            "
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}