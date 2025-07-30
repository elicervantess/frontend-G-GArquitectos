"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { AlertWithIcon } from "@/components/ui/alert"
import { Loading, Skeleton, SkeletonText, SkeletonAvatar } from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/ui/search-input"
import { 
  Star, Heart, Eye, Download, Share2, 
  Mail, Lock, User, Search, Bell,
  CheckCircle, AlertCircle, Info, XCircle
} from "lucide-react"

export function UIShowcase() {
  const [showAlert, setShowAlert] = useState(true)
  const [loading, setLoading] = useState(false)

  const handleLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Componentes UI Modernos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Biblioteca de componentes profesionales con las últimas tecnologías
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated" className="h-full">
              <CardHeader>
                <CardTitle>Card Elevado</CardTitle>
                <CardDescription>
                  Card con efecto de elevación y hover
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Este card tiene un efecto de sombra que se intensifica al hacer hover.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Acción</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glass" className="h-full">
              <CardHeader>
                <CardTitle>Card Glass</CardTitle>
                <CardDescription>
                  Efecto glassmorphism moderno
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Fondo translúcido con efecto blur para un look moderno.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Ver más</Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="gradient" className="h-full">
              <CardHeader>
                <CardTitle>Card Gradiente</CardTitle>
                <CardDescription>
                  Fondo con gradiente elegante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Gradiente suave de azul a púrpura para un diseño premium.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm">Premium</Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Diferentes variantes de badges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="premium">Premium</Badge>
                  <Badge variant="glass">Glass</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>Diferentes estilos de inputs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Input por defecto" />
                <Input variant="filled" placeholder="Input con fondo" />
                <Input variant="outline" placeholder="Input con borde" />
                <Input variant="ghost" placeholder="Input fantasma" />
                <Input 
                  leftIcon={<Mail className="h-4 w-4" />}
                  placeholder="Con icono izquierdo"
                />
                <Input 
                  rightIcon={<Lock className="h-4 w-4" />}
                  placeholder="Con icono derecho"
                />
                <SearchInput 
                  placeholder="Buscar componentes..."
                  onSearch={(query) => console.log('Search:', query)}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Avatars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Avatars</CardTitle>
                <CardDescription>Diferentes tamaños y variantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar size="sm" name="Juan Pérez" />
                  <Avatar size="md" name="Raquel Sotomayor" />
                  <Avatar size="lg" name="María González" />
                  <Avatar size="xl" name="Carlos Rodríguez" />
                </div>
                <div className="flex items-center gap-4">
                  <Avatar variant="primary" name="Ana López" />
                  <Avatar variant="success" name="Pedro Silva" />
                  <Avatar variant="warning" name="Laura Torres" />
                  <Avatar variant="danger" name="Diego Morales" />
                  <Avatar variant="glass" name="Carmen Vega" />
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p>Los avatares muestran automáticamente las iniciales del nombre del usuario.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Notificaciones y mensajes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAlert && (
                  <AlertWithIcon
                    variant="success"
                    title="¡Éxito!"
                    description="Operación completada correctamente."
                    showClose
                    onClose={() => setShowAlert(false)}
                  />
                )}
                <AlertWithIcon
                  variant="info"
                  title="Información"
                  description="Este es un mensaje informativo."
                />
                <AlertWithIcon
                  variant="warning"
                  title="Advertencia"
                  description="Ten cuidado con esta acción."
                />
                <AlertWithIcon
                  variant="destructive"
                  title="Error"
                  description="Algo salió mal. Inténtalo de nuevo."
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Loading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Loading & Skeleton</CardTitle>
                <CardDescription>Estados de carga</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Loading size="sm" text="Cargando..." />
                  <Loading size="md" variant="primary" />
                  <Loading size="lg" variant="success" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <SkeletonAvatar size="md" />
                    <div className="flex-1">
                      <SkeletonText lines={2} />
                    </div>
                  </div>
                  
                  <Skeleton className="h-20 w-full" />
                  
                  <div className="space-y-2">
                    <SkeletonText lines={3} />
                  </div>
                </div>

                <Button onClick={handleLoading} disabled={loading}>
                  {loading ? <Loading size="sm" /> : "Simular carga"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Botones</CardTitle>
                <CardDescription>Diferentes variantes y tamaños</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Small</Button>
                  <Button>Medium</Button>
                  <Button size="lg">Large</Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button>
                    <Star className="mr-2 h-4 w-4" />
                    Con icono
                  </Button>
                  <Button variant="outline">
                    <Heart className="mr-2 h-4 w-4" />
                    Favorito
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  )
} 