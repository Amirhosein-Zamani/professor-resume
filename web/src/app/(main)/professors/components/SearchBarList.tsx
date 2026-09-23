"use client";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useState } from "react";
import { FaUserTie, FaUniversity } from "react-icons/fa";

interface SearchBarListProps {
  onChange?: (filters: {
    name: string;
    faculty: string;
  }) => void;
}

function SearchBarList({ onChange }: SearchBarListProps) {
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("همه دانشکده‌ها");

  const handleChange = (newValues: Partial<{ name: string; faculty: string }>) => {
    const updated = { name, faculty, ...newValues };
    setName(updated.name);
    setFaculty(updated.faculty);

    onChange?.(updated);
  };

  return (
    <section className="p-6 md:p-8 rounded-2xl shadow-md border backdrop-blur-sm bg-surface border-border">

      <div className="flex flex-col md:flex-row gap-6 md:items-end">

        {/* نام استاد – پهن‌تر */}
        <div className="flex-1 md:flex-[2]">
          <Input
            label="نام و نام خانوادگی استاد"
            labelIcon={FaUserTie}
            placeholder="مثال: دکتر احمدی..."
            value={name}
            onChange={(e) => handleChange({ name: e.target.value })}
          />
        </div>

        {/* دانشکده */}
        <div className="flex-1 md:flex-[1]">
          <Select
            label="دانشکده"
            labelIcon={FaUniversity}
            options={["همه دانشکده‌ها", "مهندسی کامپیوتر", "علوم پایه"]}
            value={faculty}
            onChange={(val) => handleChange({ faculty: val })}
          />
        </div>

      </div>

    </section>
  );
}

export default SearchBarList;
