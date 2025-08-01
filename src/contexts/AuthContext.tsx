"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { decodeJWT, isTokenValid, getUserFromToken } from '@/lib/jwt'
import { GoogleUser } from '@/types/google-oauth'
import { useUserApi } from '@/hooks/useUserApi'

interface User {
  id: string
  email: string
  name: string
  role: string
  profileImage?: string // Agregamos la foto de perfil
  lastPasswordUpdate?: string // ISO timestamp para la última actualización de contraseña
  provider?: string // Para identificar el método de autenticación
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
  handleGoogleAuth: (googleUser: GoogleUser, isNewUser?: boolean, jwtToken?: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean; message?: string }>
  logout: () => void
  logoutWithBackend: () => Promise<void>
  updateUserProfile: (updatedUserData: any) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { getCurrentUser: getCurrentUserFromApi } = useUserApi()

  // Debug: Log cada vez que el usuario cambie
  useEffect(() => {
    console.log('🔄 User state updated:', {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
      profileImage: user?.profileImage ? 'HAS_IMAGE' : 'NO_IMAGE'
    })
  }, [user])

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken && isTokenValid(savedToken)) {
      const userData = getUserFromToken(savedToken)
      if (userData) {
        setToken(savedToken)
        setUser(userData)
        
        // Obtener datos completos del usuario desde el backend
        getCurrentUserFromApi(savedToken)
          .then(backendUserData => {
            if (backendUserData) {
              setUser({
                id: backendUserData.id.toString(),
                email: backendUserData.email,
                name: backendUserData.fullName,
                role: backendUserData.role,
                profileImage: backendUserData.profileImage,
                lastPasswordUpdate: backendUserData.lastPasswordUpdate,
                provider: backendUserData.profileImage?.includes('googleusercontent.com') ? 'GOOGLE' : 'EMAIL'
              })
            }
          })
          .catch(error => {
            console.log('Error obteniendo datos del usuario al cargar:', error)
          })
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
      
      // Obtener datos completos del usuario desde el backend inmediatamente
      try {
        console.log('🔄 Obteniendo datos completos del usuario...')
        const backendUserData = await getCurrentUserFromApi(token)
        if (backendUserData) {
          console.log('✅ Actualizando usuario con datos del backend:', backendUserData)
          const updatedUser = {
            id: backendUserData.id.toString(),
            email: backendUserData.email,
            name: backendUserData.fullName,
            role: backendUserData.role,
            profileImage: backendUserData.profileImage,
            provider: backendUserData.profileImage?.includes('googleusercontent.com') ? 'GOOGLE' : 'EMAIL'
          }
          console.log('👤 Nuevo objeto usuario a guardar:', updatedUser)
          setUser(updatedUser)
          console.log('✅ setUser ejecutado con profileImage:', updatedUser.profileImage)
        }
      } catch (error) {
        console.log('Error obteniendo datos del usuario:', error)
      }
      
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
      
      // Obtener datos completos del usuario desde el backend inmediatamente
      try {
        console.log('🔄 Obteniendo datos completos del usuario (register)...')
        const backendUserData = await getCurrentUserFromApi(token)
        if (backendUserData) {
          console.log('✅ Actualizando usuario con datos del backend (register):', backendUserData)
          setUser({
            id: backendUserData.id.toString(),
            email: backendUserData.email,
            name: backendUserData.fullName,
            role: backendUserData.role,
            profileImage: backendUserData.profileImage,
            lastPasswordUpdate: backendUserData.lastPasswordUpdate,
            provider: backendUserData.profileImage?.includes('googleusercontent.com') ? 'GOOGLE' : 'EMAIL'
          })
        }
      } catch (error) {
        console.log('Error obteniendo datos del usuario (register):', error)
      }
      
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
      
      // ⚠️ IMPORTANTE: Este Google OAuth necesita integrarse con el backend
      // Por ahora, NO establecer token hasta que esté integrado con backend
      console.warn('🚨 Google OAuth no está integrado con el backend aún')
      
      const userData = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        role: 'USER'
      }

      // NO crear token simulado - esto causa el error en el backend
      setUser(userData)
      // NO guardar token hasta que esté integrado con backend
      
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
      
      // ⚠️ IMPORTANTE: Este Google OAuth necesita integrarse con el backend
      // Por ahora, NO establecer token hasta que esté integrado con backend
      console.warn('🚨 Google OAuth no está integrado con el backend aún')
      
      const userData = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        role: 'USER'
      }

      // NO crear token simulado - esto causa el error en el backend
      setUser(userData)
      // NO guardar token hasta que esté integrado con backend
      
      return { success: true }
    } catch (error) {
      console.error('Google register error:', error)
      return { success: false, error: 'Error al registrarse con Google' }
    } finally {
      setIsLoading(false)
    }
  }

  // Nueva función unificada para manejar Google Auth con JWT token
  const handleGoogleAuth = async (googleUser: GoogleUser, isNewUser: boolean = false, jwtToken?: string) => {
    try {
      setIsLoading(true)
      
      if (!jwtToken) {
        console.error('❌ No JWT token provided from Google Auth')
        return { 
          success: false, 
          error: 'No se recibió token de autenticación',
          isNewUser: false 
        }
      }

      // Verificar que el JWT token sea válido
      const userData = getUserFromToken(jwtToken)
      if (!userData) {
        console.error('❌ Invalid JWT token from Google Auth')
        return { 
          success: false, 
          error: 'Token de autenticación inválido',
          isNewUser: false 
        }
      }

      console.log('✅ Valid JWT token received from Google Auth:', { userData })

      // Guardar token y usuario
      setToken(jwtToken)
      setUser(userData)
      localStorage.setItem('token', jwtToken)
      
      // Obtener datos completos del usuario desde el backend inmediatamente
      try {
        console.log('🔄 Obteniendo datos completos del usuario de Google...')
        const backendUserData = await getCurrentUserFromApi(jwtToken)
        if (backendUserData) {
          console.log('✅ Actualizando usuario de Google con datos del backend:', backendUserData)
          const updatedUser = {
            id: backendUserData.id.toString(),
            email: backendUserData.email,
            name: backendUserData.fullName,
            role: backendUserData.role,
            profileImage: backendUserData.profileImage, // 🖼️ Imagen de perfil de Google
            provider: 'GOOGLE' // Los usuarios de Google siempre tienen provider GOOGLE
          }
          setUser(updatedUser)
        }
      } catch (apiError) {
        console.warn('⚠️ Error obteniendo datos del usuario de Google, usando datos del token:', apiError)
        // Continuar con los datos del token si falla la API
      }
      
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

  const updateUserProfile = (updatedUserData: any) => {
    if (updatedUserData && user) {
      console.log('🔄 Updating user profile in context:', updatedUserData)
      setUser({
        id: updatedUserData.id?.toString() || user.id,
        email: updatedUserData.email || user.email,
        name: updatedUserData.fullName || user.name,
        role: updatedUserData.role || user.role,
        profileImage: updatedUserData.profileImage || user.profileImage,
        lastPasswordUpdate: updatedUserData.lastPasswordUpdate || user.lastPasswordUpdate,
        provider: user.provider // Mantener el provider existente
      })
    }
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
    updateUserProfile,
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