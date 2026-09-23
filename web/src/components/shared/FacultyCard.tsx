import Link from "next/link";

import type { Faculty } from "@/types/faculty";
import FacultyIcon from "./FacultyIcon";

const persianNumber = new Intl.NumberFormat("fa-IR");

type FacultyCardProps = {
  faculty: Faculty;
  compact?: boolean;
};

export default function FacultyCard({ faculty, compact = false }: FacultyCardProps) {
  return (
    <Link
      href={`/professors?faculty=${encodeURIComponent(faculty.name)}`}
      className={`group block rounded-2xl border border-border bg-surface shadow-sm transition-all active:scale-[.98] lg:hover:-translate-y-1 lg:hover:border-base-jade-2 lg:hover:shadow-md ${
        compact ? "p-4 sm:p-6" : "p-6"
      }`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-base-jade-1 text-base-jade-5 transition-colors group-hover:bg-base-jade-2">
        <FacultyIcon
          iconUrl={faculty.iconUrl}
          facultyName={faculty.name}
          alt={`آیکن ${faculty.name}`}
          className="h-8 w-8"
          fallbackSize={25}
        />
      </div>

      <h3 className="mb-1 font-bold text-text lg:text-lg">{faculty.name}</h3>
      <p className="text-sm text-text-muted">
        {persianNumber.format(faculty.professorCount)} استاد عضو هیئت علمی
      </p>
    </Link>
  );
}
