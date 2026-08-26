export interface Tournament {
    id: string
    name: string
    subtitle?: string
    description?: string
    slug: string
    roleId: string
}

export interface CreateTournamentPayload {
    name: string
    subtitle?: string
    description?: string
}

export type UpdateTournamentPayload = Partial<CreateTournamentPayload>