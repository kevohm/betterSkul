import { api } from "../../lib/axios";

export type MeResponse = {
  userId: number,
  role: string,
  full_name:string
};

export const authApi = {
  login: (payload: { email: string, password: string }) =>
    api.post("/auth/login", payload),

  register: (payload: {
    email: string,
    password: string,
    role: string,
    first_name?: string,
    last_name?: string,
    full_name?: string,
    date_of_birth?: string,
  }) => api.post("/auth/register", payload),

  logout: () => api.post("/auth/logout"),

  me: async (): Promise<MeResponse> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};
