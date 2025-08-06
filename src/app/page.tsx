"use client"

import "@/styles/performance.css"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { ArrowRight, Star, Users, Award, Building, ChevronLeft, ChevronRight, Leaf, House, Facebook, Linkedin, Instagram } from "lucide-react"
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

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState('proyectos') // Iniciar en proyectos
  const [currentProject, setCurrentProject] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  
  // Valores optimizados estáticos para evitar hydration mismatch
  const imageQuality = 85
  const imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"

  // Evitar hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Secciones de navegación
  const sections = [
    { id: 'proyectos', name: 'Proyectos' }, // Hero es proyectos pero también inicio
    { id: 'nosotros', name: 'Nosotros' },
    { id: 'clientes', name: 'Clientes' },
    { id: 'reseñas', name: 'Reseñas' },
    { id: 'contacto', name: 'Contacto' }
  ]

  // AUTOPLAY OPTIMIZADO - Sin interferir con performance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProject((prev) => (prev + 1) % projects.length)
    }, 7000) // Reducido a 7 segundos para más dinamismo

    return () => clearInterval(interval)
  }, []) // Sin dependencias para evitar re-creación

  // PRELOAD CRÍTICO - Imágenes del carrusel
  useEffect(() => {
    if (isMounted && projects.length > 0) {
      // Precargar las primeras 2 imágenes INMEDIATAMENTE
      const priorityImages = projects.slice(0, 2)
      priorityImages.forEach((project) => {
        const img = new Image()
        img.src = project.image
        img.loading = 'eager'
      })

      // Precargar el resto después de 500ms
      const timer = setTimeout(() => {
        projects.slice(2).forEach((project) => {
          const img = new Image()
          img.src = project.image
          img.loading = 'lazy'
        })
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isMounted, projects])

  // SCROLL LISTENER ULTRA-OPTIMIZADO - ZERO LAG
  useEffect(() => {
    let ticking = false
    let lastScrollY = 0
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          
          // Solo actualizar si hay cambio significativo (evita renders innecesarios)
          if (Math.abs(scrollY - lastScrollY) > 50) {
            const windowHeight = window.innerHeight
            let newSection = 'proyectos' // Proyectos es el inicio

            // Ajustar breakpoints para las nuevas secciones
            if (scrollY >= windowHeight * 3.5) {
              newSection = 'contacto'
            } else if (scrollY >= windowHeight * 2.5) {
              newSection = 'reseñas'
            } else if (scrollY >= windowHeight * 1.5) {
              newSection = 'clientes'
            } else if (scrollY >= windowHeight * 0.8) {
              newSection = 'nosotros'
            }

            // Solo actualizar si la sección cambió
            setCurrentSection(prev => prev !== newSection ? newSection : prev)
            lastScrollY = scrollY
          }
          
          ticking = false
        })
        ticking = true
      }
    }

    // Usar scroll pasivo para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Ejecutar una vez al montar

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // FUNCIONES OPTIMIZADAS CON useCallback - ZERO RE-RENDERS
  const nextProject = useCallback(() => {
    setCurrentProject((prev) => (prev + 1) % projects.length)
  }, [])

  const prevProject = useCallback(() => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length)
  }, [])

  const currentProjectData = projects[currentProject]

  return (
    <div className="min-h-screen scroll-optimized">
      {/* Hero Carousel Section - Proyectos y también funciona como Inicio */}
      <section id="proyectos" className="relative h-screen overflow-hidden composite-layer">
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
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:border-white/40 transition-all duration-300 group"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextProject}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-16 md:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:border-white/40 transition-all duration-300 group"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentProject(index)}
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
                  {sections.find(section => section.id === currentSection)?.name || 'Proyectos'}
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
      
      {/* Nosotros Section */}
      <section id="nosotros" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Sobre Nosotros
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12">
              Conoce al equipo de arquitectos expertos que transforman ideas en realidades extraordinarias
            </p>
            
            {/* Stats Section - Moved here and increased size by 20% */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { number: "150+", label: "Proyectos" },
                { number: "15+", label: "Años" },
                { number: "50+", label: "Clientes" },
                { number: "25+", label: "Premios" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true, amount: 0.5 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Architects Team - Simple Layout without Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-16 max-w-5xl mx-auto">
            {[
              {
                id: 1,
                name: "Gonzalo Sanchez",
                title: "Arquitecto Principal",
                image: "/images/architects/gonzalo.jpg",
                bio: "Con más de 15 años de experiencia en diseño arquitectónico, especializado en proyectos residenciales y comerciales de alta gama.",
                social: {
                  facebook: "https://facebook.com/gonzalo.garcia",
                  linkedin: "https://linkedin.com/in/gonzalo.garcia",
                  instagram: "https://instagram.com/gonzalo.garcia"
                }
              },
              {
                id: 2,
                name: "Grethel Cervantes",
                title: "Arquitecta Senior",
                image: "/images/architects/grethel.jpg",
                bio: "Especialista en diseño sostenible y arquitectura bioclimática, con enfoque en la innovación y funcionalidad en cada proyecto.",
                social: {
                  facebook: "https://facebook.com/grethel.morales",
                  linkedin: "https://linkedin.com/in/grethel.morales",
                  instagram: "https://instagram.com/grethel.morales"
                }
              }
            ].map((architect, index) => (
              <motion.div
                key={architect.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-center"
              >
                {/* Photo - Much Larger and rectangular - AQUÍ SE EDITA EL TAMAÑO */}
                <motion.div 
                  className="flex justify-center mb-8"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.2 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {/* TAMAÑO DE LA FOTO: w-96 h-[32rem] = 384x512px */}
                  <div className="w-96 h-[32rem] relative overflow-hidden rounded-2xl shadow-2xl">
                    <OptimizedImage
                      src={architect.image}
                      alt={`${architect.name} - ${architect.title}`}
                      width={384}
                      height={512}
                      className="object-cover w-full h-full hover:scale-110 transition-transform duration-700 ease-out"
                      priority={index === 0}
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
                
                {/* Name and Title */}
                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.4 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <h3 className="text-3xl font-bold text-black dark:text-white mb-3">
                    {architect.name}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    {architect.title}
                  </p>
                </motion.div>
                
                {/* Social Media - Smaller icons with monochrome palette */}
                <motion.div 
                  className="flex justify-center space-x-3 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.6 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <motion.a
                    href={architect.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-black dark:hover:bg-white rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black transition-all duration-300"
                  >
                    <Facebook size={16} />
                  </motion.a>
                  
                  <motion.a
                    href={architect.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-black dark:hover:bg-white rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black transition-all duration-300"
                  >
                    <Linkedin size={16} />
                  </motion.a>
                  
                  <motion.a
                    href={architect.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-black dark:hover:bg-white rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-black transition-all duration-300"
                  >
                    <Instagram size={16} />
                  </motion.a>
                </motion.div>
                
                {/* Biography */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.8 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto">
                    {architect.bio}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Company Values Section - Nosotros, Visión, Misión - CSS Pure Animations */}
          <div className="mt-32 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m4 0h1" />
                    </svg>
                  ),
                  title: "NOSOTROS",
                  description: "Somos una empresa con más de 29 años, con un equipo calificado y experimentado en constante evolución y crecimiento."
                },
                {
                  icon: (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ),
                  title: "VISIÓN",
                  description: "Ser la empresa líder en el mercado nacional en la Construcción e Implementaciones y Arquitectura Publicitaria."
                },
                {
                  icon: (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                  ),
                  title: "MISIÓN",
                  description: "Somos una organización comprometida en alcanzar la completa satisfacción de nuestros clientes cuidando la calidad."
                }
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="text-center opacity-0 animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Icon Circle */}
                  <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
                    {item.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-6 tracking-wide">
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm mx-auto text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Nuestros Valores Section - Company Values with Icons */}
          <div className="mt-32 mb-20">
            {/* Title */}
            <div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
                NUESTROS VALORES
              </h2>
            </div>

            {/* Top Row - 5 Values Labels */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl mx-auto mb-8">
              {[
                { title: "ÉTICA" },
                { title: "HONESTIDAD" },
                { title: "PUNTUALIDAD" },
                { title: "LIDERAZGO" },
                { title: "SEGURIDAD" }
              ].map((value, index) => (
                <div
                  key={value.title}
                  className="text-center opacity-0 animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-bold tracking-wide rounded-full">
                    {value.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Center Row - 5 Icon Circles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-4xl mx-auto mb-8">
              {[
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                  )
                },
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )
                }
              ].map((value, index) => (
                <div
                  key={index}
                  className="text-center opacity-0 animate-fade-in-scale"
                  style={{ 
                    animationDelay: `${index * 100 + 200}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Icon Circle with Decorative Border */}
                  <div className="relative mx-auto">
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center relative text-gray-600 dark:text-gray-400">
                      {value.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row - 4 Values Labels */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { title: "RESPETO" },
                { title: "COMPROMISO" },
                { title: "TOLERANCIA" },
                { title: "RESPONSABILIDAD" }
              ].map((value, index) => (
                <div
                  key={value.title}
                  className="text-center opacity-0 animate-fade-in-up"
                  style={{ 
                    animationDelay: `${index * 100 + 500}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <span className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-bold tracking-wide rounded-full">
                    {value.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Clientes Section */}
      <section id="clientes" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Nuestros Clientes
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12">
              Marcas reconocidas que confían en nuestra experiencia y calidad arquitectónica
            </p>
          </motion.div>

          {/* Solo mostrar el carrusel después de la hidratación */}
          {isMounted && (
            <>
              {/* Premium Client Carousel - Single Row with Redirects */}
              <div className="relative">
                {/* Enhanced Gradient Masks */}
                <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-gray-50 via-gray-50/90 via-gray-50/60 to-transparent dark:from-slate-900 dark:via-slate-900/90 dark:via-slate-900/60 dark:to-transparent z-20" />
                <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-gray-50 via-gray-50/90 via-gray-50/60 to-transparent dark:from-slate-900 dark:via-slate-900/90 dark:via-slate-900/60 dark:to-transparent z-20" />
                
                {/* Main Carousel Container */}
                <div className="overflow-hidden py-12">
                  <motion.div
                    className="flex gap-12 items-center"
                    animate={{
                      x: [0, -2400]
                    }}
                    transition={{
                      x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 40,
                        ease: "linear"
                      }
                    }}
                    style={{ width: "max-content" }}
                  >
                    {/* Single row with clickable logos */}
                    {[
                      { name: "Banco del Bajío", src: "/images/clients/banbajio.png", website: "https://www.bb.com.mx" },
                      { name: "Charly", src: "/images/clients/charly.png", website: "https://www.charly.mx" },
                      { name: "Walmart", src: "/images/clients/walmart.png", website: "https://www.walmart.com.mx" },
                      { name: "Flexi", src: "/images/clients/flexi.png", website: "https://www.flexi.com.mx" },
                      { name: "La Costeña", src: "/images/clients/la-costena.png", website: "https://www.lacostena.com.mx" },
                      { name: "OXXO", src: "/images/clients/oxxo.png", website: "https://www.oxxo.com" },
                      { name: "Telmex", src: "/images/clients/telmex.png", website: "https://www.telmex.com" },
                      { name: "Telcel", src: "/images/clients/telcel.png", website: "https://www.telcel.com" },
                      // Duplicamos para crear loop infinito perfecto
                      { name: "Banco del Bajío", src: "/images/clients/banbajio.png", website: "https://www.bb.com.mx" },
                      { name: "Charly", src: "/images/clients/charly.png", website: "https://www.charly.mx" },
                      { name: "Walmart", src: "/images/clients/walmart.png", website: "https://www.walmart.com.mx" },
                      { name: "Flexi", src: "/images/clients/flexi.png", website: "https://www.flexi.com.mx" },
                      { name: "La Costeña", src: "/images/clients/la-costena.png", website: "https://www.lacostena.com.mx" },
                      { name: "OXXO", src: "/images/clients/oxxo.png", website: "https://www.oxxo.com" },
                      { name: "Telmex", src: "/images/clients/telmex.png", website: "https://www.telmex.com" },
                      { name: "Telcel", src: "/images/clients/telcel.png", website: "https://www.telcel.com" }
                    ].map((client, index) => (
                      <div
                        key={`${client.name}-${index}`}
                        className="flex-shrink-0 group cursor-pointer relative"
                      >
                        {/* Clickable Container that redirects to company website */}
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-56 h-32 flex items-center justify-center p-8 rounded-2xl bg-white/50 dark:bg-white backdrop-blur-sm border border-gray-200/30 dark:border-gray-300/50 hover:border-gray-300/60 dark:hover:border-gray-400/70 transition-all duration-500 group-hover:transform group-hover:scale-105 group-hover:shadow-xl group-hover:bg-white/80 dark:group-hover:bg-white"
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <OptimizedImage
                              src={client.src}
                              alt={`${client.name} - Cliente de GYG Arquitectos`}
                              width={200}
                              height={120}
                              className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                              quality={95}
                              style={{
                                objectFit: 'contain',
                                objectPosition: 'center',
                                width: 'auto',
                                height: 'auto',
                                maxWidth: '100%',
                                maxHeight: '100%'
                              }}
                            />
                          </div>
                          
                          {/* Hover overlay con nombre del cliente y indicador de link */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl flex items-end justify-center pb-4">
                            <div className="text-center">
                              <span className="text-white text-sm font-medium tracking-wide block">
                                {client.name}
                              </span>
                              <span className="text-white/80 text-xs flex items-center justify-center mt-1">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Visitar sitio web
                              </span>
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Premium Trust Indicators */}
              <div className="text-center mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
                <div className="inline-flex items-center space-x-8 px-8 py-4 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-full border border-gray-200/30 dark:border-gray-700/30">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Empresas Verificadas</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">Proyectos Exitosos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Confianza Garantizada</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Placeholder mientras se hidrata */}
          {!isMounted && (
            <div className="relative">
              <div className="overflow-hidden">
                <div className="flex gap-16 items-center justify-center py-10">
                  {[
                    { name: "Banco del Bajío", src: "/images/clients/banbajio.png" },
                    { name: "OXXO", src: "/images/clients/oxxo.png" },
                    { name: "Telcel", src: "/images/clients/telcel.png" },
                    { name: "La Costeña", src: "/images/clients/la-costena.png" }
                  ].map((client, index) => (
                    <div
                      key={client.name}
                      className="flex-shrink-0"
                    >
                      <div className="w-40 h-20 flex items-center justify-center p-4">
                        <OptimizedImage
                          src={client.src}
                          alt={`${client.name} - Cliente de GYG Arquitectos`}
                          width={160}
                          height={80}
                          className="max-w-full max-h-full object-contain opacity-60 filter grayscale"
                          quality={90}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stats Section - Redesigned - Simple without cards for better performance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mt-20 text-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
              {[
                { 
                  number: "98%", 
                  label: "Satisfacción del Cliente",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )
                },
                { 
                  number: "200+", 
                  label: "Proyectos Corporativos",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m4 0h1" />
                    </svg>
                  )
                },
                { 
                  number: "24/7", 
                  label: "Soporte Personalizado",
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                    </svg>
                  )
                }
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center"
                >
                  {/* Simple Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mb-4">
                    {stat.icon}
                  </div>
                  
                  {/* Number */}
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  
                  {/* Label */}
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reseñas Section */}
      <section id="reseñas" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Testimonios reales de proyectos que han transformado espacios y superado expectativas
            </p>
          </motion.div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                company: "Directora General, Innovate Corp",
                review: "GYG Arquitectos transformó completamente nuestra oficina central. El diseño no solo es espectacular, sino que ha mejorado significativamente la productividad de nuestro equipo.",
                rating: 5,
                project: "Oficinas Corporativas Innovate"
              },
              {
                name: "Carlos Mendoza",
                company: "CEO, TechStart Solutions",
                review: "La atención al detalle y la capacidad de entender nuestra visión fue excepcional. Nuestro nuevo campus es el reflejo perfecto de nuestra cultura empresarial.",
                rating: 5,
                project: "Campus Tecnológico TechStart"
              },
              {
                name: "Ana Sofía Ruiz",
                company: "Propietaria, Villa Moderna",
                review: "Hicieron realidad el hogar de nuestros sueños. Cada espacio está diseñado con propósito y belleza. La experiencia fue increíble de principio a fin.",
                rating: 5,
                project: "Residencia Familiar"
              },
              {
                name: "Roberto Silva",
                company: "Director, Green Building Initiative",
                review: "Su enfoque en sostenibilidad y tecnología verde superó nuestras expectativas. El edificio es un ejemplo perfecto de arquitectura responsable.",
                rating: 5,
                project: "Torre Eco-Sostenible"
              },
              {
                name: "Lucía Herrera",
                company: "Gerente, Luxury Hotels Group",
                review: "El diseño de nuestro hotel boutique es simplemente extraordinario. Los huéspedes constantemente elogian la arquitectura y los espacios únicos.",
                rating: 5,
                project: "Hotel Boutique Premium"
              },
              {
                name: "Diego Ramírez",
                company: "Fundador, Creative Studios",
                review: "Entendieron perfectamente nuestra necesidad de espacios creativos y funcionales. Nuestro estudio ahora inspira a todo el equipo diariamente.",
                rating: 5,
                project: "Estudio Creativo Multimedia"
              }
            ].map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              >
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                {/* Review Text */}
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  "{review.review}"
                </p>
                
                {/* Author Info */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-slate-800 dark:from-gray-400 dark:to-gray-600 rounded-full flex items-center justify-center text-white dark:text-black font-bold">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {review.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {review.company}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Proyecto: {review.project}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mt-16"
          >
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
              ¿Quieres ser nuestro próximo cliente satisfecho?
            </p>
            <Button className="bg-gradient-to-r from-gray-700 to-slate-900 hover:from-gray-800 hover:to-black dark:from-gray-300 dark:to-gray-500 dark:hover:from-gray-200 dark:hover:to-gray-400 text-white dark:text-black px-8 py-3 text-lg font-semibold transition-all duration-300">
              Iniciar Mi Proyecto
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
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
            {/* Contact Info - Enhanced Design with Cards */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
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
                      subtitle: "Respuesta en menos de 24 horas",
                      bgColor: "bg-blue-50 dark:bg-blue-900/20",
                      iconColor: "text-blue-600 dark:text-blue-400",
                      borderColor: "border-blue-200 dark:border-blue-700"
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      title: "Teléfono",
                      content: "+52 (55) 1234-5678",
                      subtitle: "Lunes a Viernes, 9:00 AM - 6:00 PM",
                      bgColor: "bg-green-50 dark:bg-green-900/20",
                      iconColor: "text-green-600 dark:text-green-400",
                      borderColor: "border-green-200 dark:border-green-700"
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
                      subtitle: "Visitas con cita previa",
                      bgColor: "bg-purple-50 dark:bg-purple-900/20",
                      iconColor: "text-purple-600 dark:text-purple-400",
                      borderColor: "border-purple-200 dark:border-purple-700"
                    }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      className={`${item.bgColor} ${item.borderColor} border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group hover:scale-105`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center ${item.iconColor} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {item.title}
                          </h4>
                          <p className="text-slate-900 dark:text-white font-medium mb-1">
                            {item.content}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form - Simple Design without Card */}
            <div className="space-y-6">
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
            </div>
          </div>
        </div>
      </section>
      </div>
  )
}
