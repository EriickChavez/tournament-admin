import { ApiError, NetworkError } from "../../../shared/types/api-error";

export function getCategoryErrorMessage(error: unknown): string {
  if (error instanceof NetworkError)
    return "No pudimos conectar con el servidor. Intenta de nuevo.";
  if (error instanceof ApiError) {
    switch (error.code) {
      case "INVALID_AGE_RANGE":
        return "La edad máxima debe ser mayor o igual a la edad mínima";
      case "NOT_TOURNAMENT_OWNER":
        return "No tienes permisos para gestionar categorías en este torneo";
      case "TOURNAMENT_NOT_FOUND":
        return "El torneo no fue encontrado";
      case "CATEGORY_NOT_FOUND":
        return "La categoría ya no existe";
      default:
        return error.message || "Ocurrió un error en la categoría";
    }
  }
  return "Ocurrió un error inesperado";
}
