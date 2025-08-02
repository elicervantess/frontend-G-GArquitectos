import React, { useEffect, useState } from "react"
import { Avatar, AvatarProps } from "./avatar"
import { useAuth } from "@/contexts/AuthContext"

interface UserAvatarProps extends Omit<AvatarProps, 'name' | 'fallback'> {
  showName?: boolean
  autoRefresh?: boolean // Nueva prop para refrescar automáticamente
}

export function UserAvatar({ showName = false, autoRefresh = false, ...props }: UserAvatarProps) {
  const { user } = useAuth()
  const [imageUrl, setImageUrl] = useState(user?.profileImage)
  
  // Actualizar URL cuando cambie el usuario - SIN efectos complejos
  useEffect(() => {
    if (user?.profileImage) {
      setImageUrl(user.profileImage)
      console.log('🔄 UserAvatar: Usuario cambió, imagen actualizada:', user.profileImage)
    } else {
      setImageUrl(undefined)
    }
  }, [user?.profileImage])
  
  // Debug simplificado
  console.log('🖼️ UserAvatar render:', {
    user: !!user,
    profileImage: imageUrl,
    name: user?.name
  })
  
  if (!user) {
    console.log('❌ UserAvatar: No user found, showing default avatar')
    return <Avatar {...props} />
  }
  
  console.log('✅ UserAvatar: Renderizando avatar')
  console.log('  - src:', imageUrl)
  console.log('  - name:', user.name)
  
  return (
    <Avatar 
      {...props} 
      src={imageUrl}
      name={user.name}
      alt={showName ? user.name : `Avatar de ${user.name}`}
    />
  )
} 