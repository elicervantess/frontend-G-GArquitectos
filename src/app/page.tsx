"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowRight, Star, Users, Award, Building, ChevronLeft, ChevronRight, Leaf, House } from "lucide-react"
import { OptimizedImage } from "@/components/ui/optimized-image"

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
  const [currentCarouselProject, setCurrentCarouselProject] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isCarouselLoading, setIsCarouselLoading] = useState(false)
  const [currentSection, setCurrentSection] = useState('inicio')
  
  // Valores optimizados estáticos para evitar hydration mismatch
  const imageQuality = 85
  const imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"

  // Secciones de navegación
  const sections = [
    { id: 'inicio', name: 'Inicio' },
    { id: 'proyectos', name: 'Proyectos' },
    { id: 'servicios', name: 'Servicios' },
    { id: 'sobre-nosotros', name: 'Nosotros' },
    { id: 'contacto', name: 'Contacto' }
  ]

  // Auto-play del carousel (opcional)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length)
    }, 8000) // Cambia cada 8 segundos

    return () => clearInterval(interval)
  }, [])

  // Detectar sección actual basada en scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      if (scrollY < windowHeight * 0.5) {
        setCurrentSection('inicio')
      } else if (scrollY < windowHeight * 1.5) {
        setCurrentSection('proyectos')
      } else if (scrollY < windowHeight * 2.5) {
        setCurrentSection('servicios')
      } else if (scrollY < windowHeight * 3.5) {
        setCurrentSection('sobre-nosotros')
      } else {
        setCurrentSection('contacto')
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Ejecutar una vez al montar

    return () => window.removeEventListener('scroll', handleScroll)
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

  // Funciones para el carrusel de proyectos - INSTANT SNAP PERFORMANCE
  const nextCarouselProject = () => {
    setCurrentCarouselProject((prev) => (prev + 1) % projects.length)
    // Cambio instantáneo sin delays ni loading states
  }

  const prevCarouselProject = () => {
    setCurrentCarouselProject((prev) => (prev - 1 + projects.length) % projects.length)
    // Cambio instantáneo sin delays ni loading states
  }

  const currentProjectData = projects[currentProject]

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section id="inicio" className="relative h-screen overflow-hidden">
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
                quality={75} // Valor estático optimizado
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
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 items-start">
              
              {/* Project Info - Main Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ 
                  type: "tween",
                  delay: 0.3, 
                  duration: 0.8 
                }}
                className="space-y-8"
              >
                <AnimatePresence mode="wait">
                  <div className="space-y-6">
                    <motion.h1 
                      key={`title-${currentProject}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        type: "tween",
                        duration: 0.6,
                        ease: "easeOut"
                      }}
                      className="text-4xl md:text-5xl lg:text-6xl font-inter font-black text-white leading-tight"
                    >
                      {currentProjectData.title}
                    </motion.h1>
                    
                    <motion.p 
                      key={`desc-${currentProject}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ 
                        type: "tween",
                        duration: 0.6,
                        delay: 0.2,
                        ease: "easeOut"
                      }}
                      className="text-lg md:text-xl text-white/90 font-inter font-medium leading-relaxed max-w-2xl"
                    >
                      {currentProjectData.description}
                    </motion.p>
                  </div>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    type: "tween",
                    duration: 0.6, 
                    delay: 0.4 
                  }}
                  className="flex gap-4"
                >
                  {/* Botón Principal - Glassmorphism */}
                  <Button 
                    size="lg" 
                    className="
                      bg-white/10 hover:bg-white/20 
                      dark:bg-white/5 dark:hover:bg-white/15
                      text-white font-inter font-semibold
                      border border-white/20 hover:border-white/40
                      backdrop-blur-xl shadow-2xl hover:shadow-white/10
                      px-8 py-4 text-lg rounded-2xl
                      transition-all duration-500 group
                      hover:scale-105 active:scale-95
                      relative overflow-hidden
                      before:absolute before:inset-0 
                      before:bg-gradient-to-r before:from-white/5 before:to-transparent 
                      before:opacity-0 before:transition-opacity before:duration-300
                      hover:before:opacity-100
                    "
                  >
                    <span className="relative z-10 flex items-center">
                      Explorar Proyecto
                      <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-all duration-300" />
                    </span>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </Button>

                  {/* Botón Secundario - Outline */}
                  <Button 
                    variant="outline"
                    size="lg"
                    className="
                      bg-transparent hover:bg-white/5
                      dark:hover:bg-white/10
                      text-white/90 hover:text-white
                      border-2 border-white/30 hover:border-white/60
                      backdrop-blur-xl
                      px-6 py-4 rounded-2xl
                      transition-all duration-300 group
                      hover:scale-105 active:scale-95
                      font-inter font-medium
                    "
                  >
                    <span className="flex items-center">
                      Ver Galería
                      <svg 
                        className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
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

        {/* Section Navigator */}
        <div className="absolute bottom-8 right-8 z-30">
          <div className="
            bg-white/5 hover:bg-white/10 
            dark:bg-white/5 dark:hover:bg-white/10
            backdrop-blur-xl border border-white/10 hover:border-white/20
            dark:border-white/10 dark:hover:border-white/25
            rounded-2xl px-4 py-3 shadow-2xl
            transition-all duration-300 group
          ">
            <div className="flex items-center gap-3">
              {/* Icono de ubicación */}
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              
              {/* Texto de sección */}
              <div className="text-right">
                <p className="text-white font-inter font-semibold text-base capitalize">
                  {sections.find(section => section.id === currentSection)?.name || 'Inicio'}
                </p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 w-16 h-0.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                style={{ 
                  width: `${((sections.findIndex(s => s.id === currentSection) + 1) / sections.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Proyectos Section */}
      <section id="proyectos" className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-slate-400 to-gray-600 dark:from-slate-600 dark:to-gray-700 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wider uppercase rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-white dark:to-gray-100 text-gray-800 dark:text-black border border-gray-300 dark:border-gray-300">
                Portafolio
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative"
            >
              <span className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 dark:from-white dark:via-white dark:to-white bg-clip-text text-transparent leading-tight">
                Nuestros
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-700 via-slate-800 to-gray-700 dark:from-white dark:via-white dark:to-white bg-clip-text text-transparent leading-tight">
                Proyectos
              </span>
              
              {/* Decorative elements */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.8, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-500 rounded-full opacity-80"
              ></motion.div>
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 1, type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-gray-500 to-slate-700 dark:from-gray-400 dark:to-gray-200 rounded-full opacity-70"
              ></motion.div>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light"
            >
              Descubre nuestra cartera de proyectos arquitectónicos que 
              <span className="font-medium text-gray-800 dark:text-gray-200"> transforman espacios </span>
              y crean 
              <span className="font-medium text-slate-700 dark:text-slate-300"> experiencias únicas</span>
            </motion.p>

            {/* Decorative line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "12rem" }}
              transition={{ duration: 1, delay: 0.7 }}
              viewport={{ once: true }}
              className="h-1 bg-gradient-to-r from-gray-500 to-slate-700 dark:from-gray-400 dark:to-gray-200 mx-auto mt-8 rounded-full"
            ></motion.div>
          </motion.div>

          {/* Projects Carousel - Professional Premium Design */}
          <div className="relative w-full max-w-7xl mx-auto px-4">
            {/* Carousel Container with Advanced Styling */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 1, 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative overflow-hidden"
              >
                {/* Premium Cards Container with Perspective */}
                <div className="relative perspective-1000">
                  <div 
                    className="flex will-change-transform transform-gpu"
                    style={{
                      transform: `translate3d(calc(-${currentCarouselProject * 100}% + ${currentCarouselProject * 48}px), 0, 0)`,
                      // SIN TRANSICIONES - Cambio instantáneo natural
                    }}
                  >
                    {projects.map((project, index) => {
                      const isActive = index === currentCarouselProject;
                      
                      return (
                        <div
                          key={project.id}
                          className="relative flex-shrink-0 w-full max-w-5xl mx-auto"
                          style={{
                            marginRight: index < projects.length - 1 ? '48px' : '0'
                          }}
                        >
                          {/* INSTANT Performance Card - Zero Lag */}
                          <div 
                            className="relative w-full h-[500px] rounded-3xl overflow-hidden cursor-pointer will-change-transform transform-gpu"
                            style={{
                              // Propiedades fijas - Sin transiciones
                              boxShadow: isActive 
                                ? '0 25px 80px -15px rgba(0,0,0,0.4)' 
                                : '0 15px 40px -10px rgba(0,0,0,0.3)',
                              transform: isActive ? 'scale(1)' : 'scale(0.95)',
                              opacity: isActive ? 1 : 0.7,
                              // SIN TRANSITION - Cambio instantáneo
                            }}
                          >
                            {/* Optimized Image Container */}
                            <div className="absolute inset-0">
                              <OptimizedImage
                                src={project.image}
                                alt={`${project.title} - Architectural Project`}
                                width={1200}
                                height={500}
                                className="object-cover w-full h-full will-change-transform transform-gpu"
                                priority={isActive}
                                quality={90}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                              />
                            </div>
                            
                            {/* Instant Info Container */}
                            <div className="absolute bottom-8 right-8 text-right text-white z-20">
                              <div 
                                className="space-y-2 will-change-transform transform-gpu"
                                style={{
                                  // Propiedades fijas sin transiciones
                                  opacity: isActive ? 1 : 0.9,
                                  transform: isActive ? 'scale(1)' : 'scale(0.95)',
                                  // SIN TRANSITION - Cambio instantáneo
                                }}
                              >
                                {/* Instant Title - No Transitions */}
                                <h3 
                                  className="font-black leading-none drop-shadow-2xl will-change-transform transform-gpu"
                                  style={{
                                    // Tamaño fijo sin transiciones
                                    fontSize: isActive ? '2.25rem' : '1.875rem',
                                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.95)',
                                    // SIN TRANSITION - Cambio instantáneo natural
                                  }}
                                >
                                  {project.title.split(' ').slice(0, 2).join(' ').toUpperCase()}.
                                </h3>
                                
                                {/* Instant Subtitle - No Transitions */}
                                <p 
                                  className="text-white/80 drop-shadow-lg leading-relaxed will-change-transform transform-gpu"
                                  style={{
                                    // Propiedades fijas sin transiciones
                                    fontSize: isActive ? '1.125rem' : '0.875rem',
                                    fontWeight: isActive ? '500' : '400',
                                    // SIN TRANSITION - Cambio instantáneo natural
                                  }}
                                >
                                  {project.category} • {project.title.split(' ').slice(2).join(' ')}
                                </p>
                              </div>
                            </div>
                            
                            {/* Minimal Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* INSTANT Navigation - PREV */}
            <button
              onClick={prevCarouselProject}
              disabled={currentCarouselProject === 0}
              className="
                absolute left-0 top-1/2 -translate-y-1/2 z-50
                group flex items-center gap-3
                bg-black/20 hover:bg-black/40 
                backdrop-blur-2xl border border-white/20 hover:border-white/40
                px-6 py-4 rounded-r-2xl text-white font-bold text-lg
                disabled:opacity-30 disabled:cursor-not-allowed
                shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)]
                will-change-transform transform-gpu
                transition-colors duration-200
                hover:scale-105 active:scale-95
              "
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-150 drop-shadow-lg will-change-transform transform-gpu" />
              <span className="font-black tracking-wider">PREV</span>
            </button>

            {/* INSTANT Navigation - NEXT */}
            <button
              onClick={nextCarouselProject}
              disabled={currentCarouselProject === projects.length - 1}
              className="
                absolute right-0 top-1/2 -translate-y-1/2 z-50
                group flex items-center gap-3
                bg-black/20 hover:bg-black/40 
                backdrop-blur-2xl border border-white/20 hover:border-white/40
                px-6 py-4 rounded-l-2xl text-white font-bold text-lg
                disabled:opacity-30 disabled:cursor-not-allowed
                shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)]
                will-change-transform transform-gpu
                transition-colors duration-200
                hover:scale-105 active:scale-95
              "
            >
              <span className="font-black tracking-wider">NEXT</span>
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-150 drop-shadow-lg will-change-transform transform-gpu" />
            </button>
            
            {/* Optimized Progress Indicator */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <div className="flex gap-3">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentCarouselProject(index)
                    }}
                    style={{
                      // Cambio instantáneo de dimensiones
                      width: index === currentCarouselProject ? '3rem' : '1rem',
                      height: '1rem',
                      background: index === currentCarouselProject 
                        ? 'linear-gradient(to right, #1f2937, #111827)' 
                        : 'rgba(156, 163, 175, 0.6)',
                      // Solo transición suave en colores, NO en posición
                      transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                      transform: 'scale(1)', // Siempre fijo
                      boxShadow: index === currentCarouselProject 
                        ? '0 4px 14px 0 rgba(0, 0, 0, 0.3)' 
                        : '0 2px 8px 0 rgba(0, 0, 0, 0.2)'
                    }}
                    className="relative overflow-hidden rounded-full cursor-pointer hover:scale-125 will-change-transform transform-gpu"
                  >
                    {index === currentCarouselProject && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"
                      />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Optimized Progress Counter */}
              <div className="flex items-center gap-2 ml-6 text-gray-600 dark:text-gray-400 font-medium">
                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                  {String(currentCarouselProject + 1).padStart(2, '0')}
                </span>
                <span>/</span>
                <span>{String(projects.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Ofrecemos servicios integrales de arquitectura y diseño para convertir tus ideas en realidad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Building,
                title: "Arquitectura Residencial",
                description: "Diseño y construcción de viviendas únicas que reflejan tu estilo de vida y personalidad.",
                features: ["Diseño personalizado", "Sostenibilidad", "Tecnología inteligente"]
              },
              {
                icon: Star,
                title: "Arquitectura Comercial",
                description: "Espacios comerciales que maximizan la funcionalidad y crean experiencias memorables.",
                features: ["Espacios optimizados", "Branding arquitectónico", "ROI maximizado"]
              },
              {
                icon: Leaf,
                title: "Diseño Sostenible",
                description: "Arquitectura eco-friendly con certificación LEED y tecnologías verdes.",
                features: ["Certificación LEED", "Eficiencia energética", "Materiales sostenibles"]
              },
              {
                icon: Users,
                title: "Consultoría Arquitectónica",
                description: "Asesoramiento especializado para optimizar tus proyectos arquitectónicos.",
                features: ["Análisis de viabilidad", "Optimización de costos", "Gestión de proyectos"]
              },
              {
                icon: Award,
                title: "Interiorismo",
                description: "Diseño de interiores que complementa perfectamente la arquitectura exterior.",
                features: ["Diseño integral", "Mobiliario personalizado", "Iluminación especializada"]
              },
              {
                icon: House,
                title: "Remodelaciones",
                description: "Transformación de espacios existentes con soluciones innovadoras y creativas.",
                features: ["Renovación completa", "Ampliaciones", "Modernización"]
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-slate-800 dark:from-gray-400 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre Nosotros Section */}
      <section id="sobre-nosotros" className="py-20 bg-white dark:bg-slate-900">
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
              Más de 15 años de experiencia creando espacios que inspiran y perduran en el tiempo
            </p>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { number: "150+", label: "Proyectos Completados" },
              { number: "15+", label: "Años de Experiencia" },
              { number: "50+", label: "Clientes Satisfechos" },
              { number: "25+", label: "Premios Ganados" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-300 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Star,
                title: "Diseño Premium",
                description: "Cada proyecto es único, diseñado con atención al detalle y materiales de la más alta calidad para crear espacios excepcionales."
              },
              {
                icon: Users,
                title: "Equipo Experto",
                description: "Arquitectos certificados con amplia experiencia en proyectos residenciales, comerciales e institucionales de gran envergadura."
              },
              {
                icon: Award,
                title: "Premios Reconocidos",
                description: "Hemos sido galardonados con múltiples premios nacionales e internacionales por nuestro diseño innovador y sostenible."
              },
              {
                icon: Building,
                title: "Sostenibilidad",
                description: "Comprometidos con el medio ambiente, utilizamos prácticas eco-friendly y tecnologías verdes en todos nuestros proyectos."
              },
              {
                icon: Leaf,
                title: "Tecnología Avanzada",
                description: "Implementamos las últimas tecnologías en diseño 3D, BIM y realidad virtual para visualizar proyectos antes de construir."
              },
              {
                icon: House,
                title: "Servicio Integral",
                description: "Desde el concepto inicial hasta la entrega final, ofrecemos un servicio completo que incluye diseño, construcción y seguimiento."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 group border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-slate-800 dark:from-gray-400 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="w-8 h-8 text-white dark:text-black" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Contáctanos
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              ¿Tienes un proyecto en mente? Nos encantaría escucharte y hacer realidad tus ideas arquitectónicas
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Información de Contacto
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      title: "Email",
                      content: "contacto@garquitectos.com",
                      subtitle: "Respuesta en menos de 24 horas"
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      title: "Teléfono",
                      content: "+52 (55) 1234-5678",
                      subtitle: "Lunes a Viernes, 9:00 AM - 6:00 PM"
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      title: "Ubicación",
                      content: "Polanco, Ciudad de México",
                      subtitle: "Visitas con cita previa"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start space-x-4 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-slate-800 dark:from-gray-400 dark:to-gray-600 rounded-xl flex items-center justify-center text-white dark:text-black flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                          {item.title}
                        </h4>
                        <p className="text-slate-900 dark:text-white font-medium mb-1">
                          {item.content}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {item.subtitle}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Envíanos un Mensaje
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-slate-700 dark:text-white transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-slate-700 dark:text-white transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tipo de Proyecto
                  </label>
                  <select className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-slate-700 dark:text-white transition-colors">
                    <option>Selecciona un tipo</option>
                    <option>Residencial</option>
                    <option>Comercial</option>
                    <option>Remodelación</option>
                    <option>Consultoría</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-slate-700 dark:text-white transition-colors resize-none"
                    placeholder="Cuéntanos sobre tu proyecto..."
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-gray-700 to-slate-900 hover:from-gray-800 hover:to-black dark:from-gray-300 dark:to-gray-500 dark:hover:from-gray-200 dark:hover:to-gray-400 text-white dark:text-black py-3 text-lg font-semibold transition-all duration-300">
                  Enviar Mensaje
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      </div>
  )
}
