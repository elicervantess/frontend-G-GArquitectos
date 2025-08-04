import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"
import { useDeviceOptimizations } from "@/hooks/useDeviceDetection"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-opacity-50 active:scale-[0.98] transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl focus-visible:ring-blue-500 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600",
        destructive:
          "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:from-red-700 hover:to-red-800 hover:shadow-xl focus-visible:ring-red-500 dark:from-red-500 dark:to-red-600",
        outline:
          "border-2 border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 shadow-sm hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-gray-400 dark:border-gray-600 dark:bg-gray-800/80 dark:text-white dark:hover:bg-gray-700/80 dark:hover:border-gray-500",
        secondary:
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-sm hover:from-gray-200 hover:to-gray-300 focus-visible:ring-gray-400 dark:from-gray-700 dark:to-gray-800 dark:text-white dark:hover:from-gray-600 dark:hover:to-gray-700",
        ghost:
          "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 backdrop-blur-sm focus-visible:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700 focus-visible:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300",
      },
      size: {
        default: "h-10 px-6 py-2 text-sm has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-4 text-xs has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  icon,
  children,
  disabled,
  onClick,
  ...props
}, ref) => {
  const { actualTheme } = useTheme()
  const { shouldReduceAnimations } = useDeviceOptimizations()
  const Comp = asChild ? Slot : "button"

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return
    onClick?.(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!loading && !disabled) {
        handleClick(e as any)
      }
    }
  }

  const buttonContent = (
    <>
      {loading && (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        />
      )}
      {!loading && icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </>
  )

  if (shouldReduceAnimations) {
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {buttonContent}
      </Comp>
    </motion.div>
  )
})

Button.displayName = "Button"

export { Button, buttonVariants }
