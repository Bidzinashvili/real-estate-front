import { create } from "zustand";
import axios from "axios";
import { getApiBaseUrl, getStoredAuthToken } from "@/shared/lib/auth";

type User = {
  id: string;
  email: string;
  role: "ADMIN" | "AGENT";
  passwordSet: boolean;
};

type CurrentUserResponse = {
  id: string;
  email: string;
  role: "ADMIN" | "AGENT";
  passwordSet?: boolean;
};

type UserState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

type UserActions = {
  fetchCurrentUser: () => Promise<void>;
  clearUser: () => void;
};

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchCurrentUser: async () => {
    if (get().user || get().isLoading) return;

    const baseUrl = getApiBaseUrl();
    const token = getStoredAuthToken();

    if (!baseUrl || !token) {
      set({ error: "API მისამართი ან ავტორიზაციის ტოკენი აკლია" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const res = await axios.get<CurrentUserResponse>(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        user: {
          id: res.data.id,
          email: res.data.email,
          role: res.data.role,
          passwordSet: res.data.passwordSet === true,
        },
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ?? "მომხმარებლის ჩატვირთვა ვერ მოხერხდა"
        : "მომხმარებლის ჩატვირთვა ვერ მოხერხდა";

      set({ user: null, isLoading: false, error: message });
    }
  },

  clearUser: () => set({ user: null, isLoading: false, error: null }),
}));
