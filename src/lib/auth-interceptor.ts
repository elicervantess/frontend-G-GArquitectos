// Interceptor para manejar automáticamente errores de autorización
export class AuthInterceptor {
  private static logoutCallback: (() => void) | null = null
  private static isLoggingOut = false

  // Registrar la función de logout
  static setLogoutCallback(callback: () => void) {
    this.logoutCallback = callback
  }

  // Interceptar respuesta y manejar errores de autorización
  static async handleResponse(response: Response, originalUrl?: string): Promise<Response> {
    // Si es 401 o 403, hacer logout automático
    if ((response.status === 401 || response.status === 403) && !this.isLoggingOut) {
      console.warn(`🚨 Error de autorización detectado: ${response.status} en ${originalUrl || 'URL desconocida'}`)
      
      // Evitar múltiples logouts simultáneos
      this.isLoggingOut = true
      
      try {
        // Obtener el mensaje de error si está disponible
        let errorMessage = 'Sesión expirada'
        try {
          const errorData = await response.clone().json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // Si no se puede parsear el JSON, usar mensaje por defecto
        }

        console.log(`🔐 Cerrando sesión automáticamente: ${errorMessage}`)
        
        // Ejecutar logout si hay callback registrado
        if (this.logoutCallback) {
          this.logoutCallback()
        }
        
        // Mostrar notificación al usuario
        this.showLogoutNotification(errorMessage)
        
      } catch (error) {
        console.error('Error durante logout automático:', error)
      } finally {
        // Reset del flag después de un delay para permitir nuevos intentos
        setTimeout(() => {
          this.isLoggingOut = false
        }, 2000)
      }
    }

    return response
  }

  // Mostrar notificación de logout automático
  private static showLogoutNotification(message: string) {
    // Crear evento personalizado para notificar el logout automático
    const event = new CustomEvent('autoLogout', { 
      detail: { 
        message,
        timestamp: new Date().toISOString()
      } 
    })
    window.dispatchEvent(event)
  }

  // Wrapper para fetch que incluye el interceptor
  static async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    try {
      const response = await fetch(url, options)
      return await this.handleResponse(response, url)
    } catch (error) {
      console.error(`Error en fetch interceptado para ${url}:`, error)
      throw error
    }
  }

  // Reset del interceptor (útil para testing o reinicios)
  static reset() {
    this.logoutCallback = null
    this.isLoggingOut = false
  }
}
