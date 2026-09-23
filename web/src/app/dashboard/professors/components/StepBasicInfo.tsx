"use client";

import { createProfessor } from "@/services/professors/Professorsapi";
import { CreateProfessorPayload } from "@/types/professor";
import { FormValues } from "@/types/form-schema";
import { useState } from "react";
import DynamicForm from "./forms/DynamicForm";

type StepProfessorInfoProps = {
  onCreated: (professorId: string, slug: string) => void;
  onCancel: () => void;
};

export default function StepProfessorInfo({
  onCreated,
  onCancel,
}: StepProfessorInfoProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      // تبدیل FormValues به CreateProfessorPayload
      const payload: CreateProfessorPayload = {
        slug: values.slug || "",
        firstName: values.firstName || "",
        lastName: values.lastName || "",
        displayName: values.displayName || "",
        nationalCode: values.nationalCode || "",
        rank: values.rank || "",
        facultyId: values.facultyId || "",
        specialty: values.specialty || "",
        isFaculty: values.isFaculty || false,
        avatar: values.avatar || "",
        email: values.email || "",
        bio: values.bio || "",
        golestanProfessorNo: values.golestanProfessorNo || "",
        employeeNo: values.employeeNo || "",
        studentNo: values.studentNo || "",
        facultyName: values.facultyName || "",
        researchGroupName: values.researchGroupName || "",
        organizationName: values.organizationName || "",
        links: values.links || {},
      };

      // اگر فایل CV وجود دارد
      const cvFile = values.cvFile || null;

      const response = await createProfessor(payload, cvFile);
      
      if (response.success && response.data) {
        onCreated(response.data.id, response.data.slug);
      } else {
        // نمایش خطا
        alert(response.error || "خطا در ایجاد استاد");
      }
    } catch (error) {
      console.error("Error creating professor:", error);
      alert("خطا در ایجاد استاد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
      <DynamicForm
        target="PROFESSOR"
        onSubmit={handleSubmit}
        onCancel={onCancel}
        loading={loading}
        submitLabel="بعدی"
        cancelLabel="انصراف"
        className="space-y-4"
      />
    </div>
  );
}
