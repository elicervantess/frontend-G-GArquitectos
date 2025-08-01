import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { useGoogleImage } from "@/hooks/useGoogleImage"

interface GoogleImageStatusProps {
  imageUrl?: string
  userName?: string
  onRefresh?: () => void
}

export function GoogleImageStatus({ imageUrl, userName, onRefresh }: GoogleImageStatusProps) {
  const {
    isLoading,
    hasError,
    retryCount,
    nextRetryIn,
    isGoogleImage,
    shouldShowPlaceholder,
    forceRefresh
  } = useGoogleImage(imageUrl)
  
  // Only show for Google images that have issues
  if (!isGoogleImage || (!isLoading && !hasError)) {
    return null
  }
  
  const handleRefresh = () => {
    forceRefresh()
    onRefresh?.()
  }
  
  const getStatusInfo = () => {
    if (isLoading) {
      return {
        icon: RefreshCw,
        iconClass: "text-blue-600 animate-spin",
        title: "Cargando imagen de perfil...",
        description: "Tu imagen de Google puede tardar unos minutos en aparecer después del registro.",
        bgClass: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      }
    }
    
    if (hasError) {
      return {
        icon: retryCount < 5 ? Clock : AlertCircle,
        iconClass: retryCount < 5 ? "text-amber-600" : "text-red-600",
        title: retryCount < 5 ? "Reintentando..." : "Imagen no disponible",
        description: retryCount < 5 
          ? "Las imágenes de Google nuevas pueden tardar hasta 10 minutos en estar disponibles."
          : "La imagen de Google parece no estar lista aún. Puedes intentar más tarde.",
        bgClass: retryCount < 5 
          ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
          : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      }
    }
    
    return null
  }
  
  const statusInfo = getStatusInfo()
  if (!statusInfo) return null
  
  const { icon: Icon, iconClass, title, description, bgClass } = statusInfo
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, x: 100 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: -20, x: 100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-20 right-4 z-50"
      >
        <Card className={`w-80 ${bgClass} shadow-lg`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar 
                src={shouldShowPlaceholder ? undefined : imageUrl}
                name={userName}
                size="sm"
                className="mt-1 flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className={`w-4 h-4 ${iconClass}`} />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {title}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                  {description}
                </p>
                
                {nextRetryIn > 0 && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Próximo intento en {nextRetryIn}s
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRefresh}
                    className="text-xs h-7 px-3 border-gray-300 dark:border-gray-600 hover:bg-white/50 dark:hover:bg-black/20"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refrescar
                  </Button>
                  
                  <div className="text-right">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">
                      Cuenta de Google
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Intento {retryCount}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

export { GoogleImageStatus as default }
