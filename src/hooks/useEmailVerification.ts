'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface RegisterWithVerificationData {
  fullName: string
  email: string
  password: string
}

interface UseEmailVerificationReturn {
  registerWithVerification: (data: RegisterWithVerificationData) => Promise<{ success: boolean; message: string }>
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; token?: string; message: string }>
  resendVerificationCode: (email: string) => Promise<{ success: boolean; message: string }>
  clearError: () => void
  isLoading: boolean
  error: string | null
}

export function useEmailVerification(): UseEmailVerificationReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { loginWithToken, updateUserProfile } = useAuth()
  
  // URL directa a tu backend Spring Boot
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

  const registerWithVerification = async (data: RegisterWithVerificationData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${backendUrl}/auth/register-with-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.fullName, // Usando fullName como name
          fullName: data.fullName, // También enviamos fullName por si el backend lo usa
          email: data.email,
          password: data.password,
          role: 'USER'
        })
      })

      // Verificar el content-type para decidir cómo parsear la respuesta
      const contentType = response.headers.get('content-type')
      let result: any = {}
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        // Si es text/plain, obtener el texto directamente
        const textResult = await response.text()
        result = { message: textResult }
      }

      if (!response.ok) {
        const errorMessage = result.message || 'Error al registrar usuario'
        setError(errorMessage)
        return { success: false, message: errorMessage }
      }

      return { 
        success: true, 
        message: result.message || 'Código de verificación enviado exitosamente' 
      }

    } catch (err) {
      const errorMessage = 'Error de conexión. Intenta de nuevo.'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (email: string, code: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${backendUrl}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          verificationCode: code
        })
      })

      // Verificar el content-type para decidir cómo parsear la respuesta
      const contentType = response.headers.get('content-type')
      let result: any = {}
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        // Si es text/plain, obtener el texto directamente
        const textResult = await response.text()
        result = { message: textResult }
      }

      if (!response.ok) {
        let errorMessage = 'Error al verificar el código'
        
        if (response.status === 400) {
          // Usar el mensaje exacto del backend
          errorMessage = result.message || 'Código incorrecto. Vuelve a intentarlo.'
        } else if (response.status === 429) {
          errorMessage = result.message || 'Demasiados intentos. Intenta de nuevo más tarde.'
        } else if (response.status === 410) {
          errorMessage = result.message || 'El código ha expirado. Solicita uno nuevo.'
        }

        setError(errorMessage)
        return { success: false, message: errorMessage }
      }

      // Automatically log in the user after successful verification
      if (result.token) {
        console.log('🔐 Token recibido, iniciando proceso de login automático...')
        
        // Decodificar el token para obtener los datos del usuario
        try {
          // Usar la función helper para obtener los datos del token
          const tokenPayload = JSON.parse(atob(result.token.split('.')[1]))
          
          // Hacer una llamada adicional para obtener los datos completos del usuario
          try {
            const userResponse = await fetch(`${backendUrl}/users/me`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${result.token}`,
                'Content-Type': 'application/json',
              },
            })
            
            if (userResponse.ok) {
              const userDataFromBackend = await userResponse.json()
              console.log('Datos del usuario desde /users/me:', userDataFromBackend)
              
              const completeUserData = {
                id: userDataFromBackend.id,
                email: userDataFromBackend.email,
                name: userDataFromBackend.fullName, // El DTO usa fullName
                fullName: userDataFromBackend.fullName,
                role: userDataFromBackend.role,
                profileImage: userDataFromBackend.profileImage,
                lastPasswordUpdate: userDataFromBackend.lastPasswordUpdate,
                provider: userDataFromBackend.provider || 'EMAIL'
              }
              
              console.log('Datos completos para loginWithToken:', completeUserData)
              await loginWithToken(result.token, completeUserData)
              
              // Actualizar inmediatamente el perfil para forzar la re-renderización
              updateUserProfile(completeUserData)
              
              console.log('✅ Usuario logueado y perfil actualizado correctamente')
            } else {
              console.error('❌ Error al obtener /users/me, status:', userResponse.status)
              const errorText = await userResponse.text()
              console.error('❌ Error response:', errorText)
              
              // Fallback: usar datos del token
              const userData = {
                id: tokenPayload.sub || tokenPayload.userId,
                email: tokenPayload.email || email,
                name: tokenPayload.fullName || tokenPayload.name || 'Usuario',
                fullName: tokenPayload.fullName || tokenPayload.name || 'Usuario',
                role: tokenPayload.role || 'USER',
                profileImage: tokenPayload.profileImage,
                provider: 'EMAIL'
              }
              console.log('⚠️ Usando fallback con datos del token:', userData)
              await loginWithToken(result.token, userData)
            }
          } catch (userFetchError) {
            console.error('Error al obtener datos del usuario:', userFetchError)
            // Fallback: usar datos del token
            const userData = {
              id: tokenPayload.sub || tokenPayload.userId,
              email: tokenPayload.email || email,
              name: tokenPayload.fullName || tokenPayload.name || 'Usuario',
              fullName: tokenPayload.fullName || tokenPayload.name || 'Usuario',
              role: tokenPayload.role || 'USER',
              profileImage: tokenPayload.profileImage,
              provider: 'EMAIL'
            }
            console.log('⚠️ Error al obtener /users/me, usando fallback:', userData)
            await loginWithToken(result.token, userData)
          }
        } catch (tokenError) {
          console.error('Error al decodificar token:', tokenError)
          // Fallback con datos básicos
          await loginWithToken(result.token, { 
            email, 
            name: 'Usuario',
            fullName: 'Usuario',
            provider: 'EMAIL'
          })
        }
      }

      return { 
        success: true, 
        token: result.token,
        message: result.message || '¡Email verificado exitosamente!' 
      }

    } catch (err) {
      const errorMessage = 'Error de conexión. Intenta de nuevo.'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerificationCode = async (email: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${backendUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      // Verificar el content-type para decidir cómo parsear la respuesta
      const contentType = response.headers.get('content-type')
      let result: any = {}
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        // Si es text/plain, obtener el texto directamente
        const textResult = await response.text()
        result = { message: textResult }
      }

      if (!response.ok) {
        let errorMessage = 'Error al reenviar el código'
        
        if (response.status === 429) {
          errorMessage = result.message || 'Debes esperar antes de solicitar otro código'
        } else if (response.status === 404) {
          errorMessage = result.message || 'Email no encontrado'
        } else {
          errorMessage = result.message || errorMessage
        }

        setError(errorMessage)
        return { success: false, message: errorMessage }
      }

      return { 
        success: true, 
        message: result.message || 'Código reenviado exitosamente' 
      }

    } catch (err) {
      const errorMessage = 'Error de conexión. Intenta de nuevo.'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    registerWithVerification,
    verifyEmail,
    resendVerificationCode,
    clearError,
    isLoading,
    error
  }
}
