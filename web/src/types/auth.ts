export type RequestOtpRequest = {
  email: string;
};

export type RequestOtpResponse = {
  message: string;
};

export type VerifyOtpRequest = {
  email: string;
  code: string;
};

export type VerifyOtpResponse = {
  user: SafeUser;
};

export type UserRole = "ADMIN" | "EDITOR";

export type SafeUser = {
  id: string;
  email: string;
  role: UserRole;
  professorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CurrentUser = {
  user: SafeUser;
};

export type UpdateMePayload = {
  email?: string;
};

export type LogoutResponse = {
  success: true;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: SafeUser;
};
