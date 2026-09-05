import { useNavigate } from "react-router";
import { CreateTournamentForm } from "../features/tournaments/components/CreateTournamentForm";

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export function CreateTournamentPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8 group"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 bg-white text-gray-500 group-hover:border-gray-300 group-hover:bg-gray-50 group-hover:text-gray-700 transition-colors">
          <ArrowLeftIcon />
        </span>
        Torneos
      </button>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Crear torneo
        </h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-md">
          Configura la información básica de tu torneo. Podrás agregar
          categorías, equipos y más después.
        </p>
      </div>

      <CreateTournamentForm onCancel={() => navigate(-1)} />
    </div>
  );
}
