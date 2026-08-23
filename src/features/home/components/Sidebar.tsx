import type { User } from "../../auth/types";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

function NavItem({
  icon,
  label,
  active,
  disabled,
  collapsed,
  onClick,
}: NavItemProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`group w-full flex items-center gap-3 min-h-10 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : disabled
            ? "text-gray-400"
            : "text-gray-600 hover:bg-blue-50 hover:text-primary"
      } ${collapsed ? "justify-center px-0" : "px-3"}`}
    >
      <span
        className={`shrink-0 flex items-center justify-center ${active ? "text-white" : "text-gray-500 group-hover:text-primary"}`}
      >
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

// Icons (SVG representations)
const PanelIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const AnaliticsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const UsuariosIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const TorneoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
  </svg>
);

const EquiposIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const JugadoresIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarioIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ConfigIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const PersonalizacionIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const AyudaIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export function Sidebar({
  user,
  onLogout,
  loggingOut,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}: {
  user?: User;
  onLogout: () => void;
  loggingOut: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Close mobile sidebar if window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileOpen && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen, onCloseMobile]);

  const go = (path: string) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(path + "/");
  const show = !collapsed || mobileOpen;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 flex flex-col h-full transition-all duration-300 ease-in-out lg:relative
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          ${mobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Area */}
        <div className="p-4 flex items-center gap-3 relative">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          {show && (
            <span className="font-bold text-xl tracking-tight text-gray-900 truncate">
              Nova
            </span>
          )}

          {/* Collapse Toggle for Desktop */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="absolute -right-3 top-5 hidden lg:flex items-center justify-center w-6 h-6 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-700 hover:shadow-sm transition-all"
              title={collapsed ? "Expandir" : "Colapsar"}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
          )}
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto mt-2">
          {/* General */}
          {show ? (
            <p className="text-xs font-medium text-gray-400 px-3 mt-4 mb-2">
              General
            </p>
          ) : (
            <div className="mt-6 mb-2 border-t border-gray-100 mx-2" />
          )}

          <NavItem
            icon={<PanelIcon />}
            label="Panel"
            active={currentPath === "/home"}
            collapsed={!show}
            onClick={() => go("/home")}
          />
          <NavItem
            icon={<AnaliticsIcon />}
            label="Analitics"
            collapsed={!show}
            disabled
            onClick={() => go("/home/analitics")}
          />
          <NavItem
            icon={<UsuariosIcon />}
            label="Usuarios"
            collapsed={!show}
            disabled
            onClick={() => go("/home/usuarios")}
          />

          {/* Torneo */}
          {show ? (
            <p className="text-xs font-medium text-gray-400 px-3 mt-6 mb-2">
              Torneo
            </p>
          ) : (
            <div className="mt-6 mb-2 border-t border-gray-100 mx-2" />
          )}

          <NavItem
            icon={<TorneoIcon />}
            label="Tu torneo"
            collapsed={!show}
            disabled
            onClick={() => go("/home/torneo")}
          />
          <NavItem
            icon={<EquiposIcon />}
            label="Equipos"
            collapsed={!show}
            disabled
            onClick={() => go("/home/equipos")}
          />
          <NavItem
            icon={<JugadoresIcon />}
            label="Jugadores"
            collapsed={!show}
            disabled
            onClick={() => go("/home/jugadores")}
          />
          <NavItem
            icon={<CalendarioIcon />}
            label="Calendario"
            collapsed={!show}
            disabled
            onClick={() => go("/home/calendario")}
          />

          {/* Sistema */}
          {show ? (
            <p className="text-xs font-medium text-gray-400 px-3 mt-6 mb-2">
              Sistema
            </p>
          ) : (
            <div className="mt-6 mb-2 border-t border-gray-100 mx-2" />
          )}

          <NavItem
            icon={<ConfigIcon />}
            label="Configuracion"
            collapsed={!show}
            disabled
            onClick={() => go("/home/configuracion")}
          />
          <NavItem
            icon={<PersonalizacionIcon />}
            label="Personalizacion"
            active={isActive("/personalizacion")}
            collapsed={!show}
            onClick={() => go("/personalizacion")}
          />
          <NavItem
            icon={<AyudaIcon />}
            label="Ayuda"
            collapsed={!show}
            disabled
            onClick={() => go("/home/ayuda")}
          />
        </nav>

        {/* User Profile Area */}
        <div
          className={`p-4 border-t border-gray-100 flex items-center ${show ? "gap-3" : "justify-center"}`}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 shrink-0 flex items-center justify-center text-sm font-bold text-primary">
            {user?.displayName?.slice(0, 2).toUpperCase() ?? "EC"}
          </div>

          {show && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.displayName || "Erick Chavez"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "Erick@ch.com"}
              </p>
            </div>
          )}

          <button
            onClick={onLogout}
            disabled={loggingOut}
            className={`p-2 text-gray-400 hover:text-gray-700 disabled:opacity-50 rounded-lg hover:bg-gray-50 ${show ? "" : "hidden"}`}
            title="Cerrar sesión"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>
    </>
  );
}
