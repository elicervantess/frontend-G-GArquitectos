"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle, Loader2, ArrowRight, Key, Sparkles, XCircle, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Toast from "@/components/ui/toast"
import { usePasswordReset } from "@/hooks/usePasswordReset"
import { useAuth } from "@/contexts/AuthContext"

interface PasswordStrength {
  score: number
  label: string
  color: string
  suggestions: string[]
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [touched, setTouched] = useState({ password: false, confirm: false })
  const [tokenStatus, setTokenStatus] = useState<'checking' | 'valid' | 'invalid' | 'used' | 'expired'>('checking')

  // Toast state
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info")

  const { resetPassword, checkResetToken } = usePasswordReset()
  const { loginWithToken } = useAuth()

  // Verificar token al cargar (SOLO UNA VEZ)
  useEffect(() => {
    const verifyToken = async () => {
      // NO verificar si ya tenemos éxito o si el token ya fue procesado
      if (!token || success || tokenStatus !== 'checking') {
        if (!token) {
          setTokenStatus('invalid')
          setError("Token de recuperación inválido")
        }
        return
      }

      try {
        const result = await checkResetToken(token)
        
        if (result.valid) {
          setTokenStatus('valid')
          showToast("Ingresa tu nueva contraseña", "info")
        } else if (result.used) {
          setTokenStatus('used')
          setError("Este enlace ya fue utilizado para cambiar la contraseña")
        } else if (result.expired) {
          setTokenStatus('expired')
          setError("El enlace de recuperación ha expirado")
        } else {
          setTokenStatus('invalid')
          setError(result.message || "Token inválido")
        }
      } catch (err) {
        setTokenStatus('invalid')
        setError("Error al verificar el token")
      }
    }

    verifyToken()
  }, [token]) // REMOVEMOS checkResetToken de las dependencias para evitar re-ejecuciones

  // Toast helper function
  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  // Password strength analyzer
  const analyzePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: "Ingresa una contraseña", color: "text-gray-400", suggestions: [] }
    }

    let score = 0
    const suggestions: string[] = []

    // Length check
    if (password.length >= 8) score += 1
    else suggestions.push("Al menos 8 caracteres")

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1
    else suggestions.push("Una letra mayúscula")

    // Lowercase check
    if (/[a-z]/.test(password)) score += 1
    else suggestions.push("Una letra minúscula")

    // Number check
    if (/\d/.test(password)) score += 1
    else suggestions.push("Un número")

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1
    else suggestions.push("Un carácter especial")

    let label = ""
    let color = ""

    if (score <= 1) {
      label = "Muy débil"
      color = "text-red-500"
    } else if (score <= 2) {
      label = "Débil"
      color = "text-orange-500"
    } else if (score <= 3) {
      label = "Regular"
      color = "text-yellow-500"
    } else if (score <= 4) {
      label = "Fuerte"
      color = "text-blue-500"
    } else {
      label = "Muy fuerte"
      color = "text-green-500"
    }

    return { score, label, color, suggestions }
  }

  const passwordStrength = analyzePasswordStrength(newPassword)

  const validateForm = () => {
    if (!newPassword.trim()) {
      setError("La nueva contraseña es requerida")
      return false
    }

    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return false
    }

    if (!confirmPassword.trim()) {
      setError("Debes confirmar tu nueva contraseña")
      return false
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await resetPassword(token, newPassword)

      if (response.success) {
        setSuccess(true)
        showToast("¡Contraseña actualizada exitosamente!", "success")
        
        // AUTO-LOGIN: Si el backend retorna un token JWT, hacer login automático
        if (response.token && response.user) {
          console.log('🔐 Iniciando sesión automáticamente después del reset...')
          
          try {
            const loginResult = await loginWithToken(response.token, response.user)
            
            if (loginResult.success) {
              showToast("¡Sesión iniciada automáticamente!", "success")
              // NO REDIRIGIR AUTOMÁTICAMENTE - Solo cuando el usuario presione el botón
            } else {
              console.error('Error en auto-login:', loginResult.error)
              // Mostrar éxito pero sin auto-login automático
            }
          } catch (autoLoginError) {
            console.error('Error durante auto-login:', autoLoginError)
            // Mostrar éxito pero sin auto-login automático
          }
        } else {
          // Sin auto-login, pero NO redirigir automáticamente
          console.log('No hay token de auto-login disponible')
        }
      } else {
        setError(response.message)
        showToast("Error al actualizar contraseña", "error")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      showToast("Error al actualizar contraseña", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordChange = (value: string) => {
    setNewPassword(value)
    if (error) setError("")
    if (!touched.password) setTouched(prev => ({ ...prev, password: true }))
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (error) setError("")
    if (!touched.confirm) setTouched(prev => ({ ...prev, confirm: true }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-auto"
      >
        <Card className="relative overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-900">
          {/* Header */}
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mx-auto shadow-xl"
            >
              <Key className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {success ? "¡Contraseña actualizada!" : "Nueva contraseña"}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {success 
                  ? "Tu contraseña se ha actualizado exitosamente" 
                  : "Crea una contraseña segura para tu cuenta"
                }
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {tokenStatus === 'checking' ? (
                <motion.div
                  key="checking"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                    <Loader2 className="w-8 h-8 text-gray-600 dark:text-gray-300 animate-spin" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Verificando enlace...
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Validando el token de recuperación
                    </p>
                  </div>
                </motion.div>
              ) : tokenStatus === 'used' ? (
                <motion.div
                  key="used"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Enlace ya utilizado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Este enlace ya fue utilizado para cambiar la contraseña.<br />
                      Si necesitas cambiar tu contraseña nuevamente, solicita un nuevo enlace.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push("/")}
                      className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white"
                    >
                      Ir al login
                    </Button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Desde allí puedes solicitar un nuevo enlace si lo necesitas
                    </p>
                  </div>
                </motion.div>
              ) : tokenStatus === 'expired' ? (
                <motion.div
                  key="expired"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Enlace expirado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Este enlace de recuperación ha expirado por seguridad.<br />
                      Los enlaces son válidos solo por 30 minutos.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push("/")}
                      className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white"
                    >
                      Solicitar nuevo enlace
                    </Button>
                  </div>
                </motion.div>
              ) : tokenStatus === 'invalid' ? (
                <motion.div
                  key="invalid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Enlace inválido
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Este enlace de recuperación no es válido o ha sido modificado.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push("/")}
                      className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white"
                    >
                      Ir al login
                    </Button>
                  </div>
                </motion.div>
              ) : success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto shadow-xl"
                  >
                    <CheckCircle className="w-10 h-10 text-gray-700 dark:text-gray-300" />
                  </motion.div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      ¡Contraseña actualizada!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Tu contraseña se ha cambiado exitosamente.<br />
                      <span className="font-medium text-gray-900 dark:text-gray-100">¡Ya has iniciado sesión automáticamente!</span>
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-4">
                      <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>¡Listo para continuar navegando!</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-6">
                    <Button
                      onClick={() => router.push("/")}
                      className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Ir a la página principal
                    </Button>
                  </div>
                </motion.div>
              ) : tokenStatus === 'valid' ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nueva contraseña */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          placeholder="Mínimo 6 caracteres"
                          leftIcon={<Lock className="w-4 h-4" />}
                          rightIcon={
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowPassword(!showPassword)}
                              className="hover:bg-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          }
                          required
                          disabled={isSubmitting}
                          className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-gray-400 dark:focus:border-gray-500"
                        />
                      </div>

                      {/* Password Strength Meter */}
                      {touched.password && newPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Fortaleza de contraseña</span>
                            <span className={`text-xs font-medium ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                passwordStrength.score <= 1 ? 'bg-red-500' :
                                passwordStrength.score <= 2 ? 'bg-orange-500' :
                                passwordStrength.score <= 3 ? 'bg-yellow-500' :
                                passwordStrength.score <= 4 ? 'bg-gray-500' : 'bg-gray-800'
                              }`}
                            />
                          </div>
                          {passwordStrength.suggestions.length > 0 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                              <p>Para mejorar tu contraseña, agrega:</p>
                              <ul className="list-disc list-inside space-y-0.5 ml-2">
                                {passwordStrength.suggestions.slice(0, 3).map((suggestion, index) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirmar nueva contraseña
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                          placeholder="Repite tu nueva contraseña"
                          leftIcon={<Shield className="w-4 h-4" />}
                          rightIcon={
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="hover:bg-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          }
                          required
                          disabled={isSubmitting}
                          className="h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-gray-400 dark:focus:border-gray-500"
                        />
                      </div>

                      {/* Password Match Indicator */}
                      {touched.confirm && confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`flex items-center gap-2 text-xs ${
                            newPassword === confirmPassword ? 'text-gray-600 dark:text-gray-400' : 'text-red-500 dark:text-red-400'
                          }`}
                        >
                          {newPassword === confirmPassword ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Las contraseñas coinciden
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3" />
                              Las contraseñas no coinciden
                            </>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Error Alert */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg"
                      >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || !newPassword.trim() || !confirmPassword.trim() || newPassword !== confirmPassword}
                      className="w-full h-12 bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Actualizando contraseña...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Actualizar contraseña
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Security Info */}
                  <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Shield className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">Consejos de seguridad</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Usa una combinación de letras, números y símbolos</li>
                          <li>Evita usar información personal obvia</li>
                          <li>Considera usar un gestor de contraseñas</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Toast Notification */}
      <Toast 
        isVisible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
        position="top-center"
        duration={4000}
      />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
