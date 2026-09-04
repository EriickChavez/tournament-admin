import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "../api/members-api";

export function useInviteMember(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => membersApi.invite(tournamentId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "members"],
            });
        },
    });
}
