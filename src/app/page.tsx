"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowRight, Star, Users, Award, Building, ChevronLeft, ChevronRight, Leaf, House } from "lucide-react"
import { UIShowcase } from "@/components/ui-showcase"
import { UserAvatarDemo } from "@/components/user-avatar-demo"
import { AuthModalDemo } from "@/components/auth-modal-demo"
import { AuthErrorDemo } from "@/components/auth-error-demo"
import { LoadingStatesDemo } from "@/components/loading-states-demo"
import { AuthInterceptorDemo } from "@/components/auth-interceptor-demo"
import { UserValidationDemo } from "@/components/user-validation-demo"
import Image from "next/image"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { useDeviceOptimizations } from "@/hooks/useDeviceDetection"

// Datos de los proyectos
const projects = [
  {
    id: 1,
    title: "Villa Moderna Riverside",
    description: "Arquitectura contemporánea con vistas espectaculares al agua. Diseño sostenible que integra espacios interiores y exteriores en perfecta armonía.",
    category: "Residencial",
    image: "/images/hero/exteriores/project1/project1_1920x1080.jpg",
    imageMobile: "/images/hero/exteriores/project1/project1_750x1334.jpg",
    imageTablet: "/images/hero/exteriores/project1/project1_1536x2048.jpg",
    featured: true,
    icon: House
  },
  {
    id: 2,
    title: "Complejo Urbano Central",
    description: "Desarrollo mixto que redefine el paisaje urbano. Combinando comercio, oficinas y espacios públicos en una propuesta arquitectónica innovadora.",
    category: "Comercial",
    image: "/images/hero/exteriores/project2/project2_1920x1080.jpg",
    imageMobile: "/images/hero/exteriores/project2/project2_750x1334.jpg",
    imageTablet: "/images/hero/exteriores/project2/project2_1536x2048.jpg",
    featured: false,
    icon: Building
  },
  {
    id: 3,
    title: "Eco-Residencias Sostenibles",
    description: "Viviendas ecológicas con certificación LEED. Materiales naturales y tecnología verde para un futuro más sostenible y eficiente.",
    category: "Sostenible",
    image: "/images/hero/exteriores/project3/project3_1920x1080.jpg",
    imageMobile: "/images/hero/exteriores/project3/project3_750x1334.jpg",
    imageTablet: "/images/hero/exteriores/project3/project3_1536x2048.jpg",
    featured: true,
    icon: Leaf
  },
  {
    id: 4,
    title: "Torre Corporativa Premium",
    description: "Rascacielos de última generación con tecnología inteligente. Espacios de trabajo que inspiran productividad y bienestar empresarial.",
    category: "Corporativo",
    image: "/images/hero/exteriores/project4/project4_1920x1080.jpg",
    imageMobile: "/images/hero/exteriores/project4/project4_750x1334.jpg",
    imageTablet: "/images/hero/exteriores/project4/project4_1536x2048.jpg",
    featured: false,
    icon: Star
  }
]

export default function Home() {
  const [currentProject, setCurrentProject] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Optimizaciones basadas en dispositivo
  const {
    imageQuality,
    imageSizes,
    shouldPreload,
    shouldReduceAnimations
  } = useDeviceOptimizations()

  // Auto-play del carousel (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length)
    }, 8000) // Cambia cada 8 segundos

    return () => clearInterval(interval)
  }, [])

  const nextProject = () => {
    if (isLoading) return
    setIsLoading(true)
    setCurrentProject((prev) => (prev + 1) % projects.length)
    setTimeout(() => setIsLoading(false), 500)
  }

  const prevProject = () => {
    if (isLoading) return
    setIsLoading(true)
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length)
    setTimeout(() => setIsLoading(false), 500)
  }

  const currentProjectData = projects[currentProject]

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Images - All Stacked */}
        <div className="absolute inset-0">
          {projects.map((project, index) => (
            <div key={project.id} className="absolute inset-0">
              {/* Desktop & Tablet */}
              <OptimizedImage
                src={project.image}
                alt={`${project.title} - Proyecto arquitectónico de ${project.category}`}
                width={1920}
                height={1080}
                className="object-cover hidden md:block transition-opacity duration-700 ease-in-out"
                style={{
                  opacity: index === currentProject ? 1 : 0,
                  zIndex: index === currentProject ? 2 : 1
                }}
                priority={index === 0}
                quality={imageQuality}
                sizes={imageSizes}
                onLoad={() => {
                  if (index === currentProject) {
                    console.log(`✅ Imagen cargada: ${project.title}`)
                  }
                }}
              />
              {/* Mobile */}
              <OptimizedImage
                src={project.imageMobile}
                alt={`${project.title} - Versión móvil`}
                width={750}
                height={1334}
                className="object-cover md:hidden transition-opacity duration-700 ease-in-out"
                style={{
                  opacity: index === currentProject ? 1 : 0,
                  zIndex: index === currentProject ? 2 : 1
                }}
                priority={index === 0}
                quality={Math.max(imageQuality, 75)} // Asegurar calidad mínima de 75
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Overlay - Always on top */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

        {/* Content Container */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              
              {/* Featured Card - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="order-2 lg:order-1"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
                  <div className="text-center space-y-6">
                    {/* Featured Badge */}
                    {currentProjectData.featured && (
                      <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 px-4 py-2 rounded-full text-sm font-inter font-medium border border-blue-400/30">
                        <Star className="w-4 h-4" />
                        Featured
                      </div>
                    )}

                    {/* Icon */}
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                        <currentProjectData.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <p className="text-white/80 font-inter font-medium text-lg">
                        {currentProjectData.category}
                      </p>
                      <div className="w-12 h-0.5 bg-white/60 mx-auto rounded-full" />
                    </div>

                    <p className="text-white/90 font-inter text-sm leading-relaxed">
                      Creative
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Project Info - Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="order-1 lg:order-2 space-y-8"
              >
                <div className="space-y-6">
                  <motion.h1 
                    key={`title-${currentProject}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-inter font-black text-white leading-tight"
                  >
                    {currentProjectData.title}
                  </motion.h1>
                  
                  <motion.p 
                    key={`desc-${currentProject}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-lg md:text-xl text-white/90 font-inter font-medium leading-relaxed max-w-2xl"
                  >
                    {currentProjectData.description}
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-inter font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group border-0"
                  >
                    Detalles
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevProject}
          disabled={isLoading}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:border-white/40 transition-all duration-300 group disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextProject}
          disabled={isLoading}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:border-white/40 transition-all duration-300 group disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isLoading) {
                  setIsLoading(true)
                  setCurrentProject(index)
                  setTimeout(() => setIsLoading(false), 500)
                }
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentProject
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Project Counter */}
        <div className="absolute bottom-8 right-8 z-30 text-white/80 font-inter font-medium">
          <span className="text-xl font-bold text-white">{String(currentProject + 1).padStart(2, '0')}</span>
          <span className="text-white/60"> / </span>
          <span>{String(projects.length).padStart(2, '0')}</span>
        </div>
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
