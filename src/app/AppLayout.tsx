import { Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { useCurrentUser } from "../features/auth/hooks/use-current-user";
import { useLogout } from "../features/auth/hooks/use-logout";
import { Sidebar } from "../features/home/components/Sidebar";
import { Topbar } from "../features/home/components/Topbar";

export function AppLayout() {
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
        <Topbar user={data?.user} onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 p-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
