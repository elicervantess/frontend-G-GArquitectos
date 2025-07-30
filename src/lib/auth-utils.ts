/**
 * Utilidades para manejo de errores de autenticación
 */

export interface AuthError {
  field?: 'email' | 'password' | 'general'
  message: string
}

/**
 * Analiza el mensaje de error del backend y determina a qué campo pertenece
 * @param errorMessage - Mensaje de error del backend
 * @returns Objeto con el campo y mensaje de error
 */
export function parseAuthError(errorMessage: string): AuthError {
  const message = errorMessage.toLowerCase()
  
  // Errores específicos de email
  if (message.includes('email') || 
      message.includes('correo') || 
      message.includes('usuario') ||
      message.includes('not found') ||
      message.includes('already exist')) {
    return {
      field: 'email',
      message: errorMessage
    }
  }
  
  // Errores específicos de contraseña
  if (message.includes('password') || 
      message.includes('contraseña') ||
      message.includes('invalid password')) {
    return {
      field: 'password',
      message: errorMessage
    }
  }
  
  // Errores generales
  return {
    field: 'general',
    message: errorMessage
  }
}

/**
 * Mapea los errores del backend a mensajes de usuario
 * @param errorMessage - Mensaje de error del backend
 * @returns Mensaje traducido para el usuario
 */
export function translateAuthError(errorMessage: string): string {
  const message = errorMessage.toLowerCase()
  
  // Mapeo de errores específicos del backend
  const errorMap: Record<string, string> = {
    'email not found': 'Email no encontrado',
    'email already exist': 'Este email ya está registrado',
    'invalid password': 'Contraseña incorrecta',
    'invalid credentials': 'Credenciales inválidas',
    'user not found': 'Usuario no encontrado',
    'password is required': 'La contraseña es requerida',
    'email is required': 'El email es requerido',
    'name is required': 'El nombre es requerido'
  }
  
  // Buscar coincidencia exacta
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value
    }
  }
  
  // Si no hay coincidencia, devolver el mensaje original
  return errorMessage
} 