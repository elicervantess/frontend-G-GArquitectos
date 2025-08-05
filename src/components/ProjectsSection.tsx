import { useOptimizedInView } from '@/hooks/useOptimizedInView'
import { useOptimizedCarousel } from '@/hooks/useOptimizedCarousel'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Project {
  id: number
  title: string
  description: string
  category: string
  image: string
  imageMobile: string
  imageTablet: string
  featured: boolean
  icon: any
}

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const { ref: sectionRef, isInView } = useOptimizedInView({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  })

  const {
    currentIndex: currentCarouselProject,
    nextSlide: nextCarouselProject,
    prevSlide: prevCarouselProject,
    goToSlide: setCarouselProject,
    shouldPreload
  } = useOptimizedCarousel({
    totalItems: projects.length,
    autoPlayInterval: 4000,
    preloadRange: 1
  })

  return (
    <section 
      id="proyectos" 
      ref={sectionRef}
      className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden scroll-optimized"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-600 dark:to-gray-800 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-slate-400 to-gray-600 dark:from-slate-600 dark:to-gray-700 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section con CSS Animations */}
        <div className={`text-center mb-20 section-fade-in ${isInView ? 'section-fade-in-visible' : ''}`}>
          {/* Subtitle */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wider uppercase rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-white dark:to-gray-100 text-gray-800 dark:text-black border border-gray-300 dark:border-gray-300">
              Portafolio
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative">
            <span className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 dark:from-white dark:via-white dark:to-white bg-clip-text text-transparent leading-tight">
              Nuestros
            </span>
            <br />
            <span className="bg-gradient-to-r from-gray-700 via-slate-800 to-gray-700 dark:from-white dark:via-white dark:to-white bg-clip-text text-transparent leading-tight">
              Proyectos
            </span>
            
            {/* Decorative elements estáticos */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-300 dark:to-gray-500 rounded-full opacity-80"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-gray-500 to-slate-700 dark:from-gray-400 dark:to-gray-200 rounded-full opacity-70"></div>
          </h2>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
            Descubre nuestra cartera de proyectos arquitectónicos que 
            <span className="font-medium text-gray-800 dark:text-gray-200"> transforman espacios </span>
            y crean 
            <span className="font-medium text-slate-700 dark:text-slate-300"> experiencias únicas</span>
          </p>

          {/* Decorative line */}
          <div className="h-1 bg-gradient-to-r from-gray-500 to-slate-700 dark:from-gray-400 dark:to-gray-200 mx-auto mt-8 rounded-full w-48"></div>
        </div>

        {/* Carousel Optimizado - ZERO LAG */}
        <div className="relative w-full max-w-7xl mx-auto px-4">
          <div className="relative">
            <div className="relative overflow-hidden carousel-container">
              {/* Carousel Track */}
              <div 
                className="flex composite-layer"
                style={{
                  transform: `translate3d(-${currentCarouselProject * 100}%, 0, 0)`,
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform'
                }}
              >
                {projects.map((project, index) => {
                  const isActive = index === currentCarouselProject
                  const isVisible = Math.abs(index - currentCarouselProject) <= 1
                  
                  return (
                    <div
                      key={project.id}
                      className="w-full flex-shrink-0"
                    >
                      {/* Project Card */}
                      <div 
                        className={`relative w-full max-w-5xl mx-auto h-[500px] rounded-3xl overflow-hidden cursor-pointer composite-layer ${
                          isActive 
                            ? 'carousel-slide-active shadow-[0_25px_80px_-15px_rgba(0,0,0,0.4)]' 
                            : 'opacity-70 scale-95 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)]'
                        }`}
                        style={{
                          transition: 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease'
                        }}
                      >
                        {/* Image Container */}
                        <div className="absolute inset-0">
                          {isVisible && (
                            <OptimizedImage
                              src={project.image}
                              alt={`${project.title} - Proyecto arquitectónico`}
                              width={1200}
                              height={500}
                              className="object-cover w-full h-full project-image"
                              priority={shouldPreload(index)}
                              quality={isActive ? 90 : 75}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                            />
                          )}
                        </div>
                        
                        {/* Project Info */}
                        <div className="absolute bottom-8 right-8 text-right text-white z-20">
                          <div className="space-y-2">
                            <h3 className={`font-black leading-none drop-shadow-2xl ${
                              isActive ? 'text-4xl' : 'text-3xl'
                            }`}>
                              {project.title.split(' ').slice(0, 2).join(' ').toUpperCase()}.
                            </h3>
                            <p className={`text-white/80 drop-shadow-lg leading-relaxed ${
                              isActive ? 'text-lg font-medium' : 'text-sm font-normal'
                            }`}>
                              {project.category} • {project.title.split(' ').slice(2).join(' ')}
                            </p>
                          </div>
                        </div>
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <button
              onClick={prevCarouselProject}
              disabled={currentCarouselProject === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-50 group flex items-center gap-3 bg-black/20 hover:bg-black/40 backdrop-blur-2xl border border-white/20 hover:border-white/40 px-6 py-4 rounded-r-2xl text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] composite-layer transition-colors duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform duration-150 drop-shadow-lg composite-layer" />
              <span className="font-black tracking-wider">PREV</span>
            </button>

            <button
              onClick={nextCarouselProject}
              disabled={currentCarouselProject === projects.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-50 group flex items-center gap-3 bg-black/20 hover:bg-black/40 backdrop-blur-2xl border border-white/20 hover:border-white/40 px-6 py-4 rounded-l-2xl text-white font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] composite-layer transition-colors duration-200 hover:scale-105 active:scale-95"
            >
              <span className="font-black tracking-wider">NEXT</span>
              <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform duration-150 drop-shadow-lg composite-layer" />
            </button>
            
            {/* Progress Indicators */}
            <div className="flex justify-center items-center gap-4 mt-12">
              <div className="flex gap-3">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselProject(index)}
                    className={`relative overflow-hidden rounded-full cursor-pointer hover:scale-125 composite-layer transition-all duration-200 ease-out ${
                      index === currentCarouselProject 
                        ? 'w-12 h-4 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg' 
                        : 'w-4 h-4 bg-gray-400/60 shadow-md'
                    }`}
                  >
                    {index === currentCarouselProject && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              
              {/* Progress Counter */}
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
      </div>
    </section>
  )
}
