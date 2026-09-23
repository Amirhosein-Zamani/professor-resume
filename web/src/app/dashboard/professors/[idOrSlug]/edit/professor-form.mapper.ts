import { stripEmpty } from "@/lib/Stripempty";
import type { FormValues } from "@/types/form-schema";
import type { Professor, UpdateProfessorPayload } from "@/types/professor";

export function toProfessorFormValues(professor: Professor): FormValues {
    return {
        slug: professor.slug || "",
        firstName: professor.firstName || "",
        lastName: professor.lastName || "",
        displayName: professor.displayName || "",
        nationalCode: professor.nationalCode || "",
        rank: professor.rank || "",
        facultyId: professor.facultyId || "",
        specialty: professor.specialty || "",
        isFaculty: professor.isFaculty ?? true,
        avatar: professor.avatar || "",
        email: professor.email || "",
        bio: professor.bio || "",
        golestanProfessorNo: professor.golestanProfessorNo
            ? String(professor.golestanProfessorNo)
            : "",
        employeeNo: professor.employeeNo || "",
        studentNo: professor.studentNo || "",
        facultyName: professor.facultyName || "",
        researchGroupName: professor.researchGroupName || "",
        organizationName: professor.organizationName || "",
        scholar: professor.links?.scholar || "",
        researchgate: professor.links?.researchgate || "",
        scopus: professor.links?.scopus || "",
        website: professor.links?.website || "",
    };
}

export function toProfessorUpdate(values: FormValues): UpdateProfessorPayload {
    const payload: UpdateProfessorPayload = {
        slug: values.slug || "",
        firstName: values.firstName || "",
        lastName: values.lastName || "",
        displayName: values.displayName || "",
        nationalCode: values.nationalCode || "",
        rank: values.rank || "",
        facultyId: values.facultyId || "",
        specialty: values.specialty || "",
        isFaculty: values.isFaculty ?? true,
        avatar: values.avatar || "",
        email: values.email || "",
        bio: values.bio || "",
        golestanProfessorNo: values.golestanProfessorNo || "",
        employeeNo: values.employeeNo || "",
        studentNo: values.studentNo || "",
        facultyName: values.facultyName || "",
        researchGroupName: values.researchGroupName || "",
        organizationName: values.organizationName || "",
        links: {
            scholar: values.scholar || "",
            researchgate: values.researchgate || "",
            scopus: values.scopus || "",
            website: values.website || "",
        },
    };

    return stripEmpty(payload as Record<string, unknown>) as UpdateProfessorPayload;
}
