import { ApiError, NetworkError } from '../../../shared/types/api-error'

export function getTournamentErrorMessage(error: unknown): string {
    if (error instanceof NetworkError) return 'No pudimos conectar con el servidor. Intenta de nuevo.'
    if (error instanceof ApiError) {
        switch (error.code) {
            case 'SLUG_ALREADY_IN_USE':
                return 'Ya existe un torneo con un nombre muy similar, prueba con otro nombre'
            case 'NOT_TOURNAMENT_OWNER':
                return 'No tienes permisos para editar este torneo'
            case 'TOURNAMENT_NOT_FOUND':
                return 'Este torneo ya no existe'
            default:
                return error.message
        }
    }
    return 'Ocurrió un error inesperado'
}