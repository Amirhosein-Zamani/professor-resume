"use client";

import Link from "next/link";
import {
    FaUniversity,
    FaUserGraduate,
} from "react-icons/fa";
import { ProfessorListItem } from "@/types/professor";
import Image from "next/image";

type CardProps = {
    professors: ProfessorListItem[];
};

function getAvatarSrc(avatar: string): string {
    if (!avatar) return "/Images/default-avatar.png";
    if (avatar.startsWith("/") || avatar.startsWith("http")) return avatar;
    return `data:image/webp;base64,${avatar}`;
}

function Card({ professors }: CardProps) {
    return (
        <section className="grid grid-cols-1 gap-3 pb-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:pb-10">
            {professors.map((prof) => (
                <div
                    key={prof.id}
                    className="cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200 active:scale-[.985] lg:hover:-translate-y-0.5 lg:hover:shadow-lg"
                    style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                    }}
                >
                    <Link href={`/professors/${prof.slug}`}>
                        <div className="p-4 sm:p-5">
                            <div className="mb-4 flex items-center gap-3 sm:gap-4">
                                <div className="shrink-0">
                                    <Image
                                        src={getAvatarSrc(prof.avatar)}
                                        alt={prof.displayName}
                                        width={0}
                                        height={0}
                                        sizes="100"
                                        className="h-16 w-16 rounded-full border-2 object-cover sm:h-20 sm:w-20"
                                        style={{ borderColor: "var(--color-base-jade-3)" }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/Images/default-avatar.png";
                                        }}
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base leading-snug truncate text-[var(--color-text)]">
                                        {prof.displayName}
                                    </h3>

                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <FaUserGraduate
                                            className="shrink-0"
                                            style={{ color: "var(--color-base-jade-4)" }}
                                        />
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: "var(--color-text-soft)" }}
                                        >
                                            {prof.rank}
                                        </span>
                                    </div>

                                    {prof.isFaculty && (
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-md mt-2 inline-block"
                                            style={{
                                                backgroundColor: "var(--color-base-jade-0)",
                                                color: "var(--color-base-jade-6)",
                                            }}
                                        >
                                            عضو هیئت علمی
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* ===== دانشکده ===== */}
                            <div className="flex items-center gap-2 text-sm">
                                <FaUniversity
                                    className="shrink-0"
                                    style={{ color: "var(--color-base-jade-4)" }}
                                />
                                <span
                                    className="truncate"
                                    style={{ color: "var(--color-text-muted)" }}
                                >
                                    {prof.faculty}
                                </span>
                            </div>

                            {/* ===== تخصص ===== */}
                            {prof.specialty && (
                                <p
                                    className="text-xs mt-1.5 truncate"
                                    style={{ color: "var(--color-text-muted)" }}
                                >
                                    {prof.specialty}
                                </p>
                            )}
                        </div>


                    </Link>
                </div>
            ))}
        </section>
    );
}

export default Card;
