import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, generateInitials } from "@/lib/utils"
import { User } from "lucide-react"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
      },
      variant: {
        default: "bg-gray-100 dark:bg-gray-800",
        primary: "bg-gray-200 dark:bg-gray-700",
        success: "bg-green-100 dark:bg-green-900",
        warning: "bg-yellow-100 dark:bg-yellow-900",
        danger: "bg-red-100 dark:bg-red-900",
        glass: "bg-white/20 backdrop-blur-sm border border-white/30",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  name?: string // Nuevo prop para el nombre del usuario
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, variant, src, alt, fallback, name, children, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    
    const shouldShowFallback = !src || imageError
    
    // Generar iniciales si se proporciona un nombre
    const initials = name ? generateInitials(name) : null
    
    // Determinar qué mostrar en el fallback
    const getFallbackContent = () => {
      if (fallback) return fallback
      if (initials) return initials
      return null
    }
    
    const fallbackContent = getFallbackContent()
    
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant }), className)}
        {...props}
      >
        {!shouldShowFallback && (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        
        {shouldShowFallback && (
          <div className="flex h-full w-full items-center justify-center">
            {fallbackContent ? (
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {fallbackContent}
              </span>
            ) : (
              <User className="h-1/2 w-1/2 text-gray-400" />
            )}
          </div>
        )}
        
        {children}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar, avatarVariants } 