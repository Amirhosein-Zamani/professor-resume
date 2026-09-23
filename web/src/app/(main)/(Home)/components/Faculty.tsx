"use client";

import { useEffect, useState } from "react";

import FacultyCard from "@/components/shared/FacultyCard";
import { ROUTES } from "@/constants/Routes";
import { getFaculties } from "@/services/faculties/FacultiesApi";
import type { Faculty as FacultyType } from "@/types/faculty";

export default function Faculty() {
  const [faculties, setFaculties] = useState<FacultyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await getFaculties();

      if (response.success && response.data) {
        setFaculties(response.data.slice(0, 4));
      }

      setLoading(false);
    };

    void load();
  }, []);

  return (
    <section className="mt-10 space-y-4 pb-4 sm:mt-14 sm:space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h2 className="text-lg font-bold text-header-bg sm:text-2xl">دانشکده‌ها</h2>
        <a href={ROUTES.Faculties} className="text-xs font-medium text-link hover:underline sm:text-sm">
          مشاهده همه ←
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-44 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      ) : faculties.length ? (
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {faculties.map((faculty) => (
            <FacultyCard key={faculty.id} faculty={faculty} compact />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-sm text-text-muted">
          هنوز دانشکده‌ای ثبت نشده است.
        </div>
      )}
    </section>
  );
}
