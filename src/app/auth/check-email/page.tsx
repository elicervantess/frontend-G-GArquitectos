"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Clock, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/contexts/ThemeContext"
import { Navbar } from "@/components/navbar"

function CheckEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const { theme, actualTheme } = useTheme()

  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutos en segundos

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleBackToLogin = () => {
    router.push("/")
  }

  const handleResendEmail = () => {
    // Aquí podrías implementar la lógica para reenviar el email
    // Por ahora, simplemente reiniciamos el timer
    setTimeLeft(30 * 60)
  }

  return (
    <>
      <Navbar />
      <div className={`min-h-screen pt-20 flex items-center justify-center p-4 ${
        actualTheme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md mx-auto"
      >
        <Card className={`relative overflow-hidden border shadow-2xl ${
          actualTheme === 'dark'
            ? 'border-gray-800 bg-gray-900'
            : 'border-gray-200 bg-white'
        }`}>
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mx-auto shadow-xl"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <CardTitle className={`text-2xl font-bold mb-2 ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                ¡Email enviado!
              </CardTitle>
              <p className={`text-sm ${
                actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Revisa tu bandeja de entrada
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center space-y-4"
            >
              <div className="space-y-3">
                <p className={`text-sm leading-relaxed ${
                  actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Hemos enviado un enlace de recuperación a:
                </p>
                <div className={`border rounded-lg p-3 ${
                  actualTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <p className={`font-medium break-all ${
                    actualTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {email || 'tu@email.com'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className={`border rounded-lg p-4 ${
                  actualTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-100 border-gray-200'
                }`}>
                  <div className={`flex items-center justify-center gap-2 text-sm mb-2 ${
                    actualTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">El enlace expira en:</span>
                  </div>
                  <div className={`text-2xl font-bold font-mono ${
                    actualTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>

                <div className={`border rounded-lg p-4 text-left ${
                  actualTheme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      actualTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <Sparkles className={`w-3 h-3 ${
                        actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className={`text-xs leading-relaxed ${
                      actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <p className={`font-medium mb-2 ${
                        actualTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                      }`}>¿No ves el email?</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Revisa tu carpeta de spam o correo no deseado</li>
                        <li>Asegúrate de que la dirección de email sea correcta</li>
                        <li>El email puede tardar unos minutos en llegar</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleBackToLogin}
                  className={`w-full font-medium h-12 rounded-xl shadow-lg transition-all duration-300 ${
                    actualTheme === 'dark'
                      ? 'bg-white hover:bg-gray-100 text-black'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al login
                  </div>
                </Button>

                {timeLeft > 0 ? (
                  <p className={`text-xs text-center ${
                    actualTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ¿No recibiste el email? Espera {Math.ceil(timeLeft / 60)} minutos antes de solicitar otro
                  </p>
                ) : (
                  <Button
                    onClick={handleResendEmail}
                    variant="outline"
                    className={`w-full transition-all duration-200 ${
                      actualTheme === 'dark'
                        ? 'bg-white text-black border-white hover:bg-gray-100'
                        : 'bg-black text-white border-black hover:bg-gray-800'
                    }`}
                  >
                    Solicitar nuevo enlace
                  </Button>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      </div>
    </>
  )
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  )
}
