import { ApiError, NetworkError } from '../../../shared/types/api-error'

export function getLoginErrorMessage(error: unknown): string {
    if (error instanceof NetworkError) return 'No pudimos conectar con el servidor. Intenta de nuevo.'

    if (error instanceof ApiError) {
        switch (error.code) {
            case 'INVALID_CREDENTIALS':
                return 'Email o contraseña incorrectos'
            case 'ACCOUNT_SUSPENDED':
                return 'Tu cuenta está suspendida. Contacta al administrador.'
            case 'TOO_MANY_REQUESTS':
                return 'Demasiados intentos, espera un momento'
            default:
                return error.message
        }
    }

    return 'Ocurrió un error inesperado'
}
