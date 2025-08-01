"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { 
  AlertTriangle,
  RefreshCw,
  Shield,
  Eye,
  CheckCircle,
  Users,
  Clock
} from 'lucide-react'

export function UserValidationDemo() {
  const { user, verifyUserExists } = useAuth()

  const handleManualCheck = async () => {
    console.log('🔍 Verificación manual iniciada...')
    const exists = await verifyUserExists(true)
    console.log('✅ Resultado:', exists ? 'Usuario válido' : 'Usuario eliminado')
  }

  const simulateUserDeleted = () => {
    // Simular evento de usuario eliminado para probar la notificación
    window.dispatchEvent(new CustomEvent('userDeleted', {
      detail: { message: 'Cuenta eliminada por el administrador (simulación)' }
    }))
  }

  const features = [
    {
      icon: RefreshCw,
      title: "Verificación Automática",
      description: "El sistema verifica cada 2 minutos si el usuario sigue existiendo en la base de datos",
      badge: "Automático"
    },
    {
      icon: Eye,
      title: "Verificación al Recuperar Foco",
      description: "Cuando regresas a la pestaña, se verifica inmediatamente el estado del usuario",
      badge: "Inteligente"
    },
    {
      icon: Shield,
      title: "Manejo de Errores 401/403",
      description: "Si el backend responde con unauthorized, se hace logout automático",
      badge: "Seguro"
    },
    {
      icon: AlertTriangle,
      title: "Notificación Inmediata",
      description: "El usuario recibe una notificación cuando su cuenta es eliminada",
      badge: "UX"
    }
  ]

  const testActions = [
    {
      icon: CheckCircle,
      title: "Verificar Usuario Actual",
      description: "Hacer una verificación manual del estado del usuario",
      action: handleManualCheck,
      buttonText: "Verificar Ahora"
    },
    {
      icon: AlertTriangle,
      title: "Simular Usuario Eliminado",
      description: "Probar la notificación cuando un usuario es eliminado",
      action: simulateUserDeleted,
      buttonText: "Simular Eliminación"
    }
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
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Validación de Usuario en Tiempo Real
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sistema que detecta automáticamente cuando un usuario es eliminado de la base de datos
          </p>
        </motion.div>

        {/* User Status */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-md mx-auto">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Usuario Activo: {user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {user.id} • {user.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="default">Real-time Validation</Badge>
            <Badge variant="premium">Auto Logout</Badge>
            <Badge variant="warning">Error Handling</Badge>
            <Badge variant="success">UX Notifications</Badge>
            <Badge variant="info">JWT Verification</Badge>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card variant="glass" className="h-full hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardDescription className="text-sm mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Test Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card variant="gradient" className="relative overflow-hidden border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/20" />
          <CardHeader className="relative">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Pruebas del Sistema
                </CardTitle>
                <CardDescription className="text-red-100">
                  Prueba manualmente las funciones de validación de usuario
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <action.icon className="w-5 h-5 text-white" />
                        <h3 className="font-semibold text-white">{action.title}</h3>
                      </div>
                      <p className="text-red-100 text-sm mb-4">{action.description}</p>
                      <Button 
                        onClick={action.action}
                        className="w-full bg-white/20 hover:bg-white/30 border-white/30"
                        variant="outline"
                      >
                        {action.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
