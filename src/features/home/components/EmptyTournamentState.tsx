import { useNavigate } from "react-router";

export function EmptyTournamentState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl mb-4">
        🏆
      </div>
      <h2 className="text-lg font-semibold text-gray-900">Aún no tienes un torneo</h2>
      <p className="text-gray-500 text-sm mt-1.5 max-w-sm">
        Crea tu primer torneo para empezar a gestionar equipos, jugadores y
        calendario.
      </p>
      <button
        onClick={() => navigate("/torneos/crear")}
        className="mt-6 min-h-11 px-6 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Crear torneo
      </button>
    </div>
  );
}
