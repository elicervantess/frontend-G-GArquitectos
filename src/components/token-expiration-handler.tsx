"use client"

import { useTokenExpiration } from '@/hooks/useTokenExpiration'

export function TokenExpirationHandler() {
  // Hook para manejar la expiración del token
  useTokenExpiration()
  
  // Este componente no renderiza nada, solo maneja la expiración del token
  return null
} 