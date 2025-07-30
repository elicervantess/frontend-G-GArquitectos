"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertWithIcon } from "@/components/ui/alert"
import { parseAuthError, translateAuthError } from "@/lib/auth-utils"
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Zap,
  Shield
} from "lucide-react"

export function AuthErrorDemo() {
  const [selectedError, setSelectedError] = useState<string>("")
  const [parsedError, setParsedError] = useState<any>(null)

  const backendErrors = [
    {
      code: "Email not found",
      description: "Usuario intenta iniciar sesión con email inexistente",
      category: "Login"
    },
    {
      code: "Email already exist",
      description: "Usuario intenta registrarse con email ya existente",
      category: "Register"
    },
    {
      code: "Invalid password",
      description: "Usuario ingresa contraseña incorrecta",
      category: "Login"
    },
    {
      code: "Invalid credentials",
      description: "Credenciales generales inválidas",
      category: "Login"
    },
    {
      code: "Password is required",
      description: "Campo de contraseña vacío",
      category: "Validation"
    },
    {
      code: "Email is required",
      description: "Campo de email vacío",
      category: "Validation"
    }
  ]

  const handleErrorTest = (errorCode: string) => {
    setSelectedError(errorCode)
    
    // Simular el proceso de parsing y traducción
    const parsed = parseAuthError(errorCode)
    const translated = translateAuthError(errorCode)
    
    setParsedError({
      original: errorCode,
      parsed: parsed,
      translated: translated
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Login":
        return "primary"
      case "Register":
        return "success"
      case "Validation":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Manejo de Errores del Backend
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sistema inteligente que consume y procesa errores específicos del backend
          </p>
        </motion.div>
      </div>

      {/* Error Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {backendErrors.map((error, index) => (
          <motion.div
            key={error.code}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card 
              variant="glass" 
              className={`h-full hover:shadow-xl transition-all duration-300 cursor-pointer ${
                selectedError === error.code ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleErrorTest(error.code)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {error.code}
                      </h3>
                      <Badge variant={getCategoryColor(error.category) as any} className="mt-1">
                        {error.category}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {error.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Error Processing Demo */}
      {parsedError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card variant="glass" className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Procesamiento de Error</span>
              </CardTitle>
              <CardDescription>
                Cómo el sistema procesa y traduce los errores del backend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Original Error */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <XCircle className="w-4 h-4 text-red-500 mr-2" />
                  Error Original del Backend
                </h4>
                <p className="text-red-600 dark:text-red-400 font-mono">
                  {parsedError.original}
                </p>
              </div>

              {/* Parsed Error */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Info className="w-4 h-4 text-blue-500 mr-2" />
                  Error Procesado
                </h4>
                <div className="space-y-2">
                  <p><strong>Campo:</strong> {parsedError.parsed.field}</p>
                  <p><strong>Mensaje:</strong> {parsedError.parsed.message}</p>
                </div>
              </div>

              {/* Translated Error */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Mensaje Traducido para el Usuario
                </h4>
                <p className="text-green-600 dark:text-green-400">
                  {parsedError.translated}
                </p>
              </div>

              {/* Alert Demo */}
              <div className="mt-6">
                <AlertWithIcon
                  variant="destructive"
                  title="Error"
                  description={parsedError.translated}
                  showClose
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Benefits */}
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
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">
                  Beneficios del Sistema
                </CardTitle>
                <CardDescription className="text-red-100">
                  Manejo inteligente y consistente de errores
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white/90 font-medium">Errores específicos del backend</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white/90 font-medium">Traducción automática de mensajes</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white/90 font-medium">Asignación inteligente de campos</span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white/90 font-medium">Experiencia de usuario mejorada</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 