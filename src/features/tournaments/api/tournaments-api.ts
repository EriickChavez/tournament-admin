import { httpClient } from '../../../shared/api/http-client'
import type { Tournament, CreateTournamentPayload, UpdateTournamentPayload } from '../types'

export const tournamentsApi = {
    create: (payload: CreateTournamentPayload) =>
        httpClient.post<{ tournament: Tournament }>('/tournaments', payload),
    list: () => httpClient.get<{ tournaments: Tournament[] }>('/tournaments'),
    update: (id: string, payload: UpdateTournamentPayload) =>
        httpClient.patch<{ tournament: Tournament }>(`/tournaments/${id}`, payload),

}
