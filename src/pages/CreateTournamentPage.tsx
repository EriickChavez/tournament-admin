import { useNavigate } from "react-router";
import { CreateTournamentForm } from "../features/tournaments/components/CreateTournamentForm";

const ArrowLeftIcon = () => (
  <svg
    width="18"
    height="18"
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
    <div className="max-w-2xl">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          title="Volver"
        >
          <ArrowLeftIcon />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Crear torneo</h1>
          <p className="text-sm text-gray-500">Completa los datos de tu nuevo torneo</p>
        </div>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <CreateTournamentForm />
      </div>
    </div>
  );
}
