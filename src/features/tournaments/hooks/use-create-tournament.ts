import { useMutation } from '@tanstack/react-query'
import { tournamentsApi } from '../api/tournaments-api'

export function useCreateTournament() {
    return useMutation({ mutationFn: tournamentsApi.create })
}
