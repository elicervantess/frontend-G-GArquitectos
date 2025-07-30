"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import { Button } from "./button"

interface SearchInputProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchInput({ onSearch, placeholder = "Buscar proyectos..." }: SearchInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

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
              className="hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-200"
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
            className="relative flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg"
          >
            <Search className="w-4 h-4 ml-3 text-neutral-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm placeholder-neutral-500 dark:placeholder-neutral-400"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsExpanded(false)
                setQuery("")
              }}
              className="mr-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 