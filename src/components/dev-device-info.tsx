'use client'

import { useDeviceDetection } from '@/hooks/useDeviceDetection'
import { useDeviceInfoSettings } from '@/hooks/useDeviceInfoSettings'
import { motion, AnimatePresence } from 'framer-motion'

// Componente de información del dispositivo (solo en desarrollo)
export function DeviceDebugInfo() {
  const deviceInfo = useDeviceDetection()
  const { showDeviceInfo } = useDeviceInfoSettings()

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <AnimatePresence>
      {showDeviceInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="fixed bottom-4 left-4 bg-black/90 backdrop-blur-sm text-white p-4 rounded-xl text-xs font-mono z-50 max-w-xs border border-white/20 shadow-2xl"
        >
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="text-white/80 font-semibold mb-2 text-center border-b border-white/20 pb-1">
              📱 Device Info
            </div>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex justify-between">
                <span className="text-white/60">Device:</span>
                <span className="text-white">{deviceInfo.isMobile ? 'Mobile' : deviceInfo.isTablet ? 'Tablet' : 'Desktop'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Screen:</span>
                <span className="text-white">{deviceInfo.screenWidth}×{deviceInfo.screenHeight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Connection:</span>
                <span className="text-white">{deviceInfo.connectionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Status:</span>
                <span className={deviceInfo.isOnline ? 'text-green-400' : 'text-red-400'}>
                  {deviceInfo.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Touch:</span>
                <span className="text-white">{deviceInfo.touchSupport ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">DPR:</span>
                <span className="text-white">{deviceInfo.devicePixelRatio}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
