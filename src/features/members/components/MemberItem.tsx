import type { Member } from "../types";

export function MemberItem({
  member,
  onRemove,
  isChangingRole,
  isRemoving,
}: {
  member: Member;
  onRemove: () => void;
  isChangingRole: boolean;
  isRemoving: boolean;
}) {
  const isOwner = member.roleName === "OWNER";

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
          {member.displayName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {member.displayName}
          </p>
          <p className="text-xs text-gray-400">
            {member.roleName === "OWNER" ? "Dueño" : "Admin"}
          </p>
        </div>
      </div>

      {!isOwner && (
        <div className="flex items-center gap-2">
          <button
            onClick={onRemove}
            disabled={isRemoving || isChangingRole}
            className="min-h-8 px-3 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            Quitar
          </button>
        </div>
      )}
    </div>
  );
}
