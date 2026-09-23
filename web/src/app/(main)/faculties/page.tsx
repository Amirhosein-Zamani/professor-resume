"use client";

import { useEffect, useState } from "react";

import FacultyCard from "@/components/shared/FacultyCard";
import { getFaculties } from "@/services/faculties/FacultiesApi";
import type { Faculty } from "@/types/faculty";

export default function AllFaculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await getFaculties();

      if (response.success && response.data) {
        setFaculties(response.data);
      } else {
        setError(response.message || response.error || "دریافت دانشکده‌ها انجام نشد.");
      }

      setLoading(false);
    };

    void load();
  }, []);

  return (
    <div className="bg-bg px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-7 sm:mb-10">
          <h1 className="mb-4 text-xl font-bold text-header-bg lg:text-3xl">تمامی دانشکده‌ها</h1>
          <p className="text-text-soft">لیست دانشکده‌های دانشگاه و تعداد اساتید هر دانشکده</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="h-48 animate-pulse rounded-xl border border-border bg-surface" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl border border-danger/30 bg-surface p-8 text-center text-danger">{error}</div>
        ) : faculties.length ? (
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {faculties.map((faculty) => (
              <FacultyCard key={faculty.id} faculty={faculty} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center text-text-muted">
            هنوز دانشکده‌ای ثبت نشده است.
          </div>
        )}
      </div>
    </div>
  );
}
