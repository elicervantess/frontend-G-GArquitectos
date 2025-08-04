import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, actualTheme, toggleTheme } = useTheme()

  const getIcon = () => {
    if (theme === 'system') {
      return <Monitor className={`w-4 h-4 ${actualTheme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
    }
    return actualTheme === 'dark' ? 
      <Sun className="w-4 h-4 text-white" /> : 
      <Moon className="w-4 h-4 text-gray-900" />
  }

  const getLabel = () => {
    switch (theme) {
      case 'light': return 'Cambiar a modo oscuro'
      case 'dark': return 'Cambiar a modo automático'
      case 'system': return 'Cambiar a modo claro'
      default: return 'Cambiar tema'
    }
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border ${
        actualTheme === 'dark'
          ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 shadow-xl'
          : 'bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/40 shadow-lg'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {getIcon()}
      </motion.div>
    </motion.button>
  )
}
