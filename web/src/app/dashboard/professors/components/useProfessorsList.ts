"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getDashboardProfessors } from "@/services/professors/Professorsapi";
import type { ProfessorListItem } from "@/types/professor";

export const INITIAL_VISIBLE_COUNT = 9;
export type ProfessorFilters = { name: string; faculty: string };

export function useProfessorsList() {
    const [professors, setProfessors] = useState<ProfessorListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [filters, setFilters] = useState<ProfessorFilters>({ name: "", faculty: "" });

    useEffect(() => {
        let active = true;
        void getDashboardProfessors().then((response) => {
            if (!active) return;
            if (response.success) setProfessors(response.data ?? []);
            else setError(response.error || "خطا در دریافت لیست اساتید");
            setIsLoading(false);
        });
        return () => {
            active = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const name = filters.name.trim().toLocaleLowerCase("fa");
        return professors.filter((professor) => {
            const fullName = `${professor.firstName} ${professor.lastName}`.toLocaleLowerCase("fa");
            return (
                (!name || professor.displayName.toLocaleLowerCase("fa").includes(name) || fullName.includes(name)) &&
                (!filters.faculty || professor.faculty === filters.faculty)
            );
        });
    }, [filters, professors]);

    const updateFilters = useCallback((next: ProfessorFilters) => {
        setFilters(next);
        setVisibleCount(INITIAL_VISIBLE_COUNT);
    }, []);
    return {
        professors,
        filtered,
        visible: filtered.slice(0, visibleCount),
        filters,
        visibleCount,
        isLoading,
        error,
        setFilters: updateFilters,

        showMore: () => setVisibleCount((count) => count + INITIAL_VISIBLE_COUNT),
    };
}
