"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { OptimizedImage } from "@/components/ui/optimized-image"
import { 
  ShoppingCart, Plus, Search, Filter, Grid, List, ChevronLeft, ChevronRight, 
  Star, Heart, Eye, SlidersHorizontal, Award,
  CheckCircle, X, ArrowUpDown, MoreHorizontal, Home, Sofa, Sparkles, 
  Crown, Flame
} from "lucide-react"
import './tienda.css'

// Tipos para productos
interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  features: string[]
  inStock: boolean
  category: string
  rating: number
  reviews: number
  isNew?: boolean
  isBestseller?: boolean
  isPremium?: boolean
  discount?: number
  tags: string[]
}

// Tipos de sección de la tienda
type StoreSection = 'muebles' | 'interiores'

// Datos de productos premium (14 productos)
const products: Product[] = [
  {
    id: 1,
    name: "Planos Arquitectónicos Premium Elite",
    price: 2500,
    originalPrice: 3200,
    image: "/images/products/1.png",
    description: "Planos arquitectónicos detallados para residencias de lujo con especificaciones técnicas completas y renderizados 3D incluidos.",
    features: ["Planos estructurales", "Diseño de interiores", "Especificaciones técnicas", "Renderizados 3D", "Consulta incluida"],
    inStock: true,
    category: "Planos",
    rating: 4.9,
    reviews: 127,
    isNew: true,
    isBestseller: true,
    discount: 22,
    tags: ["Premium", "3D", "Completo"]
  },
  {
    id: 2,
    name: "Consultoría Arquitectónica VIP",
    price: 1800,
    image: "/images/products/2.png",
    description: "Sesión de consultoría personalizada con nuestros arquitectos expertos certificados internacionalmente.",
    features: ["3 horas de consulta", "Recomendaciones personalizadas", "Seguimiento por email", "Propuesta inicial", "Garantía de satisfacción"],
    inStock: true,
    category: "Consultoría",
    rating: 4.8,
    reviews: 89,
    isPremium: true,
    tags: ["VIP", "Experto", "Personalizado"]
  },
  {
    id: 3,
    name: "Kit de Materiales Eco-Sostenibles",
    price: 4200,
    image: "/images/products/3.png",
    description: "Selección curada de materiales eco-friendly certificados para construcción sostenible y responsable.",
    features: ["Certificación ecológica", "Entrega gratis", "Guía de instalación", "Garantía 10 años", "Soporte técnico"],
    inStock: true,
    category: "Materiales",
    rating: 4.9,
    reviews: 203,
    isBestseller: true,
    tags: ["Eco", "Sostenible", "Premium"]
  },
  {
    id: 4,
    name: "Renderizado 3D Ultra-Realista",
    price: 850,
    originalPrice: 1100,
    image: "/images/products/4.png",
    description: "Visualizaciones fotorealistas de máxima calidad con tecnología ray-tracing avanzada.",
    features: ["8 vistas diferentes", "Iluminación profesional", "Texturas 4K", "Revisiones ilimitadas", "Entrega 48h"],
    inStock: true,
    category: "Renderizado",
    rating: 4.7,
    reviews: 156,
    discount: 23,
    tags: ["Ultra-HD", "Ray-tracing", "Rápido"]
  },
  {
    id: 5,
    name: "Supervisión de Obra Master",
    price: 3500,
    image: "/images/products/5.png",
    description: "Supervisión profesional integral durante todo el proceso de construcción con reportes digitales.",
    features: ["Visitas bi-semanales", "Reportes digitales", "Control de calidad", "Asesoría 24/7", "App móvil"],
    inStock: true,
    category: "Supervisión",
    rating: 5.0,
    reviews: 78,
    isPremium: true,
    tags: ["Master", "24/7", "Digital"]
  },
  {
    id: 6,
    name: "Diseño de Paisajismo Luxury",
    price: 1950,
    image: "/images/products/6.png",
    description: "Diseño completo de jardines y espacios exteriores con enfoque en paisajismo de lujo.",
    features: ["Plano de plantación", "Selección premium", "Sistema de riego automático", "Mantenimiento 6 meses", "Garantía plantas"],
    inStock: true,
    category: "Paisajismo",
    rating: 4.6,
    reviews: 92,
    tags: ["Luxury", "Automático", "Garantía"]
  },
  {
    id: 7,
    name: "Proyecto Integral Residencial",
    price: 7500,
    originalPrice: 9000,
    image: "/images/products/7.png",
    description: "Proyecto arquitectónico completo desde diseño conceptual hasta supervisión de obra.",
    features: ["Diseño completo", "Planos ejecutivos", "Supervisión incluida", "Garantía total", "Soporte continuo"],
    inStock: true,
    category: "Proyectos",
    rating: 4.9,
    reviews: 45,
    isNew: true,
    isBestseller: true,
    isPremium: true,
    discount: 17,
    tags: ["Integral", "Premium", "Completo"]
  },
  {
    id: 8,
    name: "Consultorí­a Estructural Avanzada",
    price: 2200,
    image: "/images/products/8.png",
    description: "Análisis y consultoría estructural especializada con cálculos computacionales avanzados.",
    features: ["Análisis sísmico", "Cálculos computacionales", "Reporte técnico", "Certificación", "Respaldo legal"],
    inStock: true,
    category: "Consultoría",
    rating: 4.8,
    reviews: 67,
    tags: ["Avanzado", "Certificado", "Legal"]
  },
  {
    id: 9,
    name: "Kit Smart Home Integration",
    price: 3800,
    image: "/images/products/9.png",
    description: "Integración completa de tecnología inteligente para el hogar moderno y conectado.",
    features: ["Domótica completa", "App control", "Instalación incluida", "Configuración", "Soporte técnico"],
    inStock: true,
    category: "Tecnología",
    rating: 4.7,
    reviews: 134,
    isNew: true,
    tags: ["Smart", "Domótica", "Moderno"]
  },
  {
    id: 10,
    name: "Diseño de Interiores Premium",
    price: 2800,
    image: "/images/products/10.png",
    description: "Diseño de interiores personalizado con mobiliario de diseñador y acabados de lujo.",
    features: ["Diseño personalizado", "Mobiliario incluido", "Acabados luxury", "Renderizados", "Seguimiento"],
    inStock: true,
    category: "Interiores",
    rating: 4.9,
    reviews: 198,
    isBestseller: true,
    tags: ["Personalizado", "Luxury", "Mobiliario"]
  },
  {
    id: 11,
    name: "Certificación LEED Consulting",
    price: 4500,
    image: "/images/products/11.png",
    description: "Consultoría especializada para obtener certificación LEED en proyectos sustentables.",
    features: ["Asesoría LEED", "Documentación", "Seguimiento proceso", "Certificación garantizada", "Consultor experto"],
    inStock: true,
    category: "Certificaciones",
    rating: 4.8,
    reviews: 34,
    isPremium: true,
    tags: ["LEED", "Sustentable", "Certificado"]
  },
  {
    id: 12,
    name: "Remodelación Arquitectónica",
    price: 5200,
    originalPrice: 6000,
    image: "/images/products/12.png",
    description: "Servicio completo de remodelación arquitectónica con diseño moderno y funcional.",
    features: ["Análisis actual", "Diseño nuevo", "Planos de remodelación", "Supervisión", "Garantía obra"],
    inStock: true,
    category: "Remodelación",
    rating: 4.7,
    reviews: 76,
    discount: 13,
    tags: ["Remodelación", "Moderno", "Garantía"]
  },
  {
    id: 13,
    name: "Estudios de Factibilidad",
    price: 1600,
    image: "/images/products/13.png",
    description: "Análisis completo de factibilidad técnica y económica para proyectos arquitectónicos.",
    features: ["Análisis técnico", "Estudio económico", "Viabilidad legal", "Reporte ejecutivo", "Recomendaciones"],
    inStock: true,
    category: "Estudios",
    rating: 4.6,
    reviews: 52,
    tags: ["Factibilidad", "Análisis", "Ejecutivo"]
  },
  {
    id: 14,
    name: "Masterplan Urbano Premium",
    price: 8900,
    originalPrice: 10500,
    image: "/images/products/14.png",
    description: "Desarrollo de masterplan urbano integral con enfoque sustentable y tecnológico avanzado.",
    features: ["Planificación urbana", "Diseño sustentable", "Tecnología integrada", "Estudios completos", "Presentación ejecutiva"],
    inStock: false,
    category: "Urbanismo",
    rating: 5.0,
    reviews: 28,
    isNew: true,
    isPremium: true,
    discount: 15,
    tags: ["Masterplan", "Urbano", "Sustentable"]
  }
]

// Productos de interiores (5 productos)
const interioresProducts: Product[] = [
  {
    id: 15,
    name: "Sala de Estar Moderna Elite",
    price: 4500,
    originalPrice: 5200,
    image: "/images/interiores/1.png",
    description: "Diseño completo de sala de estar moderna con mobiliario premium y acabados de lujo.",
    features: ["Sofá italiano premium", "Mesa de centro diseñador", "Iluminación LED integrada", "Accesorios decorativos", "Instalación incluida"],
    inStock: true,
    category: "Salas",
    rating: 4.9,
    reviews: 145,
    isNew: true,
    isBestseller: true,
    discount: 13,
    tags: ["Moderno", "Premium", "Italiano"]
  },
  {
    id: 16,
    name: "Cocina Contemporánea Luxury",
    price: 7800,
    image: "/images/interiores/2.png",
    description: "Cocina integral contemporánea con electrodomésticos de última generación y acabados premium.",
    features: ["Electrodomésticos premium", "Isla central", "Iluminación especializada", "Acabados de lujo", "Garantía 5 años"],
    inStock: true,
    category: "Cocinas",
    rating: 5.0,
    reviews: 89,
    isPremium: true,
    tags: ["Luxury", "Contemporáneo", "Integral"]
  },
  {
    id: 17,
    name: "Dormitorio Principal Premium",
    price: 3200,
    originalPrice: 3800,
    image: "/images/interiores/3.png",
    description: "Dormitorio principal con diseño exclusivo, closet integrado y elementos de confort premium.",
    features: ["Cama king size diseñador", "Closet walk-in", "Iluminación ambiental", "Textiles premium", "Mobiliario complementario"],
    inStock: true,
    category: "Dormitorios",
    rating: 4.8,
    reviews: 167,
    discount: 16,
    tags: ["Premium", "Walk-in", "King Size"]
  },
  {
    id: 18,
    name: "Baño Spa de Lujo",
    price: 5500,
    image: "/images/interiores/4.png",
    description: "Baño principal con concepto spa, tina de hidromasaje y acabados de mármol natural.",
    features: ["Tina de hidromasaje", "Regadera de lluvia", "Mármol natural", "Iluminación spa", "Calefacción de piso"],
    inStock: true,
    category: "Baños",
    rating: 4.9,
    reviews: 78,
    isPremium: true,
    isBestseller: true,
    tags: ["Spa", "Hidromasaje", "Mármol"]
  },
  {
    id: 19,
    name: "Estudio Home Office Ejecutivo",
    price: 2900,
    originalPrice: 3400,
    image: "/images/interiores/5.png",
    description: "Estudio ejecutivo completo con mobiliario ergonómico y tecnología integrada para trabajo profesional.",
    features: ["Escritorio ejecutivo", "Silla ergonómica premium", "Librería integrada", "Iluminación de trabajo", "Cableado oculto"],
    inStock: true,
    category: "Oficinas",
    rating: 4.7,
    reviews: 112,
    discount: 15,
    tags: ["Ejecutivo", "Ergonómico", "Tecnología"]
  }
]

export default function TiendaPage() {
  // Estados principales
  const [currentSection, setCurrentSection] = useState<StoreSection>('muebles')
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [ratingFilter, setRatingFilter] = useState(0)
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [showQuickView, setShowQuickView] = useState<Product | null>(null)
  
  const router = useRouter()
  const itemsPerPage = 8 // 8 productos por página como pediste
  
  // Categorías dinámicas según la sección
  const mueblesCategories = [
    "Todos", "Planos", "Consultoría", "Materiales", "Renderizado", 
    "Supervisión", "Paisajismo", "Proyectos", "Tecnología", "Interiores",
    "Certificaciones", "Remodelación", "Estudios", "Urbanismo"
  ]
  
  const interioresCategories = [
    "Todos", "Salas", "Cocinas", "Dormitorios", "Baños", "Oficinas"
  ]
  
  const categories = currentSection === 'muebles' ? mueblesCategories : interioresCategories

  // Efecto para resetear filtros al cambiar de sección
  useEffect(() => {
    setSelectedCategory("Todos")
    setSearchTerm("")
    setCurrentPage(1)
  }, [currentSection])

  // Funciones del carrito y wishlist
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Obtener productos según la sección actual
  const currentProducts = currentSection === 'muebles' ? products : interioresProducts

  // Filtros avanzados y búsqueda
  const filteredProducts = currentProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesRating = product.rating >= ratingFilter
    const matchesStock = !onlyInStock || product.inStock
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock
  })

  // Ordenamiento avanzado
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      case "name": return a.name.localeCompare(b.name)
      case "rating": return b.rating - a.rating
      case "reviews": return b.reviews - a.reviews
      case "newest": return a.isNew ? -1 : b.isNew ? 1 : 0
      case "featured": 
        if (a.isBestseller && !b.isBestseller) return -1
        if (!a.isBestseller && b.isBestseller) return 1
        if (a.isPremium && !b.isPremium) return -1
        if (!a.isPremium && b.isPremium) return 1
        return b.rating - a.rating
      default: return 0
    }
  })

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy, priceRange, ratingFilter, onlyInStock])

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-6 pt-24">
        {/* Header de la página (NO fixed) - CENTRADO */}
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div>
              <h1 className="page-title text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                STORE
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 text-sm mt-2">
                <Award className="w-4 h-4 text-yellow-500" />
                Servicios arquitectónicos premium
              </p>
            </div>
            
            {/* Cart Premium - solo visible si hay items */}
            {cartItemCount > 0 && (
              <div className="relative">
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                  {cartItemCount}
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black px-4 py-2 rounded-xl shadow-lg">
                  <ShoppingCart className="w-4 h-4" />
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium opacity-90">{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</p>
                    <p className="text-sm font-bold">${cartTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300">
                    Ver
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Navegación de secciones y filtros integrados - Responsive */}
        <div className="bg-white/70 dark:bg-black/70 backdrop-blur border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-sm">
          {/* Layout responsive: móvil vertical, desktop horizontal */}
          <div className="flex flex-col gap-4">
            
            {/* Primera fila: Secciones + Búsqueda (siempre visibles) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {/* Secciones Muebles/Interiores */}
              <div className="section-tabs-mobile flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner w-full sm:w-auto">
                <button
                  onClick={() => setCurrentSection('muebles')}
                  className={`section-tab flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex-1 sm:flex-none ${
                    currentSection === 'muebles'
                      ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Home 
                    className="w-4 h-4 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push('/')
                    }}
                  />
                  <span className="font-semibold">Muebles</span>
                </button>
                <button
                  onClick={() => setCurrentSection('interiores')}
                  className={`section-tab flex items-center justify-center sm:justify-start gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm flex-1 sm:flex-none ${
                    currentSection === 'interiores'
                      ? 'bg-white dark:bg-gray-900 text-black dark:text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Sofa className="w-4 h-4" />
                  <span className="font-semibold">Interiores</span>
                </button>
              </div>

              {/* Barra de búsqueda */}
              <div className="flex-1 w-full sm:max-w-md">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-gray-500 dark:focus:border-gray-400 bg-white dark:bg-gray-900 text-sm shadow-sm transition-all duration-200"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Segunda fila: Filtros responsivos */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-4">
              
              {/* Filtros de ordenamiento - Mejor diseño móvil */}
              <div className="w-full lg:flex-1">
                {/* Versión móvil - Grid de 2 columnas */}
                <div className="block sm:hidden">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'featured', label: 'Relevantes', icon: Award, shortLabel: 'Relevantes' },
                      { value: 'newest', label: 'Nuevos', icon: Sparkles, shortLabel: 'Nuevos' },
                      { value: 'price-low', label: 'Menor $', icon: ChevronLeft, shortLabel: 'Menor $' },
                      { value: 'price-high', label: 'Mayor $', icon: ChevronRight, shortLabel: 'Mayor $' },
                      { value: 'rating', label: 'Top', icon: Star, shortLabel: 'Top Rated' },
                      { value: 'name', label: 'A-Z', icon: SlidersHorizontal, shortLabel: 'A-Z' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`filter-pill relative flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap border-2 ${
                          sortBy === option.value
                            ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg border-black dark:border-white transform scale-105'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md'
                        }`}
                      >
                        <option.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-bold">{option.shortLabel}</span>
                        
                        {/* Active indicator */}
                        {sortBy === option.value && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Versión tablet y desktop - Scroll horizontal */}
                <div className="hidden sm:block overflow-hidden">
                  <div className="mobile-filters-scroll flex items-center filter-container-mobile gap-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-1.5 shadow-lg overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-1 min-w-max">
                      {[
                        { value: 'featured', label: 'Relevantes', icon: Award, shortLabel: 'Rel' },
                        { value: 'newest', label: 'Nuevos', icon: Sparkles, shortLabel: 'New' },
                        { value: 'price-low', label: 'Menor $', icon: ChevronLeft, shortLabel: '↓$' },
                        { value: 'price-high', label: 'Mayor $', icon: ChevronRight, shortLabel: '↑$' },
                        { value: 'rating', label: 'Top', icon: Star, shortLabel: 'Top' },
                        { value: 'name', label: 'A-Z', icon: SlidersHorizontal, shortLabel: 'A-Z' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`filter-pill filter-button-mobile relative flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-sm sm:text-sm font-medium transition-all duration-300 whitespace-nowrap min-w-0 ${
                            sortBy === option.value
                              ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg transform scale-105'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100/60 dark:hover:bg-gray-700/60'
                          }`}
                        >
                          <option.icon className="w-4 h-4 flex-shrink-0" />
                          {/* Mostrar label apropiado según el breakpoint */}
                          <span className="font-semibold block md:hidden">{option.shortLabel}</span>
                          <span className="font-semibold hidden md:block">{option.label}</span>
                          
                          {/* Active indicator */}
                          {sortBy === option.value && (
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white dark:bg-black rounded-full animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Controles adicionales */}
              <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                {/* Toggle de vista */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 shadow-inner border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-3 rounded-md transition-all duration-300 ${
                      viewMode === "grid" 
                        ? "bg-white dark:bg-gray-900 shadow-sm text-black dark:text-white" 
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-3 rounded-md transition-all duration-300 ${
                      viewMode === "list" 
                        ? "bg-white dark:bg-gray-900 shadow-sm text-black dark:text-white" 
                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* Favoritos */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm sm:text-sm text-gray-600 dark:text-gray-400 font-medium hidden sm:block">Favoritos:</span>
                  <span className="text-sm sm:text-sm text-gray-600 dark:text-gray-400 font-medium block sm:hidden">♥:</span>
                  <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-md text-sm font-bold min-w-[24px] text-center">
                    {wishlist.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resultados en línea separada */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-bold text-black dark:text-white">{sortedProducts.length}</span> productos encontrados
            </p>
            {sortedProducts.length > 0 && (
              <p className="text-xs text-gray-500">
                Página {currentPage} de {totalPages} • {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)}
              </p>
            )}
          </div>
        </div>

        {/* Grid de productos minimalista y responsive */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
          : "space-y-4"
        }>
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className={`product-card group relative rounded-2xl overflow-hidden transition-all duration-300 ${
                viewMode === "list" ? "flex gap-4 p-4" : "p-4"
              }`}
            >
              {/* Badges con colores preciosos y sutiles */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    NUEVO
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3" />
                    TOP
                  </span>
                )}
                {product.isPremium && (
                  <span className="bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm">
                    <Crown className="w-3 h-3" />
                    PRO
                  </span>
                )}
                {product.discount && (
                  <span className="bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* Wishlist Button minimalista */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  wishlist.includes(product.id)
                    ? "bg-red-500 text-white"
                    : "bg-white/80 dark:bg-black/80 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                }`}
              >
                <Heart className="w-4 h-4" fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
              </button>

              {/* Imagen del producto */}
              <div className={`relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 ${
                viewMode === "list" ? "w-32 h-32 flex-shrink-0" : "aspect-square mb-4"
              }`}>
                <OptimizedImage
                  src={product.image}
                  alt={product.name}
                  width={viewMode === "list" ? 128 : 320}
                  height={viewMode === "list" ? 128 : 320}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  quality={85}
                />
                
                {/* Overlay simplificado solo en hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2 text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.inStock ? 'Agregar' : 'Agotado'}
                    </button>
                    <button 
                      onClick={() => setShowQuickView(product)}
                      className="bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stock indicator minimalista */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      Agotado
                    </span>
                  </div>
                )}
              </div>

              {/* Info del producto minimalista */}
              <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="mb-2">
                  <h3 className={`font-semibold text-gray-900 dark:text-white mb-1 leading-tight ${
                    viewMode === "list" ? "text-base" : "text-sm"
                  }`}>
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                </div>

                {/* Tags minimalistas */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Precio y botones */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-black dark:text-white ${
                        viewMode === "list" ? "text-lg" : "text-base"
                      }`}>
                        ${product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          ${product.originalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.category}
                    </p>
                  </div>
                  
                  {viewMode === "list" && (
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
                    >
                      Agregar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación moderna */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 sm:mt-12 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page = i + 1
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    page = currentPage - 2 + i
                  }
                  if (currentPage > totalPages - 2) {
                    page = totalPages - 4 + i
                  }
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      currentPage === page
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-lg transform scale-105"
                        : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* No results */}
        {paginatedProducts.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
              Intenta ajustar tus filtros o términos de búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("Todos")
                setRatingFilter(0)
                setOnlyInStock(false)
              }}
              className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Limpiar Filtros
            </button>
          </div>
        )}

        {/* Quick View Modal */}
        {showQuickView && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-black rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold">Vista Rápida</h3>
                <button
                  onClick={() => setShowQuickView(null)}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden">
                    <OptimizedImage
                      src={showQuickView.image}
                      alt={showQuickView.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                      quality={95}
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      {showQuickView.tags.map((tag, index) => (
                        <span key={index} className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {showQuickView.name}
                    </h2>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{showQuickView.rating}</span>
                        <span className="text-gray-500">({showQuickView.reviews} reseñas)</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        showQuickView.inStock 
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}>
                        {showQuickView.inStock ? "En Stock" : "Agotado"}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {showQuickView.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Características:</h4>
                      <ul className="space-y-2">
                        {showQuickView.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div>
                        <span className="text-3xl font-bold text-black dark:text-white">
                          ${showQuickView.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </span>
                        {showQuickView.originalPrice && (
                          <span className="text-lg text-gray-500 line-through ml-3">
                            ${showQuickView.originalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          addToCart(showQuickView)
                          setShowQuickView(null)
                        }}
                        disabled={!showQuickView.inStock}
                        className="flex-1 bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Agregar al Carrito
                      </button>
                      <button
                        onClick={() => toggleWishlist(showQuickView.id)}
                        className={`px-6 py-4 rounded-xl transition-colors flex items-center justify-center ${
                          wishlist.includes(showQuickView.id)
                            ? "bg-red-500 text-white"
                            : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                        }`}
                      >
                        <Heart className="w-5 h-5" fill={wishlist.includes(showQuickView.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
