import { useState } from "react";
import { useNavigate } from "react-router";
import { useCurrentUser } from "../auth/hooks/use-current-user";
import { useLogout } from "../auth/hooks/use-logout";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";

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
          <div className="max-w-6xl">
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              Buenas tardes, {data?.user.name ? data.user.name.split(" ")[0] : "Usuario"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Esto es lo que sucede en tu torneo
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
