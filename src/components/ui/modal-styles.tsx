import { useTheme } from "@/contexts/ThemeContext"

// Función para obtener estilos consistentes del modal
export function getModalStyles(actualTheme: 'light' | 'dark') {
  return {
    // Overlay del modal
    overlay: `fixed inset-0 z-50 backdrop-blur-sm ${
      actualTheme === 'dark' 
        ? 'bg-black/60' 
        : 'bg-black/40'
    }`,
    
    // Contenedor principal del modal
    container: `relative mx-auto mt-8 max-w-2xl rounded-2xl shadow-2xl border backdrop-blur-xl ${
      actualTheme === 'dark'
        ? 'bg-black/80 border-white/20'
        : 'bg-white/95 border-gray-200'
    }`,
    
    // Header del modal
    header: `flex items-center justify-between p-6 border-b ${
      actualTheme === 'dark'
        ? 'border-white/10'
        : 'border-gray-200'
    }`,
    
    // Título del modal
    title: `text-xl font-bold ${
      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
    }`,
    
    // Botón de cerrar
    closeButton: `p-2 rounded-xl transition-all duration-200 ${
      actualTheme === 'dark'
        ? 'hover:bg-white/10 text-white/70 hover:text-white'
        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
    }`,
    
    // Contenido del modal
    content: `p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin ${
      actualTheme === 'dark'
        ? 'scrollbar-track-gray-800 scrollbar-thumb-gray-600'
        : 'scrollbar-track-gray-100 scrollbar-thumb-gray-400'
    }`,
    
    // Campo editable
    field: `group relative rounded-2xl p-5 border transition-all duration-300 backdrop-blur-sm ${
      actualTheme === 'dark'
        ? 'bg-white/5 border-white/10 hover:border-white/20'
        : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'
    }`,
    
    // Icono del campo
    fieldIcon: `p-2.5 rounded-xl shadow-sm ${
      actualTheme === 'dark'
        ? 'bg-white/10 text-white/70'
        : 'bg-gray-100 text-gray-600'
    }`,
    
    // Label del campo
    fieldLabel: `text-xs font-semibold uppercase tracking-wider font-sans mb-1 ${
      actualTheme === 'dark' ? 'text-white/60' : 'text-gray-500'
    }`,
    
    // Valor del campo
    fieldValue: `text-sm font-medium ${
      actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
    }`,
    
    // Input de edición
    input: `h-9 text-sm border rounded-lg font-sans transition-all duration-200 ${
      actualTheme === 'dark'
        ? 'bg-black/60 border-white/20 focus:border-white/40 text-white placeholder-white/50'
        : 'bg-white border-gray-200 focus:border-gray-400 text-gray-900 placeholder-gray-500'
    }`,
    
    // Botón primario
    primaryButton: `px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
      actualTheme === 'dark'
        ? 'bg-white text-black hover:bg-gray-200'
        : 'bg-gray-900 text-white hover:bg-gray-700'
    }`,
    
    // Botón secundario
    secondaryButton: `px-4 py-2 rounded-xl font-medium text-sm border transition-all duration-200 ${
      actualTheme === 'dark'
        ? 'border-white/20 text-white hover:bg-white/10'
        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
    }`,
    
    // Botón de peligro
    dangerButton: `px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
      actualTheme === 'dark'
        ? 'bg-white/20 text-white hover:bg-white/30'
        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
    }`,
    
    // Avatar container
    avatarContainer: `relative group cursor-pointer ${
      actualTheme === 'dark'
        ? 'hover:ring-4 hover:ring-white/20'
        : 'hover:ring-4 hover:ring-gray-200'
    }`,
    
    // Alert/notification
    alert: `p-4 rounded-xl border ${
      actualTheme === 'dark'
        ? 'bg-white/5 border-white/10 text-white'
        : 'bg-gray-50 border-gray-200 text-gray-900'
    }`
  }
}

// Hook para usar los estilos del modal
export function useModalStyles() {
  const { actualTheme } = useTheme()
  return getModalStyles(actualTheme)
}
