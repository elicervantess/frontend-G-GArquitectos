# Sistema de Logout Automático

## Características Implementadas

### 🔄 **Logout Manual con Backend**
- **Ubicación**: Navbar y AuthModal
- **Función**: `logoutWithBackend()`
- **Comportamiento**: 
  - Llama al endpoint `/auth/logout` del backend
  - Invalida el token en el servidor
  - Limpia el estado local (token, usuario)
  - Fallback al logout local si falla el backend

### 🚪 **Logout Automático al Cerrar Página**
- **Ubicación**: Componente `AutoLogoutHandler` en el layout global
- **Eventos**: `beforeunload`, `pagehide`, `unload`, `visibilitychange`
- **Tecnología**: `navigator.sendBeacon()`
- **Comportamiento**:
  - Se ejecuta cuando el usuario cierra la pestaña/ventana
  - Envía petición de logout al backend antes de cerrar
  - Usa `sendBeacon` para mayor confiabilidad
  - **GLOBAL**: Funciona en toda la aplicación

### 🎯 **Eventos Manejados**

#### 1. `beforeunload`
- Se dispara cuando el usuario intenta cerrar la pestaña
- Envía logout al backend usando `sendBeacon`
- No bloquea el cierre de la página
- **Prioridad alta** con `capture: true`

#### 2. `pagehide`
- Se dispara cuando la página se oculta
- Útil para casos donde `beforeunload` no se ejecuta
- Backup para logout automático
- **Prioridad alta** con `capture: true`

#### 3. `unload`
- Se dispara cuando la página se descarga completamente
- Último recurso para logout automático
- **Prioridad alta** con `capture: true`

#### 4. `visibilitychange`
- Se dispara cuando la pestaña pierde el foco
- Solo registra el evento, no hace logout automático
- Para monitoreo y debugging

## Implementación Técnica

### Componente `AutoLogoutHandler`
```typescript
export function AutoLogoutHandler() {
  // Hook para manejar logout automático cuando se cierra la página
  useAutoLogout()
  
  // Este componente no renderiza nada, solo maneja el auto logout
  return null
}
```

### Hook `useAutoLogout` Mejorado
```typescript
export const useAutoLogout = () => {
  const { token, logoutWithBackend } = useAuth()
  const isLoggingOut = useRef(false)

  useEffect(() => {
    if (!token) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (token && !isLoggingOut.current) {
        isLoggingOut.current = true
        console.log('🔄 Auto logout: beforeunload event triggered')
        
        const logoutData = new FormData()
        logoutData.append('token', token)
        
        const success = navigator.sendBeacon('http://localhost:8080/auth/logout', logoutData)
        console.log('📡 Auto logout: sendBeacon result:', success)
      }
    }

    // Agregar event listeners con diferentes prioridades
    window.addEventListener('beforeunload', handleBeforeUnload, { capture: true })
    window.addEventListener('pagehide', handlePageHide, { capture: true })
    window.addEventListener('unload', handleUnload, { capture: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      // Cleanup event listeners
    }
  }, [token, logoutWithBackend])

  return { isLoggingOut: isLoggingOut.current }
}
```

### Layout Global
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <AutoLogoutHandler /> {/* Global auto logout */}
          <Navbar />
          <div className="pt-16 lg:pt-20">
            {children}
          </div>
          <AutoLogoutDebug /> {/* Debug component */}
        </AuthProvider>
      </body>
    </html>
  )
}
```

## Beneficios del Sistema

### 🔒 **Seguridad Mejorada**
- Tokens inválidos en el servidor al cerrar sesión
- Limpieza automática del estado local
- Prevención de sesiones huérfanas
- **Cobertura global** en toda la aplicación

### 🎯 **Experiencia de Usuario**
- Logout automático al cerrar la página
- No requiere acción manual del usuario
- Comportamiento esperado y moderno
- **Funciona en todas las páginas**

### 🛡️ **Robustez**
- Fallback al logout local si falla el backend
- Múltiples eventos para mayor cobertura
- Manejo de errores apropiado
- **Event listeners con prioridad alta**

### 📱 **Compatibilidad**
- Funciona en todos los navegadores modernos
- `sendBeacon` para mayor confiabilidad
- Event listeners apropiados para cada caso
- **Debug visual** para verificar funcionamiento

## Configuración del Backend

### Endpoint de Logout
```java
@PostMapping("/logout")
public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
    authenticationService.logout(request, response);
    return ResponseEntity.ok("Logged out successfully");
}
```

### Servicio de Logout
```java
public void logout(HttpServletRequest request, HttpServletResponse response) {
    String token = jwtService.resolveToken(request);
    if (token != null) {
        jwtService.invalidateToken(token);
    }
}
```

## Casos de Uso

### 1. **Usuario cierra la pestaña**
- Se ejecuta `beforeunload` → `pagehide` → `unload`
- Envía logout al backend
- Token inválido en el servidor

### 2. **Usuario presiona botón de logout**
- Se ejecuta `logoutWithBackend()`
- Logout manual con confirmación
- Limpieza inmediata del estado

### 3. **Usuario cambia de pestaña**
- Se ejecuta `visibilitychange`
- Solo monitoreo, no logout
- Token sigue válido

### 4. **Navegador se cierra abruptamente**
- Se ejecuta `pagehide` → `unload`
- Backup para logout automático
- Mayor cobertura de casos edge

## Debug y Monitoreo

### Componente `AutoLogoutDebug`
- Muestra estado del token en tiempo real
- Indica si la autenticación está activa
- Registra última actividad del usuario
- **Solo visible cuando hay sesión activa**

### Logs de Consola
- `🔄 Auto logout: beforeunload event triggered`
- `📡 Auto logout: sendBeacon result: true/false`
- `🎯 Auto logout: Event listeners registered`
- `🧹 Auto logout: Event listeners cleaned up`

## Notas de Desarrollo

- El sistema es **no bloqueante**
- Usa `sendBeacon` para peticiones confiables
- Maneja múltiples escenarios de cierre
- Mantiene compatibilidad con navegadores antiguos
- **Event listeners con `capture: true`** para mayor prioridad
- **Debug visual** para verificar funcionamiento
- **Cobertura global** en toda la aplicación 