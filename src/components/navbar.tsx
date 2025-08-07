"use client"

import "@/styles/navbar-premium.css"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth/auth-modal"
import { OptimizedAvatar } from "@/components/ui/optimized-avatar"
import ProfileModal from "@/components/profile-modal"
import { SettingsModal } from "@/components/settings-modal"
import TopLoadingBar from "@/components/ui/top-loading-bar"
import { ScrollIndicator } from "@/components/ui/scroll-indicator"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useGoogleAuth } from "@/hooks/useGoogleAuth"
import { useNavbarUser } from "@/hooks/useOptimizedUser"
import { Menu, X, User, Settings, LogOut, LogIn, UserPlus, Building, Users, Sun, Moon, Monitor, ShoppingCart } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login")
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [refreshImageKey, setRefreshImageKey] = useState(0)
  const [hasRefreshedOnce, setHasRefreshedOnce] = useState(false) // Track si ya hizo refresh por registro

  const router = useRouter()
  const { isAuthenticated, logout, logoutWithBackend, token } = useAuth()
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme()
  const { isLoading: isGoogleAuthLoading } = useGoogleAuth()
  
  // Hook optimizado para usuario con avatar optimizado
  const { user, isLoading: isUserLoading } = useNavbarUser()
  
  // Función para refrescar la imagen de perfil - SOLO MANUAL
  const refreshProfileImage = () => {
    setRefreshImageKey(prev => prev + 1)
    setHasRefreshedOnce(false) // Permitir nuevo refresh manual
    console.log('🔄 Refresh manual de imagen de perfil')
  }
  
  // Debug: Log del estado de autenticación - SOLO para refresh inicial
  useEffect(() => {
    console.log('🔍 Navbar Auth state changed:', { isAuthenticated, user: !!user, token: !!token })
    if (user) {
      console.log('👤 Navbar User data:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        provider: user.provider
      })
      
      // Si es un usuario de Google Y no hemos hecho refresh aún, forzar UNA SOLA VEZ
      if (user.provider === 'GOOGLE' && user.profileImage && !hasRefreshedOnce) {
        console.log('🔄 Usuario de Google recién registrado, forzando refresh de imagen UNA VEZ')
        setRefreshImageKey(prev => prev + 1)
        setHasRefreshedOnce(true) // Marcar que ya se hizo el refresh
      }
    }
  }, [isAuthenticated, user, token, hasRefreshedOnce])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMounted])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const navItems = [
    { name: "Inicio", href: "/" }, // Inicio va al home principal
    { name: "Proyectos", href: "#proyectos" }, // Proyectos también apunta al hero
    { name: "Nosotros", href: "#nosotros" },
    { name: "Servicios", href: "#servicios" }, // Cambié Clientes por Servicios
    { name: "Reseñas", href: "#reseñas" },
    { name: "Contacto", href: "#contacto" },
  ]

  // Función para scroll suave
  const scrollToSection = (href: string) => {
    // Si es "Inicio" ("/"), redirigir al home principal
    if (href === '/') {
      router.push('/')
      setIsMobileMenuOpen(false)
      return
    }
    
    // Si es "Proyectos", hacer scroll al top
    if (href === '#proyectos') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setIsMobileMenuOpen(false)
      return
    }
    
    const elementId = href.replace('#', '')
    const element = document.getElementById(elementId)
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
    
    // Cerrar menú móvil si está abierto
    setIsMobileMenuOpen(false)
  }

  const openAuthModal = (mode: "login" | "register") => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
    setIsUserMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logoutWithBackend()
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Error al hacer logout:', error)
      // Fallback al logout local si falla el backend
    logout()
    setIsUserMenuOpen(false)
    }
  }

  // Funciones para manejo del tema
  const getThemeIcon = () => {
    if (theme === 'system') {
      return <Monitor className="w-4 h-4" />
    }
    return actualTheme === 'dark' ? 
      <Sun className="w-4 h-4" /> : 
      <Moon className="w-4 h-4" />
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Modo claro'
      case 'dark': return 'Modo oscuro'
      case 'system': return 'Automático'
      default: return 'Tema'
    }
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    setIsUserMenuOpen(false)
  }

  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/15 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-gradient-to-br from-white/90 via-white/70 to-white/50 rounded-lg flex items-center justify-center shadow-xl border border-white/30 backdrop-blur-sm">
                <span className="text-slate-800 font-black text-sm tracking-wide">G</span>
              </div>
              <span className="text-xl font-bold text-white drop-shadow-2xl font-sans tracking-wider ml-0.5 opacity-95 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent hover:from-blue-100 hover:via-white hover:to-blue-100 transition-all duration-500">
                GYG Arquitectos
              </span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* Scroll Progress Indicator */}
      <ScrollIndicator />
      
      {/* Top Loading Bar */}
      <TopLoadingBar isLoading={isGoogleAuthLoading} color="primary" height={3} />
      
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.8
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? actualTheme === 'dark'
              ? "bg-black/30 backdrop-blur-xl border-b border-white/20 shadow-2xl"
              : "bg-white/20 backdrop-blur-xl border-b border-gray-200 shadow-xl"
            : actualTheme === 'dark'
              ? "bg-black/15 backdrop-blur-lg"
              : "bg-white/20 backdrop-blur-lg"
        }`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <motion.div
              whileHover={{ 
                scale: 1.08,
                filter: "brightness(1.3) drop-shadow(0 0 20px rgba(255,255,255,0.4))"
              }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25,
                duration: 0.4
              }}
              className="flex items-center space-x-2 cursor-pointer ml-8 group"
              onClick={() => router.push('/')} // Logo también va al home
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-white/95 via-blue-50/80 to-white/90 rounded-xl flex items-center justify-center shadow-2xl border-2 border-white/40 backdrop-blur-sm hover:border-blue-200/60 transition-all duration-300"
                whileHover={{ 
                  rotate: [0, -8, 8, 0],
                  scale: 1.15,
                  boxShadow: "0 20px 40px rgba(255,255,255,0.3)"
                }}
                transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
              >
                <span className="text-slate-800 font-black text-base tracking-wider drop-shadow-sm">G</span>
              </motion.div>
              <span className={`text-xl font-bold font-sans tracking-wider drop-shadow-2xl ml-2.5 opacity-95 transition-all duration-500 filter hover:brightness-110 ${
                actualTheme === 'dark'
                  ? 'text-white bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent hover:from-blue-100 hover:via-white hover:to-blue-100'
                  : 'text-gray-900 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent hover:from-blue-900 hover:via-gray-900 hover:to-blue-900'
              }`}>
                GYG Arquitectos
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  whileHover={{ 
                    scale: 1.08,
                    y: -3,
                    filter: "brightness(1.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`font-sans font-medium text-base transition-all duration-300 relative group drop-shadow-2xl hover:drop-shadow-xl tracking-wider opacity-95 px-3 py-2 rounded-lg cursor-pointer ${
                    actualTheme === 'dark' 
                      ? 'text-white hover:text-blue-200 hover:bg-white/10' 
                      : 'text-gray-900 hover:text-blue-700 hover:bg-gray-900/10'
                  }`}
                >
                  {item.name}
                  
                  {/* Animated underline - Más visible y atractivo */}
                  <motion.div
                    className={`absolute -bottom-1 left-1/2 h-1 rounded-full origin-center shadow-lg ${
                      actualTheme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-400 via-white to-blue-400'
                        : 'bg-gradient-to-r from-blue-600 via-blue-800 to-blue-600'
                    }`}
                    initial={{ width: 0, x: "-50%", opacity: 0 }}
                    whileHover={{ 
                      width: "110%", 
                      opacity: 1,
                      boxShadow: actualTheme === 'dark' 
                        ? "0 0 25px rgba(59,130,246,0.9), 0 0 50px rgba(59,130,246,0.6)"
                        : "0 0 25px rgba(37,99,235,0.9), 0 0 50px rgba(37,99,235,0.6)"
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      boxShadow: { duration: 0.4 }
                    }}
                  />
                  
                  {/* Glow effect - Más pronunciado */}
                  <motion.div
                    className={`absolute inset-0 rounded-lg ${
                      actualTheme === 'dark' 
                        ? 'bg-gradient-to-r from-blue-500/10 via-white/15 to-blue-500/10' 
                        : 'bg-gradient-to-r from-blue-600/10 via-gray-900/15 to-blue-600/10'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ 
                      opacity: 1, 
                      scale: 1.05,
                    }}
                    transition={{ 
                      duration: 0.25,
                      ease: "easeOut"
                    }}
                  />
                  
                  {/* Text shimmer effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-lg ${
                      actualTheme === 'dark' 
                        ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
                        : 'bg-gradient-to-r from-transparent via-blue-500/20 to-transparent'
                    }`}
                    initial={{ x: "-100%", opacity: 0 }}
                    whileHover={{ 
                      x: "100%", 
                      opacity: [0, 1, 0],
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeInOut"
                    }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4 mr-8">
              {/* Shopping Cart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`p-2 rounded-xl border backdrop-blur-sm transition-all duration-500 ${
                    isScrolled
                      ? actualTheme === 'dark'
                        ? "bg-white/15 hover:bg-white/25 border-white/30 hover:border-white/50"
                        : "bg-black/15 hover:bg-black/25 border-black/30 hover:border-black/50"
                      : actualTheme === 'dark'
                        ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 shadow-2xl"
                        : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/40 shadow-xl"
                  }`}
                  onClick={() => {
                    router.push('/tienda')
                  }}
                  aria-label="Carrito de compras"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <ShoppingCart className={`w-5 h-5 drop-shadow-2xl ${
                      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} />
                  </motion.div>
                </Button>
              </motion.div>

              {/* User Menu */}
              <motion.div 
                className="relative group user-menu-container"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`transition-all duration-500 ${
                    isAuthenticated && user 
                      ? "navbar-avatar-button p-0 bg-transparent hover:bg-transparent border-none hover:border-none rounded-full" 
                      : `p-2 rounded-xl border backdrop-blur-sm ${
                          isScrolled
                            ? actualTheme === 'dark'
                              ? "bg-white/15 hover:bg-white/25 border-white/30 hover:border-white/50"
                              : "bg-black/15 hover:bg-black/25 border-black/30 hover:border-black/50"
                            : actualTheme === 'dark'
                              ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 shadow-2xl"
                              : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/40 shadow-xl"
                        }`
                  }`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setIsUserMenuOpen(!isUserMenuOpen)
                    }
                    if (e.key === 'Escape') {
                      setIsUserMenuOpen(false)
                    }
                  }}
                  aria-label={isAuthenticated ? `Menú de usuario: ${user?.name || 'Usuario'}` : "Menú de autenticación"}
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                >
                  <motion.div
                    whileHover={{ scale: isAuthenticated && user ? 1.05 : 1.1, rotate: isAuthenticated && user ? 0 : 5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={isAuthenticated && user ? "navbar-avatar-motion" : ""}
                  >
                    {isAuthenticated && user ? (
                      <OptimizedAvatar 
                        key={`navbar-${user.id}-${refreshImageKey}`} 
                        size="navbar" 
                        variant="navbar" 
                        priority={true}
                        quality="medium"
                        cacheKey={`navbar_${user.id}_optimized`}
                        src={user.optimizedAvatar || user.profileImage}
                        className="navbar-avatar"
                      />
                    ) : (
                      <User className={`w-5 h-5 drop-shadow-2xl ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`} />
                    )}
                  </motion.div>
                </Button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ 
                        opacity: 0, 
                        y: -20, 
                        scale: 0.9,
                        filter: "blur(4px)"
                      }}
                      animate={{ 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        filter: "blur(0px)"
                      }}
                      exit={{ 
                        opacity: 0, 
                        y: -15, 
                        scale: 0.95,
                        filter: "blur(2px)"
                      }}
                      transition={{ 
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        duration: 0.4
                      }}
                      className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-3 min-w-[200px] rounded-2xl border backdrop-blur-2xl p-3 shadow-2xl z-50 ${
                        actualTheme === 'dark'
                          ? 'border-white/20 bg-black/40'
                          : 'border-gray-200 bg-white/90'
                      }`}
                      onMouseEnter={() => setIsUserMenuOpen(true)}
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      {isAuthenticated ? (
                        <>
                          <motion.div 
                            onClick={() => setIsProfileModalOpen(true)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl cursor-pointer transition-all duration-300 group border ${
                              actualTheme === 'dark'
                                ? 'bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/10 hover:border-white/20'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-900/90 hover:text-gray-900 border-gray-200 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <User className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-sans font-medium">Mi Perfil</span>
                          </motion.div>
                          
                          {/* Opciones específicas por rol */}
                          {user?.role === 'ARCHITECT' && (
                            <motion.div 
                              className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl cursor-pointer transition-all duration-300 group border ${
                                actualTheme === 'dark'
                                  ? 'bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/10 hover:border-white/20'
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900/90 hover:text-gray-900 border-gray-200 hover:border-gray-300'
                              }`}
                              whileHover={{ scale: 1.02, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Building className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                              <span className="font-sans font-medium">Mis Proyectos</span>
                            </motion.div>
                          )}
                          
                          {user?.role === 'ADMIN' && (
                            <motion.div 
                              className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl cursor-pointer transition-all duration-300 group border ${
                                actualTheme === 'dark'
                                  ? 'bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/10 hover:border-white/20'
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900/90 hover:text-gray-900 border-gray-200 hover:border-gray-300'
                              }`}
                              whileHover={{ scale: 1.02, x: 2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                              <span className="font-sans font-medium">Gestionar Usuarios</span>
                            </motion.div>
                          )}
                          
                          <div className={`h-px bg-gradient-to-r from-transparent to-transparent my-2 ${
                            actualTheme === 'dark' ? 'via-white/20' : 'via-gray-300'
                          }`} />
                          
                          <motion.div 
                            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl cursor-pointer transition-all duration-300 group border ${
                              actualTheme === 'dark'
                                ? 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border-white/20 hover:border-white/40'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900/90 hover:text-gray-900 border-gray-300 hover:border-gray-400'
                            }`}
                            onClick={handleLogout}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-sans font-medium">Cerrar Sesión</span>
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <motion.div 
                            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl cursor-pointer transition-all duration-300 group border ${
                              actualTheme === 'dark'
                                ? 'bg-white/10 hover:bg-white/20 text-white/90 hover:text-white border-white/20 hover:border-white/40'
                                : 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900/90 hover:text-gray-900 border-gray-900/20 hover:border-gray-900/40'
                            }`}
                            onClick={() => {
                              openAuthModal("login")
                              setIsUserMenuOpen(false)
                            }}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-sans font-medium">Iniciar Sesión</span>
                          </motion.div>
                          
                          <motion.div 
                            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl cursor-pointer transition-all duration-300 group border ${
                              actualTheme === 'dark'
                                ? 'bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/10 hover:border-white/20'
                                : 'bg-gray-50 hover:bg-gray-100 text-gray-900/90 hover:text-gray-900 border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => {
                              openAuthModal("register")
                              setIsUserMenuOpen(false)
                            }}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span className="font-sans font-medium">Registrarme</span>
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Config Menu - Para todos los usuarios */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="relative config-menu-container"
              >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`p-2 rounded-xl border backdrop-blur-sm transition-all duration-500 ${
                      isScrolled
                        ? actualTheme === 'dark'
                          ? "bg-white/15 hover:bg-white/25 border-white/30 hover:border-white/50"
                          : "bg-black/15 hover:bg-black/25 border-black/30 hover:border-black/50"
                        : actualTheme === 'dark'
                          ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 shadow-2xl"
                          : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/40 shadow-xl"
                    }`}
                    onClick={() => setIsSettingsModalOpen(true)}
                    aria-label="Configuración"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Settings className={`w-5 h-5 drop-shadow-2xl ${
                        actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`} />
                    </motion.div>
                  </Button>
                </motion.div>
            </div>

            {/* Mobile Menu Button + Shopping Cart */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Mobile Shopping Cart */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/tienda')}
                  className={`relative transition-all duration-500 p-2 rounded-xl border backdrop-blur-sm ${
                    isScrolled
                      ? actualTheme === 'dark'
                        ? "bg-white/15 hover:bg-white/25 border-white/30 hover:border-white/50"
                        : "bg-black/15 hover:bg-black/25 border-black/30 hover:border-black/50"
                      : actualTheme === 'dark'
                        ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 shadow-2xl"
                        : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/40 shadow-xl"
                  }`}
                  aria-label="Ir a la tienda"
                >
                  <ShoppingCart className={`w-5 h-5 drop-shadow-2xl ${
                    actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`} />
                </Button>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`relative transition-all duration-500 p-2 rounded-xl border backdrop-blur-sm ${
                    isScrolled
                      ? actualTheme === 'dark'
                        ? "bg-white/15 hover:bg-white/25 border-white/30 hover:border-white/50"
                        : "bg-black/15 hover:bg-black/25 border-black/30 hover:border-black/50"
                      : actualTheme === 'dark'
                        ? "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 shadow-2xl"
                        : "bg-black/10 hover:bg-black/20 border-black/20 hover:border-black/40 shadow-xl"
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <X className={`w-5 h-5 drop-shadow-2xl ${
                          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Menu className={`w-5 h-5 drop-shadow-2xl ${
                          actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ 
                opacity: 0, 
                height: 0,
                backdropFilter: "blur(0px)"
              }}
              animate={{ 
                opacity: 1, 
                height: "auto",
                backdropFilter: "blur(20px)"
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                backdropFilter: "blur(0px)"
              }}
              transition={{ 
                duration: 0.5, 
                ease: "easeInOut",
                backdropFilter: { duration: 0.3 }
              }}
              className={`lg:hidden backdrop-blur-2xl border-t ${
                actualTheme === 'dark'
                  ? 'bg-black/40 border-white/10'
                  : 'bg-white/90 border-gray-200'
              }`}
            >
              <div className="px-6 py-8 space-y-6">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ 
                      delay: index * 0.1 + 0.2,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 300,
                      damping: 25
                    }}
                    whileHover={{ 
                      scale: 1.03, 
                      x: 8,
                      filter: "brightness(1.2)",
                      backgroundColor: actualTheme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      x: 3 
                    }}
                    className={`relative block text-xl font-sans font-semibold transition-all duration-300 py-3 px-2 border-b w-full text-left rounded-lg overflow-hidden ${
                      actualTheme === 'dark'
                        ? 'text-white/90 hover:text-white border-white/10 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20'
                        : 'text-gray-900/90 hover:text-gray-900 border-gray-200 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10'
                    }`}
                  >
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ width: 0 }}
                      whileHover={{ 
                        width: "100%",
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
                      }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                    {item.name}
                  </motion.button>
                ))}

                {/* Botón de Tienda para móvil */}
                <motion.button
                  onClick={() => {
                    router.push('/tienda')
                    setIsMobileMenuOpen(false)
                  }}
                  initial={{ opacity: 0, x: -30, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ 
                    delay: navItems.length * 0.1 + 0.2,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  whileHover={{ 
                    scale: 1.03, 
                    x: 8,
                    filter: "brightness(1.2)",
                    backgroundColor: actualTheme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    x: 3 
                  }}
                  className={`relative flex items-center gap-3 text-xl font-sans font-semibold transition-all duration-300 py-3 px-2 border-b w-full text-left rounded-lg overflow-hidden ${
                    actualTheme === 'dark'
                      ? 'text-emerald-300 hover:text-emerald-200 border-emerald-400/20 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20'
                      : 'text-emerald-700 hover:text-emerald-800 border-emerald-400/30 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10'
                  }`}
                >
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600"
                    initial={{ width: 0 }}
                    whileHover={{ 
                      width: "100%",
                      boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)"
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  <ShoppingCart className="w-6 h-6 flex-shrink-0" />
                  <span>Tienda</span>
                </motion.button>
                
                {/* Mobile Auth Section */}
                <motion.div 
                  className={`pt-6 border-t space-y-4 ${
                    actualTheme === 'dark' ? 'border-white/20' : 'border-gray-200'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {isAuthenticated ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          className={`w-full justify-center backdrop-blur-sm transition-all duration-300 border ${
                            actualTheme === 'dark'
                              ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 text-white hover:text-white'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-900 hover:text-gray-900'
                          }`}
                          onClick={() => {
                            setIsProfileModalOpen(true)
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          Mi Perfil
                        </Button>
                      </motion.div>
                      
                      {/* Opciones específicas por rol en mobile */}
                      {user?.role === 'ARCHITECT' && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            variant="outline" 
                            className={`w-full justify-center backdrop-blur-sm transition-all duration-300 border ${
                              actualTheme === 'dark'
                                ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/90 hover:text-white'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-900/90 hover:text-gray-900'
                            }`}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              // Navegación a proyectos
                            }}
                          >
                            Mis Proyectos
                          </Button>
                        </motion.div>
                      )}
                      
                      {user?.role === 'ADMIN' && (
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            variant="outline" 
                            className={`w-full justify-center backdrop-blur-sm transition-all duration-300 border ${
                              actualTheme === 'dark'
                                ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/90 hover:text-white'
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-900/90 hover:text-gray-900'
                            }`}
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              // Navegación a gestión de usuarios
                            }}
                          >
                            Gestionar Usuarios
                          </Button>
                        </motion.div>
                      )}
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="destructive" 
                          className={`w-full justify-center backdrop-blur-sm transition-all duration-300 border ${
                            actualTheme === 'dark'
                              ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40 text-white hover:text-white'
                              : 'bg-gray-200 hover:bg-gray-300 border-gray-300 hover:border-gray-400 text-gray-900 hover:text-gray-900'
                          }`}
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          Cerrar Sesión
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          className={`w-full backdrop-blur-sm border transition-all duration-300 shadow-xl ${
                            actualTheme === 'dark'
                              ? 'bg-white text-black hover:bg-gray-200 border-white/40 hover:border-gray-200'
                              : 'bg-gray-900 text-white hover:bg-gray-700 border-gray-900 hover:border-gray-700'
                          }`}
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            openAuthModal("login")
                          }}
                        >
                          Iniciar Sesión
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="outline" 
                          className={`w-full justify-center backdrop-blur-sm transition-all duration-300 border ${
                            actualTheme === 'dark'
                              ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/90 hover:text-white'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300 text-gray-900/90 hover:text-gray-900'
                          }`}
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            openAuthModal("register")
                          }}
                        >
                          Registrarme
                        </Button>
                      </motion.div>
                      
                      {/* Selector de Tema en Mobile para usuarios no autenticados */}
                      <div className={`pt-4 border-t space-y-2 ${
                        actualTheme === 'dark' ? 'border-white/20' : 'border-gray-200'
                      }`}>
                        <p className={`text-center text-sm font-sans font-semibold uppercase tracking-wider ${
                          actualTheme === 'dark' ? 'text-white/70' : 'text-gray-600'
                        }`}>
                          Tema
                        </p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <motion.button
                            onClick={() => handleThemeChange('light')}
                            className={`flex flex-col items-center gap-1 px-3 py-3 text-xs rounded-xl transition-all duration-300 border ${
                              theme === 'light'
                                ? actualTheme === 'dark'
                                  ? 'bg-white/20 text-white border-white/40'
                                  : 'bg-gray-200 text-gray-900 border-gray-400'
                                : actualTheme === 'dark'
                                  ? 'bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/10 hover:border-white/20'
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900/90 hover:text-gray-900 border-gray-200 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Sun className="w-4 h-4" />
                            <span className="font-sans font-medium">Claro</span>
                            {theme === 'light' && (
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            )}
                          </motion.button>

                          <motion.button
                            onClick={() => handleThemeChange('dark')}
                            className={`flex flex-col items-center gap-1 px-3 py-3 text-xs rounded-xl transition-all duration-300 border ${
                              theme === 'dark'
                                ? actualTheme === 'dark'
                                  ? 'bg-white/20 text-white border-white/40'
                                  : 'bg-gray-200 text-gray-900 border-gray-400'
                                : actualTheme === 'dark'
                                  ? 'bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/10 hover:border-white/20'
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900/90 hover:text-gray-900 border-gray-200 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Moon className="w-4 h-4" />
                            <span className="font-sans font-medium">Oscuro</span>
                            {theme === 'dark' && (
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            )}
                          </motion.button>

                          <motion.button
                            onClick={() => handleThemeChange('system')}
                            className={`flex flex-col items-center gap-1 px-3 py-3 text-xs rounded-xl transition-all duration-300 border ${
                              theme === 'system'
                                ? actualTheme === 'dark'
                                  ? 'bg-white/20 text-white border-white/40'
                                  : 'bg-gray-200 text-gray-900 border-gray-400'
                                : actualTheme === 'dark'
                                  ? 'bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border-white/10 hover:border-white/20'
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-900/90 hover:text-gray-900 border-gray-200 hover:border-gray-300'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Monitor className="w-4 h-4" />
                            <span className="font-sans font-medium">Auto</span>
                            {theme === 'system' && (
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
                

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Profile Modal */}
      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  )
} 