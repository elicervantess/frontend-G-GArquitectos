"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, ArrowRight, Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Toast from "@/components/ui/toast"
import { usePasswordReset } from "@/hooks/usePasswordReset"
import { useTheme } from "@/contexts/ThemeContext"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onBackToLogin: () => void
  onCloseAllModals?: () => void // NUEVA prop para cerrar todos los modales
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin, onCloseAllModals }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [touched, setTouched] = useState(false)
  const [cooldownMinutes, setCooldownMinutes] = useState(0)

  // Toast state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info")

  const router = useRouter()
  const { forgotPassword } = usePasswordReset()
  const { theme, actualTheme } = useTheme()

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("")
      setError("")
      setSuccess(false)
      setTouched(false)
      setIsSubmitting(false)
      setCooldownMinutes(0)
    }
  }, [isOpen])

  // Toast helper function
  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError("El email es requerido")
      return
    }

    if (!validateEmail(email)) {
      setError("El email no es válido")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await forgotPassword(email)
      
      if (response.success) {
        setSuccess(true)
        showToast("Email de recuperación enviado exitosamente", "success")
        // NO cerramos el modal automáticamente para mejor UX
        
      } else {
        setError(response.message)
        setCooldownMinutes(response.cooldownMinutes)
        if (response.cooldownMinutes > 0) {
          showToast(`Debes esperar ${response.cooldownMinutes} minutos`, "warning")
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      showToast("Error al enviar email de recuperación", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (error) setError("")
    if (!touched) setTouched(true)
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className={`relative overflow-hidden border shadow-2xl ${
                actualTheme === 'dark'
                  ? 'border-gray-700 bg-gray-900'
                  : 'border-gray-200 bg-white'
              }`}>
                {/* Background Pattern */}
                <div className={`absolute inset-0 ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80'
                    : 'bg-gradient-to-br from-gray-50/80 to-gray-100/80'
                }`} />
                
                {/* Floating Elements */}
                <motion.div
                  className={`absolute top-4 left-4 w-20 h-20 rounded-full opacity-10 ${
                    actualTheme === 'dark'
                      ? 'bg-gradient-to-br from-gray-400 to-gray-600'
                      : 'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className={`absolute bottom-4 right-4 w-16 h-16 rounded-full opacity-10 ${
                    actualTheme === 'dark'
                      ? 'bg-gradient-to-br from-gray-500 to-gray-700'
                      : 'bg-gradient-to-br from-gray-500 to-gray-700'
                  }`}
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        actualTheme === 'dark'
                          ? 'bg-gradient-to-br from-gray-600 to-gray-800'
                          : 'bg-gradient-to-br from-gray-600 to-gray-800'
                      }`}>
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`text-2xl font-bold ${
                          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {success ? "¡Email enviado!" : "Recuperar contraseña"}
                        </CardTitle>
                        <p className={`text-sm mt-1 ${
                          actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {success 
                            ? "Revisa tu bandeja de entrada" 
                            : "Te enviaremos un enlace de recuperación"
                          }
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className={`rounded-xl transition-colors ${
                        actualTheme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
                          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-6"
                      >
                        <div className="flex justify-center mb-6">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            actualTheme === 'dark'
                              ? 'bg-gradient-to-br from-gray-800 to-gray-700'
                              : 'bg-gradient-to-br from-gray-100 to-gray-200'
                          }`}>
                            <CheckCircle className={`w-8 h-8 ${
                              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`} />
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className={`text-lg font-semibold ${
                            actualTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            ¡Enlace enviado exitosamente!
                          </h3>
                          <p className={`text-sm leading-relaxed ${
                            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Hemos enviado un enlace de recuperación a:<br />
                            <span className={`font-medium ${
                              actualTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            }`}>{email}</span>
                          </p>
                          <div className={`border rounded-lg p-3 ${
                            actualTheme === 'dark'
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className={`flex items-center gap-2 text-sm ${
                              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">El enlace expira en 30 minutos</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Button
                            onClick={() => {
                              // Cerrar todos los modales si la función está disponible
                              if (onCloseAllModals) {
                                onCloseAllModals()
                              } else {
                                onClose()
                              }
                              router.push(`/auth/check-email?email=${encodeURIComponent(email)}`)
                            }}
                            className={`w-full transition-all duration-300 ${
                              actualTheme === 'dark'
                                ? 'bg-white hover:bg-gray-100 text-black'
                                : 'bg-gray-900 hover:bg-gray-800 text-white'
                            }`}
                          >
                            <div className="flex items-center justify-center">
                              <Mail className="w-4 h-4 mr-2" />
                              Ir a página de confirmación
                            </div>
                          </Button>
                          <Button
                            onClick={onBackToLogin}
                            variant="ghost"
                            className={`w-full border transition-colors ${
                              actualTheme === 'dark'
                                ? 'border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                            }`}
                          >
                            Volver al login
                          </Button>
                          <p className={`text-xs text-center ${
                            actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            ¿No recibiste el email? Revisa tu carpeta de spam o cierra este modal para intentar nuevamente
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label className={`text-sm font-medium ${
                              actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Correo electrónico
                            </label>
                            <Input
                              type="email"
                              value={email}
                              onChange={(e) => handleEmailChange(e.target.value)}
                              placeholder="tu@email.com"
                              leftIcon={<Mail className="w-4 h-4" />}
                              required
                              disabled={isSubmitting}
                              className="h-12"
                            />
                          </div>

                          {/* Error Alert */}
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex items-center gap-2 text-sm p-3 rounded-lg border ${
                                actualTheme === 'dark'
                                  ? 'text-red-400 bg-red-900/20 border-red-800'
                                  : 'text-red-600 bg-red-50 border-red-200'
                              }`}
                            >
                              <AlertCircle className="h-4 w-4 flex-shrink-0" />
                              <span>{error}</span>
                              {cooldownMinutes > 0 && (
                                <div className={`ml-auto text-xs px-2 py-1 rounded ${
                                  actualTheme === 'dark' ? 'bg-red-900/40' : 'bg-red-100'
                                }`}>
                                  {cooldownMinutes}min
                                </div>
                              )}
                            </motion.div>
                          )}

                          <Button
                            type="submit"
                            disabled={isSubmitting || !email.trim()}
                            className={`w-full h-12 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                              actualTheme === 'dark'
                                ? 'bg-white hover:bg-gray-100 text-black disabled:bg-gray-600 disabled:text-gray-400'
                                : 'bg-gray-900 hover:bg-gray-800 text-white disabled:bg-gray-300 disabled:text-gray-500'
                            }`}
                          >
                            {isSubmitting ? (
                              <div className="flex items-center justify-center">
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Enviando...
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                Enviar enlace de recuperación
                                <ArrowRight className="ml-2 w-4 h-4" />
                              </div>
                            )}
                          </Button>
                        </form>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={onBackToLogin}
                            className={`text-sm font-medium hover:underline transition-colors ${
                              actualTheme === 'dark'
                                ? 'text-gray-300 hover:text-white'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            ← Volver al login
                          </button>
                        </div>

                        <div className={`border rounded-lg p-4 ${
                          actualTheme === 'dark'
                            ? 'bg-gray-800/50 border-gray-700'
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              actualTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                            }`}>
                              <Mail className={`w-3 h-3 ${
                                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`} />
                            </div>
                            <div className={`text-xs leading-relaxed ${
                              actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              <p className={`font-medium mb-1 ${
                                actualTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                              }`}>¿Cómo funciona?</p>
                              <p>Recibirás un email con un enlace seguro que te permitirá crear una nueva contraseña. El enlace es válido solo por 30 minutos.</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <Toast 
        isVisible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
        position="top-center"
        duration={4000}
      />
    </>
  )
}
