import { useState } from 'react'

interface ForgotPasswordRequest {
  email: string
}

interface ForgotPasswordResponse {
  success: boolean
  message: string
  cooldownMinutes: number
}

interface ResetPasswordRequest {
  token: string
  newPassword: string
}

interface ResetPasswordResponse {
  success: boolean
  message: string
  token?: string // NUEVO: Token JWT para auto-login
  user?: {      // NUEVO: Información del usuario
    id: number
    fullName: string
    email: string
    role: string
    profileImage: string
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔐 Enviando solicitud de recuperación de contraseña para:', email)
      
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log('📧 Respuesta del servidor:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Error al solicitar recuperación de contraseña')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('❌ Error en forgot password:', errorMessage)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔑 Enviando solicitud de reset de contraseña con token:', token.substring(0, 8) + '...')
      
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()
      console.log('✅ Respuesta del servidor:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer contraseña')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('❌ Error en reset password:', errorMessage)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // NUEVO: Función para verificar si un token ya fue usado
  const checkResetToken = async (token: string): Promise<{valid: boolean, used?: boolean, expired?: boolean, message: string}> => {
    try {
      console.log('🔍 Verificando token de reset:', token)
      
      const response = await fetch(`${API_BASE_URL}/auth/check-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Verificación de token exitosa:', data)
      
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('❌ Error al verificar token:', errorMessage)
      
      return {
        valid: false,
        message: 'Error al verificar el token'
      }
    }
  }

  const clearError = () => setError(null)

  return {
    forgotPassword,
    resetPassword,
    checkResetToken, // NUEVA función exportada
    isLoading,
    error,
    clearError,
  }
}
