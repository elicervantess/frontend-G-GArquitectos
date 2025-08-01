"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Eye, EyeOff, Mail, Lock, User, Building, Crown, ArrowRight, Loader2, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertWithIcon } from "@/components/ui/alert"
import { Loading } from "@/components/ui/loading"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { parseAuthError, translateAuthError } from "@/lib/auth-utils"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"
import { GoogleUser } from "@/types/google-oauth"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, register, loginWithGoogle, registerWithGoogle, handleGoogleAuth } = useAuth()
  const { initiateGoogleAuth, isLoading: isGoogleLoading } = useGoogleAuth()

  // Función para reiniciar el estado del modal
  const resetModalState = () => {
    setFormData({ name: "", email: "", password: "", role: "USER" })
    setErrors({})
    setTouched({})
    setSuccess("")
    setIsSubmitting(false)
    setShowPassword(false)
    setMode(initialMode)
  }

  // Reset form when mode changes
  useEffect(() => {
    setFormData({ name: "", email: "", password: "", role: "USER" })
    setErrors({})
    setTouched({})
    setSuccess("")
  }, [mode])

  // Update mode when initialMode changes (when modal is opened with different mode)
  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  // Reset modal when it opens to ensure correct initial state
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setFormData({ name: "", email: "", password: "", role: "USER" })
      setErrors({})
      setTouched({})
      setSuccess("")
      setIsSubmitting(false)
      setShowPassword(false)
    }
  }, [isOpen, initialMode])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetModalState()
    }
  }, [isOpen])

  // Google OAuth event listeners
  useEffect(() => {
    const handleGoogleAuthSuccess = async (event: CustomEvent) => {
      const { user, mode, message, isNewUser, jwtToken } = event.detail
      
      try {
        // Usar la nueva función unificada con JWT token
        const result = await handleGoogleAuth(user, isNewUser, jwtToken)

        if (result.success) {
          // Mostrar mensaje apropiado según el caso
          let successMessage = result.message || '¡Autenticación con Google exitosa!'
          
          if (!isNewUser && mode === 'register') {
            // Usuario existente intentando registrarse
            successMessage = 'Cuenta de Google con este correo ya fue registrada. Iniciando sesión...'
          } else if (isNewUser && mode === 'login') {
            // Usuario nuevo intentando hacer login
            successMessage = 'Usuario no encontrado. Registrando nueva cuenta...'
          }
          
          setSuccess(successMessage)
          setTimeout(() => {
            onClose()
          }, 2000)
        } else {
          setErrors({ general: result.error || 'Error en la autenticación con Google' })
        }
      } catch (error) {
        setErrors({ general: 'Error en la autenticación con Google' })
      }
    }

    const handleGoogleAuthError = (event: CustomEvent) => {
      setErrors({ general: event.detail.error || 'Error en la autenticación con Google' })
    }

    window.addEventListener('googleAuthSuccess', handleGoogleAuthSuccess as unknown as EventListener)
    window.addEventListener('googleAuthError', handleGoogleAuthError as unknown as EventListener)

    return () => {
      window.removeEventListener('googleAuthSuccess', handleGoogleAuthSuccess as unknown as EventListener)
      window.removeEventListener('googleAuthError', handleGoogleAuthError as unknown as EventListener)
    }
  }, [handleGoogleAuth, onClose])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (mode === "register") {
      if (!formData.name.trim()) {
        newErrors.name = "El nombre es requerido"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "El nombre debe tener al menos 2 caracteres"
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "El email no es válido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar formulario antes de enviar
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      let result
      if (mode === "login") {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.name, formData.email, formData.password, formData.role)
      }

      if (result.success) {
        // Mostrar mensaje de éxito y mantener modal abierto
        setSuccess(mode === "login" ? "¡Inicio de sesión exitoso!" : "¡Registro exitoso!")
        setIsSubmitting(false)
        
        // Cerrar modal después de mostrar el mensaje de éxito
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        // El backend envía mensajes de error específicos
        const errorMessage = result.error || "Error desconocido"
        
        // Parsear el error para determinar el campo y traducir el mensaje
        const parsedError = parseAuthError(errorMessage)
        const translatedMessage = translateAuthError(errorMessage)
        
        if (parsedError.field === 'email') {
          setErrors({ email: translatedMessage })
        } else if (parsedError.field === 'password') {
          setErrors({ password: translatedMessage })
        } else {
          setErrors({ general: translatedMessage })
        }
      }
    } catch (error) {
      setErrors({ general: "Error de conexión. Inténtalo de nuevo." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    
    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: "" }))
    }
    
    // Clear success message when user starts typing
    if (success) {
      setSuccess("")
    }
    
    // Validación en tiempo real solo para campos que han sido tocados
    if (touched[field]) {
      if (field === "email" && value.trim() === "") {
        setErrors(prev => ({ ...prev, email: "El email es requerido" }))
      } else if (field === "email" && value.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({ ...prev, email: "El email no es válido" }))
      } else if (field === "email") {
        setErrors(prev => ({ ...prev, email: "" }))
      }
      
      if (field === "password" && value === "") {
        setErrors(prev => ({ ...prev, password: "La contraseña es requerida" }))
      } else if (field === "password" && value !== "" && value.length < 6) {
        setErrors(prev => ({ ...prev, password: "La contraseña debe tener al menos 6 caracteres" }))
      } else if (field === "password") {
        setErrors(prev => ({ ...prev, password: "" }))
      }
      
      if (mode === "register" && field === "name" && value.trim() === "") {
        setErrors(prev => ({ ...prev, name: "El nombre es requerido" }))
      } else if (mode === "register" && field === "name" && value.trim() !== "" && value.trim().length < 2) {
        setErrors(prev => ({ ...prev, name: "El nombre debe tener al menos 2 caracteres" }))
      } else if (mode === "register" && field === "name") {
        setErrors(prev => ({ ...prev, name: "" }))
      }
    }
  }

  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validar el campo cuando el usuario sale de él
    const value = formData[field as keyof typeof formData] as string
    
    if (field === "email" && value.trim() === "") {
      setErrors(prev => ({ ...prev, email: "El email es requerido" }))
    } else if (field === "email" && value.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors(prev => ({ ...prev, email: "El email no es válido" }))
    }
    
    if (field === "password" && value === "") {
      setErrors(prev => ({ ...prev, password: "La contraseña es requerida" }))
    } else if (field === "password" && value !== "" && value.length < 6) {
      setErrors(prev => ({ ...prev, password: "La contraseña debe tener al menos 6 caracteres" }))
    }
    
    if (mode === "register" && field === "name" && value.trim() === "") {
      setErrors(prev => ({ ...prev, name: "El nombre es requerido" }))
    } else if (mode === "register" && field === "name" && value.trim() !== "" && value.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: "El nombre debe tener al menos 2 caracteres" }))
    }
  }

  const handleSocialAuth = async (provider: "apple" | "google") => {
    if (provider === "google") {
      try {
        initiateGoogleAuth(mode)
      } catch (error) {
        setErrors({ general: 'Error al abrir la ventana de autenticación de Google' })
      }
    } else {
      console.log('🍎 Procesando Apple auth...')
      setIsSubmitting(true)
      setTimeout(() => {
        setIsSubmitting(false)
        console.log(`${provider} auth clicked`)
      }, 2000)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-4 h-4" />
      case "ARCHITECT":
        return <Building className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "premium"
      case "ARCHITECT":
        return "primary"
      default:
        return "secondary"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() => {
            onClose()
            resetModalState()
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-lg mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card variant="glass" className="relative overflow-hidden border-0 shadow-2xl">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-slate-100/80 to-zinc-100/80 dark:from-gray-900/80 dark:via-slate-800/80 dark:to-zinc-900/80" />
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full opacity-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-slate-500 to-zinc-600 rounded-full opacity-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-slate-800 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-slate-900 bg-clip-text text-transparent">
                        {mode === "login" ? "Bienvenido de vuelta" : "Únete a nosotros"}
                      </CardTitle>
                      <CardDescription className="text-base mt-1">
                        {mode === "login" 
                          ? "Inicia sesión para acceder a tu cuenta" 
                          : "Crea tu cuenta para comenzar"
                        }
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClose()
                      resetModalState()
                    }}
                    className="hover:bg-white/20 dark:hover:bg-black/20 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === "register" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nombre completo
                        </label>
                        <Input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          onBlur={() => handleInputBlur("name")}
                          placeholder="Tu nombre completo"
                          leftIcon={<User className="w-4 h-4" />}
                          required
                          disabled={isSubmitting || !!success}
                        />
                        {errors.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <AlertWithIcon
                              variant="destructive"
                              title="Error"
                              description={errors.name}
                              showClose
                              onClose={() => setErrors(prev => ({ ...prev, name: "" }))}
                            />
                          </motion.div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Correo electrónico
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleInputBlur("email")}
                      placeholder="tu@email.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      required
                      disabled={isSubmitting || !!success}
                    />
                    {errors.email && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AlertWithIcon
                          variant="destructive"
                          title="Error"
                          description={errors.email}
                          showClose
                          onClose={() => setErrors(prev => ({ ...prev, email: "" }))}
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contraseña
                    </label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onBlur={() => handleInputBlur("password")}
                      placeholder="••••••••"
                      leftIcon={<Lock className="w-4 h-4" />}
                      rightIcon={
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                          className="hover:bg-transparent"
                          disabled={isSubmitting || !!success}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      }
                      required
                      disabled={isSubmitting || !!success}
                    />
                    {errors.password && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AlertWithIcon
                          variant="destructive"
                          title="Error"
                          description={errors.password}
                          showClose
                          onClose={() => setErrors(prev => ({ ...prev, password: "" }))}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Success Alert */}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertWithIcon
                        variant="success"
                        title="¡Éxito!"
                        description={success}
                        showClose={false}
                      />
                    </motion.div>
                  )}



                  {/* Error Alert */}
                  {errors.general && (
                    <AlertWithIcon
                      variant="destructive"
                      title="Error"
                      description={errors.general}
                      showClose
                      onClose={() => setErrors(prev => ({ ...prev, general: "" }))}
                    />
                  )}

                  {/* Main Action Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !!success}
                    className="w-full h-12 bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loading size="sm" />
                        <span className="ml-2">
                          {mode === "login" ? "Iniciando sesión..." : "Registrando..."}
                        </span>
                      </div>
                    ) : success ? (
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {mode === "login" ? "¡Sesión iniciada!" : "¡Cuenta creada!"}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-neutral-900 text-gray-500">o continúa con</span>
                  </div>
                </div>

                {/* Social Auth Buttons */}
                <div className="space-y-3">
                  {/* Google Auth Button */}
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 hover:shadow-md disabled:opacity-50"
                    onClick={() => handleSocialAuth("google")}
                    disabled={isSubmitting || isGoogleLoading || !!success}
                  >
                    {isSubmitting || isGoogleLoading ? (
                      <Loading size="sm" />
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        {mode === "login" ? "Iniciar sesión con Google" : "Registrarse con Google"}
                      </>
                    )}
                  </Button>

                  {/* Apple Auth Button */}
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-300 hover:shadow-md disabled:opacity-50"
                    onClick={() => handleSocialAuth("apple")}
                    disabled={isSubmitting || isGoogleLoading || !!success}
                  >
                    {isSubmitting ? (
                      <Loading size="sm" />
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        {mode === "login" ? "Iniciar sesión con Apple" : "Registrarse con Apple"}
                      </>
                    )}
                  </Button>
                </div>

                {/* Footer */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                    <button
                      type="button"
                      onClick={() => setMode(mode === "login" ? "register" : "login")}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {mode === "login" ? "Regístrate aquí" : "Inicia sesión aquí"}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 