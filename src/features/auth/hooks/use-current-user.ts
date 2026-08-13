import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import { ApiError } from '../../../shared/types/api-error'

export function useCurrentUser() {
    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: authApi.me,
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (error instanceof ApiError && error.status === 401) return false
            return failureCount < 2
        },
    })
}