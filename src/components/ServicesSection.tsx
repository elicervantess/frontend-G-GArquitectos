import { useOptimizedInView } from '@/hooks/useOptimizedInView'
import { Star, Users, Award, Building, Leaf, House } from 'lucide-react'

const services = [
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
]

export function ServicesSection() {
  const { ref: sectionRef, isInView } = useOptimizedInView({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  })

  return (
    <section 
      id="servicios" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 services-container"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con CSS Animations */}
        <div className={`text-center mb-16 section-fade-in ${isInView ? 'section-fade-in-visible' : ''}`}>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Ofrecemos servicios integrales de arquitectura y diseño para convertir tus ideas en realidad
          </p>
        </div>

        {/* Services Grid con Stagger CSS Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`service-card service-card-hover stagger-item stagger-item-${(index % 4) + 1} ${
                isInView ? 'service-card-visible stagger-visible' : ''
              } bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-transparent hover:border-gray-300 dark:hover:border-gray-600`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-slate-800 dark:from-gray-400 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-6 composite-layer">
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
                    <div className="w-1.5 h-1.5 bg-gray-600 dark:bg-gray-400 rounded-full mr-3 composite-layer" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
