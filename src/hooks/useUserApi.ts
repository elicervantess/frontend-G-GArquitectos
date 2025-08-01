import { UserResponseDto } from '@/types/user'
import { createAuthHeaders } from '@/lib/jwt'
import { AuthInterceptor } from '@/lib/auth-interceptor'

// Interfaces para los DTOs
export interface UserRequestDto {
  fullName?: string
  email?: string
  password?: string
  role?: string
}

export interface UserPasswordVerificationRequestDto {
  email: string
  password: string
}

// Interface para respuestas con manejo de errores
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export const useUserApi = () => {
  const getCurrentUser = async (token: string): Promise<UserResponseDto> => {
    console.log('🔍 Calling /users/me endpoint with token:', token?.substring(0, 20) + '...')
    
    const response = await AuthInterceptor.fetch('http://localhost:8080/users/me', {
      method: 'GET',
      headers: createAuthHeaders(token)
    })
    
    // Si es 401 o 403, significa que el usuario fue eliminado o token inválido
    if (response.status === 401 || response.status === 403) {
      throw new Error(`User not found or unauthorized: ${response.status}`)
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('📦 Response from /users/me:', data)
    
    return data
  }

  const updateCurrentUser = async (token: string, userRequestDto: UserRequestDto): Promise<ApiResponse<UserResponseDto>> => {
    console.log('🔄 Updating current user with data:', {
      ...userRequestDto,
      password: userRequestDto.password ? '[HIDDEN]' : 'NOT_PROVIDED'
    })
    
    const requestBody = JSON.stringify(userRequestDto)
    console.log('📤 Request body (raw):', requestBody)
    
    const response = await AuthInterceptor.fetch('http://localhost:8080/users/edit/me', {
      method: 'PUT',
      headers: {
        ...createAuthHeaders(token),
        'Content-Type': 'application/json',
      },
      body: requestBody
    })
    
    console.log('📡 Response status:', response.status, response.statusText)
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      let errorMessage = `Error al actualizar usuario: ${response.status} ${response.statusText}`
      
      // Verificar el Content-Type para manejar correctamente la respuesta
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        // Respuesta JSON
        try {
          const errorData = await response.json()
          const message = errorData.message || errorData.error || errorData.detail || errorData.title
          errorMessage = message || errorMessage
        } catch (parseError) {
          errorMessage = `Error del servidor: ${response.status}`
        }
      } else {
        // Respuesta de texto plano
        try {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        } catch (parseError) {
          errorMessage = `Error del servidor: ${response.status}`
        }
      }
      
      // 🚫 NO lanzar excepción - devolver objeto de error
      return {
        success: false,
        error: errorMessage
      }
    }
    
    // Manejar respuesta exitosa (debería ser JSON)
    let data
    try {
      data = await response.json()
      console.log('✅ User updated successfully:', data)
      return {
        success: true,
        data: data
      }
    } catch (parseError) {
      console.error('❌ Cannot parse success response as JSON:', parseError)
      return {
        success: false,
        error: 'La respuesta del servidor no es válida'
      }
    }
  }

  const verifyPassword = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Verifying password for email:', email)
    
    const response = await AuthInterceptor.fetch('http://localhost:8080/auth/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })
    
    if (!response.ok) {
      let errorMessage = `Error al verificar contraseña: ${response.status} ${response.statusText}`
      
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (parseError) {
          errorMessage = `Error del servidor: ${response.status}`
        }
      } else {
        try {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        } catch (parseError) {
          errorMessage = `Error del servidor: ${response.status}`
        }
      }
      
      throw new Error(errorMessage)
    }
    
    let isValid
    try {
      isValid = await response.json()
    } catch (parseError) {
      console.error('❌ Cannot parse password verification response as JSON:', parseError)
      throw new Error('La respuesta del servidor no es válida')
    }
    
    console.log(isValid ? '✅ Password verified' : '❌ Invalid password')
    return Boolean(isValid)
  }

  const updateProfilePhoto = async (token: string, userId: string, photoFile: File): Promise<ApiResponse<UserResponseDto>> => {
    console.log('📸 Uploading profile photo for user:', userId)
    
    try {
      const formData = new FormData()
      formData.append('profilePhoto', photoFile)
      
      const response = await AuthInterceptor.fetch(`http://localhost:8080/users/${userId}/profile-photo`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // No incluir Content-Type - el navegador lo establece automáticamente para FormData
        },
        body: formData
      })
      
      console.log('📡 Profile photo response status:', response.status, response.statusText)
      
      if (!response.ok) {
        let errorMessage = `Error al actualizar foto de perfil: ${response.status} ${response.statusText}`
        
        const contentType = response.headers.get('content-type')
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json()
            const message = errorData.message || errorData.error || errorData.detail || errorData.title
            errorMessage = message || errorMessage
          } catch (parseError) {
            errorMessage = `Error del servidor: ${response.status}`
          }
        } else {
          try {
            const errorText = await response.text()
            errorMessage = errorText || errorMessage
          } catch (parseError) {
            errorMessage = `Error del servidor: ${response.status}`
          }
        }
        
        return {
          success: false,
          error: errorMessage
        }
      }
      
      // Manejar respuesta exitosa
      let data
      try {
        data = await response.json()
        console.log('✅ Profile photo updated successfully:', data)
        return {
          success: true,
          data: data
        }
      } catch (parseError) {
        console.error('❌ Cannot parse profile photo response as JSON:', parseError)
        return {
          success: false,
          error: 'La respuesta del servidor no es válida'
        }
      }
    } catch (error) {
      console.error('❌ Network error updating profile photo:', error)
      return {
        success: false,
        error: 'Error de conexión al subir la foto'
      }
    }
  }

  const removeProfilePhoto = async (token: string, userId: string): Promise<ApiResponse<UserResponseDto>> => {
    console.log('🗑️ Removing profile photo for user (resetting to default):', userId)
    
    try {
      // Usar el endpoint existente con parámetro resetToDefault
      const formData = new FormData()
      formData.append('resetToDefault', 'true')
      
      const response = await AuthInterceptor.fetch(`http://localhost:8080/users/${userId}/profile-photo`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // No establecer Content-Type para que FormData lo maneje
        },
        body: formData
      })
      
      console.log('📡 Reset photo response status:', response.status, response.statusText)
      
      if (!response.ok) {
        let errorMessage = `Error al restablecer foto de perfil: ${response.status} ${response.statusText}`
        
        const contentType = response.headers.get('content-type')
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json()
            const message = errorData.message || errorData.error || errorData.detail || errorData.title
            errorMessage = message || errorMessage
          } catch (parseError) {
            errorMessage = `Error del servidor: ${response.status}`
          }
        } else {
          try {
            const errorText = await response.text()
            errorMessage = errorText || errorMessage
          } catch (parseError) {
            errorMessage = `Error del servidor: ${response.status}`
          }
        }
        
        return {
          success: false,
          error: errorMessage
        }
      }
      
      // Manejar respuesta exitosa
      let data
      try {
        data = await response.json()
        console.log('✅ Profile photo removed successfully:', data)
        return {
          success: true,
          data: data
        }
      } catch (parseError) {
        console.error('❌ Cannot parse remove photo response as JSON:', parseError)
        return {
          success: false,
          error: 'La respuesta del servidor no es válida'
        }
      }
    } catch (error) {
      console.error('❌ Network error removing profile photo:', error)
      return {
        success: false,
        error: 'Error de conexión al eliminar la foto'
      }
    }
  }

  return {
    getCurrentUser,
    updateCurrentUser,
    verifyPassword,
    updateProfilePhoto,
    removeProfilePhoto
  }
}
