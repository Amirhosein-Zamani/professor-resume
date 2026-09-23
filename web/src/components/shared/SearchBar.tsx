"use client";

import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FaUniversity, FaUserTie } from "react-icons/fa";

import { getFaculties } from "@/services/faculties/FacultiesApi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const ALL_FACULTIES = "همه دانشکده‌ها";
type SearchBarHomeProps = {
  initialName?: string;
  initialFaculty?: string;
};

function SearchBarHome({
  initialName = "",
  initialFaculty = "",
}: SearchBarHomeProps) {
  const [name, setName] = useState(initialName);
  const [faculty, setFaculty] = useState(initialFaculty || ALL_FACULTIES);
  const [facultyOptions, setFacultyOptions] = useState<string[]>([ALL_FACULTIES]);

  useEffect(() => {
    const loadFaculties = async () => {
      const response = await getFaculties();

      if (!response.success || !response.data) {
        return;
      }

      setFacultyOptions([
        ALL_FACULTIES,
        ...response.data.map((item) => item.name),
      ]);
    };

    void loadFaculties();
  }, []);

  const normalizedFaculty = faculty === ALL_FACULTIES ? "" : faculty.trim();
  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-[0_8px_30px_rgba(30,61,57,.07)] sm:p-6 lg:p-8">
      <form
        action="/professors"
        method="get"
        className="grid grid-cols-1 items-end gap-4 sm:gap-5 md:grid-cols-[1.4fr_1fr_auto]"
      >
        <Input
          name="name"
          label="نام و نام خانوادگی استاد"
          labelIcon={FaUserTie}
          placeholder="مثال: دکتر احمدی..."
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input name="faculty" type="hidden" value={normalizedFaculty} />

        <Select
          label="دانشکده"
          labelIcon={FaUniversity}
          options={facultyOptions}
          value={faculty}
          onChange={setFaculty}
          searchable
          searchPlaceholder="جست‌وجوی دانشکده..."
        />

        <Button type="submit" fullWidth className="md:w-auto" icon={<BiSearch className="mt-0.5 text-[15px]" />}>
          جستجو
        </Button>
      </form>
    </section>
  );
}

export default SearchBarHome;
