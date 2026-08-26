import { useQuery } from '@tanstack/react-query'
import { tournamentsApi } from '../api/tournaments-api'

export function useTournaments() {
    return useQuery({ queryKey: ['tournaments'], queryFn: tournamentsApi.list })
}
