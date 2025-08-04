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
      inputRef.current.focus()
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
    <div className="relative">
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className={`p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
                actualTheme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 text-white/90 hover:text-white'
                  : 'bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/40 text-gray-900/90 hover:text-gray-900'
              }`}
              aria-label="Abrir búsqueda"
            >
              <Search className="w-4 h-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, width: 40 }}
            animate={{ opacity: 1, width: 350 }}
            exit={{ opacity: 0, width: 40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`relative flex items-center rounded-xl shadow-xl border backdrop-blur-xl ${
              actualTheme === 'dark'
                ? 'bg-black/60 border-white/30'
                : 'bg-white/90 border-gray-200'
            }`}
          >
            <Search className={`w-4 h-4 ml-3 ${
              actualTheme === 'dark' ? 'text-white/70' : 'text-gray-500'
            }`} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className={`flex-1 px-3 py-2.5 bg-transparent border-none outline-none text-sm font-medium ${
                actualTheme === 'dark'
                  ? 'text-white placeholder-white/50'
                  : 'text-gray-900 placeholder-gray-500'
              }`}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsExpanded(false)
                setQuery("")
              }}
              className={`mr-2 p-1.5 rounded-lg transition-all duration-200 ${
                actualTheme === 'dark'
                  ? 'hover:bg-white/20 text-white/70 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
              aria-label="Cerrar búsqueda"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 