# Análisis Técnico: Seguridad y autorización

> Documento prospectivo (**problemas detectados, sin corregir**). Elaborado el 2026-11-06 a partir de la
> revisión del código, durante el trabajo de `11_skeletons_ui_asincrona_spect.md`. No se intentó explotar
> ningún problema. Sirve como especificación para tratarlos más adelante; al implementarlo, seguir el flujo de
> `CLAUDE.md` y cerrar con `security-auditor` sobre el diff.

## Problema

Casi ningún Server Action comprueba quién lo llama. De 134 archivos `*.action.ts`, solo `userWorkspaceAction`
consulta la sesión, y lo hace para saber qué usuario cargar, no para autorizar. Además, 52 actions leen cookies
que escribe el propio navegador para decidir sobre qué establecimiento o sucursal operan.

Mover `proxy.ts` no resuelve esto por sí solo. La documentación de Next incluida en el proyecto
(`node_modules/next/dist/docs/01-app/02-guides/data-security.md` y `.../03-file-conventions/proxy.md`) indica que
un Server Action es alcanzable con un POST directo y que la autorización debe verificarse dentro de cada uno.

La combinación más grave es la de los problemas 1 y 4: el servidor no sabe quién llama y además confía en lo que
dice la cookie. Los ids son números pequeños y fáciles de adivinar.

## Problemas detectados

| # | Severidad | Problema | Impacto |
|---|---|---|---|
| 1 | **Crítica** | Los Server Actions no verifican la sesión | Ejecutar operaciones sin login |
| 2 | **Crítica** | `updateUserAction` no valida quién llama | Cambiar la contraseña de otro usuario |
| 3 | **Crítica** | `passwordHash` llega al navegador | Obtener los hashes de los usuarios del establecimiento |
| 4 | **Crítica** | El contexto sale de cookies escritas por el cliente | Acceder a datos de otra sucursal o establecimiento |
| 5 | **Alta** | El onboarding nunca se cierra | Crear un `establishment_manager` sin login |
| 6 | **Alta** | `proxy.ts` no está activo | Las páginas se procesan sin sesión |
| 7 | **Alta** | Los roles solo se comprueban en el navegador | Los datos no quedan protegidos por rol |
| 8 | **Media** | `signQzMessageAction` firma cualquier mensaje | Usar la clave privada de QZ sin autorización |
| 9 | **Media** | `validateAuthAction` es público y no hay límite de intentos | Probar contraseñas sin freno |
| 10 | **Media** | Un usuario desactivado conserva su sesión | Acceso y roles desactualizados mientras dure el JWT |
| 11 | **Media** | Los inputs no se validan | Datos sin validar llegan a los casos de uso |

## Detalle y evidencia

### 1. Server Actions sin autorización

- `requireSession` no existe en `src/`, aunque `AGENTS.md` lo describe en
  `src/shared/infrastructure/auth/require-session.ts`.
- Ejemplos: `addRoleToUserAction`, `registerUserAction`, `registerCreditPaymentAction` y `deleteProductAction`.
- El caso de uso tampoco recibe la identidad de quien llama, así que no puede autorizar.

### 2. Cambio de contraseña de terceros

`updateUserAction(userId, dto)` recibe el id y los datos directamente del cliente. `UpdateUserUseCase` actualiza
correo, usuario, contraseña y estado sin comprobar quién hace la petición. El único contexto es el
`establishmentId` de la cookie, que el cliente controla (problema 4).

### 3. Exposición de `passwordHash`

`UserMapper.toIResponse` incluye `passwordHash`, y `IUser` lo declara como campo. Salen por:

- `findAllByEstablishmentIdAction`: el hash de **todos** los usuarios del establecimiento.
- `userWorkspaceAction`: el hash del usuario actual, en cada carga de la aplicación.
- `updateUserAction`.
- `UserRoleMapper.toIResponse`: revisar los actions que devuelven `UserRole` con su usuario, como
  `addRoleToUserAction` y `registerUserAction`.

`EmployeeMapper` ya lo vacía con `passwordHash: ''`, así que ese camino no lo expone.

### 4. Contexto basado en cookies del cliente

`useAuth.ts` escribe `establishmentCookie`, `branchOfficeCookie` y `employeeCookie` desde el navegador, sin
`httpOnly`. Los actions las leen con `JSON.parse` y usan los ids resultantes para filtrar datos.

### 5. Onboarding abierto

`registerUserWithEmployeeAction` crea un usuario con rol `establishment_manager` en la sucursal indicada, sin
comprobar si la aplicación ya está configurada. Las pantallas de `/initial/*` y sus actions de establecimiento y
sucursal tampoco se cierran después de la primera instalación.

### 6. `proxy.ts` inactivo

- El archivo está en la raíz y la aplicación usa `src/app`. La documentación exige que esté al mismo nivel que
  `app`.
- En el build, `.next/server/middleware-manifest.json` sale vacío y `/sale` sin sesión responde 200.
- Sin sesión, solo `ProtectedRoute` redirige, en el navegador y después de procesar la página. Los datos pasados
  a los componentes pueden viajar en la respuesta. Esto se dedujo del código, no se comprobó con datos reales.
- El bloque `/admin` está muerto: lee `token.user`, que no existe, y no hay rutas `/admin`.
- La excepción `pathname === "/"` deja pública la página de inicio.

### 7. Roles solo en cliente

`ProtectedRoute` y `HideElement` ocultan pantallas, pero no protegen los datos ni las operaciones. Hoy 10 usos de
`ProtectedRoute` declaran `requiredRoles`.

### 8. Firma de QZ

`signQzMessageAction` (`src/shared/infrastructure/qz/sign-qz-message.action.ts`) firma cualquier texto con la clave
privada, sin sesión. QZ Tray confiaría en esos mensajes. `public/qz/digital-certificate.txt` se sirve
públicamente; es esperable si solo contiene el certificado público, pero conviene confirmarlo.

### 9. Login

`validateAuthAction` tiene `'use server'`, por lo que es invocable directamente además de usarse en `auth.ts`.
Con credenciales válidas devuelve `IUser`, incluido el hash. No hay ningún límite de intentos en el repo.

### 10. Sesiones

`maxAge` está comentado en `auth.ts`, así que aplica el valor por defecto de NextAuth (30 días). Roles y permisos
quedan guardados en el JWT y no se revisa si el usuario sigue activo.

### 11. Validación

Ningún archivo `*.action.ts` usa yup ni `.validate()`.

## Decisión de diseño propuesta

`requireSession` será la pieza central:

```ts
const { userId, employeeId, branchOfficeId, establishmentId } =
    await requireSession({ roles: ['global_admin'] });
```

- **Identidad:** toma el id del JWT y consulta al usuario en la base una vez por petición, con `cache()` de React.
  Si el usuario está desactivado o eliminado, rechaza. Esto resuelve el problema 10.
- **Contexto:** sucursal y establecimiento salen de la base, nunca de cookies. Esto resuelve el problema 4.
- **Autorización:** valida roles y permisos actuales en el servidor.
- **Errores:** debe ir fuera del `try` o dejar pasar su error. Hoy varios actions, como
  `findAllSaleByBranchOfficeAndFilterAction`, convierten cualquier fallo en una lista vacía, lo que escondería un
  acceso denegado.

Se prefiere la consulta a la base frente a guardar más datos en el JWT: `auth.ts` pide mantener el token pequeño,
y así los cambios de rol y las desactivaciones aplican de inmediato.

## Plan de implementación

### Fase 1: contención inmediata

- [ ] Quitar `passwordHash` de `IUser`, de `UserResponseDto` y de los mappers de respuesta.
- [ ] Mover `validateAuthAction` a una función solo de servidor, sin `'use server'`, y actualizar `auth.ts`.

### Fase 2: activar el proxy

- [ ] Mover `proxy.ts` a `src/proxy.ts`.
- [ ] Dejar `/initial/*` público temporalmente. Si no, una instalación nueva queda bloqueada.
- [ ] Decidir el acceso a `/uploads` y comprobar que las imágenes sigan cargando.
- [ ] Quitar el bloque `/admin` y la excepción de `/`.
- [ ] Comprobar que el build registra el proxy y que `/sale` sin sesión redirige.

### Fase 3: `requireSession`

- [ ] Crear `src/shared/infrastructure/auth/require-session.ts` con sus tests.
- [ ] Definir cómo responde al fallar en actions llamados desde páginas y desde componentes cliente.

### Fase 4: migrar actions por riesgo

- [ ] Usuarios y roles.
- [ ] Caja, ventas, créditos y transacciones.
- [ ] QZ, imágenes y nube EDYOF.
- [ ] Resto de actions.
- [ ] Usar el empleado de la sesión en lugar del que venga en el DTO.
- [ ] Agregar un test que falle si un `*.action.ts` no llama a `requireSession`, con una lista explícita de
  excepciones. No depender de ESLint mientras `pnpm lint` siga roto.

### Fase 5: cierre

- [ ] Permitir el onboarding solo mientras no exista ningún usuario.
- [ ] Limitar los intentos de login por correo e IP.
- [ ] Validar inputs con yup, empezando por dinero y usuarios.
- [ ] Eliminar las cookies de contexto cuando nada las lea en el servidor.
- [ ] Comprobar los roles también en el servidor al cargar páginas.
- [ ] Definir `maxAge` en `auth.ts`.
- [ ] Actualizar `AGENTS.md`, que hoy describe protecciones que no existen.
- [ ] Pasar `security-auditor` sobre el diff.

## Decisiones pendientes

1. **Exposición de la aplicación:** ¿es accesible desde internet o desde una red con personas no confiables? Si
   lo es, la fase 1 es urgente y conviene cambiar las contraseñas después de cerrar los problemas 1 a 4, porque no
   se puede descartar que los hashes ya se hayan expuesto.
2. **Matriz de permisos:** definir qué rol puede ejecutar cada operación. Se puede partir de las rutas que ya usan
   `requiredRoles`.
3. **`/uploads`:** puede seguir público si solo sirve imágenes de productos; si guarda algo privado, debe exigir
   sesión.

## Riesgos de la implementación

- Activar el proxy sin excluir `/initial/*` bloquea las instalaciones nuevas.
- Los actions llamados durante el onboarding no podrán exigir sesión hasta que exista la regla de la fase 5.
- Las imágenes optimizadas con `next/image` desde `/uploads` pueden fallar si esa ruta exige sesión.
- Reemplazar las cookies afecta a los 52 actions que las leen; conviene migrarlos en lotes pequeños y probar cada
  flujo.
- `pnpm validate` hoy falla por motivos ajenos (ver `11_skeletons_ui_asincrona_spect.md`). Conviene arreglar
  ESLint y `typecheck:ci` antes de la migración masiva de la fase 4.
