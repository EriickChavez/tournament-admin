import { env } from '../../app/env'
import { ApiError, NetworkError, type ApiErrorShape } from '../types/api-error'

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: unknown
    formData?: FormData
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    let response: Response

    try {
        response = await fetch(`${env.VITE_API_URL}${path}`, {
            method: options.method ?? 'GET',
            credentials: 'include',
            // Con FormData el navegador arma el Content-Type (con boundary) solo;
            // si lo seteamos a mano el multipart se rompe.
            headers: options.formData
                ? undefined
                : options.body
                    ? { 'Content-Type': 'application/json' }
                    : undefined,
            body: options.formData ?? (options.body ? JSON.stringify(options.body) : undefined),
        })
    } catch {
        throw new NetworkError()
    }

    if (response.status === 204) {
        return undefined as T
    }

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const shape = data as ApiErrorShape | null
        throw new ApiError(
            shape?.error?.code ?? 'UNKNOWN_ERROR',
            shape?.error?.message ?? 'Ocurrió un error inesperado',
            shape?.error?.details,
            response.status,
        )
    }

    return data as T
}

export const httpClient = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
    postForm: <T>(path: string, formData: FormData) =>
        request<T>(path, { method: 'POST', formData }),
    patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
    patchForm: <T>(path: string, formData: FormData) =>
        request<T>(path, { method: 'PATCH', formData }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}