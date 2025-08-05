import { useEffect, useRef, useState } from 'react'

interface UseOptimizedInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function useOptimizedInView(options: UseOptimizedInViewOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Si ya se activó y triggerOnce está habilitado, no hacer nada
    if (hasTriggered && triggerOnce) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setIsInView(isVisible)
        
        if (isVisible && triggerOnce) {
          setHasTriggered(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, hasTriggered])

  return { ref, isInView: hasTriggered ? true : isInView }
}
