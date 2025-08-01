"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"
import { ArrowRight, Star, Users, Award, Building } from "lucide-react"
import { UIShowcase } from "@/components/ui-showcase"
import { UserAvatarDemo } from "@/components/user-avatar-demo"
import { AuthModalDemo } from "@/components/auth-modal-demo"
import { AuthErrorDemo } from "@/components/auth-error-demo"
import { LoadingStatesDemo } from "@/components/loading-states-demo"
import { AuthInterceptorDemo } from "@/components/auth-interceptor-demo"
import { UserValidationDemo } from "@/components/user-validation-demo"

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-slate-100 to-zinc-100 dark:from-gray-900 dark:via-slate-800 dark:to-zinc-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.h1 
              className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Diseño Arquitectónico
              <span className="block bg-gradient-to-r from-gray-800 to-slate-900 bg-clip-text text-transparent">
                Moderno & Elegante
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Transformamos espacios en experiencias únicas. 
              Diseño sostenible que conecta con la naturaleza y la innovación.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-gray-700 to-slate-800 hover:from-gray-800 hover:to-slate-900 text-white px-8 py-3 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group">
                Ver Nuestros Proyectos
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="lg" className="border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-8 py-3 text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300">
                Solicitar Consulta
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 hidden lg:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-slate-500 rounded-full opacity-20" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 right-10 hidden lg:block"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-zinc-600 rounded-full opacity-20" />
        </motion.div>
      </section>

      {/* UI Showcase Section */}
      <UIShowcase />

      {/* User Avatar Demo Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Avatares con Iniciales
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Sistema de avatares inteligente que muestra las iniciales del usuario automáticamente
            </p>
          </motion.div>
          
          <UserAvatarDemo />
        </div>
      </section>

      {/* Auth Modal Demo Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Modal de Autenticación Moderno
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Experiencia de usuario excepcional con validación inteligente y diseño elegante
            </p>
          </motion.div>
          
          <AuthModalDemo />
        </div>
      </section>

      {/* Loading States Demo Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingStatesDemo />
        </div>
      </section>

      {/* User Validation Demo Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserValidationDemo />
        </div>
      </section>

      {/* Auth Error Demo Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900 dark:to-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Manejo Inteligente de Errores
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Sistema que consume y procesa errores específicos del backend de manera inteligente
            </p>
          </motion.div>
          
          <AuthErrorDemo />
          
          {/* Componente de prueba temporal eliminado porque 'AuthErrorTest' no está definido */}
        </div>
      </section>

      {/* Auth Interceptor Demo Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AuthInterceptorDemo />
        </div>
      </section>

      {/* Google Config Checker Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Verificador de Configuración Google OAuth
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Herramienta para verificar que la configuración de Google OAuth esté correcta
            </p>
          </motion.div>
          
          {/* Componente eliminado temporalmente porque 'GoogleConfigChecker' no está definido */}
        </div>
      </section>

      {/* Google Auth Debug Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Debug de Google Auth
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Herramientas de diagnóstico para resolver problemas de autenticación con Google
            </p>
          </motion.div>
          
          {/* Componente eliminado temporalmente porque 'GoogleAuthDebug' no está definido */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Más de 15 años de experiencia creando espacios que inspiran y perduran
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Star,
                title: "Diseño Premium",
                description: "Cada proyecto es único, diseñado con atención al detalle y materiales de la más alta calidad."
              },
              {
                icon: Users,
                title: "Equipo Experto",
                description: "Arquitectos certificados con amplia experiencia en proyectos residenciales y comerciales."
              },
              {
                icon: Award,
                title: "Premios Reconocidos",
                description: "Hemos sido galardonados con múltiples premios por nuestro diseño innovador y sostenible."
              },
              {
                icon: Building,
                title: "Sostenibilidad",
                description: "Comprometidos con el medio ambiente, utilizamos prácticas eco-friendly en todos nuestros proyectos."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      </div>
  )
}
