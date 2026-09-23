export type Faculty = {
  id: string;
  name: string;
  iconUrl: string | null;
  professorCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateFacultyPayload = {
  name: string;
};

export type UpdateFacultyPayload = {
  name: string;
};
