import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

let isRefreshing = false;

let refreshPromise: Promise<boolean> | null = null;

const refreshAccessToken = async (): Promise<boolean> => {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                {},
                {
                    withCredentials: true,
                }
            );

            return true;
        } catch (error) {
            console.error(
                "Refresh token expired or invalid.",
                error
            );

            return false;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error: AxiosError) => {
        const originalRequest =
            error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };

        const status = error.response?.status;

        if (status !== 401) {
            return Promise.reject(error);
        }

        if (
            originalRequest?.url?.includes(
                "/auth/refresh"
            )
        ) {
            return Promise.reject(error);
        }

        if (originalRequest?._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!isRefreshing) {
            isRefreshing = true;

            try {
                const success =
                    await refreshAccessToken();

                if (!success) {
                    return Promise.reject(error);
                }
            } finally {
                isRefreshing = false;
            }
        } else {
            while (isRefreshing) {
                await new Promise((resolve) =>
                    setTimeout(resolve, 100)
                );
            }
        }

        return api(originalRequest);
    }
);

export default api;