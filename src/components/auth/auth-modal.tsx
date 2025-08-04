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
import Toast from "@/components/ui/toast"
import { EmailVerificationModal } from "./email-verification-modal"
import { ForgotPasswordModal } from "./forgot-password-modal"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useEmailVerification } from "@/hooks/useEmailVerification"
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
    confirmPassword: "",
    role: "USER"
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Email verification states
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("")
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  // Toast state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info")

  const { login, register, loginWithGoogle, registerWithGoogle, handleGoogleAuth } = useAuth()
  const { theme, actualTheme } = useTheme()
  const { initiateGoogleAuth, isLoading: isGoogleLoading } = useGoogleAuth()
  const { registerWithVerification, resendVerificationCode } = useEmailVerification()
  
  // Toast helper function
  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  // Función para reiniciar el estado del modal
  const resetModalState = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "USER" })
    setErrors({})
    setTouched({})
    setSuccess("")
    setIsSubmitting(false)
    setShowPassword(false)
    setMode(initialMode)
  }

  // Reset form when mode changes
  useEffect(() => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "USER" })
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
      setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "USER" })
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
      
      showToast("Procesando autenticación con Google...", "info")
      
      try {
        // Usar la nueva función unificada con JWT token
        const result = await handleGoogleAuth(user, isNewUser, jwtToken)

        if (result.success) {
          // Mostrar mensaje apropiado según el caso
          let successMessage = result.message || '¡Autenticación con Google exitosa!'
          
          if (!isNewUser && mode === 'register') {
            // Usuario existente intentando registrarse
            successMessage = 'Cuenta de Google con este correo ya fue registrada. Iniciando sesión...'
            showToast("Usuario existente encontrado, iniciando sesión...", "success")
          } else if (isNewUser && mode === 'login') {
            // Usuario nuevo intentando hacer login
            successMessage = 'Usuario no encontrado. Registrando nueva cuenta...'
            showToast("Nuevo usuario detectado, creando cuenta...", "success")
          } else {
            showToast("¡Autenticación exitosa!", "success")
          }
          
          setSuccess(successMessage)
          setTimeout(() => {
            onClose()
          }, 2000)
        } else {
          setErrors({ general: result.error || 'Error en la autenticación con Google' })
          showToast("Error en la autenticación con Google", "error")
        }
      } catch (error) {
        setErrors({ general: 'Error en la autenticación con Google' })
        showToast("Error de conexión con Google", "error")
      }
    }

    const handleGoogleAuthError = (event: CustomEvent) => {
      setErrors({ general: event.detail.error || 'Error en la autenticación con Google' })
      showToast(event.detail.error || 'Error en la autenticación con Google', "error")
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

    // Validación de confirmación de contraseña solo en modo registro
    if (mode === "register") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Debes confirmar tu contraseña"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }
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
        
        if (result.success) {
          setSuccess("¡Inicio de sesión exitoso!")
          setIsSubmitting(false)
          
          setTimeout(() => {
            onClose()
          }, 2000)
        } else {
          const errorMessage = result.error || "Error desconocido"
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
      } else {
        // Registro con verificación de email
        result = await registerWithVerification({
          fullName: formData.name,
          email: formData.email,
          password: formData.password
        })

        if (result.success) {
          setPendingVerificationEmail(formData.email)
          setShowEmailVerification(true)
          showToast("Código de verificación enviado a tu email", "success")
        } else {
          const errorMessage = result.message || "Error desconocido"
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
      
      // Validación en tiempo real para confirmar contraseña
      if (mode === "register" && field === "confirmPassword" && value === "") {
        setErrors(prev => ({ ...prev, confirmPassword: "Debes confirmar tu contraseña" }))
      } else if (mode === "register" && field === "confirmPassword" && value !== "" && formData.password !== value) {
        setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }))
      } else if (mode === "register" && field === "confirmPassword") {
        setErrors(prev => ({ ...prev, confirmPassword: "" }))
      }
      
      // También validar confirmPassword cuando se cambia password
      if (mode === "register" && field === "password" && formData.confirmPassword !== "" && formData.confirmPassword !== value) {
        setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }))
      } else if (mode === "register" && field === "password" && formData.confirmPassword !== "" && formData.confirmPassword === value) {
        setErrors(prev => ({ ...prev, confirmPassword: "" }))
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
    
    // Validación para confirmar contraseña en onBlur
    if (mode === "register" && field === "confirmPassword" && value === "") {
      setErrors(prev => ({ ...prev, confirmPassword: "Debes confirmar tu contraseña" }))
    } else if (mode === "register" && field === "confirmPassword" && value !== "" && formData.password !== value) {
      setErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas no coinciden" }))
    }
  }

  const handleGoogleAuthClick = async () => {
    try {
      showToast("Abriendo ventana de autenticación de Google...", "info")
      initiateGoogleAuth(mode)
    } catch (error) {
      setErrors({ general: 'Error al abrir la ventana de autenticación de Google' })
      showToast("Error al abrir la ventana de Google", "error")
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
    // Adaptado para usar solo colores en escala de grises
    switch (role) {
      case "ADMIN":
        return "default" // Gris oscuro
      case "ARCHITECT":
        return "secondary" // Gris medio
      default:
        return "outline" // Gris claro
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 ${
              actualTheme === 'dark' 
                ? 'bg-black/80' 
                : 'bg-black/60'
            }`}
            onClick={() => {
              onClose()
              resetModalState()
            }}
          >
            <motion.div
              key="auth-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-lg mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
            <Card className={`relative overflow-hidden shadow-2xl border ${
              actualTheme === 'dark'
                ? 'bg-black border-gray-800'
                : 'bg-white border-gray-200'
            }`}>
              {/* Background Pattern */}
              <div className={`absolute inset-0 ${
                actualTheme === 'dark'
                  ? 'bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-800/90'
                  : 'bg-gradient-to-br from-gray-50/90 via-white/95 to-gray-100/90'
              }`} />
              
              {/* Floating Elements */}
              <motion.div
                key="floating-element-1"
                className={`absolute top-4 left-4 w-20 h-20 rounded-full opacity-10 ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-br from-gray-600 to-gray-700'
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                key="floating-element-2"
                className={`absolute bottom-4 right-4 w-16 h-16 rounded-full opacity-10 ${
                  actualTheme === 'dark'
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800'
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      actualTheme === 'dark'
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900'
                        : 'bg-gradient-to-br from-gray-700 to-gray-800'
                    }`}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className={`text-2xl font-bold ${
                        actualTheme === 'dark'
                          ? 'text-white'
                          : 'text-gray-900'
                      }`}>
                        {mode === "login" ? "Bienvenido de vuelta" : "Únete a nosotros"}
                      </CardTitle>
                      <CardDescription className={`text-base mt-1 ${
                        actualTheme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}>
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
                    className={`rounded-xl transition-colors ${
                      actualTheme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
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
                        <label className={`text-sm font-medium ${
                          actualTheme === 'dark'
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        }`}>
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
                            key="name-error"
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
                    <label className={`text-sm font-medium ${
                      actualTheme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}>
                      Correo electrónico
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleInputBlur("em ail")}
                      placeholder="tu@email.com"
                      leftIcon={<Mail className="w-4 h-4" />}
                      required
                      disabled={isSubmitting || !!success}
                    />
                    {errors.email && (
                      <motion.div
                        key="email-error"
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
                    <label className={`text-sm font-medium ${
                      actualTheme === 'dark'
                        ? 'text-gray-300'
                        : 'text-gray-700'
                    }`}>
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
                        key="password-error"
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
                    
                    {/* Forgot Password link - Solo en modo login */}
                    {mode === "login" && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className={`text-sm font-medium transition-colors hover:underline ${
                            actualTheme === 'dark'
                              ? 'text-gray-400 hover:text-gray-200'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          disabled={isSubmitting || !!success}
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Campo de Confirmar Contraseña - Solo en modo registro */}
                  {mode === "register" && (
                    <div className="space-y-2">
                      <label className={`text-sm font-medium ${
                        actualTheme === 'dark'
                          ? 'text-gray-300'
                          : 'text-gray-700'
                      }`}>
                        Confirmar Contraseña
                      </label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        onBlur={() => handleInputBlur("confirmPassword")}
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
                      {errors.confirmPassword && (
                        <motion.div
                          key="confirmPassword-error"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <AlertWithIcon
                            variant="destructive"
                            title="Error"
                            description={errors.confirmPassword}
                            showClose
                            onClose={() => setErrors(prev => ({ ...prev, confirmPassword: "" }))}
                          />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Success Alert */}
                  {success && (
                    <motion.div
                      key="success-alert"
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
                    className={`w-full h-12 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 ${
                      actualTheme === 'dark'
                        ? 'bg-white hover:bg-gray-100 text-black'
                        : 'bg-black hover:bg-gray-900 text-white'
                    }`}
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
                    <div className={`w-full border-t ${
                      actualTheme === 'dark'
                        ? 'border-gray-700'
                        : 'border-gray-300'
                    }`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-4 ${
                      actualTheme === 'dark'
                        ? 'bg-black text-gray-400'
                        : 'bg-white text-gray-500'
                    }`}>o continúa con</span>
                  </div>
                </div>

                {/* Social Auth Buttons */}
                <div className="space-y-3">
                  {/* Google Auth Button */}
                  <Button
                    variant="outline"
                    className={`w-full h-12 border-2 rounded-xl transition-all duration-300 hover:shadow-md disabled:opacity-50 ${
                      actualTheme === 'dark'
                        ? 'bg-white hover:bg-gray-100 border-gray-300 text-black'
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                    onClick={handleGoogleAuthClick}
                    disabled={isSubmitting || isGoogleLoading || !!success}
                  >
                    {isSubmitting || isGoogleLoading ? (
                      <div className="flex items-center justify-center">
                        <Loading size="sm" />
                        <span className="ml-2 text-sm">
                          {mode === "login" ? "Iniciando sesión..." : "Registrando cuenta..."}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span className="text-sm font-medium">
                          {mode === "login" ? "Iniciar sesión con Google" : "Registrarse con Google"}
                        </span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Footer */}
                <div className="text-center pt-4">
                  <p className={`text-sm ${
                    actualTheme === 'dark'
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}>
                    {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                    <button
                      type="button"
                      onClick={() => setMode(mode === "login" ? "register" : "login")}
                      className={`font-medium hover:underline transition-colors ${
                        actualTheme === 'dark'
                          ? 'text-gray-200 hover:text-white'
                          : 'text-gray-800 hover:text-gray-900'
                      }`}
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
      
      {/* Email Verification Modal */}
      <EmailVerificationModal
        isOpen={showEmailVerification}
        onClose={() => {
          setShowEmailVerification(false)
          setPendingVerificationEmail("")
        }}
        email={pendingVerificationEmail}
        onVerificationSuccess={(token) => {
          setShowEmailVerification(false)
          setPendingVerificationEmail("")
          onClose()
          showToast("¡Cuenta verificada e iniciada exitosamente!", "success")
        }}
        onBackToRegister={() => {
          setShowEmailVerification(false)
          setPendingVerificationEmail("")
          setMode("register")
        }}
      />
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => {
          setShowForgotPassword(false)
          setMode("login")
        }}
        onCloseAllModals={() => {
          setShowForgotPassword(false)
          onClose() // Cerrar el modal principal también
        }}
      />
      
      {/* Toast Notification */}
      <Toast 
        isVisible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
        position="top-center"
        duration={3000}
      />
    </>
  )
} 