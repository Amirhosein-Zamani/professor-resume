import axios, { type AxiosResponse } from "axios";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  message?: string;
};

type ApiResponseBody = {
  data?: unknown;
  error?: string;
  message?: string | string[];
  messages?: string[];
  statusCode?: number;
};

export async function handleRequest<T>(
  request: Promise<AxiosResponse<unknown>>,
): Promise<ApiResponse<T>> {
  try {
    const res = await request;
    const body = res.data;
    const responseBody =
      typeof body === "object" && body !== null
        ? (body as ApiResponseBody)
        : undefined;
    const responseMessage = Array.isArray(responseBody?.message)
      ? responseBody.message[0]
      : responseBody?.message;

    if (res.status === 200 || res.status === 201) {
      return {
        success: true,
        data: body as T,
        statusCode: res.status,
        message: responseMessage,
      };
    }

    if (
      responseBody?.statusCode !== undefined &&
      responseBody.statusCode !== 1
    ) {
      return {
        success: false,
        error:
          responseBody.messages?.[0] ||
          responseBody.error ||
          responseMessage ||
          "خطای ناشناخته",
        statusCode: responseBody.statusCode,
        message: responseMessage,
      };
    }

    if (responseBody?.data !== undefined) {
      return {
        success: true,
        data: responseBody.data as T,
        statusCode: res.status,
        message: responseMessage,
      };
    }

    return {
      success: true,
      data: body as T,
      statusCode: res.status,
      message: responseMessage,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errData = error.response.data;
      const errorBody =
        typeof errData === "object" && errData !== null
          ? (errData as { message?: string | string[]; error?: string })
          : undefined;
      const apiMessage = Array.isArray(errorBody?.message)
        ? errorBody.message[0]
        : errorBody?.message;

      return {
        success: false,
        error: apiMessage || errorBody?.error || "خطای سرور",
        statusCode: error.response.status,
        message: apiMessage || errorBody?.error,
      };
    }

    if (
      axios.isAxiosError(error) &&
      (error.code === "ERR_NETWORK" || error.message.includes("Network"))
    ) {
      return {
        success: false,
        error: error.message,
        message: "ارتباط با سرور برقرار نشد",
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "خطای ناشناخته",
      message: "خطای ارتباط با سرور",
    };
  }
}
