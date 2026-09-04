import { useState } from "react";
import {
  useLookupUser,
  isUserNotFound,
} from "../../auth/hooks/use-lookup-user";
import { useInviteMember } from "../hooks/use-invite-member";
import { getMemberErrorMessage } from "../utils/member-error-message";

export function InviteMemberModal({
  tournamentId,
  onClose,
}: {
  tournamentId: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const lookup = useLookupUser(searchEmail, searchEmail.length > 0);
  const invite = useInviteMember(tournamentId);

  function handleSearch() {
    setSearchEmail(email.trim());
  }

  function handleInvite(userId: string) {
    invite.mutate(userId, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4">
          Invitar miembro
        </h3>

        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="correo@ejemplo.com"
            className="flex-1 min-h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleSearch}
            disabled={!email.trim()}
            className="min-h-10 px-4 rounded-xl bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Buscar
          </button>
        </div>

        <div className="mt-4 min-h-16">
          {lookup.isLoading && (
            <p className="text-sm text-gray-400">Buscando...</p>
          )}

          {lookup.isError && (
            <p className="text-sm text-red-600">
              {isUserNotFound(lookup.error)
                ? "No existe ninguna cuenta con ese correo"
                : getMemberErrorMessage(lookup.error)}
            </p>
          )}

          {lookup.data && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {lookup.data.user.displayName.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {lookup.data.user.displayName}
                </p>
              </div>
              <button
                onClick={() => handleInvite(lookup.data.user.id)}
                disabled={invite.isPending}
                className="min-h-9 px-3 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                Invitar como Admin
              </button>
            </div>
          )}

          {invite.isError && (
            <p className="text-sm text-red-600 mt-2">
              {getMemberErrorMessage(invite.error)}
            </p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="min-h-9 px-4 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
