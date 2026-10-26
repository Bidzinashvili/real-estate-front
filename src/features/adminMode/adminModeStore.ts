import { create } from "zustand";
import { persist } from "zustand/middleware";

type AdminModeState = {
  isAdminMode: boolean;
  setAdminMode: (nextValue: boolean) => void;
  resetAdminMode: () => void;
};

export const useAdminModeStore = create<AdminModeState>()(
  persist(
    (set) => ({
      isAdminMode: false,
      setAdminMode: (nextValue) => set({ isAdminMode: nextValue }),
      resetAdminMode: () => set({ isAdminMode: false }),
    }),
    {
      name: "home-agency-admin-mode",
    },
  ),
);
