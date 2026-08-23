import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'
export type FontFamily = 'inter' | 'outfit' | 'roboto' | 'poppins' | 'dm-sans'
export type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type SidebarStyle = 'default' | 'floating' | 'minimal'
export type AnimationSpeed = 'none' | 'slow' | 'normal' | 'fast'

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
}

export interface ThemeState {
  // Existing
  mode: ThemeMode
  primaryColor: string

  // Colors
  colors: ThemeColors

  // Identidad Visual
  appName: string
  logoUrl: string | null
  bannerUrl: string | null
  loginBgUrl: string | null
  dashboardBgUrl: string | null

  // Tipografía
  fontFamily: FontFamily
  fontSize: 'sm' | 'md' | 'lg'

  // Diseño
  borderRadius: BorderRadius
  sidebarStyle: SidebarStyle
  animationSpeed: AnimationSpeed
  compactMode: boolean
  showBreadcrumbs: boolean

  // Notificaciones de UI
  showToasts: boolean
  toastPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

  // Actions
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  setPrimaryColor: (color: string) => void
  setColors: (colors: Partial<ThemeColors>) => void
  setAppName: (name: string) => void
  setLogoUrl: (url: string | null) => void
  setBannerUrl: (url: string | null) => void
  setLoginBgUrl: (url: string | null) => void
  setDashboardBgUrl: (url: string | null) => void
  setFontFamily: (font: FontFamily) => void
  setFontSize: (size: 'sm' | 'md' | 'lg') => void
  setBorderRadius: (radius: BorderRadius) => void
  setSidebarStyle: (style: SidebarStyle) => void
  setAnimationSpeed: (speed: AnimationSpeed) => void
  setCompactMode: (compact: boolean) => void
  setShowBreadcrumbs: (show: boolean) => void
  setShowToasts: (show: boolean) => void
  setToastPosition: (pos: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => void
  resetToDefaults: () => void
}

const defaultColors: ThemeColors = {
  primary: '#2563eb',
  secondary: '#1E293B',
  accent: '#10B981',
  background: '#FAFAFA',
  text: '#171717',
}

const defaults = {
  mode: 'light' as ThemeMode,
  primaryColor: '#2563eb',
  colors: defaultColors,
  appName: 'Nova',
  logoUrl: null,
  bannerUrl: null,
  loginBgUrl: null,
  dashboardBgUrl: null,
  fontFamily: 'inter' as FontFamily,
  fontSize: 'md' as const,
  borderRadius: 'lg' as BorderRadius,
  sidebarStyle: 'default' as SidebarStyle,
  animationSpeed: 'normal' as AnimationSpeed,
  compactMode: false,
  showBreadcrumbs: true,
  showToasts: true,
  toastPosition: 'top-right' as const,
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...defaults,

      setMode: (mode) => set({ mode }),
      toggleMode: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
      setPrimaryColor: (primaryColor) =>
        set((state) => ({
          primaryColor,
          colors: { ...state.colors, primary: primaryColor },
        })),
      setColors: (colors) =>
        set((state) => ({ colors: { ...state.colors, ...colors }, primaryColor: colors.primary ?? state.primaryColor })),
      setAppName: (appName) => set({ appName }),
      setLogoUrl: (logoUrl) => set({ logoUrl }),
      setBannerUrl: (bannerUrl) => set({ bannerUrl }),
      setLoginBgUrl: (loginBgUrl) => set({ loginBgUrl }),
      setDashboardBgUrl: (dashboardBgUrl) => set({ dashboardBgUrl }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontSize: (fontSize) => set({ fontSize }),
      setBorderRadius: (borderRadius) => set({ borderRadius }),
      setSidebarStyle: (sidebarStyle) => set({ sidebarStyle }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setShowBreadcrumbs: (showBreadcrumbs) => set({ showBreadcrumbs }),
      setShowToasts: (showToasts) => set({ showToasts }),
      setToastPosition: (toastPosition) => set({ toastPosition }),
      resetToDefaults: () => set({ ...defaults }),
    }),
    {
      name: 'tournament-theme-store',
      version: 2,
    },
  ),
)
