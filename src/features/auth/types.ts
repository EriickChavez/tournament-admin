export interface User {
    id: string
    email: string
    name: string
}

export interface LoginPayload {
    email: string
    password: string
}