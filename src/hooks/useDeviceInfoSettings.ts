'use client'

import { useState, useEffect } from 'react'

export function useDeviceInfoSettings() {
  const [showDeviceInfo, setShowDeviceInfo] = useState(false)

  // Cargar configuración guardada
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('show-device-info')
      setShowDeviceInfo(saved === 'true')
    }
  }, [])

  // Función para toggle con persistencia y eventos en tiempo real
  const toggleDeviceInfo = () => {
    const newValue = !showDeviceInfo
    setShowDeviceInfo(newValue)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('show-device-info', newValue.toString())
      
      // Disparar evento personalizado para notificar cambios en tiempo real
      window.dispatchEvent(new CustomEvent('deviceInfoToggle', {
        detail: { showDeviceInfo: newValue }
      }))
    }
  }

  // Escuchar cambios desde otros componentes en tiempo real
  useEffect(() => {
    const handleDeviceInfoChange = (event: CustomEvent) => {
      setShowDeviceInfo(event.detail.showDeviceInfo)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('deviceInfoToggle', handleDeviceInfoChange as EventListener)
      
      return () => {
        window.removeEventListener('deviceInfoToggle', handleDeviceInfoChange as EventListener)
      }
    }
  }, [])

  return {
    showDeviceInfo,
    toggleDeviceInfo,
    setShowDeviceInfo
  }
}
