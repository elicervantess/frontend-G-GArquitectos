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
        navbar: "h-9 w-9", // Tamaño específico para navbar
      },
      variant: {
        default: "bg-gray-100 dark:bg-gray-800",
        primary: "bg-gray-200 dark:bg-gray-700",
        success: "bg-green-100 dark:bg-green-900",
        warning: "bg-yellow-100 dark:bg-yellow-900",
        danger: "bg-red-100 dark:bg-red-900",
        glass: "bg-white/20 backdrop-blur-sm border border-white/30",
        navbar: "bg-transparent", // Sin fondo para navbar
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
    const [isLoading, setIsLoading] = React.useState(false) // Solo mostrar loading cuando sea necesario
    const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false) // Track si ya cargó una vez
    
    // Debug logs (solo cuando sea necesario)
    if (src && !hasLoadedOnce) {
      console.log('🎭 Avatar primera carga:', { src, name })
    }
    
    // Reset states when src changes - pero sin loading innecesario
    React.useEffect(() => {
      if (src && !hasLoadedOnce) {
        setImageError(false)
        setIsLoading(true)
      } else if (src && hasLoadedOnce) {
        // Ya cargó antes, no mostrar loading
        setImageError(false)
        setIsLoading(false)
      }
    }, [src, hasLoadedOnce])
    
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
      setHasLoadedOnce(true) // Marcar que ya cargó una vez
    }
    
    const handleImageError = () => {
      console.log('❌ Error al cargar imagen de perfil:', src)
      setIsLoading(false)
      setImageError(true)
      setHasLoadedOnce(true) // Marcar que ya intentó cargar
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
              "aspect-square h-full w-full object-cover transition-all duration-300 rounded-full",
              isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100",
              variant === "navbar" && "border-0" // Sin borde adicional para navbar
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="eager" // Cargar imágenes inmediatamente
          />
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className={cn(
            "absolute inset-0 flex h-full w-full items-center justify-center",
            variant === "navbar" 
              ? "bg-transparent" 
              : "bg-gray-100 dark:bg-gray-800"
          )}>
            {variant !== "navbar" && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300" />
            )}
          </div>
        )}
        
        {shouldShowFallback && (
          <div className="flex h-full w-full items-center justify-center">
            {fallbackContent ? (
              <span className={cn(
                "text-sm font-medium",
                variant === "navbar" 
                  ? "text-gray-700 dark:text-gray-200"
                  : "text-gray-600 dark:text-gray-300"
              )}>
                {fallbackContent}
              </span>
            ) : (
              <User className={cn(
                "h-1/2 w-1/2",
                variant === "navbar"
                  ? "text-gray-700 dark:text-gray-200"
                  : "text-gray-400"
              )} />
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