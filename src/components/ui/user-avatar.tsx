import React from "react"
import { Avatar, AvatarProps } from "./avatar"
import { useAuth } from "@/contexts/AuthContext"

interface UserAvatarProps extends Omit<AvatarProps, 'name' | 'fallback'> {
  showName?: boolean
}

export function UserAvatar({ showName = false, ...props }: UserAvatarProps) {
  const { user } = useAuth()
  
  // Debug para ver si el componente se re-renderiza con nuevos datos
  console.log('🖼️ UserAvatar render - Profile image:', user?.profileImage)
  
  if (!user) {
    return <Avatar {...props} />
  }
  
  return (
    <Avatar 
      {...props} 
      src={user.profileImage} // Usar la foto de perfil del usuario
      name={user.name}
      alt={showName ? user.name : `Avatar de ${user.name}`}
    />
  )
} 