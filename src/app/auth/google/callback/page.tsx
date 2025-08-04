"use client"

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function GoogleAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = () => {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      
      const accessToken = params.get('access_token')
      const error = params.get('error')
      const state = params.get('state')

      if (error) {
        // Error en la autenticación
        window.opener?.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: error
        }, window.location.origin)
        window.close()
        return
      }

      if (!accessToken) {
        // No se recibió el token
        window.opener?.postMessage({
          type: 'GOOGLE_AUTH_ERROR',
          error: 'No se recibió el token de acceso'
        }, window.location.origin)
        window.close()
        return
      }

      const idToken = params.get('id_token')
      if (!idToken) {
        // Error: no se recibió el id_token
      }
      window.opener?.postMessage({
        type: 'GOOGLE_AUTH_SUCCESS',
        idToken, // <-- Cambia esto
        state: state
      }, window.location.origin)
      
      window.close()
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  )
}

export default function GoogleAuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <GoogleAuthCallbackContent />
    </Suspense>
  )
} 