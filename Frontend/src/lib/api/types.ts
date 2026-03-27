// Base compartida
export interface BaseUser {
  id: number
  name: string
  email: string
  role?: string
}

export interface AdminUser extends BaseUser {
  role: 'admin'
}

export interface VeterinarioUser extends BaseUser {
  role: 'veterinario'
  id_veterinario: number | null
  especialidad?: string
}

export interface ClienteUser extends BaseUser {
  role: 'cliente'
  telefono?: string
}

// Union type — el que se usa en toda la app
export type User = AdminUser | VeterinarioUser | ClienteUser

// Type guards — para chequear el rol con seguridad
export function isVeterinario(user: User | null): user is VeterinarioUser {
  return user?.role === 'veterinario'
}

export function isAdmin(user: User | null): user is AdminUser {
  return user?.role === 'admin'
}

export function isCliente(user: User | null): user is ClienteUser {
  return user?.role === 'cliente'
}

// Auth payloads
export interface AuthLoginPayload {
  email: string
  password: string
}

export interface AuthRegisterPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  telefono?: string
}

export interface AuthResponse {
  token?: string
  access_token?: string
  user?: User
}