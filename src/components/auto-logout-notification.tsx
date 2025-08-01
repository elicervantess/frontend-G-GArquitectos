"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AutoLogoutNotificationProps {
  className?: string
}

export function AutoLogoutNotification({ className }: AutoLogoutNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState("")
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const handleAutoLogout = (event: CustomEvent) => {
      const { message } = event.detail
      console.log('🔔 Auto-logout notification triggered:', message)
      
      setLogoutMessage(message || 'Sesión expirada')
      setIsVisible(true)
      setCountdown(5)
    }

    // Escuchar evento de logout automático
    window.addEventListener('autoLogout', handleAutoLogout as EventListener)

    return () => {
      window.removeEventListener('autoLogout', handleAutoLogout as EventListener)
    }
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!isVisible || countdown <= 0) return

    const timer = setTimeout(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setIsVisible(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [isVisible, countdown])

  const handleClose = () => {
    setIsVisible(false)
    setCountdown(0)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.4 
          }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[10000] min-w-[400px] max-w-md"
        >
          <Card className="border-red-200 bg-red-50/95 dark:bg-red-900/20 dark:border-red-800 shadow-xl backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {/* Icono */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                      Sesión Cerrada Automáticamente
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClose}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    {logoutMessage}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Por tu seguridad, tu sesión ha sido cerrada</span>
                    </div>
                    
                    {countdown > 0 && (
                      <motion.div
                        key={countdown}
                        initial={{ scale: 1.2, opacity: 0.7 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-xs text-red-600 dark:text-red-400 font-mono bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded"
                      >
                        {countdown}s
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Barra de progreso */}
              <motion.div
                className="mt-3 w-full h-1 bg-red-200 dark:bg-red-800 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className="h-full bg-red-500 dark:bg-red-400"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ 
                    duration: 5, 
                    ease: "linear" 
                  }}
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AutoLogoutNotification
