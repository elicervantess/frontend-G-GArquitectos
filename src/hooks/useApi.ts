import { useAuth } from '@/contexts/AuthContext'

export function useApi() {
  const { token, logout } = useAuth()

  const apiCall = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Agregar token de autorización si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Si el token expiró (401), hacer logout automático
    if (response.status === 401) {
      logout()
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    }

    return response
  }

  const get = (url: string) => apiCall(url, { method: 'GET' })
  const post = (url: string, data?: any) => apiCall(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
  const put = (url: string, data?: any) => apiCall(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
  const del = (url: string) => apiCall(url, { method: 'DELETE' })

  return {
    apiCall,
    get,
    post,
    put,
    delete: del,
  }
} 