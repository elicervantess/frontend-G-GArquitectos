import { useEffect, useCallback } from 'react'

interface UseKeyboardNavigationProps {
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrev?: () => void
  onSelect?: () => void
}

export function useKeyboardNavigation({
  isOpen,
  onClose,
  onNext,
  onPrev,
  onSelect
}: UseKeyboardNavigationProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        onClose()
        break
      case 'ArrowRight':
        if (onNext) {
          event.preventDefault()
          onNext()
        }
        break
      case 'ArrowLeft':
        if (onPrev) {
          event.preventDefault()
          onPrev()
        }
        break
      case 'Enter':
      case ' ':
        if (onSelect) {
          event.preventDefault()
          onSelect()
        }
        break
      case 'Tab':
        // Permitir navegación con Tab, pero manejar el foco
        if (event.shiftKey && onPrev) {
          // Shift+Tab = anterior
        } else if (onNext) {
          // Tab = siguiente
        }
        break
    }
  }, [isOpen, onClose, onNext, onPrev, onSelect])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  return { handleKeyDown }
}
