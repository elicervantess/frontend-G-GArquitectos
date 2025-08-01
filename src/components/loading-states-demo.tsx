"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth/auth-modal"
import TopLoadingBar from "@/components/ui/top-loading-bar"
import { Loading, SkeletonProgressBar } from "@/components/ui/loading"
import Toast from "@/components/ui/toast"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles,
  Zap,
  Users,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"

export function LoadingStatesDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"login" | "register">("login")
  const [isTopLoading, setIsTopLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState<"success" | "error" | "warning" | "info">("info")

  const openModal = (mode: "login" | "register") => {
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const simulateLoading = () => {
    setIsTopLoading(true)
    setTimeout(() => {
      setIsTopLoading(false)
      showToast("¡Proceso completado exitosamente!", "success")
    }, 3000)
  }

  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  const loadingExamples = [
    {
      icon: Loader2,
      title: "Loading Spinner",
      description: "Indicador básico de carga con diferentes tamaños",
      component: (
        <div className="flex items-center space-x-4">
          <Loading size="sm" />
          <Loading size="md" />
          <Loading size="lg" />
          <Loading size="xl" />
        </div>
      )
    },
    {
      icon: Eye,
      title: "Loading con Texto",
      description: "Indicador con mensaje descriptivo",
      component: (
        <Loading text="Procesando..." variant="primary" size="md" />
      )
    },
    {
      icon: CheckCircle,
      title: "Barra de Progreso Superior",
      description: "Barra animada en la parte superior como YouTube, GitHub",
      component: (
        <div className="space-y-4">
          <Button onClick={simulateLoading} className="w-full">
            {isTopLoading ? "Cargando..." : "Simular Carga"}
          </Button>
          <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
            <SkeletonProgressBar height={4} animated={true} />
          </div>
        </div>
      )
    },
    {
      icon: AlertCircle,
      title: "Notificaciones Toast",
      description: "Notificaciones emergentes para feedback inmediato",
      component: (
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => showToast("Información importante", "info")}
          >
            Info
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => showToast("¡Operación exitosa!", "success")}
          >
            Success
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => showToast("Advertencia detectada", "warning")}
          >
            Warning
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => showToast("Error en la operación", "error")}
          >
            Error
          </Button>
        </div>
      )
    }
  ]

  const authStates = [
    {
      icon: Zap,
      title: "Estado de Carga en Modal",
      description: "Loading integrado en el botón de Google Auth",
      action: () => openModal("login")
    },
    {
      icon: Users,
      title: "Barra Superior + Modal",
      description: "Combinación de top loading bar con estados en botones",
      action: () => {
        setIsTopLoading(true)
        openModal("register")
        setTimeout(() => setIsTopLoading(false), 2000)
      }
    }
  ]

  return (
    <div className="space-y-8">
      {/* Top Loading Bar */}
      <TopLoadingBar isLoading={isTopLoading} color="primary" height={3} />
      
      {/* Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Estados de Carga UI/UX
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Diferentes patrones de loading states para una experiencia de usuario profesional
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="default">Loading States</Badge>
            <Badge variant="success">Top Progress Bar</Badge>
            <Badge variant="warning">Toast Notifications</Badge>
            <Badge variant="info">Modal Integration</Badge>
            <Badge variant="premium">Framer Motion</Badge>
            <Badge variant="glass">Professional UX</Badge>
          </div>
        </motion.div>
      </div>

      {/* Loading Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loadingExamples.map((example, index) => (
          <motion.div
            key={example.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card variant="glass" className="h-full hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <example.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{example.title}</CardTitle>
                    <CardDescription className="text-sm">{example.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl">
                  {example.component}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Authentication States */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card variant="gradient" className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
          <CardHeader className="relative">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Estados de Autenticación con Google
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Prueba los diferentes estados de carga durante la autenticación
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authStates.map((state, index) => (
                <motion.div
                  key={state.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <state.icon className="w-5 h-5 text-white" />
                        <h3 className="font-semibold text-white">{state.title}</h3>
                      </div>
                      <p className="text-blue-100 text-sm mb-4">{state.description}</p>
                      <Button 
                        onClick={state.action}
                        className="w-full bg-white/20 hover:bg-white/30 border-white/30"
                        variant="outline"
                      >
                        Probar
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode={modalMode}
      />

      {/* Toast Notification */}
      <Toast 
        isVisible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
        position="top-right"
        duration={4000}
      />
    </div>
  )
}
