"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth/auth-modal"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Users, 
  Lock, 
  Eye, 
  Smartphone, 
  Globe,
  CheckCircle,
  Zap,
  Sparkles
} from "lucide-react"

export function AuthModalDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"login" | "register">("login")

  const openModal = (mode: "login" | "register") => {
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const features = [
    {
      icon: Shield,
      title: "Autenticación Segura",
      description: "Sistema de autenticación robusto con validación de datos y manejo de errores."
    },
    {
      icon: Users,
      title: "Múltiples Roles",
      description: "Soporte para diferentes tipos de usuarios: Usuario, Arquitecto y Administrador."
    },
    {
      icon: Lock,
      title: "Contraseñas Seguras",
      description: "Validación de contraseñas con visibilidad toggle y requisitos de seguridad."
    },
    {
      icon: Eye,
      title: "Validación en Tiempo Real",
      description: "Validación de formularios con feedback inmediato y mensajes de error claros."
    },
    {
      icon: Smartphone,
      title: "Autenticación Social",
      description: "Inicio de sesión con Google para una experiencia más fluida."
    },
    {
      icon: Globe,
      title: "Diseño Responsivo",
      description: "Interfaz moderna y adaptativa que funciona en todos los dispositivos."
    }
  ]

  const benefits = [
    "Validación de formularios en tiempo real",
    "Manejo inteligente de errores del servidor",
    "Autenticación social con Google",
    "Interfaz moderna con animaciones suaves",
    "Soporte para múltiples roles de usuario",
    "Diseño accesible y responsive"
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sistema de Autenticación
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experiencia de usuario excepcional con validación inteligente y diseño elegante
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={() => openModal("login")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Probar Login
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => openModal("register")}
            className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <Users className="w-5 h-5 mr-2" />
            Probar Registro
          </Button>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card variant="glass" className="h-full hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card variant="gradient" className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <CardHeader className="relative">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Características Destacadas
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Todo lo que necesitas para una autenticación moderna y segura
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={benefit} className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/90 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Tecnologías Utilizadas</CardTitle>
            <CardDescription>
              Componentes modernos y tecnologías de vanguardia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">React</Badge>
                             <Badge variant="default">TypeScript</Badge>
              <Badge variant="success">Tailwind CSS</Badge>
              <Badge variant="warning">Framer Motion</Badge>
              <Badge variant="info">Lucide Icons</Badge>
              <Badge variant="premium">Class Variance Authority</Badge>
              <Badge variant="glass">Glassmorphism</Badge>
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
    </div>
  )
} 