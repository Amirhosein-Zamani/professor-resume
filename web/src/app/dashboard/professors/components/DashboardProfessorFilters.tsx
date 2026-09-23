"use client";

import { useEffect, useState } from "react";
import { FaUniversity, FaUserTie } from "react-icons/fa";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { getFaculties } from "@/services/faculties/FacultiesApi";

const ALL_FACULTIES = "همه دانشکده‌ها";
type DashboardProfessorFiltersProps = {
    onChange: (filters: { name: string; faculty: string }) => void;
};

export default function DashboardProfessorFilters({ onChange }: DashboardProfessorFiltersProps) {
    const [name, setName] = useState("");
    const [faculty, setFaculty] = useState(ALL_FACULTIES);
    const [facultyOptions, setFacultyOptions] = useState<string[]>([ALL_FACULTIES]);

    useEffect(() => {
        const loadFaculties = async () => {
            const response = await getFaculties();
            if (response.success && response.data) {
                setFacultyOptions([
                    ALL_FACULTIES,
                    ...response.data.map((item) => item.name),
                ]);
            }
        };

        void loadFaculties();
    }, []);

    useEffect(() => {
        onChange({
            name: name.trim(),
            faculty: faculty === ALL_FACULTIES ? "" : faculty,
        });
    }, [faculty, name, onChange]);

    return (
        <section className="mb-6 rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-4 shadow-[0_1px_2px_rgba(47,44,40,0.06)] sm:p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                    label="نام و نام خانوادگی استاد"
                    labelIcon={FaUserTie}
                    placeholder="مثال: سارا محمدی"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <Select
                    label="دانشکده"
                    labelIcon={FaUniversity}
                    options={facultyOptions}
                    value={faculty}
                    onChange={setFaculty}
                    searchable
                    searchPlaceholder="جست‌وجوی دانشکده..."
                />
            </div>
        </section>
    );
}
