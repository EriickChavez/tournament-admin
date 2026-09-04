import { httpClient } from '../../../shared/api/http-client'
import type { User, LoginPayload, PublicUserSummary } from '../types'

interface AuthResponse {
    user: User
}

export const authApi = {
    login: (payload: LoginPayload) => httpClient.post<AuthResponse>('/auth/login', payload),
    logout: () => httpClient.post<void>('/auth/logout'),
    logoutAll: () => httpClient.post<void>('/auth/logout-all'),
    me: () => httpClient.get<AuthResponse>('/auth/me'),
    lookupByEmail: (email: string) =>
        httpClient.get<{ user: PublicUserSummary }>(`/users/lookup?email=${encodeURIComponent(email)}`),
}
