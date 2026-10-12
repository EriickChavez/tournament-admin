import { useMatchReferees } from "../hooks/use-match-referees";

interface MatchRefereesChipProps {
  matchId: string;
  memberNameById: Map<string, string>;
}

export function MatchRefereesChip({
  matchId,
  memberNameById,
}: MatchRefereesChipProps) {
  const { data } = useMatchReferees(matchId);
  // Mientras carga (o si falla) no se muestra nada: el chip es solo informativo.
  if (!data) return null;

  const names = data.refereeUserIds.map(
    (id) => memberNameById.get(id) ?? "Usuario",
  );

  if (names.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[11px] font-semibold">
        👤 Sin árbitro asignado
      </span>
    );
  }

  const label =
    names.length <= 2
      ? names.join(", ")
      : `${names.slice(0, 2).join(", ")} +${names.length - 2}`;

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[11px] font-semibold"
      title={names.join(", ")}
    >
      👤 {label}
    </span>
  );
}
