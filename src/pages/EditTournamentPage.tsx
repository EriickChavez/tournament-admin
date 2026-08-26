import { useParams, Navigate } from "react-router";
import { useTournaments } from "../features/tournaments/hooks/use-tournaments";
import { EditTournamentForm } from "../features/tournaments/components/EditTournamentForm";

export function EditTournamentPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useTournaments();

  if (isLoading) return <p className="text-gray-400">Cargando...</p>;

  const tournament = data?.tournaments.find((t) => t.id === id);
  if (!tournament) return <Navigate to="/torneos" replace />;

  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-xl font-bold mb-6">Editar torneo</h1>
      <EditTournamentForm tournament={tournament} />
    </div>
  );
}
