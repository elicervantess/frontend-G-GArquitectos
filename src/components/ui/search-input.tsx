"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { Button } from "./button"
import { useTheme } from "@/contexts/ThemeContext"

interface SearchInputProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchInput({ onSearch, placeholder = "Buscar proyectos..." }: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { actualTheme } = useTheme()

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      // Delay para que la animación se complete primero
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isExpanded])

  const handleSearch = () => {
    if (query.trim() && onSearch) {
      onSearch(query.trim())
    }
    setIsExpanded(false)
    setQuery("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setIsExpanded(false)
      setQuery("")
    }
  }

  return (
    <div className="relative z-[60]">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className={`p-2 rounded-xl transition-all duration-500 backdrop-blur-sm border group overflow-hidden relative ${
                actualTheme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 text-white/90 hover:text-white shadow-2xl'
                  : 'bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/40 text-gray-900/90 hover:text-gray-900 shadow-xl'
              }`}
              aria-label="Abrir búsqueda"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Search className="w-4 h-4 relative z-10" />
              </motion.div>
              
              {/* Ripple effect on hover */}
              <motion.div
                className={`absolute inset-0 rounded-xl ${
                  actualTheme === 'dark' ? 'bg-white/20' : 'bg-black/20'
                }`}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.2, opacity: 0.3 }}
                transition={{ duration: 0.6 }}
              />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              filter: "blur(4px)",
              y: -10
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: "blur(0px)",
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              filter: "blur(2px)",
              y: -10
            }}
            transition={{ 
              duration: 0.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              filter: { duration: 0.3 }
            }}
            className={`absolute top-full right-0 mt-3 w-80 flex items-center rounded-xl shadow-2xl border backdrop-blur-2xl z-[80] ${
              actualTheme === 'dark'
                ? 'bg-black/90 border-white/40 shadow-white/10'
                : 'bg-white/95 border-gray-300 shadow-black/20'
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Search className={`w-4 h-4 ml-4 ${
                actualTheme === 'dark' ? 'text-white/70' : 'text-gray-500'
              }`} />
            </motion.div>
            
            <motion.input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className={`flex-1 px-3 py-3 bg-transparent border-none outline-none text-sm font-medium placeholder:transition-colors placeholder:duration-300 ${
                actualTheme === 'dark'
                  ? 'text-white placeholder-white/40 focus:placeholder-white/60'
                  : 'text-gray-900 placeholder-gray-400 focus:placeholder-gray-600'
              }`}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.2 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsExpanded(false)
                  setQuery("")
                }}
                className={`mr-2 p-1.5 rounded-lg transition-all duration-300 group ${
                  actualTheme === 'dark'
                    ? 'hover:bg-white/20 text-white/70 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
                aria-label="Cerrar búsqueda"
              >
                <motion.div
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <X className="w-4 h-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 