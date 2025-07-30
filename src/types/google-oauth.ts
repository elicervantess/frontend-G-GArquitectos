export interface GoogleUser {
  id: string
  email: string
  name: string
  picture?: string
  given_name?: string
  family_name?: string
}

export interface GoogleAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
  authuser: string
  prompt: string
}

export interface GoogleAuthRequestDto {
  token: string
}

export interface GoogleAuthResponseDto {
  valid: boolean // Cambiado de isValid a valid para compatibilidad con el backend
  message?: string // Campo opcional para mensajes de respuesta
}

export interface GoogleAuthResult {
  success: boolean
  user?: GoogleUser
  error?: string
} 