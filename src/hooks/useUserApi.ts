import { UserResponseDto } from '@/types/user'
import { createAuthHeaders } from '@/lib/jwt'

export const useUserApi = () => {
  const getCurrentUser = async (token: string): Promise<UserResponseDto> => {
    console.log('🔍 Calling /auth/me endpoint with token:', token?.substring(0, 20) + '...')
    
    const response = await fetch('http://localhost:8080/users/me', {
      method: 'GET',
      headers: createAuthHeaders(token)
    })
    
    const data = await response.json()
    console.log('📦 Response from /users/me:', data)
    
    return data
  }

  return {
    getCurrentUser
  }
}
