"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthInterceptor } from "@/lib/auth-interceptor"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Shield,
  AlertTriangle,
  UserX,
  LogOut,
  RefreshCw,
  TestTube
} from "lucide-react"

export function AuthInterceptorDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<string>("")
  const { user, token, logout } = useAuth()

  const simulateUnauthorizedRequest = async () => {
    setIsLoading(true)
    setTestResult("")

    try {
      // Simular una llamada que devuelve 401
      const response = await AuthInterceptor.fetch('http://localhost:8080/test-401', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setTestResult("✅ Respuesta exitosa (no debería pasar)")
      } else {
        setTestResult(`⚠️ Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const simulateForbiddenRequest = async () => {
    setIsLoading(true)
    setTestResult("")

    try {
      // Simular una llamada que devuelve 403
      const response = await AuthInterceptor.fetch('http://localhost:8080/test-403', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setTestResult("✅ Respuesta exitosa (no debería pasar)")
      } else {
        setTestResult(`⚠️ Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testValidRequest = async () => {
    setIsLoading(true)
    setTestResult("")

    try {
      // Hacer una llamada válida al endpoint /users/me
      if (!token) {
        setTestResult("❌ No hay token disponible")
        return
      }

      const response = await AuthInterceptor.fetch('http://localhost:8080/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setTestResult(`✅ Usuario válido: ${userData.fullName || userData.email}`)
      } else {
        setTestResult(`⚠️ Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const manualLogout = () => {
    logout()
    setTestResult("🔓 Logout manual ejecutado")
  }

  const tests = [
    {
      icon: AlertTriangle,
      title: "Simular Error 401",
      description: "Probar respuesta no autorizada",
      action: simulateUnauthorizedRequest,
      variant: "destructive" as const
    },
    {
      icon: UserX,
      title: "Simular Error 403",
      description: "Probar respuesta prohibida",
      action: simulateForbiddenRequest,
      variant: "destructive" as const
    },
    {
      icon: Shield,
      title: "Solicitud Válida",
      description: "Probar endpoint /users/me",
      action: testValidRequest,
      variant: "default" as const
    },
    {
      icon: LogOut,
      title: "Logout Manual",
      description: "Cerrar sesión manualmente",
      action: manualLogout,
      variant: "outline" as const
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
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Interceptor de Autorización
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sistema automático de logout cuando se detectan errores 401 o 403
          </p>
        </motion.div>

        {/* User Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant={user ? "success" : "destructive"}>
              {user ? `✅ Logueado: ${user.name}` : "❌ No logueado"}
            </Badge>
            <Badge variant={token ? "info" : "secondary"}>
              {token ? "🔑 Token presente" : "🚫 Sin token"}
            </Badge>
            <Badge variant="premium">Auth Interceptor Activo</Badge>
          </div>
        </motion.div>
      </div>

      {/* Estado actual */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Estado de Sesión</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Usuario:</span>
                  <p className="text-gray-900 dark:text-gray-100">{user.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                  <p className="text-gray-900 dark:text-gray-100">{user.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Rol:</span>
                  <p className="text-gray-900 dark:text-gray-100">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test, index) => (
          <motion.div
            key={test.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card variant="glass" className="h-full hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <test.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{test.title}</CardTitle>
                    <CardDescription className="text-sm">{test.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={test.action}
                  disabled={isLoading || (!user && test.title !== "Logout Manual")}
                  variant={test.variant}
                  className="w-full mb-4"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Probando...
                    </>
                  ) : (
                    <>
                      <test.icon className="w-4 h-4 mr-2" />
                      Probar
                    </>
                  )}
                </Button>

                {testResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg"
                  >
                    <p className="text-sm font-mono">{testResult}</p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Instrucciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Card variant="gradient" className="border-0 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
          <CardHeader className="relative">
            <CardTitle className="text-white">🧪 Instrucciones de Prueba</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-blue-100 space-y-2 text-sm">
              <p>• <strong>Error 401/403:</strong> Al hacer clic, se simulará un error de autorización que debería cerrar la sesión automáticamente</p>
              <p>• <strong>Solicitud Válida:</strong> Prueba una llamada real al backend para verificar que el usuario existe</p>
              <p>• <strong>Logout Manual:</strong> Cierra la sesión manualmente para comparar con el logout automático</p>
              <p>• <strong>Resultado esperado:</strong> Los errores 401/403 deberían mostrar una notificación y cerrar la sesión automáticamente</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
