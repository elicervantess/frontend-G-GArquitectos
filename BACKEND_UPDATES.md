# Actualizaciones del Backend para Google Auth

## Cambios Necesarios en el Backend

### 1. Actualizar GoogleAuthService

El servicio debe ser actualizado para manejar mejor los casos de usuario existente vs nuevo:

```java
@Service
public class GoogleAuthService {

    @Autowired
    private UserRepository userRepository;

    public GoogleAuthResponseDto validate(GoogleAuthRequestDto googleAuthRequestDto) {
        System.out.println("Token recibido: " + googleAuthRequestDto.getToken());

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(
                        "1069628442603-dbe1irihlashj4o4dkmhi5f1b5pi1204.apps.googleusercontent.com"
                ))
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(googleAuthRequestDto.getToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                // Extraer información del usuario
                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String picture = (String) payload.get("picture");

                // Verificar si el usuario ya existe
                User user = userRepository.findByEmail(email).orElse(null);
                boolean isNewUser = false;
                String message;

                if (user == null) {
                    // Usuario nuevo - crear cuenta
                    user = new User();
                    user.setEmail(email);
                    user.setFullName(name);
                    user.setProfileImageUrl(picture != null ? picture : user.getProfileImageUrl());
                    user.setRole(Role.USER);
                    user.setCreatedAt(LocalDateTime.now());
                    user.setPassword("google_oauth_default");
                    userRepository.save(user);
                    
                    isNewUser = true;
                    message = "Usuario registrado exitosamente";
                } else {
                    // Usuario existente - actualizar información
                    user.setProfileImageUrl(picture != null ? picture : user.getProfileImageUrl());
                    userRepository.save(user);
                    
                    isNewUser = false;
                    message = "Inicio de sesión exitoso";
                }

                return new GoogleAuthResponseDto(true, message);
            } else {
                return new GoogleAuthResponseDto(false, "Token inválido");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new GoogleAuthResponseDto(false, "Error en la validación del token");
        }
    }
}
```

### 2. Actualizar GoogleAuthResponseDto

El DTO debe usar `valid` en lugar de `isValid` para mantener compatibilidad:

```java
@AllArgsConstructor
@Getter
@Setter
public class GoogleAuthResponseDto {
    private boolean valid; // Cambiado de isValid a valid
    private String message;
}
```

## Comportamiento Esperado

### Caso 1: Usuario Nuevo (Registro)
- **Backend**: Crea nueva cuenta y retorna `{"valid": true, "message": "Usuario registrado exitosamente"}`
- **Frontend**: Muestra mensaje de registro exitoso y redirige

### Caso 2: Usuario Existente (Login)
- **Backend**: Actualiza información y retorna `{"valid": true, "message": "Inicio de sesión exitoso"}`
- **Frontend**: Muestra mensaje de login exitoso y redirige

### Caso 3: Usuario Existente intentando Registrarse
- **Backend**: Actualiza información y retorna `{"valid": true, "message": "Inicio de sesión exitoso"}`
- **Frontend**: Muestra "Cuenta de Google con este correo ya fue registrada. Iniciando sesión..." y redirige

### Caso 4: Usuario Nuevo intentando hacer Login
- **Backend**: Crea nueva cuenta y retorna `{"valid": true, "message": "Usuario registrado exitosamente"}`
- **Frontend**: Muestra "Usuario no encontrado. Registrando nueva cuenta..." y redirige

## Beneficios de estos Cambios

1. **Experiencia de Usuario Mejorada**: No hay confusión sobre si se registró o inició sesión
2. **Manejo Automático**: El sistema maneja automáticamente los casos edge
3. **Mensajes Claros**: El usuario siempre sabe qué está pasando
4. **Flexibilidad**: Funciona tanto en modo login como register
5. **Compatibilidad**: Mantiene la estructura de respuesta actual del backend

## Notas de Implementación

- El frontend detecta si es usuario nuevo basándose en el mensaje del backend
- Los mensajes son consistentes y claros para el usuario
- Se mantiene la compatibilidad con el código existente
- El sistema es robusto y maneja errores apropiadamente
- La respuesta del backend usa `valid` en lugar de `isValid` para mantener compatibilidad 