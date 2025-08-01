export interface UserResponseDto {
  id: number
  fullName: string
  email: string
  role: string
  profileImage: string
  lastPasswordUpdate?: string // ISO timestamp
  provider?: string // Para identificar si es usuario de Google
}
