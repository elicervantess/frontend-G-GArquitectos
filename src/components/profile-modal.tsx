import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit2, User, Mail, Camera, Check, X, ImageIcon, Eye, Upload, Trash2, Save, ArrowLeft, Sparkles, Key, Lock, Shield } from 'lucide-react'
import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertWithIcon } from "@/components/ui/alert"
import { useAuth } from '@/contexts/AuthContext'
import { useUserApi, UserRequestDto, ApiResponse } from '@/hooks/useUserApi'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
}

interface EditableFieldProps {
  label: string
  value: string
  icon: React.ReactNode
  onSave: (newValue: string) => void
  disabled?: boolean
  type?: 'text' | 'email'
}

interface PhotoOptionProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  variant?: 'default' | 'danger'
  disabled?: boolean
}

interface PasswordVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onVerified: () => void
  userEmail: string
}

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  userEmail: string
}

const EditableField = ({ label, value, icon, onSave, disabled = false, type = 'text' }: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = () => {
    if (editValue.trim() !== value) {
      onSave(editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-900/30 dark:to-slate-900/30 rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-700/50 text-slate-600 dark:text-slate-400 shadow-sm">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-inter mb-1">
              {label}
            </p>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type={type}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-9 text-sm border-slate-200 focus:border-gray-500 dark:border-slate-700 dark:focus:border-gray-400 font-inter bg-white/80 dark:bg-gray-900/80"
                  autoFocus
                  placeholder={`Ingresa tu ${label.toLowerCase()}`}
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSave}
                    className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="font-semibold text-gray-900 dark:text-gray-100 font-inter text-sm">
                {value || 'No especificado'}
              </p>
            )}
          </div>
        </div>
        {!disabled && !isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 h-9 w-9 p-0 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

const PhotoOption = ({ icon, title, description, onClick, variant = 'default', disabled = false }: PhotoOptionProps) => {
  const colorClasses = variant === 'danger' 
    ? "border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700 hover:bg-red-50/50 dark:hover:bg-red-900/20"
    : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"

  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer"

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : (e) => {
        e.stopPropagation() // Evitar que el clic se propague al overlay del modal
        onClick()
      }}
      disabled={disabled}
      className={`w-full p-4 rounded-2xl border-2 border-dashed ${colorClasses} ${disabledClasses} transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-gray-500/20`}
    >
      <div className="flex items-center gap-4 text-left">
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors shadow-sm">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 font-inter text-sm">{title}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-inter mt-0.5">{description}</p>
        </div>
      </div>
    </motion.button>
  )
}

const PasswordVerificationModal = ({ isOpen, onClose, onVerified, userEmail }: PasswordVerificationModalProps) => {
  const [password, setPassword] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState('')
  const { verifyPassword } = useUserApi()

  const handleVerify = async () => {
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const isValid = await verifyPassword(userEmail, password)
      if (isValid) {
        onVerified()
        onClose()
        setPassword('')
      } else {
        setError('Contraseña incorrecta')
      }
    } catch (error) {
      setError('Error al verificar contraseña')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-lg p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <Shield className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-inter mb-2">
                Verificar contraseña
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                Por seguridad, confirma tu contraseña actual
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Contraseña actual"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  className="w-full"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleVerify}
                  disabled={isVerifying || !password.trim()}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900"
                >
                  {isVerifying ? 'Verificando...' : 'Verificar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

const ChangePasswordModal = ({ isOpen, onClose, onSuccess, userEmail }: ChangePasswordModalProps) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChanging, setIsChanging] = useState(false)
  const [error, setError] = useState('')
  const { updateCurrentUser, getCurrentUser } = useUserApi()
  const { token } = useAuth()
  const [userFullName, setUserFullName] = useState('')

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (isOpen && token && !userFullName) {
      getCurrentUser(token).then(userData => {
        setUserFullName(userData.fullName)
      }).catch(error => {
        console.error('Error loading user data for password change:', error)
        setError('Error al cargar datos del usuario')
      })
    }
  }, [isOpen, token, userFullName, getCurrentUser])

  const handleChangePassword = async () => {
    setError('')

    // Validaciones
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden')
      return
    }

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres')
      return
    }

    setIsChanging(true)

    try {
      if (!token) {
        setError('No se encontró token de autenticación')
        setIsChanging(false)
        return
      }

      // Obtener el fullName actual del usuario
      if (!userFullName) {
        setError('No se pudo obtener el nombre del usuario')
        setIsChanging(false)
        return
      }

      console.log('🔐 Attempting to change password with:', {
        fullName: userFullName,
        email: userEmail,
        password: '[HIDDEN]'
      })

      const updateData: UserRequestDto = {
        fullName: userFullName,
        email: userEmail,
        password: newPassword
      }

      const result = await updateCurrentUser(token, updateData)
      
      if (!result.success) {
        setError(result.error || 'Error al cambiar contraseña')
        setIsChanging(false)
        return
      }
      
      // Limpiar formulario
      setNewPassword('')
      setConfirmPassword('')
      
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('❌ Error changing password:', error)
      setError('Error inesperado al cambiar contraseña')
    } finally {
      setIsChanging(false)
    }
  }

  const handleClose = () => {
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setUserFullName('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-lg p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <CardContent className="p-0">
            {/* Header */}
            <div className="p-6 border-b border-gray-100/50 dark:border-gray-800/50">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                  <Key className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-inter text-center mb-2">
                Cambiar contraseña
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-inter text-center">
                Ingresa tu nueva contraseña (ya verificamos tu identidad)
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nueva contraseña
                </label>
                <Input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar nueva contraseña
                </label>
                <Input
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isChanging}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={isChanging || !newPassword.trim() || !confirmPassword.trim()}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900"
                >
                  {isChanging ? 'Cambiando...' : 'Cambiar contraseña'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { user, token, updateUserProfile } = useAuth()
  const { getCurrentUser, updateCurrentUser, updateProfilePhoto, removeProfilePhoto } = useUserApi()
  
  // Estados principales
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isFileSelecting, setIsFileSelecting] = useState(false) // Nuevo estado para prevenir cierre durante selección
  
  // Estados para vistas del modal
  const [currentView, setCurrentView] = useState<'profile' | 'photo-options' | 'camera' | 'full-image'>('profile')
  
  // Estados para modales de contraseña
  const [isPasswordVerificationOpen, setIsPasswordVerificationOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  
  // Estados para notificaciones
  const [notification, setNotification] = useState<{
    show: boolean
    type: 'success' | 'error' | 'info'
    title: string
    message: string
  }>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  })
  
  // Estados para imagen
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  
  // Estado para el contador de contraseña
  const [passwordCooldownTime, setPasswordCooldownTime] = useState<string | null>(null)
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    setNotification({
      show: true,
      type,
      title,
      message
    })
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 4000)
  }

  // Cargar datos del usuario - SIN useCallback para evitar el bucle
  const loadUserData = async () => {
    if (!token) return
    
    setIsLoading(true)
    try {
      const data = await getCurrentUser(token)
      if (data) {
        setUserData(data)
        setOriginalImage(data.profileImage)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar datos solo cuando se abre el modal
  useEffect(() => {
    if (isOpen && token && !userData) {
      loadUserData()
    }
  }, [isOpen, token]) // Removido loadUserData de dependencias

  // Reset estado al cerrar
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('profile')
      setPreviewImage(null)
      setUserData(null) // Reset userData al cerrar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [isOpen])

  // Cleanup de cámara al desmontar
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  // Función para obtener el tiempo restante hasta poder cambiar la contraseña
  const getTimeUntilNextPasswordChange = useCallback(() => {
    if (!userData?.lastPasswordUpdate) {
      return null
    }

    const lastUpdate = new Date(userData.lastPasswordUpdate)
    const now = new Date()
    const twelveHoursInMs = 12 * 60 * 60 * 1000
    const timeElapsed = now.getTime() - lastUpdate.getTime()
    const timeRemaining = twelveHoursInMs - timeElapsed

    if (timeRemaining <= 0) {
      return null
    }

    const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000))
    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))

    if (hoursRemaining > 0) {
      return `${hoursRemaining}h ${minutesRemaining}m`
    } else {
      return `${minutesRemaining}m`
    }
  }, [userData?.lastPasswordUpdate])

  // Contador en tiempo real para restricción de contraseña
  useEffect(() => {
    if (!userData?.lastPasswordUpdate) {
      setPasswordCooldownTime(null)
      return
    }

    const updateCooldownTime = () => {
      const timeRemaining = getTimeUntilNextPasswordChange()
      setPasswordCooldownTime(timeRemaining)
    }

    // Actualizar inmediatamente
    updateCooldownTime()

    // Actualizar cada 30 segundos para mejor UX
    const interval = setInterval(updateCooldownTime, 30000)

    return () => clearInterval(interval)
  }, [userData?.lastPasswordUpdate, getTimeUntilNextPasswordChange])

  // Funciones para manejo de campos
  const handleFieldSave = async (field: string, newValue: string) => {
    if (!token || isSaving || !userData) return
    
    setIsSaving(true)
    try {
      console.log(`Guardando ${field}:`, newValue)
      
      // Preparar datos para actualizar - solo enviar campos específicos
      let updateData: UserRequestDto = {}

      if (field === 'fullName') {
        // Para fullName, necesitamos validar que no esté vacío según el backend
        if (!newValue.trim()) {
          throw new Error('El nombre completo no puede estar vacío')
        }
        updateData.fullName = newValue.trim()
      } else if (field === 'email') {
        // Nota: El email está deshabilitado en la UI, pero por si acaso
        updateData.email = newValue.trim()
      }

      console.log('📤 Sending update data:', updateData)

      // Llamar al endpoint de actualización
      const result = await updateCurrentUser(token, updateData)
      
      if (!result.success) {
        showNotification('error', 'Error', result.error || `Error al actualizar ${field === 'fullName' ? 'nombre' : 'email'}`)
        setIsSaving(false)
        return
      }
      
      // Actualizar estado local con los datos exitosos
      if (result.data) {
        setUserData(result.data)
        // Actualizar contexto de autenticación
        updateUserProfile(result.data)
      }
      
      console.log('✅ Campo actualizado exitosamente')
      showNotification('success', '¡Actualizado!', `${field === 'fullName' ? 'Nombre' : 'Email'} actualizado correctamente`)
    } catch (error: any) {
      console.error('❌ Error saving field:', error)
      showNotification('error', 'Error', 'Error inesperado al actualizar')
    } finally {
      setIsSaving(false)
    }
  }

  // Funciones para manejo de contraseña
  const handlePasswordVerified = () => {
    setIsChangePasswordOpen(true)
  }

  const handlePasswordChangeSuccess = async () => {
    showNotification('success', '¡Contraseña actualizada!', 'Tu contraseña se ha actualizada exitosamente')
    
    // Recargar los datos del usuario para obtener la nueva fecha de lastPasswordUpdate
    if (token) {
      try {
        const updatedUserData = await getCurrentUser(token)
        if (updatedUserData) {
          setUserData(updatedUserData)
          // También actualizar el contexto de Auth
          updateUserProfile(updatedUserData)
        }
      } catch (error) {
        console.error('Error reloading user data after password change:', error)
      }
    }
  }

  // Función para verificar si puede cambiar la contraseña (12 horas de espera)
  const canChangePassword = () => {
    if (!userData?.lastPasswordUpdate) {
      return true // Si no hay fecha anterior, puede cambiar
    }

    const lastUpdate = new Date(userData.lastPasswordUpdate)
    const now = new Date()
    const twelveHoursInMs = 12 * 60 * 60 * 1000 // 12 horas en milisegundos
    
    return (now.getTime() - lastUpdate.getTime()) >= twelveHoursInMs
  }

  // Función para verificar si el usuario es de Google (no tiene contraseña propia)
  const isGoogleUser = () => {
    return userData?.provider === 'GOOGLE' || user?.provider === 'GOOGLE'
  }

  // Función para verificar si debe mostrar la opción de cambiar contraseña
  const shouldShowPasswordOption = () => {
    return !isGoogleUser()
  }

  const handleChangePasswordClick = () => {
    if (!userData?.email) {
      showNotification('error', 'Error', 'No se pudo obtener el email del usuario')
      return
    }

    if (!canChangePassword()) {
      const timeRemaining = passwordCooldownTime || getTimeUntilNextPasswordChange()
      showNotification('error', 'Cambio de contraseña bloqueado', 
        `Por seguridad, solo puedes cambiar tu contraseña cada 12 horas. Intenta de nuevo en ${timeRemaining}.`)
      return
    }

    setIsPasswordVerificationOpen(true)
  }

  // Funciones para manejo de imágenes
  const openFileSelector = () => {
    console.log('🔍 Opening file selector...')
    setIsFileSelecting(true)
    // Pequeño delay para asegurar que el evento no se propague
    setTimeout(() => {
      fileInputRef.current?.click()
      // Resetear el estado después de un tiempo razonable
      setTimeout(() => {
        setIsFileSelecting(false)
      }, 2000) // 2 segundos debería ser suficiente para seleccionar archivo
    }, 50)
  }

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File selected, starting upload process...')
    setIsFileSelecting(false) // Resetear el estado de selección
    
    const file = event.target.files?.[0]
    if (!file) {
      console.log('❌ No file selected')
      return
    }

    console.log('📄 File details:', file.name, file.type, file.size)

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Archivo inválido', 'Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      showNotification('error', 'Archivo muy grande', 'La imagen es demasiado grande. Por favor, selecciona una imagen menor a 10MB')
      return
    }

    // Subir imagen al servidor directamente sin cerrar modal
    if (!token || !userData?.id) {
      showNotification('error', 'Error de autenticación', 'No se pudo verificar tu identidad')
      return
    }
    
    try {
      setIsSaving(true)
      console.log('📸 Subiendo imagen al servidor...', file.name)
      
      const response = await updateProfilePhoto(token, userData.id.toString(), file)
      
      if (response.success && response.data) {
        // Actualizar datos del usuario con la nueva imagen
        setUserData((prev: any) => ({ 
          ...prev, 
          profileImage: response.data!.profileImage 
        }))
        
        // Actualizar contexto de autenticación
        updateUserProfile({
          profileImage: response.data.profileImage
        })
        
        setOriginalImage(response.data.profileImage)
        setPreviewImage(null) // Limpiar preview
        
        // Volver a la vista principal del perfil después del éxito
        setCurrentView('profile')
        
        console.log('✅ Modal should stay open, changing view to profile')
        showNotification('success', '¡Foto actualizada!', 'Tu foto de perfil se ha actualizado correctamente')
        console.log('✅ Imagen subida exitosamente:', response.data.profileImage)
      } else {
        throw new Error(response.error || 'Error al subir la imagen')
      }
    } catch (error) {
      console.error('❌ Error al subir imagen:', error)
      console.log('📍 Error occurred, staying in photo-options view')
      setPreviewImage(null)
      showNotification('error', 'Error al subir imagen', error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      console.log('🔄 Upload process finished, isSaving will be set to false')
      setIsSaving(false)
    }
    
    // Limpiar input
    if (event.target) {
      event.target.value = ''
    }
  }, [token, userData?.id, updateProfilePhoto, updateUserProfile, showNotification])

  const startCamera = async () => {
    try {
      setCurrentView('camera')
      
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640, min: 320, max: 1280 },
          height: { ideal: 640, min: 320, max: 1280 },
          facingMode: 'user'
        },
        audio: false
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error)
      
      let errorMessage = 'No se pudo acceder a la cámara.'
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara en tu navegador.'
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No se encontró ninguna cámara en tu dispositivo.'
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'La cámara está siendo usada por otra aplicación.'
      }
      
      showNotification('error', 'Error de cámara', errorMessage)
      setCurrentView('photo-options')
    }
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')
    
    if (!context) return

    const size = Math.min(video.videoWidth, video.videoHeight)
    canvas.width = size
    canvas.height = size
    
    const startX = (video.videoWidth - size) / 2
    const startY = (video.videoHeight - size) / 2
    
    context.drawImage(video, startX, startY, size, size, 0, 0, size, size)
    
    const imageUrl = canvas.toDataURL('image/jpeg', 0.9)
    setPreviewImage(imageUrl)
    
    // Detener cámara
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    // NO cambiar vista aquí - mantener en camera mientras se sube
    console.log('📸 Foto capturada exitosamente')
    
    // Subir imagen al servidor
    if (!token || !userData?.id) {
      showNotification('error', 'Error de autenticación', 'No se pudo verificar tu identidad')
      return
    }
    
    try {
      setIsSaving(true)
      console.log('📸 Subiendo foto capturada al servidor...')
      
      // Convertir canvas a blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          showNotification('error', 'Error de imagen', 'No se pudo procesar la imagen capturada')
          return
        }
        
        // Crear archivo desde blob
        const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
        
        const response = await updateProfilePhoto(token, userData.id.toString(), file)
        
        if (response.success && response.data) {
          // Actualizar datos del usuario con la nueva imagen
          setUserData((prev: any) => ({ 
            ...prev, 
            profileImage: response.data!.profileImage 
          }))
          
          // Actualizar contexto de autenticación
          updateUserProfile({
            profileImage: response.data.profileImage
          })
          
          setOriginalImage(response.data.profileImage)
          setPreviewImage(null) // Limpiar preview
          
          // Volver a la vista principal del perfil después del éxito
          setCurrentView('profile')
          
          console.log('✅ Camera modal should stay open, changing view to profile')
          showNotification('success', '¡Foto actualizada!', 'Tu foto de perfil se ha actualizado correctamente')
          console.log('✅ Foto capturada y subida exitosamente:', response.data.profileImage)
        } else {
          throw new Error(response.error || 'Error al subir la imagen')
        }
        
        setIsSaving(false)
      }, 'image/jpeg', 0.9)
    } catch (error) {
      console.error('❌ Error al subir foto capturada:', error)
      setPreviewImage(null)
      showNotification('error', 'Error al subir imagen', error instanceof Error ? error.message : 'Error desconocido')
      setIsSaving(false)
    }
  }

  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCurrentView('photo-options')
  }

  const removePhoto = async () => {
    if (!token || !userData?.id) {
      showNotification('error', 'Error de autenticación', 'No se pudo verificar tu identidad')
      return
    }

    try {
      setIsSaving(true)
      console.log('🗑️ Eliminando foto de perfil del servidor...')
      
      const response = await removeProfilePhoto(token, userData.id.toString())
      
      if (response.success && response.data) {
        // Actualizar datos del usuario sin imagen
        setUserData((prev: any) => ({ 
          ...prev, 
          profileImage: response.data!.profileImage || null
        }))
        
        // Actualizar contexto de autenticación
        updateUserProfile({
          profileImage: response.data.profileImage || null
        })
        
        setOriginalImage(null)
        setPreviewImage(null)
        
        showNotification('success', '¡Foto eliminada!', 'Tu foto de perfil ha sido eliminada correctamente')
        console.log('✅ Foto eliminada exitosamente')
      } else {
        throw new Error(response.error || 'Error al eliminar la foto')
      }
    } catch (error) {
      console.error('❌ Error al eliminar foto:', error)
      showNotification('error', 'Error al eliminar foto', error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsSaving(false)
    }
    
    setCurrentView('profile')
  }

  const restoreOriginalPhoto = () => {
    setPreviewImage(null)
    console.log('Foto restaurada a la original')
  }

  // Función para cerrar modal
  const handleClose = () => {
    console.log('🚪 handleClose called - modal will close')
    
    // Prevenir cierre si se está seleccionando archivo
    if (isFileSelecting) {
      console.log('🚫 Preventing modal close - file selection in progress')
      return
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
            {/* Patrón de fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-transparent to-slate-50/30 dark:from-gray-900/10 dark:via-transparent dark:to-slate-900/10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-100/20 to-transparent dark:from-gray-800/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-100/20 to-transparent dark:from-slate-800/10 rounded-full blur-2xl" />
            
            <CardContent className="relative p-0">
              <AnimatePresence mode="wait">
                {/* Vista principal del perfil */}
                {currentView === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-y-auto max-h-[80vh]"
                  >
                    {/* Header */}
                    <div className="relative p-6 pb-4 border-b border-gray-100/50 dark:border-gray-800/50">
                      <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Sparkles className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent font-inter">
                            Mi Perfil
                          </h2>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-inter">
                          Gestiona tu información personal
                        </p>
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center py-16">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-gray-500 dark:border-gray-400 border-t-transparent rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="p-6 space-y-6">
                        {/* Sección de Avatar */}
                        <div className="flex flex-col items-center">
                          <div className="relative group">
                            {/* Avatar principal */}
                            <div 
                              className="relative cursor-pointer hover:scale-105 transition-transform duration-300"
                              onClick={() => setCurrentView('full-image')}
                            >
                              <Avatar className="w-28 h-28 border-4 border-white dark:border-gray-800 shadow-2xl ring-2 ring-gray-200 dark:ring-gray-700/50">
                                {previewImage ? (
                                  <img
                                    src={previewImage}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : userData?.profileImage ? (
                                  <img
                                    src={userData.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-3xl font-bold rounded-full font-inter">
                                    {userData?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                                  </div>
                                )}
                              </Avatar>
                              
                              {/* Overlay de vista */}
                              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Eye className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            
                            {/* Botón de editar */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-full p-2.5 shadow-lg border-3 border-white dark:border-gray-800 z-10 transition-all duration-200"
                              onClick={() => setCurrentView('photo-options')}
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          {/* Info del usuario */}
                          <div className="text-center mt-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-inter">
                              {userData?.fullName || user?.name || 'Usuario'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-inter mt-1">
                              {userData?.email || user?.email}
                            </p>
                            
                            {previewImage && (
                              <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={restoreOriginalPhoto}
                                className="mt-3 text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline font-inter transition-colors duration-200"
                              >
                                Restaurar foto original
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Campos editables */}
                        <div className="space-y-4">
                          <EditableField
                            label="Nombre completo"
                            value={userData?.fullName || user?.name || ''}
                            icon={<User className="w-4 h-4" />}
                            onSave={(newValue) => handleFieldSave('fullName', newValue)}
                          />

                          <EditableField
                            label="Correo electrónico"
                            value={userData?.email || user?.email || ''}
                            icon={<Mail className="w-4 h-4" />}
                            onSave={(newValue) => handleFieldSave('email', newValue)}
                            type="email"
                            disabled={true}
                          />

                        </div>

                        {/* Sección de seguridad - Solo mostrar si no es usuario de Google */}
                        {shouldShowPasswordOption() && (
                          <div className="mt-6 pt-6 border-t border-gray-100/50 dark:border-gray-800/50">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 font-inter flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Seguridad
                            </h4>
                            
                            <motion.button
                              whileHover={{ scale: canChangePassword() ? 1.02 : 1 }}
                              whileTap={{ scale: canChangePassword() ? 0.98 : 1 }}
                              onClick={handleChangePasswordClick}
                              disabled={!canChangePassword()}
                              className={`w-full p-4 rounded-2xl border transition-all duration-300 group ${
                                canChangePassword() 
                                  ? "bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-900/30 dark:to-slate-900/30 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/70 dark:hover:border-gray-600/70 cursor-pointer"
                                  : "bg-gray-100/50 dark:bg-gray-800/50 border-gray-200/30 dark:border-gray-700/30 cursor-not-allowed opacity-60"
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl shadow-sm transition-transform duration-200 ${
                                  canChangePassword()
                                    ? "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-700/50 text-slate-600 dark:text-slate-400 group-hover:scale-110"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                                }`}>
                                  <Key className="w-4 h-4" />
                                </div>
                                <div className="flex-1 text-left">
                                  <p className={`font-semibold font-inter text-sm ${
                                    canChangePassword()
                                      ? "text-gray-900 dark:text-gray-100"
                                      : "text-gray-500 dark:text-gray-400"
                                  }`}>
                                    Cambiar contraseña
                                  </p>
                                  <p className={`text-xs font-inter mt-0.5 ${
                                    canChangePassword()
                                      ? "text-gray-500 dark:text-gray-400"
                                      : "text-gray-400 dark:text-gray-500"
                                  }`}>
                                    {canChangePassword() 
                                      ? "Actualiza tu contraseña para mayor seguridad"
                                      : `Disponible en ${passwordCooldownTime || 'calculando...'} (12h de espera)`
                                    }
                                  </p>
                                </div>
                                {canChangePassword() && (
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                                  </div>
                                )}
                              </div>
                            </motion.button>
                          </div>
                        )}

                        {/* Información para usuarios de Google */}
                        {isGoogleUser() && (
                          <div className="mt-6 pt-6 border-t border-gray-100/50 dark:border-gray-800/50">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 font-inter flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              Seguridad
                            </h4>
                            
                            <div className="w-full p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50">
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400 shadow-sm">
                                  <Shield className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-blue-900 dark:text-blue-100 font-inter text-sm">
                                    Cuenta protegida por Google
                                  </p>
                                  <p className="text-xs text-blue-700 dark:text-blue-300 font-inter mt-0.5">
                                    Tu cuenta está asegurada mediante Google OAuth. No necesitas contraseña adicional.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="pt-4 border-t border-gray-100/50 dark:border-gray-800/50">
                          <p className="text-xs text-center text-gray-400 dark:text-gray-500 font-inter">
                            {isSaving ? 'Guardando cambios...' : 'Los cambios se guardarán automáticamente'}
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Vista de opciones de foto */}
                {currentView === 'photo-options' && (
                  <motion.div
                    key="photo-options"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[500px]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100/50 dark:border-gray-800/50">
                      <button
                        onClick={() => setCurrentView('profile')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-inter">Volver</span>
                      </button>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-inter">
                        Cambiar foto
                      </h3>
                      <div className="w-16"></div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center font-inter">
                        Elige cómo quieres actualizar tu foto de perfil
                      </p>
                      
                      {/* Indicador de carga si está subiendo */}
                      {isSaving && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                            />
                            <div>
                              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                Subiendo imagen...
                              </p>
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                Por favor espera mientras se actualiza tu foto
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <PhotoOption
                          icon={<Camera className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                          title="Tomar foto"
                          description="Usar la cámara del dispositivo"
                          onClick={startCamera}
                          disabled={isSaving}
                        />
                        
                        <PhotoOption
                          icon={<Upload className="w-5 h-5 text-green-600" />}
                          title="Subir imagen"
                          description="Elegir desde tu dispositivo (JPG, PNG, GIF)"
                          onClick={openFileSelector}
                          disabled={isSaving}
                        />

                        {(previewImage || userData?.profileImage) && (
                          <PhotoOption
                            icon={<Trash2 className="w-5 h-5 text-red-600" />}
                            title="Eliminar foto"
                            description="Usar avatar por defecto"
                            onClick={removePhoto}
                            variant="danger"
                            disabled={isSaving}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Vista de cámara */}
                {currentView === 'camera' && (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[600px]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100/50 dark:border-gray-800/50">
                      <button
                        onClick={cancelCamera}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-inter">Cancelar</span>
                      </button>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-inter">
                        Tomar foto
                      </h3>
                      <div className="w-16"></div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center font-inter">
                        Posiciona tu rostro en el centro del marco
                      </p>
                      
                      <div className="relative mb-6 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-inner">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-72 object-cover"
                        />
                        {/* Marco guía */}
                        <div className="absolute inset-4 border-4 border-dashed border-white/50 rounded-2xl pointer-events-none">
                          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={capturePhoto}
                          className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-8 py-3 rounded-xl font-inter font-semibold shadow-lg transition-all duration-200 flex items-center gap-2"
                        >
                          <Camera className="w-5 h-5" />
                          Capturar foto
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Vista de imagen completa */}
                {currentView === 'full-image' && (
                  <motion.div
                    key="full-image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[600px]"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100/50 dark:border-gray-800/50">
                      <button
                        onClick={() => setCurrentView('profile')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-inter">Volver</span>
                      </button>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-inter">
                        Foto de perfil
                      </h3>
                      <button
                        onClick={() => setCurrentView('photo-options')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="text-sm font-inter">Editar</span>
                      </button>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center p-6">
                      {previewImage || userData?.profileImage ? (
                        <img
                          src={previewImage || userData?.profileImage}
                          alt="Profile Full Size"
                          className="max-w-full max-h-[450px] object-contain rounded-2xl shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700"
                        />
                      ) : (
                        <div className="w-80 h-80 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-6xl font-bold rounded-2xl font-inter shadow-2xl">
                          {userData?.fullName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Input de archivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          onClick={(e) => e.stopPropagation()}
          className="hidden"
          aria-label="Seleccionar imagen de perfil"
        />
        
        {/* Canvas oculto para captura */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {/* Modales de contraseña */}
        <PasswordVerificationModal
          isOpen={isPasswordVerificationOpen}
          onClose={() => setIsPasswordVerificationOpen(false)}
          onVerified={handlePasswordVerified}
          userEmail={userData?.email || user?.email || ''}
        />

        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
          onSuccess={handlePasswordChangeSuccess}
          userEmail={userData?.email || user?.email || ''}
        />

        {/* Notificación Toast */}
        <AnimatePresence>
          {notification.show && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-70 w-full max-w-md px-4"
            >
              <AlertWithIcon
                variant={notification.type === 'error' ? 'destructive' : notification.type}
                title={notification.title}
                description={notification.message}
                showClose={true}
                onClose={() => setNotification(prev => ({ ...prev, show: false }))}
                className="shadow-2xl border-2 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export { ProfileModal as default }
