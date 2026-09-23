import { API_ROUTES } from "@/constants/Api_Routes";
import api from "@/lib/api";
import { handleRequest } from "@/lib/api-helpers";
import {
    CreateFacultyPayload,
    Faculty,
    UpdateFacultyPayload,
} from "@/types/faculty";

export const getFaculties = async () => {
    return handleRequest<Faculty[]>(
        api.get(API_ROUTES.Faculties.list)
    );
};

export const createFaculty = async (
    data: CreateFacultyPayload,
    iconFile?: File | null,
) => {
    const formData = new FormData();
    formData.append("name", data.name);

    if (iconFile) {
        formData.append("icon", iconFile);
    }

    return handleRequest<Faculty>(
        api.post(API_ROUTES.Faculties.create, formData)
    );
};

export const updateFaculty = async (
    id: string,
    data: UpdateFacultyPayload,
    iconFile?: File | null,
) => {
    const formData = new FormData();
    formData.append("name", data.name);

    if (iconFile) {
        formData.append("icon", iconFile);
    }

    return handleRequest<Faculty>(
        api.patch(API_ROUTES.Faculties.update(id), formData)
    );
};

export const deleteFaculty = async (id: string) => {
    return handleRequest<Faculty>(
        api.delete(API_ROUTES.Faculties.delete(id))
    );
};
