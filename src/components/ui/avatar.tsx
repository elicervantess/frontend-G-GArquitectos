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
    const [isLoading, setIsLoading] = React.useState(!!src)
    const [retryCount, setRetryCount] = React.useState(0)
    const maxRetries = 3
    
    // Reset states when src changes
    React.useEffect(() => {
      if (src) {
        setImageError(false)
        setIsLoading(true)
        setRetryCount(0)
      }
    }, [src])
    
    // Retry loading image after error (useful for Google profile images that might not be ready yet)
    React.useEffect(() => {
      if (imageError && retryCount < maxRetries && src) {
        const timer = setTimeout(() => {
          console.log(`🔄 Reintentando cargar imagen (intento ${retryCount + 1}/${maxRetries}):`, src)
          setImageError(false)
          setIsLoading(true)
          setRetryCount(prev => prev + 1)
        }, (retryCount + 1) * 2000) // 2s, 4s, 6s delays
        
        return () => clearTimeout(timer)
      }
    }, [imageError, retryCount, src, maxRetries])
    
    const shouldShowFallback = (!src || imageError) && !isLoading
    
    // Generar iniciales si se proporciona un nombre
    const initials = name ? generateInitials(name) : null
    
    // Determinar qué mostrar en el fallback
    const getFallbackContent = () => {
      if (fallback) return fallback
      if (initials) return initials
      return null
    }
    
    const fallbackContent = getFallbackContent()
    
    const handleImageLoad = () => {
      console.log('✅ Imagen de perfil cargada exitosamente:', src)
      setIsLoading(false)
      setImageError(false)
    }
    
    const handleImageError = () => {
      console.log('❌ Error al cargar imagen de perfil:', src)
      setIsLoading(false)
      setImageError(true)
    }
    
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, variant }), className)}
        {...props}
      >
        {src && !imageError && (
          <img
            src={src}
            alt={alt}
            className={cn(
              "aspect-square h-full w-full object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
          </div>
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