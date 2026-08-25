import { CreateTournamentForm } from "../features/tournaments/components/CreateTournamentForm";

export function CreateTournamentPage() {
  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-xl font-bold mb-6">Crear torneo</h1>
      <CreateTournamentForm />
    </div>
  );
}
