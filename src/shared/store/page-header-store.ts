import { create } from "zustand";

interface PageHeaderState {
    title: string;
    subtitle: string;
    setHeader: (title: string, subtitle?: string) => void;
    resetHeader: () => void;
}

export const usePageHeaderStore = create<PageHeaderState>((set) => ({
    title: "Panel",
    subtitle: "Resumen general",
    setHeader: (title, subtitle = "") => set({ title, subtitle }),
    resetHeader: () => set({ title: "Panel", subtitle: "Resumen general" }),
}));