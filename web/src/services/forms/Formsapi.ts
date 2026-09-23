import { API_ROUTES } from "@/constants/Api_Routes";
import api from "@/lib/api";
import { handleRequest } from "@/lib/api-helpers";
import { FormSchemaResponse } from "@/types/form-schema";

export const getFormSchema = async (target: "PROFESSOR" | "ACTIVITY") => {
  return handleRequest<FormSchemaResponse>(
    api.get(API_ROUTES.Forms.getSchema(target))
  );
};