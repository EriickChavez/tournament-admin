import { useCurrentUser } from "../features/auth/hooks/use-current-user";
import { useLogout } from "../features/auth/hooks/use-logout";
import { useNavigate } from "react-router";

export function HomePage() {
  const { data } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b">
        <div>
          <p className="font-medium">{data?.user.name}</p>
          <p className="text-sm text-gray-500">{data?.user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="min-h-11 px-4 rounded border disabled:opacity-50"
        >
          {logout.isPending ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <p className="text-gray-400">Dashboard — próximamente</p>
      </main>
    </div>
  );
}
