import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export const useTokenExpiration = () => {
  const { token, logout } = useAuth()
  const checkInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!token) {
      // Limpiar intervalo si no hay token
      if (checkInterval.current) {
        clearInterval(checkInterval.current)
        checkInterval.current = null
      }
      return
    }

    const checkTokenExpiration = () => {
      try {
        // Decodificar el token para obtener la expiración
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expirationTime = payload.exp * 1000 // Convertir a milisegundos
        const currentTime = Date.now()

        if (currentTime >= expirationTime) {
          console.log('⏰ Token expired, logging out automatically')
          logout()
        } else {
          const timeUntilExpiration = expirationTime - currentTime
          const minutesUntilExpiration = Math.floor(timeUntilExpiration / (1000 * 60))
          
          if (minutesUntilExpiration <= 5) {
            console.log(`⚠️ Token expires in ${minutesUntilExpiration} minutes`)
          }
        }
      } catch (error) {
        console.error('Error checking token expiration:', error)
        // Si hay error decodificando el token, hacer logout
        logout()
      }
    }

    // Verificar inmediatamente
    checkTokenExpiration()

    // Verificar cada minuto
    checkInterval.current = setInterval(checkTokenExpiration, 60 * 1000)

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current)
        checkInterval.current = null
      }
    }
  }, [token, logout])

  return { checkInterval: checkInterval.current }
} 