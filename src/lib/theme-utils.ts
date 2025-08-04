// Utilidades para temas - Sistema monocromático unificado
export type ActualTheme = 'light' | 'dark'

export const getThemeClasses = (actualTheme: ActualTheme) => {
  const isDark = actualTheme === 'dark'
  
  return {
    // Backgrounds
    pageBackground: isDark 
      ? 'bg-gradient-to-br from-gray-900 via-black to-gray-800'
      : 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    
    cardBackground: isDark ? 'bg-gray-900' : 'bg-white',
    cardBorder: isDark ? 'border-gray-800' : 'border-gray-200',
    
    // Text colors
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    textTertiary: isDark ? 'text-gray-500' : 'text-gray-500',
    
    // Form elements  
    inputBackground: isDark ? 'bg-gray-800' : 'bg-white',
    inputBorder: isDark ? 'border-gray-700' : 'border-gray-200',
    inputText: isDark ? 'text-white' : 'text-gray-900',
    inputPlaceholder: isDark ? 'placeholder:text-gray-400' : 'placeholder:text-gray-500',
    inputFocusBorder: isDark ? 'focus:border-gray-500' : 'focus:border-gray-400',
    
    labelText: isDark ? 'text-gray-300' : 'text-gray-700',
    
    // Buttons (monochromatic system)
    buttonPrimary: isDark 
      ? 'bg-white hover:bg-gray-100 text-black'
      : 'bg-gray-900 hover:bg-gray-800 text-white',
    
    buttonSecondary: isDark
      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200',
    
    // Interactive elements
    hoverText: isDark ? 'hover:text-gray-200' : 'hover:text-gray-600',
    iconColor: isDark ? 'text-gray-400' : 'text-gray-400',
    
    // Status colors (maintaining same scheme)
    errorBackground: isDark ? 'bg-red-900/20' : 'bg-red-50',
    errorBorder: isDark ? 'border-red-800' : 'border-red-200', 
    errorText: isDark ? 'text-red-400' : 'text-red-600',
    errorIcon: isDark ? 'text-red-400' : 'text-red-600',
    
    warningBackground: isDark ? 'bg-orange-900/20' : 'bg-orange-100',
    warningText: isDark ? 'text-orange-400' : 'text-orange-600',
    warningIcon: isDark ? 'text-orange-400' : 'text-orange-600',
    
    // Progress/strength indicators
    progressBackground: isDark ? 'bg-gray-700' : 'bg-gray-200',
    
    // Info boxes
    infoBackground: isDark ? 'bg-gray-800' : 'bg-gray-50',
    infoBorder: isDark ? 'border-gray-700' : 'border-gray-200',
    infoText: isDark ? 'text-gray-400' : 'text-gray-600',
    
    // Disabled states  
    disabledBackground: isDark ? 'disabled:bg-gray-600' : 'disabled:bg-gray-300',
    disabledText: isDark ? 'disabled:text-gray-400' : 'disabled:text-gray-500',
  }
}
