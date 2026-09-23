// services/auth/AuthApi.ts
import { API_ROUTES } from "@/constants/Api_Routes";
import api from "@/lib/api";
import { handleRequest } from "@/lib/api-helpers";
import {
  RequestOtpRequest,
  RequestOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  CurrentUser,
  UpdateMePayload,
  LogoutResponse,
  LoginRequest,
  LoginResponse,
} from "@/types/auth";

export const requestOtp = async (data: RequestOtpRequest) => {
  return handleRequest<RequestOtpResponse>(
    api.post(API_ROUTES.Auth.requestOtp, data),
  );
};

export const verifyOtp = async (data: VerifyOtpRequest) => {
  return handleRequest<VerifyOtpResponse>(
    api.post(API_ROUTES.Auth.verifyOtp, data),
  );
};

export const getCurrentUser = async () => {
  return handleRequest<CurrentUser>(api.get(API_ROUTES.Auth.getMe));
};

export const logout = async () => {
  return handleRequest<LogoutResponse>(api.post(API_ROUTES.Auth.logout));
};

export const updateCurrentUser = async (data: UpdateMePayload) => {
  return handleRequest<CurrentUser>(api.patch(API_ROUTES.Auth.updateMe, data));
};

export const authLogin = async (data: LoginRequest) => {
  return handleRequest<LoginResponse>(api.post(API_ROUTES.Auth.login, data));
};
