import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "../api/members-api";

export function useUpdateMemberRole(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (memberId: string) => membersApi.updateRole(tournamentId, memberId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "members"],
            });
        },
    });
}
