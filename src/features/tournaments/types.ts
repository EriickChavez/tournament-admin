export interface Tournament {
    id: string
    name: string
    subtitle?: string
    description?: string
    slug: string
    roleId: string
    startDate?: string | null
    endDate?: string | null
    timezone?: string
}

export interface CreateTournamentPayload {
    name: string
    subtitle?: string
    description?: string
    startDate?: string
    endDate?: string
    timezone?: string
}

export type UpdateTournamentPayload = Partial<CreateTournamentPayload>