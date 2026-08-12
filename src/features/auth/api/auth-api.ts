import { httpClient } from '../../../shared/api/http-client'
import type { User, LoginPayload } from '../types'

interface AuthResponse {
    user: User
}

export const authApi = {
    login: (payload: LoginPayload) => httpClient.post<AuthResponse>('/auth/login', payload),
    logout: () => httpClient.post<void>('/auth/logout'),
    logoutAll: () => httpClient.post<void>('/auth/logout-all'),
    me: () => httpClient.get<AuthResponse>('/auth/me'),
}
