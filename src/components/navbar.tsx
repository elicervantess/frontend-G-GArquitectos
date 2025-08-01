"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/search-input"
import { AuthModal } from "@/components/auth/auth-modal"
import { UserAvatar } from "@/components/ui/user-avatar"
import ProfileModal from "@/components/profile-modal"
import { useAuth } from "@/contexts/AuthContext"
import { Menu, X, User, Settings, LogOut, LogIn, UserPlus, Building, Users } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login")
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  const { user, isAuthenticated, logout, logoutWithBackend, token } = useAuth()
  
  // Debug: Log del estado de autenticación
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user, token })
    if (user) {
      console.log('User data:', {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      })
    }
  }, [isAuthenticated, user, token])

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
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/servicios" },
    { name: "Proyectos", href: "/proyectos" },
    { name: "Sobre Nosotros", href: "/sobre-nosotros" },
    { name: "Contacto", href: "/contacto" },
  ]

  const handleSearch = (query: string) => {
    console.log("Búsqueda:", query)
    // Aquí puedes implementar la lógica de búsqueda
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

  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-black dark:text-white">
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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-black dark:text-white">
                GYG Arquitectos
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 font-medium relative group"
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-slate-800 group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Search Input */}
              <SearchInput onSearch={handleSearch} />

              {/* User Menu */}
              <div className="relative group user-menu-container">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 p-1"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                >
                  {isAuthenticated ? (
                    <UserAvatar size="sm" variant="primary" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </Button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 min-w-[180px] rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg p-2 shadow-2xl z-50"
                      onMouseEnter={() => setIsUserMenuOpen(true)}
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                    >
                      {isAuthenticated ? (
                        <>
                          <div 
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center justify-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/20 dark:hover:to-slate-900/20 cursor-pointer transition-all duration-200 group"
                          >
                            <User className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-200" />
                            Mi Perfil
                          </div>
                          
                          {/* Opciones específicas por rol */}
                          {user?.role === 'ARCHITECT' && (
                            <div className="flex items-center justify-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/20 dark:hover:to-slate-900/20 cursor-pointer transition-all duration-200 group">
                              <Building className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                              Mis Proyectos
                            </div>
                          )}
                          
                          {user?.role === 'ADMIN' && (
                            <div className="flex items-center justify-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/20 dark:hover:to-slate-900/20 cursor-pointer transition-all duration-200 group">
                              <Users className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                              Gestionar Usuarios
                            </div>
                          )}
                          
                          <div className="flex items-center justify-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/20 dark:hover:to-slate-900/20 cursor-pointer transition-all duration-200 group">
                            <Settings className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            Configuración
                          </div>
                          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent my-1.5" />
                          <div 
                            className="flex items-center justify-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 cursor-pointer transition-all duration-200 text-red-600 dark:text-red-400 group"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            Cerrar Sesión
                          </div>
                        </>
                                              ) : (
                          <>
                            <div 
                              className="flex items-center justify-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/20 dark:hover:to-slate-900/20 cursor-pointer transition-all duration-200 group"
                              onClick={() => {
                                openAuthModal("login")
                                setIsUserMenuOpen(false)
                              }}
                            >
                              <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                              Iniciar Sesión
                            </div>
                            <div 
                              className="flex items-center justify-center gap-2.5 px-2.5 py-2 text-sm rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-900/20 dark:hover:to-slate-900/20 cursor-pointer transition-all duration-200 group"
                              onClick={() => {
                                openAuthModal("register")
                                setIsUserMenuOpen(false)
                              }}
                            >
                              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                              Registrarme
                            </div>
                          </>
                        )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800"
            >
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                
                {/* Mobile Auth Section */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full justify-center"
                        onClick={() => {
                          setIsProfileModalOpen(true)
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        Mi Perfil
                      </Button>
                      
                      {/* Opciones específicas por rol en mobile */}
                      {user?.role === 'ARCHITECT' && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-center"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            // Navegación a proyectos
                          }}
                        >
                          Mis Proyectos
                        </Button>
                      )}
                      
                      {user?.role === 'ADMIN' && (
                        <Button 
                          variant="outline" 
                          className="w-full justify-center"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            // Navegación a gestión de usuarios
                          }}
                        >
                          Gestionar Usuarios
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        className="w-full justify-center"
                        onClick={() => {
                          handleLogout()
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white justify-center"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          openAuthModal("login")
                        }}
                      >
                        Iniciar Sesión
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-center"
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          openAuthModal("register")
                        }}
                      >
                        Registrarme
                      </Button>
                    </>
                  )}
                </div>
                

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
    </>
  )
} 