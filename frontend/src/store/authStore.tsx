import { create } from "zustand";
import api from "@/lib/api";

interface User {
  id: string;
  name: string;
  phone	: string;
  email: string;
  userType: "CLIENT" | "ADMIN";
  birthDate	: string | null;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token, user) => {
    localStorage.setItem("uaifood-token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Falha ao fazer logout no servidor:", error);
    }
    localStorage.removeItem("uaifood-token");
    delete api.defaults.headers.common["Authorization"]; // Limpa o header do Axios
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  initialize: () => {
    const token = localStorage.getItem("uaifood-token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/user")
        .then((response) => {
          const user = response.data as User;
          set({ token, user, isAuthenticated: true, isLoading: false });
        })
        .catch(() => {
          localStorage.removeItem("uaifood-token");
          delete api.defaults.headers.common["Authorization"];
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        });
    } else {
      set({ isLoading: false });
    }
  },
}));
