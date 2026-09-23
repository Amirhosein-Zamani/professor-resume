import { API_ROUTES } from "@/constants/Api_Routes";
import api from "@/lib/api";
import { handleRequest } from "@/lib/api-helpers";
import {
  CreateActivityPayload,
  CreateProfessorPayload,
  Professor,
  ProfessorActivity,
  ProfessorLinks,
  ProfessorListItem,
  UpdateProfessorPayload,
} from "@/types/professor";

type GetProfessorsParams = {
  name?: string;
  faculty?: string;
};

export const getProfessors = async (params?: GetProfessorsParams) => {
  return handleRequest<ProfessorListItem[]>(
    api.get(API_ROUTES.Professors.list, { params }),
  );
};

export const getProfessor = async (professorId: string) => {
  console.log('professorId: ', professorId)
  return handleRequest<Professor>(
    api.get(API_ROUTES.Professors.detail(professorId)),
  );
};

const toProfessorFormData = (
  data: CreateProfessorPayload | UpdateProfessorPayload,
  cvFile?: File | null,
): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "links") {
      if (value && Object.keys(value as object).length > 0) {
        formData.append("links", JSON.stringify(value));
      }
      return;
    }

    if (value === undefined || value === null || value === "") {
      return;
    }

    formData.append(key, String(value));
  });

  if (cvFile) {
    formData.append("cv", cvFile);
  }

  return formData;
};

export const createProfessor = async (
  data: CreateProfessorPayload,
  cvFile?: File | null,
) => {
  const formData = toProfessorFormData(data, cvFile);

  return handleRequest<Professor>(
    api.post(API_ROUTES.Professors.create, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
};

export const updateProfessor = async (
  id: string,
  data: UpdateProfessorPayload,
  cvFile?: File | null,
) => {
  const formData = toProfessorFormData(data, cvFile);

  return handleRequest<Professor>(
    api.patch(API_ROUTES.Professors.update(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
};

export const removeProfessor = async (id: string) => {
  return handleRequest<{ success: boolean }>(
    api.delete(API_ROUTES.Professors.remove(id)),
  );
};

export const updateProfessorLinks = async (
  id: string,
  links: ProfessorLinks,
) => {
  return handleRequest<ProfessorLinks>(
    api.put(API_ROUTES.Professors.updateLinks(id), links),
  );
};

export const addProfessorActivity = async (
  id: string,
  data: CreateActivityPayload,
) => {
  return handleRequest<ProfessorActivity>(
    api.post(API_ROUTES.Professors.createActivity(id), data),
  );
};

export const updateProfessorActivity = async (
  id: string,
  activityId: string,
  data: Partial<CreateActivityPayload>,
) => {
  return handleRequest<ProfessorActivity>(
    api.patch(API_ROUTES.Professors.updateActivity(id, activityId), data),
  );
};

export const removeProfessorActivity = async (
  id: string,
  activityId: string,
) => {
  return handleRequest<void>(
    api.delete(API_ROUTES.Professors.removeActivity(id, activityId)),
  );
};
