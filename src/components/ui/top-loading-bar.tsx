import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface TopLoadingBarProps {
  isLoading: boolean
  className?: string
  color?: "default" | "primary" | "success" | "warning" | "danger"
  height?: number
}

const colorClasses = {
  default: "bg-gray-600",
  primary: "bg-blue-600",
  success: "bg-green-600", 
  warning: "bg-yellow-600",
  danger: "bg-red-600"
}

export const TopLoadingBar = React.forwardRef<HTMLDivElement, TopLoadingBarProps>(
  ({ isLoading, className, color = "primary", height = 3 }, ref) => {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            ref={ref}
            className={cn(
              "fixed top-0 left-0 right-0 z-[9999] overflow-hidden",
              className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={cn(
                "h-full shadow-lg shadow-current/20",
                colorClasses[color]
              )}
              style={{ height: `${height}px` }}
              initial={{ x: "-100%" }}
              animate={{ 
                x: ["−100%", "0%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            />
            
            {/* Glow effect */}
            <motion.div
              className={cn(
                "absolute top-0 h-full w-20 blur-sm opacity-60",
                colorClasses[color]
              )}
              style={{ height: `${height}px` }}
              initial={{ x: "-100px" }}
              animate={{ 
                x: ["−100px", "calc(100vw - 80px)", "100vw"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

TopLoadingBar.displayName = "TopLoadingBar"

export { TopLoadingBar as default }
