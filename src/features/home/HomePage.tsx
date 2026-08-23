import { useCurrentUser } from "../auth/hooks/use-current-user";
import { EmptyTournamentState } from "./components/EmptyTournamentState";

export function HomePage() {
  const { data } = useCurrentUser();

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mt-2">
        Buenas tardes,{" "}
        {data?.user.displayName
          ? data.user.displayName.split(" ")[0]
          : "Usuario"}
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Esto es lo que sucede en tu torneo
      </p>
      <EmptyTournamentState />
    </div>
  );
}
