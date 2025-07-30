"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { decodeJWT, isTokenValid, getUserFromToken } from '@/lib/jwt'
import { GoogleUser } from '@/types/google-oauth'

interface User {
  id: string
  email: string
  name: string
  role: string
  // Agregar más campos según tu backend
}

// DTOs que coinciden con tu backend
interface LoginDto {
  email: string
  password: string
}

interface SigninDto {
  email: string
  name: string
  password: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: (googleUser: GoogleUser) => Promise<{ success: boolean; error?: string }>
  registerWithGoogle: (googleUser: GoogleUser) => Promise<{ success: boolean; error?: string }>
  handleGoogleAuth: (googleUser: GoogleUser, isNewUser?: boolean) => Promise<{ success: boolean; error?: string; isNewUser?: boolean; message?: string }>
  logout: () => void
  logoutWithBackend: () => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken && isTokenValid(savedToken)) {
      const userData = getUserFromToken(savedToken)
      if (userData) {
        setToken(savedToken)
        setUser(userData)
      } else {
        localStorage.removeItem('token')
      }
    } else if (savedToken) {
      // Token expirado o inválido
      localStorage.removeItem('token')
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      
      const loginDto: LoginDto = {
        email,
        password
      }
      
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDto),
      })

      if (!response.ok) {
        // Leer el body una sola vez como texto
        const errorText = await response.text()
        console.log('Login error response:', errorText)
        
        // Intentar parsear como JSON si es posible
        try {
          const data = JSON.parse(errorText)
          return { success: false, error: data.message || data.error || 'Error al iniciar sesión' }
        } catch (parseError) {
          // Si no es JSON válido, usar el texto directamente
          return { success: false, error: errorText || 'Error al iniciar sesión' }
        }
      }

      // Si la respuesta es exitosa, leer como JSON
      const data = await response.json()
      console.log('Login response:', data)

      // Extraer token y datos del usuario
      const token = data.token || data.accessToken
      if (!token) {
        return { success: false, error: 'No se recibió token de autenticación' }
      }

      const userData = getUserFromToken(token)
      if (!userData) {
        return { success: false, error: 'Token inválido' }
      }

      // Guardar token y usuario
      setToken(token)
      setUser(userData)
      localStorage.setItem('token', token)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Error de conexión' }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: string = 'USER') => {
    try {
      setIsLoading(true)
      
      const signinDto: SigninDto = {
        email,
        name,
        password,
        role
      }
      
      const response = await fetch('http://localhost:8080/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signinDto),
      })

      if (!response.ok) {
        // Leer el body una sola vez como texto
        const errorText = await response.text()
        console.log('Register error response:', errorText)
        
        // Intentar parsear como JSON si es posible
        try {
          const data = JSON.parse(errorText)
          return { success: false, error: data.message || data.error || 'Error al registrarse' }
        } catch (parseError) {
          // Si no es JSON válido, usar el texto directamente
          return { success: false, error: errorText || 'Error al registrarse' }
        }
      }

      // Si la respuesta es exitosa, leer como JSON
      const data = await response.json()
      console.log('Register response:', data)

      // Extraer token y datos del usuario
      const token = data.token || data.accessToken
      if (!token) {
        return { success: false, error: 'No se recibió token de autenticación' }
      }

      const userData = getUserFromToken(token)
      if (!userData) {
        return { success: false, error: 'Token inválido' }
      }

      // Guardar token y usuario
      setToken(token)
      setUser(userData)
      localStorage.setItem('token', token)
      
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      return { success: false, error: 'Error de conexión' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const logoutWithBackend = async () => {
    try {
      // Llamar al endpoint de logout del backend
      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Incluir el token actual
        },
      })

      if (response.ok) {
        console.log('Logout exitoso en el backend')
      } else {
        console.warn('Error en logout del backend:', response.status)
      }
    } catch (error) {
      console.error('Error al hacer logout en el backend:', error)
    } finally {
      // Siempre limpiar el estado local, independientemente del resultado del backend
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
    }
  }

  const loginWithGoogle = async (googleUser: GoogleUser) => {
    try {
      setIsLoading(true)
      
      // Por ahora, simular el login con Google
      // En el futuro, esto debería hacer una llamada al backend
      const userData = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        role: 'USER'
      }

      // Simular token (en producción, el backend debería generar uno)
      const mockToken = btoa(JSON.stringify(userData))
      
      setToken(mockToken)
      setUser(userData)
      localStorage.setItem('token', mockToken)
      
      return { success: true }
    } catch (error) {
      console.error('Google login error:', error)
      return { success: false, error: 'Error al iniciar sesión con Google' }
    } finally {
      setIsLoading(false)
    }
  }

  const registerWithGoogle = async (googleUser: GoogleUser) => {
    try {
      setIsLoading(true)
      
      // Por ahora, simular el registro con Google
      // En el futuro, esto debería hacer una llamada al backend
      const userData = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        role: 'USER'
      }

      // Simular token (en producción, el backend debería generar uno)
      const mockToken = btoa(JSON.stringify(userData))
      
      setToken(mockToken)
      setUser(userData)
      localStorage.setItem('token', mockToken)
      
      return { success: true }
    } catch (error) {
      console.error('Google register error:', error)
      return { success: false, error: 'Error al registrarse con Google' }
    } finally {
      setIsLoading(false)
    }
  }

  // Nueva función unificada para manejar Google Auth
  const handleGoogleAuth = async (googleUser: GoogleUser, isNewUser: boolean = false) => {
    try {
      setIsLoading(true)
      
      // Crear datos del usuario
      const userData = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        role: 'USER'
      }

      // Simular token (en producción, el backend debería generar uno)
      const mockToken = btoa(JSON.stringify(userData))
      
      setToken(mockToken)
      setUser(userData)
      localStorage.setItem('token', mockToken)
      
      return { 
        success: true, 
        isNewUser,
        message: isNewUser 
          ? '¡Registro con Google exitoso!' 
          : '¡Inicio de sesión con Google exitoso!'
      }
    } catch (error) {
      console.error('Google auth error:', error)
      return { 
        success: false, 
        error: 'Error en la autenticación con Google',
        isNewUser: false 
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshToken = async () => {
    // Implementar refresh token si es necesario
    console.log('Refresh token functionality')
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    token,
    login,
    register,
    loginWithGoogle,
    registerWithGoogle,
    handleGoogleAuth,
    logout,
    logoutWithBackend,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 