"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function ScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = (window.scrollY / totalHeight) * 100
      setScrollProgress(currentProgress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 z-[100] origin-left"
      style={{ 
        width: `${scrollProgress}%`,
        filter: 'drop-shadow(0 0 6px currentColor)'
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: scrollProgress / 100 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
    />
  )
}
