'use client'

import { useState, useEffect } from 'react'

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  screenWidth: number
  screenHeight: number
  devicePixelRatio: number
  userAgent: string
  touchSupport: boolean
  connectionType: string
  isOnline: boolean
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1920,
    screenHeight: 1080,
    devicePixelRatio: 1,
    userAgent: '',
    touchSupport: false,
    connectionType: 'unknown',
    isOnline: true
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024

      // Detectar tipo de conexión
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      const connectionType = connection ? connection.effectiveType || 'unknown' : 'unknown'

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        devicePixelRatio: window.devicePixelRatio || 1,
        userAgent: navigator.userAgent,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        connectionType,
        isOnline: navigator.onLine
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('online', updateDeviceInfo)
    window.addEventListener('offline', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('online', updateDeviceInfo)
      window.removeEventListener('offline', updateDeviceInfo)
    }
  }, [])

  return deviceInfo
}

// Hook para optimizaciones basadas en el dispositivo
export function useDeviceOptimizations() {
  const deviceInfo = useDeviceDetection()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Valores por defecto durante SSR para evitar hidratación
  if (!isMounted) {
    return {
      shouldReduceAnimations: false,
      imageQuality: 85, // Valor entero por defecto
      imageSizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      shouldPreload: true, // Por defecto cargar
      lazyLoadingMargin: '100px'
    }
  }

  return {
    // Reducir animaciones en dispositivos móviles de gama baja
    shouldReduceAnimations: deviceInfo.isMobile && deviceInfo.devicePixelRatio < 2,
    
    // Calidad de imagen basada en el dispositivo (siempre enteros)
    imageQuality: Math.round(deviceInfo.isMobile ? 75 : deviceInfo.isTablet ? 85 : 90),
    
    // Tamaños de imagen responsivos
    imageSizes: deviceInfo.isMobile 
      ? '100vw' 
      : deviceInfo.isTablet 
        ? '(max-width: 1024px) 100vw, 50vw'
        : '(max-width: 1200px) 50vw, 33vw',
    
    // Preload basado en conexión
    shouldPreload: deviceInfo.connectionType === '4g' || deviceInfo.connectionType === 'unknown',
    
    // Lazy loading más agresivo en móviles
    lazyLoadingMargin: deviceInfo.isMobile ? '50px' : '100px'
  }
}
