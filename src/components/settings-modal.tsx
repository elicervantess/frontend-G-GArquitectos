"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Settings, Sun, Moon, Monitor, Info, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/ThemeContext"
import { useDeviceInfoSettings } from "@/hooks/useDeviceInfoSettings"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, actualTheme, setTheme } = useTheme()
  const { showDeviceInfo, toggleDeviceInfo } = useDeviceInfoSettings()

  // Cerrar modal con escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Manejar cambio de tema con transición suave
  const handleThemeChange = (newTheme: typeof theme) => {
    // Agregar clase de transición antes del cambio
    document.documentElement.style.setProperty('transition', 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1)')
    
    setTheme(newTheme)
    
    // Remover transición después del cambio
    setTimeout(() => {
      document.documentElement.style.removeProperty('transition')
    }, 300)
  }

  const themeOptions = [
    {
      key: 'light',
      label: 'Claro',
      icon: Sun,
      description: 'Tema claro para mejor visibilidad durante el día'
    },
    {
      key: 'dark',
      label: 'Oscuro',
      icon: Moon,
      description: 'Tema oscuro para reducir fatiga visual'
    },
    {
      key: 'system',
      label: 'Automático',
      icon: Monitor,
      description: 'Sigue la configuración del sistema operativo'
    }
  ] as const

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0.9,
                y: 20
              }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.9,
                y: 20
              }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.4
              }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className={`backdrop-blur-2xl border-2 shadow-2xl transition-all duration-300 ${
                actualTheme === 'dark'
                  ? 'bg-black/40 border-white/20'
                  : 'bg-white/90 border-gray-200'
              }`}>
                <CardHeader className="relative">
                  <motion.button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-xl transition-all duration-300 ${
                      actualTheme === 'dark'
                        ? 'hover:bg-white/10 text-white/70 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>

                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        actualTheme === 'dark'
                          ? 'bg-white/10 border border-white/20'
                          : 'bg-gray-100 border border-gray-200'
                      }`}
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Settings className={`w-6 h-6 ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-700'
                      }`} />
                    </motion.div>
                    <div>
                      <CardTitle className={`text-2xl font-bold ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Configuración
                      </CardTitle>
                      <p className={`text-sm ${
                        actualTheme === 'dark' ? 'text-white/70' : 'text-gray-600'
                      }`}>
                        Personaliza tu experiencia
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Sección de Tema */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-6 rounded-full ${
                        actualTheme === 'dark' ? 'bg-white/40' : 'bg-gray-400'
                      }`} />
                      <h3 className={`text-lg font-semibold ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Tema
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      {themeOptions.map((option) => {
                        const IconComponent = option.icon
                        const isSelected = theme === option.key
                        
                        return (
                          <motion.button
                            key={option.key}
                            onClick={() => handleThemeChange(option.key)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                              isSelected
                                ? actualTheme === 'dark'
                                  ? 'bg-white/15 border-white/50 shadow-lg'
                                  : 'bg-gray-100 border-gray-400 shadow-lg'
                                : actualTheme === 'dark'
                                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                isSelected
                                  ? actualTheme === 'dark'
                                    ? 'bg-white/25'
                                    : 'bg-gray-200'
                                  : actualTheme === 'dark'
                                    ? 'bg-white/10'
                                    : 'bg-gray-200'
                              }`}>
                                <IconComponent className={`w-5 h-5 ${
                                  isSelected
                                    ? actualTheme === 'dark'
                                      ? 'text-white'
                                      : 'text-gray-900'
                                    : actualTheme === 'dark'
                                      ? 'text-white/70'
                                      : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <div className={`font-medium ${
                                  isSelected
                                    ? actualTheme === 'dark'
                                      ? 'text-white'
                                      : 'text-gray-900'
                                    : actualTheme === 'dark'
                                      ? 'text-white/90'
                                      : 'text-gray-900'
                                }`}>
                                  {option.label}
                                </div>
                                <div className={`text-sm ${
                                  isSelected
                                    ? actualTheme === 'dark'
                                      ? 'text-white/70'
                                      : 'text-gray-700'
                                    : actualTheme === 'dark'
                                      ? 'text-white/60'
                                      : 'text-gray-600'
                                }`}>
                                  {option.description}
                                </div>
                              </div>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className={`w-3 h-3 rounded-full ${
                                    actualTheme === 'dark' ? 'bg-white' : 'bg-gray-900'
                                  }`}
                                />
                              )}
                            </div>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Sección de Información del Dispositivo */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-6 rounded-full ${
                        actualTheme === 'dark' ? 'bg-white/40' : 'bg-gray-400'
                      }`} />
                      <h3 className={`text-lg font-semibold ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Información del Dispositivo
                      </h3>
                    </div>
                    
                    <motion.button
                      onClick={toggleDeviceInfo}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        actualTheme === 'dark'
                          ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      layout
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            showDeviceInfo
                              ? actualTheme === 'dark'
                                ? 'bg-white/20'
                                : 'bg-gray-200'
                              : actualTheme === 'dark'
                                ? 'bg-white/10'
                                : 'bg-gray-200'
                          }`}>
                            <motion.div
                              animate={{ rotate: showDeviceInfo ? 360 : 0 }}
                              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            >
                              <Info className={`w-5 h-5 transition-colors duration-300 ${
                                showDeviceInfo
                                  ? actualTheme === 'dark'
                                    ? 'text-white'
                                    : 'text-gray-900'
                                  : actualTheme === 'dark'
                                    ? 'text-white/70'
                                    : 'text-gray-600'
                              }`} />
                            </motion.div>
                          </div>
                          <div className="text-left">
                            <div className={`font-medium ${
                              actualTheme === 'dark' ? 'text-white/90' : 'text-gray-900'
                            }`}>
                              Debug del Dispositivo
                            </div>
                            <div className={`text-sm transition-all duration-300 ${
                              actualTheme === 'dark' ? 'text-white/60' : 'text-gray-600'
                            }`}>
                              {showDeviceInfo ? 'Mostrar información técnica' : 'Ocultar información técnica'}
                            </div>
                          </div>
                        </div>
                        <motion.div
                          animate={{ 
                            rotate: showDeviceInfo ? 0 : 180,
                            scale: showDeviceInfo ? 1.1 : 1
                          }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                          {showDeviceInfo ? (
                            <ToggleRight className={`w-8 h-8 transition-colors duration-300 ${
                              actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`} />
                          ) : (
                            <ToggleLeft className={`w-8 h-8 transition-colors duration-300 ${
                              actualTheme === 'dark' ? 'text-white/40' : 'text-gray-400'
                            }`} />
                          )}
                        </motion.div>
                      </div>
                    </motion.button>

                    {process.env.NODE_ENV === 'development' && (
                      <div className={`text-xs px-3 py-2 rounded-lg ${
                        actualTheme === 'dark'
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        💡 Esta función solo está disponible en modo desarrollo
                      </div>
                    )}
                  </div>

                  {/* Botón de cerrar */}
                  <div className="pt-4">
                    <Button
                      onClick={onClose}
                      className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                        actualTheme === 'dark'
                          ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 hover:border-gray-300'
                      }`}
                      variant="outline"
                    >
                      Cerrar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
