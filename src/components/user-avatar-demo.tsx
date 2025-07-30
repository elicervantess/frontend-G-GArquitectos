"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserAvatar } from "@/components/ui/user-avatar"
import { Avatar } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"

export function UserAvatarDemo() {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Avatar del Usuario Actual</CardTitle>
          <CardDescription>
            Muestra las iniciales del usuario logueado automáticamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-center">
                <UserAvatar size="sm" variant="primary" />
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Pequeño</p>
              </div>
              <div className="text-center">
                <UserAvatar size="md" variant="primary" />
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Mediano</p>
              </div>
              <div className="text-center">
                <UserAvatar size="lg" variant="primary" />
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Grande</p>
              </div>
              <div className="text-center">
                <UserAvatar size="xl" variant="primary" />
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Extra Grande</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-300">
                No hay usuario logueado. Inicia sesión para ver tu avatar con iniciales.
              </p>
            </div>
          )}
          
          {user && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Usuario actual:</strong> {user.name}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Iniciales generadas:</strong> {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Avatares con Iniciales</CardTitle>
          <CardDescription>
            Diferentes nombres y cómo se generan las iniciales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Avatar name="Juan Pérez" variant="primary" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Juan Pérez → JP</p>
            </div>
            <div className="text-center">
              <Avatar name="Raquel Sotomayor" variant="success" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Raquel Sotomayor → RS</p>
            </div>
            <div className="text-center">
              <Avatar name="María González" variant="warning" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">María González → MG</p>
            </div>
            <div className="text-center">
              <Avatar name="Carlos Rodríguez" variant="danger" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Carlos Rodríguez → CR</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Avatar name="Ana López" variant="glass" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Ana López → AL</p>
            </div>
            <div className="text-center">
              <Avatar name="Pedro Silva" variant="default" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Pedro Silva → PS</p>
            </div>
            <div className="text-center">
              <Avatar name="Laura Torres" variant="primary" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Laura Torres → LT</p>
            </div>
            <div className="text-center">
              <Avatar name="Diego Morales" variant="success" />
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Diego Morales → DM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 