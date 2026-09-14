import { create } from "zustand";

type AdminModeState = {
  isAdminMode: boolean;
  setAdminMode: (nextValue: boolean) => void;
  resetAdminMode: () => void;
};

export const useAdminModeStore = create<AdminModeState>((set) => ({
  isAdminMode: false,
  setAdminMode: (nextValue) => set({ isAdminMode: nextValue }),
  resetAdminMode: () => set({ isAdminMode: false }),
}));
