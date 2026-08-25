import { ApiError, NetworkError } from '../../../shared/types/api-error'

export function getCreateTournamentErrorMessage(error: unknown): string {
    if (error instanceof NetworkError) return 'No pudimos conectar con el servidor. Intenta de nuevo.'
    if (error instanceof ApiError) {
        if (error.code === 'SLUG_ALREADY_IN_USE') {
            return 'Ya existe un torneo con un nombre muy similar, prueba con otro nombre'
        }
        return error.message
    }
    return 'Ocurrió un error inesperado'
}
