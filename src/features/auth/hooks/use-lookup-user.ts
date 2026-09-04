import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth-api";
import { ApiError } from "../../../shared/types/api-error";

export function useLookupUser(email: string, enabled: boolean) {
    return useQuery({
        queryKey: ["users", "lookup", email],
        queryFn: () => authApi.lookupByEmail(email),
        enabled: enabled && email.length > 3,
        retry: false,
        staleTime: 30_000,
    });
}

export function isUserNotFound(error: unknown): boolean {
    return error instanceof ApiError && error.code === "USER_NOT_FOUND";
}