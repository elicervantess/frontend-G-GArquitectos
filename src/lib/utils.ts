import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera las iniciales de un nombre completo
 * @param name - Nombre completo del usuario
 * @returns Las iniciales (ej: "Juan Pérez" -> "JP")
 */
export function generateInitials(name: string): string {
  if (!name || typeof name !== 'string') return ''
  
  // Dividir el nombre en palabras y filtrar espacios vacíos
  const words = name.trim().split(/\s+/).filter(word => word.length > 0)
  
  if (words.length === 0) return ''
  
  if (words.length === 1) {
    // Si solo hay una palabra, tomar las primeras dos letras
    return words[0].substring(0, 2).toUpperCase()
  }
  
  // Tomar la primera letra de la primera y última palabra
  const firstInitial = words[0].charAt(0).toUpperCase()
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase()
  
  return firstInitial + lastInitial
}
