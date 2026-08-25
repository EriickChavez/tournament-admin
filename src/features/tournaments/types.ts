export interface Tournament {
    id: string
    name: string
    subtitle?: string
    description?: string
    slug: string
}

export interface CreateTournamentPayload {
    name: string
    subtitle?: string
    description?: string
}
