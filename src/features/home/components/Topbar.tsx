import type { User } from "../../auth/types";
import { useThemeStore } from "../../../shared/store/theme-store";
import { useEffect } from "react";

// Icons
const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const PanelTopIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export function Topbar({ user, onOpenMobile }: { user?: User, onOpenMobile?: () => void }) {
  const initials = user?.name?.slice(0, 2).toUpperCase() ?? "EC";
  const { mode, toggleMode, primaryColor } = useThemeStore();

  useEffect(() => {
    // Apply primary color variable to root
    document.documentElement.style.setProperty("--theme-primary", primaryColor);
    
    // Apply dark mode class
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode, primaryColor]);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button 
            onClick={onOpenMobile}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <MenuIcon />
          </button>
        )}
        <div className="hidden sm:flex w-10 h-10 border border-gray-200 rounded-xl items-center justify-center text-gray-700 bg-white">
          <PanelTopIcon />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 leading-tight">Panel</h2>
          <p className="text-xs text-gray-400">Resumen general</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          onClick={toggleMode}
          className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
          title="Alternar tema"
        >
          {mode === 'light' ? <SunIcon /> : <MoonIcon />}
        </button>
        
        <button className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
          <BellIcon />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 ml-1">
          {initials}
        </div>
      </div>
    </header>
  );
}
