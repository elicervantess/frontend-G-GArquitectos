import React from "react"
import { Avatar, AvatarProps } from "./avatar"
import { useAuth } from "@/contexts/AuthContext"

interface UserAvatarProps extends Omit<AvatarProps, 'name' | 'fallback'> {
  showName?: boolean
}

export function UserAvatar({ showName = false, ...props }: UserAvatarProps) {
  const { user } = useAuth()
  
  if (!user) {
    return <Avatar {...props} />
  }
  
  return (
    <Avatar 
      {...props} 
      name={user.name}
      alt={showName ? user.name : `Avatar de ${user.name}`}
    />
  )
} 