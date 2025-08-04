'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Mail, Clock, AlertCircle, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { UniversalModal } from '../ui/universal-modal'
import { useEmailVerification } from '@/hooks/useEmailVerification'
import { useTheme } from '@/contexts/ThemeContext'
import { useDeviceOptimizations } from '@/hooks/useDeviceDetection'

interface EmailVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
  onVerificationSuccess?: (token: string) => void
  onBackToRegister?: () => void
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
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  
  const { verifyEmail, resendVerificationCode, clearError, isLoading, error } = useEmailVerification()
  const { actualTheme } = useTheme()
  const { shouldReduceAnimations } = useDeviceOptimizations()

  // Animation variants optimized for performance
  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceAnimations ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: shouldReduceAnimations ? 0.1 : 0.3,
        staggerChildren: shouldReduceAnimations ? 0 : 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: shouldReduceAnimations ? 1 : 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: shouldReduceAnimations ? 0.1 : 0.2 }
    }
  }

  const codeInputVariants = {
    idle: { scale: 1, borderColor: actualTheme === 'dark' ? '#374151' : '#d1d5db' },
    focus: { 
      scale: shouldReduceAnimations ? 1 : 1.05, 
      borderColor: '#3b82f6',
      transition: { duration: shouldReduceAnimations ? 0.1 : 0.2 }
    },
    success: { 
      scale: shouldReduceAnimations ? 1 : 1.02, 
      borderColor: '#10b981',
      backgroundColor: actualTheme === 'dark' ? '#064e3b' : '#dcfce7'
    }
  }

  // Countdown timer for resend
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

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setVerificationCode('')
      setSuccess(false)
      setTimeLeft(60)
      setCanResend(false)
      setIsVerifying(false)
      clearError()
      
      // Focus first input with slight delay for better UX
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 300)
    }
  }, [isOpen, clearError])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Only one digit per input
    
    const newCode = verificationCode.split('')
    newCode[index] = value
    
    const updatedCode = newCode.join('')
    setVerificationCode(updatedCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when 6 digits are complete
    if (updatedCode.length === 6 && newCode.every(digit => digit !== '')) {
      handleVerify(updatedCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      // Clear current field and focus previous
      const newCode = verificationCode.split('')
      newCode[index] = ''
      setVerificationCode(newCode.join(''))
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      setVerificationCode(pastedData)
      // Focus last input
      inputRefs.current[5]?.focus()
      // Auto-verify pasted code
      setTimeout(() => handleVerify(pastedData), 100)
    }
  }

  const handleVerify = async (code = verificationCode) => {
    if (code.length !== 6 || isVerifying) return

    setIsVerifying(true)
    try {
      const result = await verifyEmail(email, code)
      
      if (result.success) {
        setSuccess(true)
        
        // Enhanced success feedback
        if (!shouldReduceAnimations) {
          // Animate all inputs to success state
          inputRefs.current.forEach((input, index) => {
            if (input) {
              setTimeout(() => {
                input.style.borderColor = '#10b981'
                input.style.backgroundColor = actualTheme === 'dark' ? '#064e3b' : '#dcfce7'
              }, index * 50)
            }
          })
        }

        if (onVerificationSuccess && result.token) {
          setTimeout(() => {
            onVerificationSuccess(result.token!)
            onClose()
          }, 2000)
        } else {
          setTimeout(() => {
            onClose()
          }, 2000)
        }
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (!canResend || isLoading) return

    const result = await resendVerificationCode(email)
    
    if (result.success) {
      setTimeLeft(60)
      setCanResend(false)
      setVerificationCode('')
      inputRefs.current[0]?.focus()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verificar Email"
      description={`Hemos enviado un código de 6 dígitos a ${email}`}
      size="md"
      className="max-w-md"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 space-y-6"
      >
        {success ? (
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <motion.div
              initial={shouldReduceAnimations ? false : { scale: 0 }}
              animate={shouldReduceAnimations ? false : { scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </motion.div>
            
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                ¡Email Verificado!
              </h3>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Tu cuenta ha sido verificada exitosamente
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Email Icon */}
            <motion.div variants={itemVariants} className="text-center">
              <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                actualTheme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
            </motion.div>

            {/* Code Input Fields */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {Array.from({ length: 6 }, (_, index) => (
                  <motion.input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    variants={codeInputVariants}
                    initial="idle"
                    whileFocus="focus"
                    animate={success ? "success" : "idle"}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={verificationCode[index] || ''}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={isVerifying || success}
                    className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      actualTheme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } ${window.innerWidth < 768 ? 'text-lg' : ''}`}
                    aria-label={`Dígito ${index + 1} del código de verificación`}
                  />
                ))}
              </div>

              {/* Loading State */}
              {isVerifying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-sm text-blue-500"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando...
                </motion.div>
              )}
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div
                variants={itemVariants}
                className={`p-3 rounded-lg border-l-4 border-red-500 flex items-start gap-2 ${
                  actualTheme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'
                }`}
              >
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className={`text-sm ${
                  actualTheme === 'dark' ? 'text-red-200' : 'text-red-800'
                }`}>
                  {error}
                </p>
              </motion.div>
            )}

            {/* Resend Section */}
            <motion.div variants={itemVariants} className="text-center space-y-3">
              {canResend ? (
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={isLoading}
                  loading={isLoading}
                  icon={<RefreshCw className="w-4 h-4" />}
                  className="w-full"
                >
                  Reenviar código
                </Button>
              ) : (
                <div className={`flex items-center justify-center gap-2 text-sm ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <Clock className="w-4 h-4" />
                  Reenviar en {formatTime(timeLeft)}
                </div>
              )}

              <div className={`text-xs ${
                actualTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                ¿No recibiste el código? Revisa tu carpeta de spam
              </div>
            </motion.div>

            {/* Back Button */}
            {onBackToRegister && (
              <motion.div variants={itemVariants}>
                <Button
                  variant="ghost"
                  onClick={onBackToRegister}
                  disabled={isVerifying}
                  icon={<ArrowLeft className="w-4 h-4" />}
                  className="w-full"
                >
                  Volver al registro
                </Button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </UniversalModal>
  )
}
