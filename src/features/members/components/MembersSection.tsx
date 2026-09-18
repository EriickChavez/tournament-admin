import { useState } from "react";
import { useMembers } from "../hooks/use-members";
import { useRemoveMember } from "../hooks/use-remove-member";
import { getMemberErrorMessage } from "../utils/member-error-message";
import { InviteMemberModal } from "./InviteMemberModal";
import { MemberItem } from "./MemberItem";

export function MembersSection({ tournamentId }: { tournamentId: string }) {
  const { data, isLoading, isError, error } = useMembers(tournamentId);
  const removeMember = useRemoveMember(tournamentId);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <h2 className="text-base font-bold text-gray-900">Miembros</h2>
        <button
          onClick={() => setInviteOpen(true)}
          className="min-h-9 px-3 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Invitar
        </button>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-400 py-2">Cargando miembros...</p>
      )}

      {isError && (
        <p className="text-sm text-red-600 py-2">
          {getMemberErrorMessage(error)}
        </p>
      )}

      {data && (
        <div className="flex flex-col gap-2">
          {data.members.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              onRemove={() => removeMember.mutate(member.id)}
              isChangingRole={false}
              isRemoving={
                removeMember.isPending && removeMember.variables === member.id
              }
            />
          ))}
        </div>
      )}

      {removeMember.isError && (
        <p className="text-sm text-red-600 mt-2">
          {getMemberErrorMessage(removeMember.error)}
        </p>
      )}

      {inviteOpen && (
        <InviteMemberModal
          tournamentId={tournamentId}
          onClose={() => setInviteOpen(false)}
        />
      )}
    </div>
  );
}
