# Análisis Técnico: Gestión de Imágenes (entidad `Image` genérica + almacenamiento dual Local/Cloud)

> Documento de planificación. No contiene código de implementación — es la especificación a partir de la
> cual los agentes `backend` y `frontend` ejecutarán el trabajo en fases posteriores.
>
> Este documento **reemplaza** al borrador previo `01_gestion_imagenes_producto_spect.md` (alcance
> limitado a producto). El alcance se amplió a pedido del usuario: una única entidad `Image` reutilizable
> para producto, perfil de empleado/usuario y logotipo de establecimiento.

## Problema

El sistema necesita una capacidad genérica de gestión de imágenes, no limitada a producto:

1. **Producto**: hasta **3 imágenes**, **1 marcada como principal (default)**, mostrada en el catálogo de
   productos y en la pantalla de ventas. Las otras 2 se guardan para uso futuro (e-commerce / catálogo en
   línea), sin renderizarse todavía en ninguna pantalla.
2. **Empleado (perfil de usuario)**: foto de perfil.
3. **Establecimiento**: logotipo.

En vez de construir tres módulos de imagen paralelos (uno por contexto), el usuario pidió explícitamente
**una sola entidad `Image`** reutilizable por los tres, que en el futuro pueda extenderse a más "dueños" de
imagen sin duplicar infraestructura de subida/almacenamiento.

La dificultad particular de este proyecto es que se distribuye en **dos modalidades de despliegue**:

1. **On-premise / local**: instalado en la máquina del cliente (proceso Node persistente, con disco
   propio). Las imágenes deben guardarse en el sistema de archivos local del cliente.
2. **Cloud (Vercel)**: entorno serverless, sin disco persistente entre invocaciones. Las imágenes deben
   guardarse en un servicio de almacenamiento externo (blob storage).

El sistema debe decidir automáticamente qué estrategia de almacenamiento usar según el entorno de
ejecución, sin que el dominio ni la aplicación conozcan la diferencia (inversión de dependencia).

## Hallazgos sobre el estado actual del código

- **`Product.imageUrl`** (`string | null`) ya existe de punta a punta: entidad de dominio (`create()`,
  `reconstitute()`, getter y `updateImageUrl()` ya implementado pero sin uso actual), columna ORM
  `image_url` (ya migrada, `1783063705557-schema.ts`), DTOs, ambos mappers, e interfaz `IProduct`. **Esta
  será la imagen "por defecto" del producto**, tal como pidió el usuario — se reutiliza tal cual, sin
  tocar su tipo ni su nombre.
- **`Employee.photoUrl`** (`string | null`) — **hallazgo nuevo, no documentado en el borrador anterior**:
  existe exactamente el mismo patrón que en producto (`_photoUrl`, `create()`, `reconstitute()`, getter
  `photoUrl`, método `updatePhotoUrl()` ya implementado pero sin uso), columna ORM `photo_url` en
  `employee`, y presente en DTOs/mapper/`IEmployee`. Es decir, **la foto de perfil de empleado ya tiene el
  mismo 80% de cableado que producto** — no se requiere migración para agregar el campo, solo conectar el
  flujo de subida.
- **`Establishment` no tiene ningún campo de imagen/logo** — a diferencia de producto y empleado, aquí sí
  hace falta agregar el campo desde cero: dominio, columna ORM (`logo_url`), migración, DTOs, mapper y
  `IEstablishment`.
- **Ningún formulario ni pantalla expone la subida de imágenes hoy**, para ninguno de los tres. No existe
  `<input type="file">` en el proyecto, ni `multer`/`formidable`/`@vercel/blob`/`aws-sdk`/`cloudinary`, ni
  manejo de `multipart/form-data`. El `FetchHttpClient` compartido sólo serializa JSON.
- **`enrollmentKey`** (`establishment-management` + `inventory-management/transfer`) no tiene relación con
  el modo de despliegue local/cloud de la app — es una feature de negocio independiente para traspasos de
  mercancía entre sucursales vía la plataforma cloud externa "JEEMA Transfer Platform". Lo único
  reutilizable como *precedente técnico* es el patrón de configuración: `ApiCloudTransferConfigImpl`
  (`src/shared/infrastructure/config/api-cloud-transfer.config.ts`) lee variables de entorno con fallback y
  se registra como singleton en `DependencyFactory` (`src/shared/infrastructure/di/dependency-factory.ts`).
  Ese patrón ("config con fallback + singleton en `DependencyFactory`, con setters para test") es el que se
  replica para `ImageStoragePort`.
- **`ProductCheckerPort`/`EmployeeChekerPort` existen pero están sin usar** — descartados como base para
  esta feature. Verificado: `ProductCheckerAdapter`
  (`product/infraestructure/persistence/typeorm/external-services/product-checker.adapter.ts`) y
  `TypeormEmployeeCheckerAdapter`
  (`employee/infraestruture/persistence/typeorm/external-services/typeorm-employee-checker.adapter.ts`)
  implementan sus respectivos puertos, pero ningún use-case los inyecta ni hay registro de DI para
  ninguno de los dos — son código muerto (el de empleado incluso importa `Injectable` de
  `@nestjs/common`, un framework que este proyecto no usa, señal adicional de que quedó a medio integrar).
  En su lugar, la validación de existencia del dueño se hace directamente contra los repositorios de cada
  contexto, que ya exponen `existById(id): Promise<Entity | null>` (`ProductRepository`,
  `EmployeeRepository`, `EstablishmentRepository` lo tienen los tres) y son el mecanismo que sí está en uso
  real en el resto de la base de código. No se crea ningún checker port nuevo para `Establishment`.
- **`next.config.ts`** ya tiene `images.remotePatterns` con un dominio de ejemplo (`example.com`) — debe
  actualizarse al dominio real del proveedor cloud elegido.
- **`config.ts`** (`src/configuration/databases/typeorm/config/config.ts`) registra manualmente cada
  `OrmEntity` en un array `entities` — TypeORM no las autodescubre aquí. Cualquier entidad ORM nueva debe
  añadirse ahí explícitamente.
- **Migraciones**: sólo existe una migración baseline (`1783063705557-schema.ts`). La nueva migración de
  esta feature será la segunda del proyecto.
- **`.gitignore`** no tiene ninguna entrada para una futura carpeta de subidas (`public/uploads` o
  similar) — hay que añadirla para no versionar archivos de clientes en modo local.
- **`package.json`**: Next 16.2.10 / React 19.2.7 (Server Actions soportan `FormData`/`File` nativamente,
  no requiere librería adicional para recibir el archivo). `sharp` sólo aparece en
  `pnpm.ignoredBuiltDependencies` (dependencia transitiva de Next, no está en uso real).

**Conclusión**: no se reinventa el campo "imagen principal" — producto y empleado ya lo tienen cableado
(solo falta la subida real); establecimiento lo necesita desde cero. Lo que falta construir de raíz para
los tres es: (a) la entidad `Image` genérica con su persistencia y reglas de negocio, (b) el
almacenamiento dual local/cloud del archivo binario, (c) el mecanismo genérico para sincronizar la imagen
principal con el campo denormalizado del dueño (`imageUrl` / `photoUrl` / `logoUrl`), y (d) toda la capa
de presentación.

## Impacto Arquitectural

### Backend (dominio / aplicación / infraestructura)

- **Nuevo bounded context** `image-management/image/`, al mismo nivel que `product-management`,
  `employee-management`, `establishment-management` — porque `Image` no pertenece a ninguno de los tres en
  particular, es transversal a todos. Sigue el mismo patrón de 4 capas (`domain/application/infraestructure/presentation`)
  que el resto del proyecto.
- **Asociación polimórfica**: la tabla `image` tiene `owner_type` (enum `PRODUCT | EMPLOYEE |
  ESTABLISHMENT`) + `owner_id` (bigint), en vez de tres tablas `product_image` / `employee_image` /
  `establishment_image` separadas. Esto es justo lo que el usuario pidió (una sola entidad), a cambio de
  **no poder tener una FK real de Postgres** hacia el dueño (una columna no puede apuntar a tres tablas
  distintas). Se documenta la mitigación en la sección de Seguridad/Integridad más abajo, y la alternativa
  descartada en "Riesgos y decisiones abiertas".
- **`ImageStoragePort`** (interfaz, shared kernel en `src/shared/domain/ports/`, junto a
  `transaction.port.ts`) — desacopla el use-case de *dónde* se guarda físicamente el archivo.
- **`ImageOwnerGatewayPort`** (interfaz de dominio de `image-management`) — desacopla el use-case de
  `Image` de los tres contextos dueños. Dos responsabilidades por dueño:
  - `exists(ownerId): Promise<boolean>` — validar que el dueño existe antes de asociarle una imagen.
  - `updatePrimaryImageUrl(ownerId, url: string | null): Promise<void>` — sincronizar el campo
    denormalizado (`imageUrl`/`photoUrl`/`logoUrl`) cuando cambia la imagen principal.
  Tres adaptadores concretos (uno por `ownerType`) implementan este puerto reutilizando **directamente los
  repositorios ya existentes de cada contexto** — `ProductRepository`, `EmployeeRepository`, y
  `EstablishmentRepository` (este último con su nuevo método `updateLogoUrl()` en la entidad) — usando el
  método `existById()` que los tres ya exponen para la verificación de existencia. No se introduce ningún
  puerto/adaptador "checker" nuevo.
- Dos adaptadores de infraestructura que implementan `ImageStoragePort`: uno para filesystem local, uno
  para almacenamiento cloud (blob) — genéricos, no saben qué tipo de dueño tiene la imagen.
- Extensión de `DependencyFactory` con `getImageStorage()` (decide adaptador local/cloud en runtime) y
  `getImageOwnerGateway(ownerType)` (resuelve el adaptador correcto por tipo de dueño).
- Nuevos use-cases genéricos en `image-management`: `UploadImageUseCase`, `ListImagesByOwnerUseCase`,
  `SetPrimaryImageUseCase`, `DeleteImageUseCase` — parametrizados por `ownerType` + `ownerId`, sin lógica
  específica de producto/empleado/establecimiento.
- Nuevo campo en `Establishment`: `logoUrl` + método de dominio `updateLogoUrl()` (mismo patrón que
  `updateImageUrl`/`updatePhotoUrl`).
- Nueva tabla `image` + columna `establishment.logo_url`, ambas en una sola migración TypeORM.

### Frontend (presentación)

- Server Actions genéricas en `image-management/image/presentation/actions/`: `upload-image.action.ts`,
  `list-images-by-owner.action.ts`, `set-primary-image.action.ts`, `delete-image.action.ts` — reciben
  `ownerType` + `ownerId` + `FormData`.
- Componentes genéricos y reutilizables:
  - `ImageUploader` (slots configurables vía prop `maxSlots`: `3` para producto, `1` para empleado y
    establecimiento; selección de imagen principal, preview antes de subir, estados
    loading/error/success).
  - `ImageThumbnail` (imagen principal vía `next/image` + fallback a ícono/placeholder cuando la URL es
    `null`).
- Integración puntual por contexto (cada uno consume los componentes genéricos, no duplica lógica):
  - **Producto**: `FormRegisterCompleteProduct.tsx`, `UpdateProductModal.tsx`/`ProductDetail.tsx` (alta/
    edición, 3 slots); `TableProducts.tsx`, `ListMovileProducts.tsx`, y los componentes de venta
    (`SaleProductList.tsx`, `SaleCardList.tsx`, `SaleDesktopTable.tsx`, `SaleDetailItem.tsx`,
    `SaleDetailItemMovile.tsx`, `SaleInventoryListModal.tsx`) — solo lectura de la imagen principal.
  - **Empleado**: formulario de alta/edición de empleado (`useEmployeeForm.ts`/`useEmployeeUpdate.ts` y
    sus modales) — 1 slot (foto de perfil).
  - **Establecimiento**: pantalla de configuración/ajustes del establecimiento
    (`useEstablishmentUpdate.ts`) — 1 slot (logotipo).
- `next/image` exige mantener actualizado `images.remotePatterns` en `next.config.ts` con el dominio del
  proveedor cloud elegido.

### Base de datos

- **Nueva tabla `image`**: `image_id` (PK), `owner_type` (varchar/enum: `PRODUCT`|`EMPLOYEE`|
  `ESTABLISHMENT`), `owner_id` (bigint, sin FK real por ser polimórfico — ver Seguridad/Integridad),
  `storage_key` (ruta/clave interna en el storage, para poder borrar el archivo físico), `url` (URL
  pública/servible), `mime_type`, `size_bytes`, `is_primary` (boolean), `sort_order` (1-3), `created_at`,
  `updated_at`, `deleted_at` (soft delete, consistente con el resto del esquema).
- Índice compuesto `(owner_type, owner_id)` para listar rápido las imágenes de un dueño.
- **Índice único parcial** (garantía a nivel de base de datos, no sólo de aplicación):
  `CREATE UNIQUE INDEX ... ON image(owner_type, owner_id) WHERE is_primary = true AND deleted_at IS NULL`
  — asegura que nunca haya más de una imagen principal activa por dueño, incluso si un bug de aplicación
  intenta insertar una segunda.
- Regla de máximo 3 imágenes activas por dueño: a nivel de aplicación (igual que en el borrador anterior;
  un `CHECK`/trigger de conteo es posible pero se considera sobre-ingeniería para esta iteración).
- **Nueva columna `establishment.logo_url`** (`varchar`, nullable). `product.image_url` y
  `employee.photo_url` **no se tocan** — ya existen y se reutilizan como caché de lectura rápida de la
  imagen principal de cada uno.

## Propuesta de Solución

### 1. Modelo de dominio

**`ImageEntity`** (nueva, `contexts/image-management/image/domain/entities/image.entity.ts`):
- Constructor privado + `create()` / `reconstitute()`, siguiendo el patrón ya usado en `ProductEntity` /
  `EmployeeEntity`.
- Campos: `imageId`, `ownerType` (`ImageOwnerType`), `ownerId`, `storageKey`, `url`, `mimeType`,
  `sizeBytes`, `isPrimary`, `sortOrder`, `createdAt`/`updatedAt`/`deletedAt`.
- Métodos de dominio (sin setters públicos): `markAsPrimary()`, `unmarkAsPrimary()`.
- Reglas de colección (viven en el use-case, no en la entidad individual): máximo 3 imágenes activas por
  `(ownerType, ownerId)`; sólo una marcada como principal a la vez (al marcar una nueva como principal, se
  desmarca la anterior en la misma operación transaccional).

**`ImageOwnerType`** (enum, `domain/enums/image-owner-type.enum.ts`): `PRODUCT`, `EMPLOYEE`,
`ESTABLISHMENT`. Diseñado para poder agregar valores futuros (p. ej. `CATEGORY`, `BRAND`) sin cambiar el
resto del modelo.

Excepciones de dominio nuevas (extienden `DomainException`, en `image-management/image/domain/exceptions/`):
`ImageLimitExceededException` (ya hay 3 imágenes activas), `ImageNotFoundException`,
`InvalidImageOwnerException` (el `ownerId` indicado no existe para ese `ownerType`),
`InvalidImageFileException` (tipo/tamaño no permitido).

**Cambio en `Establishment`**: agregar campo privado `_logoUrl: string | null` + parámetro en
`create()`/`reconstitute()` + getter `logoUrl` + método `updateLogoUrl(newUrl: string | null): void` —
copia exacta del patrón ya usado en `Product.updateImageUrl()` / `Employee.updatePhotoUrl()`.

### 2. Puertos de dominio

**`ImageStoragePort`** (interfaz, `src/shared/domain/ports/image-storage.port.ts`):
- Subir un archivo (recibe el binario + metadata) → devuelve `{ storageKey, url }`.
- Eliminar un archivo dado su `storageKey`.

**`ImageOwnerGatewayPort`** (interfaz, `image-management/image/domain/ports/out/image-owner-gateway.port.ts`):
- `exists(ownerId: bigint): Promise<boolean>`
- `updatePrimaryImageUrl(ownerId: bigint, url: string | null): Promise<void>`

Estos dos puertos son lo único que los use-cases de `image-management` conocen. La elección de
implementación (dónde se guarda el archivo, y cómo se sincroniza cada tipo de dueño) queda fuera del
dominio y de la aplicación, resuelta en el borde de infraestructura.

### 3. Adaptadores concretos

**Almacenamiento** (genéricos, `shared/infrastructure/storage/`):
- **`LocalFilesystemImageStorageAdapter`**: escribe el archivo en un directorio configurable dentro de
  `public/` (p. ej. `public/uploads/{ownerType}/{ownerId}/{uuid}.ext`), para que Next.js lo sirva
  directamente sin necesidad de una ruta API dedicada — válido porque el modo local corre como proceso
  persistente, no serverless. Nombres de archivo generados por UUID, nunca a partir del nombre original.
- **`CloudImageStorageAdapter`**: sube el archivo a **Cloudinary** (decisión confirmada por el usuario).
  Requiere la dependencia `cloudinary` (SDK oficial) y las variables `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- **Selección de adaptador**: `DependencyFactory.getImageStorage()`, misma filosofía de "env var con
  fallback razonable" que `ApiCloudTransferConfigImpl`:
  - Si `IMAGE_STORAGE_MODE` está definida (`local` | `cloud`), se respeta.
  - Si no, se autodetecta: Vercel inyecta `process.env.VERCEL=1` en runtime → si existe, modo `cloud`; si
    no, modo `local`. Así ninguna instalación on-premise necesita configurar nada manualmente, y el deploy
    en Vercel no depende de que alguien recuerde poner la variable.

**Owner gateway** (uno por `ownerType`, `image-management/image/infraestructure/adapters/`), los tres
construidos **sólo sobre el repositorio ya existente de cada contexto** (sin checker ports, sin puertos
nuevos de "existencia"):
- `ProductImageOwnerGatewayAdapter` — `exists()` delega en `ProductRepository.existById(ownerId)`;
  `updatePrimaryImageUrl()` delega en `ProductRepository.findById` + `product.updateImageUrl()` + `save`.
- `EmployeeImageOwnerGatewayAdapter` — `exists()` delega en `EmployeeRepository.existById(ownerId)`;
  `updatePrimaryImageUrl()` delega en `EmployeeRepository.findById` + `employee.updatePhotoUrl()` +
  `update`.
- `EstablishmentImageOwnerGatewayAdapter` — `exists()` delega en
  `EstablishmentRepository.existById(ownerId)`; `updatePrimaryImageUrl()` delega en
  `EstablishmentRepository.findById` + `establishment.updateLogoUrl()` + `transactionUpdate`/`save`.
- **Resolución**: `DependencyFactory.getImageOwnerGateway(ownerType: ImageOwnerType):
  ImageOwnerGatewayPort` — switch/registro simple que devuelve el adaptador correspondiente. Los use-cases
  de `Image` nunca hacen ese switch ellos mismos; lo reciben ya resuelto.

### 4. Reglas de negocio (resumen, aplican igual a los 3 tipos de dueño)

- Máximo 3 imágenes activas (no borradas) por `(ownerType, ownerId)`.
- Exactamente 0 o 1 imagen marcada como `isPrimary = true` por dueño (reforzado también con índice único
  parcial en base de datos).
- Al subir la primera imagen de un dueño, se marca automáticamente como principal.
- Al eliminar la imagen principal, si quedan otras, se promueve automáticamente la de menor `sortOrder`;
  si no quedan, se limpia el campo denormalizado del dueño (`imageUrl`/`photoUrl`/`logoUrl` → `null`).
- Antes de crear una imagen, se valida `ImageOwnerGatewayPort.exists(ownerId)` — si no existe, se lanza
  `InvalidImageOwnerException`.
- Tipos de archivo permitidos: `image/jpeg`, `image/png`, `image/webp` (whitelist explícita, validada
  server-side por contenido/mimetype, no sólo por extensión).
- Tamaño máximo por archivo: configurable vía env (`MAX_IMAGE_SIZE_MB`, default sugerido 2MB), validado
  antes de escribir a disco/red.
- La UI puede limitar cuántos slots muestra por tipo de dueño (3 para producto, 1 para empleado y
  establecimiento) **sin que eso sea una regla de dominio** — el dominio permite hasta 3 para cualquier
  dueño, dejando espacio a que en el futuro, por ejemplo, un establecimiento suba más de un logotipo (claro/
  oscuro) sin tocar el backend.

### 5. Variables de entorno nuevas (a documentar en `.env.template`)

| Variable | Propósito | Modo |
|---|---|---|
| `IMAGE_STORAGE_MODE` | Fuerza `local` o `cloud` (opcional; si no se define, se autodetecta por `VERCEL`) | Ambos |
| `LOCAL_IMAGE_STORAGE_PATH` | Carpeta destino relativa dentro de `public/` para modo local (default `uploads`) | Local |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la cuenta Cloudinary | Cloud |
| `CLOUDINARY_API_KEY` | API key de Cloudinary | Cloud |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary | Cloud |
| `MAX_IMAGE_SIZE_MB` | Límite de tamaño por imagen | Ambos |

### 6. Seguridad e integridad

- Validación de tipo de archivo por contenido (no confiar sólo en la extensión ni en el `Content-Type`
  declarado por el cliente).
- Nombres de archivo generados por el servidor (UUID), nunca derivados del nombre original subido por el
  usuario — evita path traversal y colisiones.
- Límite de tamaño aplicado antes de persistir, para mitigar abuso/DoS por subida de archivos grandes.
- El directorio local de almacenamiento debe quedar contenido dentro de `public/` y no permitir escritura
  fuera de ese árbol (sanitizar cualquier segmento de ruta calculado, incluyendo `ownerId`/`ownerType`).
- Las Server Actions de subida deben validar sesión/autorización igual que el resto de acciones existentes
  de cada módulo.
- **Integridad referencial de `owner_id` (trade-off de la asociación polimórfica)**: al no existir FK real
  hacia `product`/`employee`/`establishment`, la única garantía es a nivel de aplicación
  (`ImageOwnerGatewayPort.exists()` antes de insertar). Si en el futuro se **elimina físicamente** (hard
  delete) un producto/empleado/establecimiento que tiene imágenes asociadas, quedarían filas huérfanas en
  `image` — hoy el proyecto sólo hace *soft delete* (`deleted_at`) en estas entidades, por lo que el riesgo
  es bajo en la práctica, pero queda documentado como limitación conocida (mismo estilo que el TODO ya
  existente de compensación cloud en `RegisterCloudBranchAndCloudEstablishmentUseCase`).

## Plan de Implementación

Fases pensadas para ejecutarse con `backend` y `frontend` trabajando de forma mayormente secuencial por
fase (backend expone el contrato antes de que frontend lo consuma), pero cada fase es un incremento
funcionalmente verificable.

### Fase 0 — Preparación
1. Agregar dependencia `cloudinary` al `package.json`.
2. Documentar las nuevas variables de entorno en `.env.template`.
3. Agregar entrada a `.gitignore` para la carpeta local de subidas (p. ej. `/public/uploads/`).
4. (Backend) Definir `ImageStoragePort` en `shared/domain/ports/`.

### Fase 1 — Backend: dominio de `image-management`
1. (Backend) Crear `ImageOwnerType` (enum) y `ImageEntity` + excepciones de dominio.
2. (Backend) Crear `ImageOwnerGatewayPort` y el repositorio de dominio `ImageRepository` (interfaz).
3. (Backend) Agregar `logoUrl` + `updateLogoUrl()` a `EstablishmentEntity` (mismo patrón que
   `Product.updateImageUrl()` / `Employee.updatePhotoUrl()`).

### Fase 2 — Backend: persistencia
1. (Backend) Crear `ImageOrmEntity` (tabla `image`), registrar en el array `entities` de `config.ts`.
2. (Backend) Generar y correr la migración: tabla `image` (con índice compuesto e índice único parcial de
   `is_primary`) + columna `establishment.logo_url`.
3. (Backend) Implementar `TypeormImageRepository` siguiendo el patrón de `typeorm-product.repository.ts`.
4. (Backend) Actualizar `EstablishmentOrmEntity`, DTOs, mapper (aplicación y TypeORM) e `IEstablishment`
   con `logoUrl`.

### Fase 3 — Backend: adaptadores de almacenamiento y DI
1. (Backend) Implementar `LocalFilesystemImageStorageAdapter`.
2. (Backend) Implementar `CloudImageStorageAdapter` (Cloudinary).
3. (Backend) Extender `DependencyFactory` con `getImageStorage()` + autodetección de modo, con los setters
   de test correspondientes (patrón `setHttpClient`/`setApiConfig`/`reset`).

### Fase 4 — Backend: owner gateways
1. (Backend) Implementar `ProductImageOwnerGatewayAdapter`, `EmployeeImageOwnerGatewayAdapter`,
   `EstablishmentImageOwnerGatewayAdapter` — los tres construidos directamente sobre
   `ProductRepository`/`EmployeeRepository`/`EstablishmentRepository` (método `existById()` ya existente
   en los tres), sin checker ports.
2. (Backend) Extender `DependencyFactory` con `getImageOwnerGateway(ownerType)`.

### Fase 5 — Backend: use-cases y Server Actions
1. (Backend) Use-cases genéricos: `UploadImageUseCase`, `ListImagesByOwnerUseCase`,
   `SetPrimaryImageUseCase`, `DeleteImageUseCase`.
2. (Backend) DTOs y mapper de `image-management`.
3. (Backend) Server Actions (`presentation/actions/`), recibiendo `FormData` + `ownerType`/`ownerId`, con
   validación de tamaño/tipo antes de invocar el use-case.
4. (Backend) Tests con `pg-mem` para los use-cases, mockeando `ImageStoragePort` y `ImageOwnerGatewayPort`
   (inyección manual, sin depender de storage real ni de los otros contextos en tests).

### Fase 6 — Frontend: componentes genéricos
1. (Frontend) `ImageUploader` (slots configurables, selector de imagen principal, preview, estados
   loading/error/success).
2. (Frontend) `ImageThumbnail` (imagen principal vía `next/image` + fallback a placeholder).
3. (Frontend) Hooks reutilizables (`useOwnerImages`, `useImageUpload`) sobre las Server Actions genéricas.

### Fase 7 — Frontend: producto
1. Integrar `ImageUploader` (3 slots) en `FormRegisterCompleteProduct.tsx` y en
   `UpdateProductModal.tsx`/`ProductDetail.tsx`.
2. Integrar `ImageThumbnail` en `TableProducts.tsx`, `ListMovileProducts.tsx` y en los componentes de venta
   (`SaleProductList.tsx`, `SaleCardList.tsx`, `SaleDesktopTable.tsx`, `SaleDetailItem.tsx`,
   `SaleDetailItemMovile.tsx`, `SaleInventoryListModal.tsx`).

### Fase 8 — Frontend: empleado
1. Integrar `ImageUploader` (1 slot) en el formulario de alta/edición de empleado.
2. Mostrar `ImageThumbnail` (avatar) donde ya se liste o muestre el detalle de un empleado.

### Fase 9 — Frontend: establecimiento
1. Integrar `ImageUploader` (1 slot) en la pantalla de configuración/ajustes del establecimiento.
2. Mostrar el logotipo donde tenga sentido en la UI actual (p. ej. cabecera de configuración).

### Fase 10 — Verificación
1. Probar manualmente el flujo completo en modo local (`pnpm run dev`, sin `VERCEL` definido) para los 3
   tipos de dueño: subir, marcar principal, eliminar, ver reflejado en catálogo/venta/perfil/ajustes.
2. Probar en un deploy de preview de Vercel (o simulando `VERCEL=1` + `BLOB_READ_WRITE_TOKEN` local) que el
   modo cloud sube correctamente y que las URLs resultantes cargan bajo `images.remotePatterns`.
3. Actualizar `images.remotePatterns` en `next.config.ts` con el dominio real del proveedor cloud elegido.
4. Confirmar `pnpm run build` (Webpack, no Turbopack — restricción documentada en
   `CLAUDE.md`/`MIGRATION-NEXT-V15-TO-V16.MD`) sin errores relacionados a las nuevas entidades TypeORM.

## Fuera de alcance en esta iteración

- Mostrar la imagen 2 y 3 del producto en algún catálogo/e-commerce en línea — no existe todavía esa
  superficie en el proyecto; sólo se deja la capacidad de subir y almacenar hasta 3 imágenes.
- Uso del logotipo del establecimiento en tickets/facturas PDF (`@react-pdf/renderer`) — natural
  extensión futura, no pedida explícitamente ahora.
- Redimensionado/optimización automática de imágenes (p. ej. con `sharp`) — evaluar si el tamaño de
  archivo original resulta un problema real de performance/costos de storage cloud.
- Migración/backfill de imágenes para productos o empleados ya existentes (no aplica: hoy ninguno tiene
  imagen cargada).
- Cascada de borrado de imágenes ante un hard-delete del dueño — hoy el proyecto no hace hard-delete en
  estas entidades (ver nota de integridad referencial arriba).

## Riesgos y decisiones (confirmadas por el usuario el 2026-08-11)

1. **Proveedor cloud**: **Cloudinary** (confirmado). Cambia el adaptador de infraestructura
   (`CloudImageStorageAdapter`), no el puerto/contrato de dominio (`ImageStoragePort`).
2. **Asociación polimórfica vs. tablas separadas**: **confirmada la asociación polimórfica** (una sola
   tabla `image` con `owner_type` + `owner_id`), aceptando el trade-off de no tener FK real de Postgres
   hacia el dueño (mitigado con índice único parcial + validación de aplicación vía
   `ImageOwnerGatewayPort.exists()`).
3. **Ruta de almacenamiento local**: se propone `public/uploads/{ownerType}/{ownerId}/`. Confirmar que no
   hay conflicto con build/despliegue (debe excluirse de git pero no de lo servido en runtime).
4. **Límite de tamaño**: 2MB por imagen propuesto como default razonable — ajustable.
5. **¿Recorte/aspect ratio fijo?** No especificado; se asume que el frontend sólo previsualiza tal cual se
   sube, sin editor de recorte, salvo que se indique lo contrario.
6. **Slots visibles en UI para empleado/establecimiento**: **confirmado 1 solo slot**, aunque el dominio
   permita hasta 3, para no exponer una capacidad (foto secundaria de empleado, logo alterno) que no fue
   pedida.
