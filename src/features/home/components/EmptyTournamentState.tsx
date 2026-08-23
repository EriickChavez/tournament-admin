export function EmptyTournamentState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-5xl mb-4">🏆</div>
      <h2 className="text-lg font-semibold">Aún no tienes un torneo</h2>
      <p className="text-gray-500 text-sm mt-1 max-w-sm">
        Crea tu primer torneo para empezar a gestionar equipos, jugadores y
        calendario.
      </p>
      <button
        disabled
        title="Disponible próximamente"
        className="mt-6 min-h-11 px-6 rounded bg-gray-300 text-white cursor-not-allowed"
      >
        Crear torneo
      </button>
    </div>
  );
}
