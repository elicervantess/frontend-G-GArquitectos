'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useDeviceOptimizations } from '@/hooks/useDeviceDetection'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { Button } from '@/components/ui/button'

interface UniversalModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg', 
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-screen-xl'
}

export function UniversalModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = ''
}: UniversalModalProps) {
  const { actualTheme } = useTheme()
  const { shouldReduceAnimations } = useDeviceOptimizations()
  const modalRef = useRef<HTMLDivElement>(null)

  // Navegación por teclado
  useKeyboardNavigation({
    isOpen,
    onClose: closeOnEscape ? onClose : () => {},
  })

  // Focus trap
  useEffect(() => {
    if (!isOpen) return

    const modal = modalRef.current
    if (!modal) return

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [isOpen])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: shouldReduceAnimations ? 0.1 : 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: shouldReduceAnimations ? 0.1 : 0.2 }
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: shouldReduceAnimations ? 1 : 0.95,
      y: shouldReduceAnimations ? 0 : 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        duration: shouldReduceAnimations ? 0.1 : 0.3,
        type: shouldReduceAnimations ? 'tween' as const : 'spring' as const,
        ...(shouldReduceAnimations ? {} : { stiffness: 300, damping: 25 })
      }
    },
    exit: { 
      opacity: 0, 
      scale: shouldReduceAnimations ? 1 : 0.95,
      y: shouldReduceAnimations ? 0 : 20,
      transition: { duration: shouldReduceAnimations ? 0.1 : 0.2 }
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose()
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className={`absolute inset-0 ${
              actualTheme === 'dark' 
                ? 'bg-black/60 backdrop-blur-md' 
                : 'bg-black/40 backdrop-blur-sm'
            }`}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className={`
              relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden
              ${actualTheme === 'dark' 
                ? 'bg-gray-900 border border-gray-700 shadow-2xl' 
                : 'bg-white border border-gray-200 shadow-xl'
              }
              rounded-2xl backdrop-blur-xl ${className}
            `}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className={`
                flex items-center justify-between p-6 border-b
                ${actualTheme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <div className="space-y-1">
                  {title && (
                    <h2 
                      id="modal-title"
                      className={`text-xl font-semibold ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p 
                      id="modal-description"
                      className={`text-sm ${
                        actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {description}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className={`
                      rounded-full hover:scale-110 transition-transform
                      ${actualTheme === 'dark' 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                      }
                    `}
                    aria-label="Cerrar modal"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Hook para controlar modales con mejor UX
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  }
}
