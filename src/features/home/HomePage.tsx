import { useState, useEffect } from "react";
import { useNavigate, Routes, Route, Navigate } from "react-router";
import { useCurrentUser } from "../auth/hooks/use-current-user";
import { useLogout } from "../auth/hooks/use-logout";
import { useThemeStore } from "../../shared/store/theme-store";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { PersonalizacionPage } from "../personalizacion/PersonalizacionPage";

// ─── Placeholder pages ────────────────────────────────────────────────────────

function PanelContent({ userName }: { userName?: string }) {
  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mt-2">
        Buenas tardes, {userName ? userName.split(" ")[0] : "Usuario"}
      </h1>
      <p className="text-sm text-gray-500 mt-1">Esto es lo que sucede en tu torneo</p>
    </div>
  );
}

// ─── Theme applier ────────────────────────────────────────────────────────────

function ThemeApplier() {
  const { mode, colors, primaryColor, fontFamily, fontSize, borderRadius, animationSpeed } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    const effectivePrimary = colors?.primary || primaryColor;

    // Colors
    root.style.setProperty("--theme-primary", effectivePrimary);
    root.style.setProperty("--theme-secondary", colors?.secondary || "#1E293B");
    root.style.setProperty("--theme-accent", colors?.accent || "#10B981");
    root.style.setProperty("--theme-bg", colors?.background || "#FAFAFA");
    root.style.setProperty("--theme-text", colors?.text || "#171717");

    // Dark mode
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Font family
    const fontMap: Record<string, string> = {
      inter: "'Inter', sans-serif",
      outfit: "'Outfit', sans-serif",
      roboto: "'Roboto', sans-serif",
      poppins: "'Poppins', sans-serif",
      "dm-sans": "'DM Sans', sans-serif",
    };
    root.style.setProperty("--theme-font", fontMap[fontFamily] || fontMap.inter);

    // Font size
    const sizeMap: Record<string, string> = { sm: "13px", md: "15px", lg: "17px" };
    root.style.setProperty("--theme-font-size", sizeMap[fontSize] || "15px");

    // Border radius
    const radiusMap: Record<string, string> = {
      none: "0px", sm: "4px", md: "8px", lg: "12px", xl: "16px", "2xl": "24px"
    };
    root.style.setProperty("--theme-radius", radiusMap[borderRadius] || "12px");

    // Animation speed
    const speedMap: Record<string, string> = {
      none: "0ms", slow: "400ms", normal: "200ms", fast: "100ms"
    };
    root.style.setProperty("--theme-transition", speedMap[animationSpeed] || "200ms");

  }, [mode, colors, primaryColor, fontFamily, fontSize, borderRadius, animationSpeed]);

  return null;
}

// ─── Main HomePage ────────────────────────────────────────────────────────────

export function HomePage() {
  const { data } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  }

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <ThemeApplier />
      <Sidebar
        user={data?.user}
        onLogout={handleLogout}
        loggingOut={logout.isPending}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          user={data?.user}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-6 lg:px-8">
          <Routes>
            <Route index element={<PanelContent userName={data?.user.name} />} />
            <Route path="personalizacion" element={<PersonalizacionPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
