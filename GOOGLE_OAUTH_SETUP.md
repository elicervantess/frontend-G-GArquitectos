# Configuración de Google OAuth 2.0

## Configuración Actual

### Credenciales de Google OAuth
- **Client ID**: `1069628442603-dbe1irihlashj4o4dkmhi5f1b5pi1204.apps.googleusercontent.com`
- **Client Secret**: `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`
- **Redirect URI**: `http://localhost:3000/auth/google/callback`

### Configuración en Google Cloud Console

1. **Orígenes autorizados de JavaScript**:
   - `http://localhost:3000`

2. **URIs de redireccionamiento autorizados**:
   - `http://localhost:3000/auth/google/callback`

## Arquitectura Implementada

### Estructura de Carpetas
```
src/
├── config/
│   └── google-oauth.ts          # Configuración de Google OAuth
├── types/
│   └── google-oauth.ts          # Tipos TypeScript para Google OAuth
├── hooks/
│   └── useGoogleAuth.ts         # Hook personalizado para Google OAuth
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticación (actualizado)
├── components/
│   └── auth/
│       └── auth-modal.tsx       # Modal de autenticación (actualizado)
└── app/
    └── auth/
        └── google/
            └── callback/
                └── page.tsx     # Página de callback
```

### Flujo de Autenticación

1. **Usuario hace clic en "Iniciar sesión con Google" o "Registrarse con Google"**
2. **Se abre una ventana popup** con la URL de autorización de Google
3. **Usuario autoriza la aplicación** en Google
4. **Google redirige al callback** con el token de acceso
5. **El callback procesa la respuesta** y envía el token al padre
6. **Se valida el token** con el backend
7. **Se obtiene la información del usuario** de Google
8. **Se completa la autenticación** en el frontend

### Funciones Principales

#### `useGoogleAuth` Hook
- `initiateGoogleAuth(mode)`: Inicia el flujo de autenticación
- `getGoogleUserInfo(token)`: Obtiene información del usuario de Google
- `validateGoogleToken(token)`: Valida el token con el backend

#### AuthContext
- `loginWithGoogle(user)`: Maneja el login con Google
- `registerWithGoogle(user)`: Maneja el registro con Google

## Uso

### En el Modal de Autenticación
Los botones de Google se muestran automáticamente en el modal de autenticación:

```tsx
// Botón de Google (automático)
<Button onClick={() => handleSocialAuth("google")}>
  {mode === "login" ? "Iniciar sesión con Google" : "Registrarse con Google"}
</Button>
```

### Eventos Personalizados
El sistema utiliza eventos personalizados para la comunicación:

- `googleAuthSuccess`: Se dispara cuando la autenticación es exitosa
- `googleAuthError`: Se dispara cuando hay un error

## Configuración del Backend

El backend debe tener un endpoint para validar tokens de Google:

```java
@PostMapping("/google")
public ResponseEntity<GoogleAuthResponseDto> validateGoogleAuthToken(
    @RequestBody GoogleAuthRequestDto googleAuthRequestDto
) {
    return ResponseEntity.ok(googleAuthService.validate(googleAuthRequestDto));
}
```

## Seguridad

- Los tokens se validan con el backend antes de procesar
- Se utiliza HTTPS en producción
- Los secretos del cliente se mantienen seguros
- Se implementa validación de estado para prevenir ataques CSRF

## Notas de Desarrollo

- El sistema está configurado para desarrollo local (`localhost:3000`)
- Para producción, actualizar las URIs en Google Cloud Console
- Los tokens se almacenan temporalmente en localStorage
- Se implementa manejo de errores robusto

## Próximos Pasos

1. **Integración completa con backend**: Implementar endpoints específicos para login/registro con Google
2. **Persistencia de sesión**: Mejorar el manejo de tokens y refresh tokens
3. **Validación adicional**: Agregar más validaciones de seguridad
4. **Testing**: Implementar tests unitarios y de integración 