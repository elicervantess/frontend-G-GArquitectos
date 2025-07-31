import { useState, useCallback } from 'react'
import { buildGoogleAuthUrl } from '@/config/google-oauth'
import { GoogleUser, GoogleAuthResult, GoogleAuthRequestDto, GoogleAuthResponseDto } from '@/types/google-oauth'

// Decodifica un JWT (ID Token) y retorna el payload como objeto
function decodeJwt(token: string) {
  const payload = token.split('.')[1]
  return JSON.parse(atob(payload))
}

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false)

  // Ya no se usa getGoogleUserInfo con fetch
  const getGoogleUserInfo = useCallback(async (idToken: string): Promise<GoogleUser | null> => {
    try {
      const payload = decodeJwt(idToken)
      // Log de depuración: muestra los campos clave del token
      console.log('[Google OAuth] ID Token payload:', {
        aud: payload.aud,
        exp: payload.exp,
        iss: payload.iss,
        email: payload.email,
        sub: payload.sub,
        iat: payload.iat,
        nbf: payload.nbf,
        azp: payload.azp,
        name: payload.name,
        picture: payload.picture
      })
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        given_name: payload.given_name,
        family_name: payload.family_name,
      }
    } catch (error) {
      console.error('Error decoding Google ID token:', error)
      return null
    }
  }, [])

  const validateGoogleToken = useCallback(async (idToken: string, mode: 'login' | 'register'): Promise<{ isValid: boolean; message: string; isNewUser: boolean; token?: string }> => {
    try {
      const requestDto: GoogleAuthRequestDto = {
        token: idToken,
        mode: mode // 🔑 Enviar el modo al backend
      }

      const response = await fetch('http://localhost:8080/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestDto),
      })

      if (!response.ok) {
        return { isValid: false, message: 'Error en la validación del token', isNewUser: false }
      }

      const data: GoogleAuthResponseDto = await response.json()
      
      // El backend retorna "valid" en lugar de "isValid"
      const isValid = data.valid
      const message = data.message || ''
      const jwtToken = data.token // El JWT generado por el backend
      
      // Determinar si es un usuario nuevo basado en el mensaje
      const isNewUser = message?.includes('registrado exitosamente') || false
      
      console.log('🔑 Google Auth Response:', { isValid, message, hasToken: !!jwtToken, isNewUser, mode })
      
      return { 
        isValid, 
        message, 
        isNewUser,
        token: jwtToken
      }
    } catch (error) {
      console.error('Error validating Google token:', error)
      return { isValid: false, message: 'Error de conexión', isNewUser: false }
    }
  }, [])

  const initiateGoogleAuth = useCallback((mode: 'login' | 'register'): void => {
    setIsLoading(true)
    
    // Generar un estado único para identificar el modo
    const state = btoa(JSON.stringify({ mode, timestamp: Date.now() }))
    // Generar un nonce seguro
    const nonce = window.crypto.randomUUID?.() || Math.random().toString(36).substring(2)
    // Construir la URL de autorización
    const authUrl = buildGoogleAuthUrl(state, nonce)
    
    // Abrir la ventana de autorización
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    const popup = window.open(
      authUrl,
      'googleAuth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    )

    if (!popup) {
      setIsLoading(false)
      throw new Error('Popup blocked. Please allow popups for this site.')
    }

    // Escuchar el mensaje del popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        const { idToken } = event.data
        
        try {
          // Obtener información del usuario
          const userInfo = await getGoogleUserInfo(idToken)
          if (!userInfo) {
            throw new Error('Failed to get user info')
          }

          // Validar el token con el backend
          const validationResult = await validateGoogleToken(idToken, mode)
          if (!validationResult.isValid) {
            throw new Error(validationResult.message || 'Invalid token')
          }

          // Emitir evento de éxito con información adicional incluyendo el JWT
          window.dispatchEvent(new CustomEvent('googleAuthSuccess', {
            detail: { 
              user: userInfo, 
              mode,
              message: validationResult.message,
              isNewUser: validationResult.isNewUser,
              jwtToken: validationResult.token // 🔑 Incluir el JWT del backend
            }
          }))

        } catch (error) {
          console.error('Google auth error:', error)
          window.dispatchEvent(new CustomEvent('googleAuthError', {
            detail: { error: error instanceof Error ? error.message : 'Unknown error' }
          }))
        } finally {
          setIsLoading(false)
          popup.close()
          window.removeEventListener('message', handleMessage)
        }
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        setIsLoading(false)
        popup.close()
        window.removeEventListener('message', handleMessage)
        window.dispatchEvent(new CustomEvent('googleAuthError', {
          detail: { error: event.data.error }
        }))
      }
    }

    window.addEventListener('message', handleMessage)

    // Limpiar el listener si el popup se cierra manualmente
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        setIsLoading(false)
        window.removeEventListener('message', handleMessage)
      }
    }, 1000)
  }, [getGoogleUserInfo, validateGoogleToken])

  return {
    initiateGoogleAuth,
    isLoading
  }
} 