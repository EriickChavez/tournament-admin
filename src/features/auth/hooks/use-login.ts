import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth-api'
import type { LoginPayload } from '../types'

export function useLogin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: LoginPayload) => authApi.login(payload),
        onSuccess: (data) => {
            queryClient.setQueryData(['auth', 'me'], data)
        },
    })
}
