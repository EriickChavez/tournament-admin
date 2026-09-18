import { useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "../api/members-api";
import type { CreateMemberAccountPayload } from "../types";

export function useCreateMemberAccount(tournamentId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateMemberAccountPayload) =>
            membersApi.createAccount(tournamentId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tournaments", tournamentId, "members"],
            });
        },
    });
}