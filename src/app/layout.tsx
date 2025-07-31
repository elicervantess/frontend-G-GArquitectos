import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GYG Arquitectos - Diseño y Construcción",
  description: "Estudio de arquitectura especializado en diseño moderno y construcción sostenible",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Navbar />
          <div className="pt-16 lg:pt-20">
            {children}
          </div>
          {/* Contenedor para Google Auth */}
          <div id="google-auth-container"></div>
        </AuthProvider>
      </body>
    </html>
  )
}