import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

interface ThemeState {
    mode: ThemeMode
    primaryColor: string
    setMode: (mode: ThemeMode) => void
    toggleMode: () => void
    setPrimaryColor: (color: string) => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'light',
            primaryColor: '#4C566A',
            setMode: (mode) => set({ mode }),
            toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
            setPrimaryColor: (primaryColor) => set({ primaryColor }),
        }),
        {
            name: 'tournament-theme-store',
        },
    ),
)
