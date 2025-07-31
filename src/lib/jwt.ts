// Utilidades para manejar JWT en el frontend

interface JWTPayload {
  sub: string
  role: string
  fullName: string
  exp: number
  iat: number
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    // JWT tiene formato: Header.Payload.Signature
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

export function isTokenValid(token: string): boolean {
  try {
    const payload = decodeJWT(token)
    if (!payload) return false
    
    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp > currentTime
  } catch (error) {
    return false
  }
}

export function getTokenExpirationTime(token: string): Date | null {
  try {
    const payload = decodeJWT(token)
    if (!payload) return null
    
    return new Date(payload.exp * 1000) // Convertir de timestamp a Date
  } catch (error) {
    return null
  }
}

export function getUserFromToken(token: string) {
  try {
    const payload = decodeJWT(token)
    if (!payload) return null
    
    return {
      id: payload.sub,
      email: payload.sub,
      name: payload.fullName,
      role: payload.role
    }
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

export function createAuthHeaders(token: string) {
  console.log('🔑 Creating auth headers with token:', token)
  console.log('🔍 Token parts count:', token.split('.').length)
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
} 


