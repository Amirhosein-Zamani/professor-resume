export const API_ROUTES = {
  Auth: {
    requestOtp: "/auth/request-otp",
    verifyOtp: "/auth/verify-otp",
    login: "/auth/login",
    getMe: "/auth/me",
    logout: "/auth/logout",
    updateMe: "/auth/me",
  },

  Professors: {
    list: "/professors",
    dashboardList: "/professors/dashboard/list",
    create: "/professors",
    detail: (idOrSlug: string) => `/professors/${idOrSlug}`,
    update: (id: string) => `/professors/${id}`,
    remove: (id: string) => `/professors/${id}`,
    activities: (idOrSlug: string) => `/professors/${idOrSlug}/activities`,
    createActivity: (id: string) => `/professors/${id}/activities`,
    updateActivity: (id: string, activityId: string) =>
      `/professors/${id}/activities/${activityId}`,
    removeActivity: (id: string, activityId: string) =>
      `/professors/${id}/activities/${activityId}`,
    updateLinks: (id: string) => `/professors/${id}/links`,
  },

  Forms: {
    getSchema: (target: string) => `/forms/${target}`
  },

  Faculties: {
    list: "/faculties",
    create: "/faculties",
    update: (id: string) => `/faculties/${id}`,
    delete: (id: string) => `/faculties/${id}`,
  },

  Users: {
    list: "/users",
    create: "/users",
    updateRole: (id: string) => `/users/${id}/role`,
  },
};
