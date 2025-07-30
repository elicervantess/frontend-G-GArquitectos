import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const loadingVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-gray-600 dark:text-gray-300",
        primary: "text-blue-600 dark:text-blue-400",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        danger: "text-red-600 dark:text-red-400",
        white: "text-white",
      },
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
  fullScreen?: boolean
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, variant, size, text, fullScreen = false, ...props }, ref) => {
    const content = (
      <div className={cn("flex flex-col items-center gap-2", className)} {...props}>
        <Loader2 
          className={cn(loadingVariants({ variant, size }), "animate-spin")} 
        />
        {text && (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {text}
          </span>
        )}
      </div>
    )

    if (fullScreen) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          {content}
        </div>
      )
    }

    return content
  }
)
Loading.displayName = "Loading"

// Componente de skeleton para contenido
const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"

// Componente de skeleton para texto
const SkeletonText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { lines?: number }>(
  ({ className, lines = 1, ...props }, ref) => (
    <div ref={ref} className="space-y-2" {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full", className)}
        />
      ))}
    </div>
  )
)
SkeletonText.displayName = "SkeletonText"

// Componente de skeleton para avatar
const SkeletonAvatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" | "xl" }>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    }
    
    return (
      <Skeleton
        ref={ref}
        className={cn("rounded-full", sizeClasses[size], className)}
        {...props}
      />
    )
  }
)
SkeletonAvatar.displayName = "SkeletonAvatar"

export { Loading, Skeleton, SkeletonText, SkeletonAvatar } 