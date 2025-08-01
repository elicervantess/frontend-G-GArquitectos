import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  isVisible: boolean
  message: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose?: () => void
  position?: "top-right" | "top-center" | "top-left" | "bottom-right" | "bottom-center" | "bottom-left"
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    iconClassName: "text-green-600 dark:text-green-400"
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
    iconClassName: "text-red-600 dark:text-red-400"
  },
  warning: {
    icon: AlertCircle,
    className: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    iconClassName: "text-yellow-600 dark:text-yellow-400"
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
    iconClassName: "text-blue-600 dark:text-blue-400"
  }
}

const positionClasses = {
  "top-right": "top-4 right-4",
  "top-center": "top-4 left-1/2 transform -translate-x-1/2",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  "bottom-left": "bottom-4 left-4"
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    isVisible, 
    message, 
    type = "info", 
    duration = 4000, 
    onClose,
    position = "top-right",
    ...props 
  }, ref) => {
    const config = typeConfig[type]
    const Icon = config.icon

    React.useEffect(() => {
      if (isVisible && duration > 0) {
        const timer = setTimeout(() => {
          onClose?.()
        }, duration)

        return () => clearTimeout(timer)
      }
    }, [isVisible, duration, onClose])

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed z-[10000] min-w-[300px] max-w-md",
              positionClasses[position]
            )}
            {...props}
          >
            <div className={cn(
              "flex items-center gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm",
              config.className
            )}>
              <Icon className={cn("w-5 h-5 flex-shrink-0", config.iconClassName)} />
              <p className="flex-1 text-sm font-medium">{message}</p>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-xl"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

Toast.displayName = "Toast"

// Hook para gestionar toasts
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    message: string
    type: ToastProps['type']
    duration?: number
  }>>([])

  const showToast = React.useCallback((
    message: string, 
    type: ToastProps['type'] = "info",
    duration = 4000
  ) => {
    const id = Math.random().toString(36).substring(2)
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const clearAllToasts = React.useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts
  }
}

export { Toast as default }
