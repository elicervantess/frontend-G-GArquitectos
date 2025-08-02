'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Loading } from '../ui/loading'
import { CheckCircle2, Mail, Clock, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { useEmailVerification } from '@/hooks/useEmailVerification'

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onVerificationSuccess: (token: string) => void
  onBackToRegister: () => void
}

export function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onVerificationSuccess,
  onBackToRegister
}: EmailVerificationModalProps) {
  const [verificationCode, setVerificationCode] = useState('')
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60 segundos para reenviar
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  
  const { verifyEmail, resendVerificationCode, clearError, isLoading, error } = useEmailVerification()
  // Countdown timer para reenvío
  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setCanResend(true)
    }
  }, [isOpen, timeLeft])

  // Reset cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setVerificationCode('')
      setSuccess(false)
      setTimeLeft(60)
      setCanResend(false)
      // Focus al primer input cuando se abre el modal
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 200)
    }
  }, [isOpen])

  // Limpiar errores cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearError()
    }
  }, [isOpen, clearError])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Solo un dígito por input
    
    const newCode = verificationCode.split('')
    newCode[index] = value
    
    const updatedCode = newCode.join('')
    setVerificationCode(updatedCode)

    // Auto-focus al siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verificar cuando se completen los 6 dígitos
    // Verificar que el código tenga 6 caracteres y no tenga espacios vacíos
    if (updatedCode.length === 6 && newCode.every(digit => digit !== '')) {
      handleVerify(updatedCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (code = verificationCode) => {
    if (code.length !== 6) {
      return
    }

    const result = await verifyEmail(email, code)
    
    if (result.success && result.token) {
      setSuccess(true)
      setTimeout(() => {
        onVerificationSuccess(result.token!)
      }, 1500)
    }
  }

  const handleResend = async () => {
    const result = await resendVerificationCode(email)
    
    if (result.success) {
      setTimeLeft(60)
      setCanResend(false)
      setVerificationCode('')
      // Focus al primer input después de un pequeño delay
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            Verifica tu email
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center py-8"
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Email verificado!
              </h3>
              <p className="text-gray-600 text-center">
                Tu cuenta ha sido verificada exitosamente
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Hemos enviado un código de verificación de 6 dígitos a:
                </p>
                <p className="font-semibold text-gray-900">{email}</p>
              </div>

              {/* Inputs para el código */}
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-semibold"
                      value={verificationCode[index] || ''}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isLoading || success}
                    />
                  ))}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleVerify()}
                  disabled={verificationCode.length !== 6 || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar código'
                  )}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <Button
                    variant="ghost"
                    onClick={onBackToRegister}
                    className="p-0 h-auto text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Cambiar email
                  </Button>

                  {canResend ? (
                    <Button
                      variant="ghost"
                      onClick={handleResend}
                      disabled={isLoading}
                      className="p-0 h-auto text-blue-600 hover:text-blue-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Reenviando...
                        </>
                      ) : (
                        'Reenviar código'
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      {formatTime(timeLeft)}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center text-xs text-gray-500">
                ¿No recibiste el código? Revisa tu carpeta de spam o correo no deseado
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
