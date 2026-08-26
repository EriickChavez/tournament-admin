import { z } from 'zod'

export const createTournamentSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(200),
    subtitle: z.string().max(255).optional().or(z.literal('')),
    description: z.string().max(2000).optional().or(z.literal('')),
})


export const editTournamentSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido').max(200),
    subtitle: z.string().max(255).optional().or(z.literal('')),
    description: z.string().max(2000).optional().or(z.literal('')),
})


export type CreateTournamentFormValues = z.infer<typeof createTournamentSchema>
export type EditTournamentFormValues = z.infer<typeof editTournamentSchema>
