"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OptimizedAvatar } from "@/components/ui/optimized-avatar"
import { useNavbarAvatar, useAvatarCacheStats, useClearAvatarCache } from "@/hooks/useNavbarAvatar"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { 
  Zap, 
  Image as ImageIcon, 
  Clock, 
  HardDrive, 
  Wifi, 
  CheckCircle,
  AlertCircle,
  RotateCcw,
  TrendingUp
} from "lucide-react"

export function AvatarOptimizationDemo() {
  const { user } = useAuth()
  const [testQuality, setTestQuality] = useState<'low' | 'medium' | 'high'>('medium')
  const avatarState = useNavbarAvatar({ compressionQuality: testQuality })
  const cacheStats = useAvatarCacheStats()
  const clearCache = useClearAvatarCache()

  const optimizationFeatures = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Compresión Inteligente",
      description: "Reduce automáticamente el tamaño de imágenes pesadas sin perder calidad visual",
      status: avatarState.isOptimized ? "active" : "inactive"
    },
    {
      icon: <HardDrive className="w-5 h-5" />,
      title: "Cache Persistente", 
      description: "Almacena imágenes optimizadas en localStorage para carga instantánea",
      status: avatarState.cacheHit ? "active" : "inactive"
    },
    {
      icon: <Wifi className="w-5 h-5" />,
      title: "Optimización de Google",
      description: "Usa parámetros de URL para optimizar imágenes de Google automáticamente",
      status: user?.profileImage?.includes('googleusercontent.com') ? "active" : "inactive"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Carga Asíncrona",
      description: "Procesa imágenes en background sin bloquear la interfaz",
      status: "active"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'loading': return 'warning'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'loading': return <Clock className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Optimización de Avatares
          </h2>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Sistema inteligente que optimiza automáticamente las fotos de perfil para carga ultrarrápida
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar de Demostración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Avatar Optimizado en Vivo
            </CardTitle>
            <CardDescription>
              Tu avatar con optimizaciones aplicadas en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <OptimizedAvatar
                  size="2xl"
                  variant="primary"
                  priority={true}
                  quality={testQuality}
                />
                {avatarState.isLoading && (
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              
              {user && (
                <div className="text-center space-y-2">
                  <p className="font-medium">{user.name}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant={getStatusColor(avatarState.isOptimized ? 'active' : 'inactive') as any}>
                      {getStatusIcon(avatarState.isOptimized ? 'active' : 'inactive')}
                      {avatarState.isOptimized ? 'Optimizada' : 'Original'}
                    </Badge>
                    {avatarState.cacheHit && (
                      <Badge variant="success">
                        <HardDrive className="w-3 h-3 mr-1" />
                        Cache Hit
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Controles de calidad */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Calidad de compresión:</label>
              <div className="flex space-x-2">
                {(['low', 'medium', 'high'] as const).map((quality) => (
                  <Button
                    key={quality}
                    variant={testQuality === quality ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTestQuality(quality)}
                    className="capitalize"
                  >
                    {quality}
                  </Button>
                ))}
              </div>
            </div>

            {/* Estado del avatar */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Estado:</span>
                <span className={avatarState.isLoading ? 'text-blue-600' : 'text-green-600'}>
                  {avatarState.isLoading ? 'Optimizando...' : 'Listo'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cache:</span>
                <span className={avatarState.cacheHit ? 'text-green-600' : 'text-gray-600'}>
                  {avatarState.cacheHit ? 'Hit' : 'Miss'}
                </span>
              </div>
              {avatarState.error && (
                <div className="flex justify-between text-sm">
                  <span>Error:</span>
                  <span className="text-red-600">{avatarState.error}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas del Cache */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Estadísticas del Cache
            </CardTitle>
            <CardDescription>
              Información sobre el rendimiento del sistema de cache
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Avatares en cache:</span>
                <Badge variant="outline">{cacheStats.size} de {cacheStats.maxSize}</Badge>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(cacheStats.size / cacheStats.maxSize) * 100}%` }}
                />
              </div>
            </div>

            <Button 
              onClick={clearCache}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpiar Cache
            </Button>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              El cache se limpia automáticamente después de 24 horas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Características */}
      <Card>
        <CardHeader>
          <CardTitle>Características de Optimización</CardTitle>
          <CardDescription>
            Tecnologías aplicadas para mejorar el rendimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizationFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <div className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <Badge variant={getStatusColor(feature.status) as any} className="text-xs">
                      {getStatusIcon(feature.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
