import React, { useState, useEffect } from "react"
import { Avatar, AvatarProps } from "./avatar"
import { useAuth } from "@/contexts/AuthContext"

interface ImmediateAvatarProps extends Omit<AvatarProps, 'name' | 'fallback'> {
  showName?: boolean
}

export function ImmediateAvatar({ showName = false, ...props }: ImmediateAvatarProps) {
  const { user } = useAuth()
  const [processedUrl, setProcessedUrl] = useState<string | undefined>(undefined)
  const [hasProcessedOnce, setHasProcessedOnce] = useState(false)
  
  // Procesar URL solo cuando sea necesario
  useEffect(() => {
    if (!user?.profileImage) {
      setProcessedUrl(undefined)
      return
    }

    // Si es la primera vez con esta imagen y es de Google, agregar timestamp
    if (user.profileImage.includes('googleusercontent.com') && !hasProcessedOnce) {
      const urlWithTimestamp = `${user.profileImage}${user.profileImage.includes('?') ? '&' : '?'}t=${Date.now()}`
      setProcessedUrl(urlWithTimestamp)
      setHasProcessedOnce(true)
      console.log('🚀 ImmediateAvatar: Primera carga con timestamp:', urlWithTimestamp)
    } else {
      // Para imágenes normales o después de la primera carga, usar URL normal
      setProcessedUrl(user.profileImage)
      console.log('🚀 ImmediateAvatar: URL normal:', user.profileImage)
    }
  }, [user?.profileImage, hasProcessedOnce])
  
  if (!user) {
    console.log('❌ ImmediateAvatar: No user found')
    return <Avatar {...props} />
  }
  
  return (
    <Avatar 
      {...props} 
      src={processedUrl}
      name={user.name}
      alt={showName ? user.name : `Avatar de ${user.name}`}
    />
  )
}
