import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { UserDeletedNotification } from "@/components/user-deleted-notification"
import { AutoLogoutNotification } from "@/components/auto-logout-notification"
import { DeviceDebugInfo } from "@/components/dev-device-info"

export const metadata: Metadata = {
  title: {
    default: "G&G Arquitectos - Diseño y Construcción",
    template: "%s | G&G Arquitectos"
  },
  description: "Estudio de arquitectura especializado en diseño moderno y construcción sostenible. Más de 15 años creando espacios únicos que inspiran y perduran.",
  keywords: [
    "arquitectura",
    "diseño arquitectónico", 
    "construcción",
    "arquitectos",
    "diseño residencial",
    "proyectos comerciales",
    "sostenibilidad",
    "LEED",
    "remodelaciones",
    "diseño de interiores"
  ],
  authors: [{ name: "G&G Arquitectos" }],
  creator: "G&G Arquitectos",
  publisher: "G&G Arquitectos",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gygarquitectos.com"),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/",
      "es": "/",
    },
  },
  openGraph: {
    title: "G&G Arquitectos - Diseño Arquitectónico Premium",
    description: "Estudio de arquitectura especializado en proyectos residenciales y comerciales. Creamos espacios únicos que inspiran.",
    url: "https://gygarquitectos.com",
    siteName: "G&G Arquitectos",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "G&G Arquitectos - Diseño y Construcción",
      },
      {
        url: "/og-image-square.jpg", 
        width: 1200,
        height: 1200,
        alt: "G&G Arquitectos - Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "G&G Arquitectos - Diseño Arquitectónico Premium",
    description: "Estudio de arquitectura especializado en proyectos residenciales y comerciales",
    creator: "@gygarquitectos",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
  manifest: "/manifest.json",
  verification: {
    google: "your-google-verification-code", // TODO: Agregar código real
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  category: "architecture",
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f23' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <UserDeletedNotification />
            <AutoLogoutNotification />
            <Navbar />
            {children}
            {/* Contenedor para Google Auth */}
            <div id="google-auth-container"></div>
            {/* Debug info solo en desarrollo */}
            <DeviceDebugInfo />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}