import { httpClient } from '../../../shared/api/http-client'
import type { Tournament, CreateTournamentPayload } from '../types'

export const tournamentsApi = {
    create: (payload: CreateTournamentPayload) =>
        httpClient.post<{ tournament: Tournament }>('/tournaments', payload),
}
