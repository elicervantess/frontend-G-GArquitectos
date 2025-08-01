"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UserDeletedNotification() {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleUserDeleted = (event: CustomEvent) => {
      setMessage(event.detail.message || 'Tu cuenta ha sido eliminada del sistema')
      setIsVisible(true)
      
      // Auto-ocultar después de 10 segundos
      setTimeout(() => {
        setIsVisible(false)
      }, 10000)
    }

    window.addEventListener('userDeleted', handleUserDeleted as EventListener)
    
    return () => {
      window.removeEventListener('userDeleted', handleUserDeleted as EventListener)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000] min-w-[400px] max-w-md"
        >
          <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-1">
                  Cuenta Eliminada
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  {message}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleReload}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                  >
                    Recargar Página
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClose}
                    className="border-red-300 text-red-700 hover:bg-red-50 text-xs"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 rounded-md hover:bg-red-100 transition-colors"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
            
            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-red-400 rounded-b-xl"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
