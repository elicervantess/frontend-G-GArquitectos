"use client"

import { useTheme } from "@/contexts/ThemeContext"

interface ArchitectureOrganizationProps {
  name?: string
  description?: string
  url?: string
  logo?: string
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
    email: string
  }
  foundingDate?: string
  founders?: string[]
  numberOfEmployees?: string
  areaServed?: string[]
  services?: string[]
}

export function ArchitectureOrganizationSchema({
  name = "G&G Arquitectos",
  description = "Estudio de arquitectura especializado en diseño moderno y construcción sostenible",
  url = "https://gygarquitectos.com",
  logo = "/logo.png",
  address = {
    streetAddress: "Calle Principal 123",
    addressLocality: "Ciudad",
    addressRegion: "Estado",
    postalCode: "12345",
    addressCountry: "MX"
  },
  contactPoint = {
    telephone: "+52-555-123-4567",
    contactType: "customer service",
    email: "contacto@gygarquitectos.com"
  },
  foundingDate = "2010-01-01",
  founders = ["Arquitecto 1", "Arquitecto 2"],
  numberOfEmployees = "10-50",
  areaServed = ["México", "Ciudad de México", "Estado de México"],
  services = [
    "Diseño Arquitectónico",
    "Planificación Urbana",
    "Construcción Sostenible",
    "Remodelación",
    "Consultoría en Construcción"
  ]
}: ArchitectureOrganizationProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    "name": name,
    "alternateName": "GYG Arquitectos",
    "description": description,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": `${url}${logo}`
    },
    "address": {
      "@type": "PostalAddress",
      ...address
    },
    "contactPoint": {
      "@type": "ContactPoint",
      ...contactPoint
    },
    "foundingDate": foundingDate,
    "founders": founders.map(founder => ({
      "@type": "Person",
      "name": founder
    })),
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": numberOfEmployees
    },
    "areaServed": areaServed.map(area => ({
      "@type": "Place",
      "name": area
    })),
    "makesOffer": services.map(service => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service,
        "serviceType": "Architectural Services"
      }
    })),
    "industry": "Architecture and Construction",
    "knowsAbout": [
      "Architectural Design",
      "Sustainable Construction",
      "Urban Planning",
      "Building Information Modeling",
      "Green Building Certification"
    ],
    "sameAs": [
      "https://www.linkedin.com/company/gyg-arquitectos",
      "https://www.instagram.com/gygarquitectos",
      "https://www.facebook.com/gygarquitectos"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}

interface WebsiteSchemaProps {
  name?: string
  description?: string
  url?: string
  inLanguage?: string
  publisher?: string
  potentialAction?: {
    target: string
    queryInput: string
  }
}

export function WebsiteSchema({
  name = "G&G Arquitectos - Estudio de Arquitectura",
  description = "Estudio de arquitectura especializado en diseño moderno, construcción sostenible y planificación urbana",
  url = "https://gygarquitectos.com",
  inLanguage = "es-MX",
  publisher = "G&G Arquitectos",
  potentialAction = {
    target: `${url}/buscar?q={search_term_string}`,
    queryInput: "required name=search_term_string"
  }
}: WebsiteSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    "name": name,
    "description": description,
    "url": url,
    "inLanguage": inLanguage,
    "publisher": {
      "@type": "Organization",
      "@id": `${url}#organization`,
      "name": publisher
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": potentialAction.target,
      "query-input": potentialAction.queryInput
    },
    "mainEntity": {
      "@type": "Organization",
      "@id": `${url}#organization`
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}

// Esquema para breadcrumbs
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  )
}
