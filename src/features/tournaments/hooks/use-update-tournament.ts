import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentsApi } from '../api/tournaments-api'
import type { UpdateTournamentPayload } from '../types'

export function useUpdateTournament(id: string) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: UpdateTournamentPayload) => tournamentsApi.update(id, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tournaments'] }),
    })
}
