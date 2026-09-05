import type { User } from "../../auth/types";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

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
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={[
        "group relative flex min-h-11 w-full items-center gap-3 rounded-xl",
        "text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center px-0" : "px-3",
        active
          ? "bg-primary text-white shadow-sm"
          : disabled
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-950",
      ].join(" ")}
    >
      {active && (
        <span className="absolute left-0 h-5 w-0.5 rounded-r-full bg-white/80" />
      )}

      <span
        className={[
          "flex shrink-0 items-center justify-center",
          active
            ? "text-white"
            : disabled
              ? "text-gray-300"
              : "text-gray-400 transition-colors group-hover:text-gray-700",
        ].join(" ")}
      >
        {icon}
      </span>

      {!collapsed && <span className="truncate">{label}</span>}

      {!collapsed && disabled && (
        <span className="ml-auto rounded-md bg-gray-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-300">
          Próximamente
        </span>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

const PanelIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarioIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const PersonalizacionIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    width="15"
    height="15"
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
    width="15"
    height="15"
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

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

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
  const show = !collapsed || mobileOpen;

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
    onCloseMobile?.();
  };

  const isActive = (path: string) =>
    currentPath === path || currentPath.startsWith(`${path}/`);

  const initials =
    user?.displayName
      ?.split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "EC";

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col",
          "border-r border-gray-200/80 bg-white",
          "transition-all duration-300 ease-in-out",
          "lg:relative lg:z-auto",
          collapsed ? "lg:w-[76px]" : "lg:w-[272px]",
          mobileOpen
            ? "w-[272px] translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div
          className={[
            "flex h-[76px] shrink-0 items-center border-b border-gray-100",
            show ? "px-5" : "justify-center px-3",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => go("/home")}
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <TorneoIcon />
            </span>

            {show && (
              <span className="truncate text-lg font-bold tracking-tight text-gray-950">
                Nova
              </span>
            )}
          </button>

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="absolute -right-3 top-[29px] hidden h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:text-gray-800 hover:shadow-md lg:flex"
              title={collapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {/* General */}
          {show ? <SectionLabel>General</SectionLabel> : <SectionDivider />}

          <div className="space-y-1">
            <NavItem
              icon={<PanelIcon />}
              label="Panel"
              active={currentPath === "/home"}
              collapsed={!show}
              onClick={() => go("/home")}
            />

            <NavItem
              icon={<AnaliticsIcon />}
              label="Analítica"
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
          </div>

          {/* Tournament */}
          {show ? (
            <SectionLabel className="mt-7">Torneo</SectionLabel>
          ) : (
            <SectionDivider className="mt-7" />
          )}

          <div className="space-y-1">
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
          </div>

          {/* System */}
          {show ? (
            <SectionLabel className="mt-7">Sistema</SectionLabel>
          ) : (
            <SectionDivider className="mt-7" />
          )}

          <div className="space-y-1">
            <NavItem
              icon={<ConfigIcon />}
              label="Configuración"
              collapsed={!show}
              disabled
              onClick={() => go("/home/configuracion")}
            />

            <NavItem
              icon={<PersonalizacionIcon />}
              label="Personalización"
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
          </div>
        </nav>

        {/* User */}
        <div className="shrink-0 border-t border-gray-100 p-3">
          <div
            className={[
              "flex items-center rounded-2xl bg-gray-50",
              show ? "gap-3 p-3" : "justify-center p-2",
            ].join(" ")}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {initials}
            </div>

            {show && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user?.displayName || "Erick Chavez"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {user?.email || "Erick@ch.com"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  disabled={loggingOut}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white hover:text-gray-700 disabled:opacity-50"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogoutIcon />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 ${className}`}
    >
      {children}
    </p>
  );
}

function SectionDivider({ className = "" }: { className?: string }) {
  return <div className={`mx-2 mb-2 border-t border-gray-100 ${className}`} />;
}
