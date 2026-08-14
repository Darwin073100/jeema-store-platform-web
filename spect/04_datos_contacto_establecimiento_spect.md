# Análisis Técnico: Datos de contacto y presencia del establecimiento (teléfonos, redes sociales, sitio web, slogan)

> Documento de planificación. No contiene código de implementación — es la especificación a partir de la
> cual los agentes `backend` y `frontend` ejecutarán el trabajo en fases posteriores. Elaborado con el
> agente `architect`.

## Problema

El ticket de venta (`Ticket58Document.tsx`) necesita mostrarle al cliente cómo volver a encontrar el
negocio: teléfono(s), redes sociales (Facebook, Instagram, etc.), sitio web y un slogan/leyenda comercial
(ej. "Papelería Fulana — mayoreo y menudeo"). Hoy esa información **no existe como dato del sistema**:
está escrita a mano, en texto plano, directamente dentro del componente del ticket.

El usuario pidió explícitamente **una sola entidad para registrar "datos extra" del establecimiento**, cada
fila con un `value` (el dato en sí: un teléfono, un correo, el nombre de una página de Facebook, etc.) y un
`enum` que indica de qué tipo de contenido se trata (`EMAIL`, `PHONE_NUMBER`, `FACEBOOK`, ...), en vez de
columnas sueltas (`phone1`, `phone2`, `facebookUrl`, `instagramUrl`, ...). También pidió que el número de
teléfono admita **uno o varios** valores (no es 1 a 1 como el resto).

## Hallazgos sobre el estado actual del código

- **`Establishment` ya tiene `name` y `logoUrl`** (`domain/entities/establishment.entity.ts`), ambos
  agregados en features previas (el `logoUrl` es el más reciente, migración
  `1786506042497-AddImageAndEstablishmentLogo.ts`). **No tiene ningún campo de contacto.** El folder de
  infraestructura de esta entidad específica se llama **`infraestruture`** (falta la segunda "c" — una
  tercera variante ortográfica distinta a la documentada en `CLAUDE.md`, y distinta también de
  `image-management/image/infraestructura` en español). Todo archivo nuevo bajo `establishment/` debe
  respetar `infraestruture` tal cual, sin "corregirlo".
- **`Address` (`establishment-management/address/`) NO pertenece a `Establishment`** — es una entidad
  compartida en relación **1:1** con `BranchOffice`, `Employee`, `Suplier` y `Customer` (dueño en
  `AddressOrmEntity` vía 4 `@OneToOne` distintos, FK del lado de cada dueño con `cascade: true, eager:
  true, onDelete: 'CASCADE'`). Esto confirma que hoy **la única información "de contacto/ubicación" vive a
  nivel de sucursal (`BranchOffice`), no de establecimiento** — el ticket ya arma la dirección impresa
  desde `sale.branchOffice.address.*` (`Ticket58Document.tsx:136`). `Address` es precedente de "un dueño,
  un registro relacionado" (1:1), **no** de "un dueño, muchos registros tipados" — no aplica como plantilla
  directa aquí.
- **El ticket ya tiene, literalmente hoy, los datos que se van a migrar a este sistema**
  (`src/contexts/sale-management/sale/presentation/documents/Ticket58Document.tsx:234-236`):
  ```tsx
  <Text style={styles.contacto}>TEL-1: 741-150-6224, TEL-2: 741-107-3337</Text>
  <Text style={styles.facebook}>FACEBOOK: Papelería y Novedades "La Bonita"</Text>
  ```
  y una línea de slogan ya prevista pero comentada, justo bajo el encabezado (línea 168):
  `{/* <Text style={styles.subheader}>MAYOREO Y MENUDEO</Text> */}`. El ticket ya carga
  `sale.branchOffice?.establishment?.logoUrl` y `.name` — **este es el componente exacto a modificar**, y
  confirma que el dueño natural de estos datos es `Establishment` (el ticket ya llega hasta ese nivel de
  relación), no `BranchOffice`.
- **Ruta de datos del ticket**: `find-sale-ticket-by-id.use-case.ts` →
  `TypeormSaleRepository.findSaleTicketById()` (`typeorm-sale.repository.ts:72-89`), que carga
  `relations: { ..., branchOffice: { address: true, establishment: true } }`. Hay que sumar la nueva
  relación ahí, y encadenar el tipo a través de `ISale` → `IBranchOffice` → `IEstablishment`.
- **Precedente directo para "lista de registros tipados con un enum discriminador"**: el contexto
  `image-management/image` (ya implementado, no sólo planeado — ver `01_gestion_imagenes_spect.md`) usa
  exactamente ese patrón para `ImageEntity` (`ownerType` enum + `ownerId`), pero de forma **polimórfica**
  (un mismo `Image` sirve a `PRODUCT | EMPLOYEE | ESTABLISHMENT`, sin FK real de Postgres — sólo `owner_id`
  bigint validado en la capa de aplicación). Aquí **no aplica la polimorfia**: el dueño siempre es
  `Establishment`, así que corresponde una **FK real** (`@ManyToOne`/`@JoinColumn` con `onDelete: 'CASCADE'`
  hacia `establishment`), más simple y con integridad referencial real — a diferencia de `Image`, que
  sacrifica eso a propósito por servir a 3 dueños distintos. Lo que **sí** vale la pena copiar de `Image`:
  reglas de colección (p. ej. "sólo un slogan activo") viven en el **use-case**, no en la entidad (mismo
  criterio que `markAsPrimary`/reglas de "máx. 3 imágenes" en `UploadImageUseCase`), y el truco de **índice
  único parcial** para reforzarlo a nivel de base de datos (`Image` usa uno para "una sola imagen primaria
  por dueño"; aquí se puede usar el mismo truco para "un solo slogan/sitio web/Facebook por establecimiento").
- **Convención de enums persistidos**: en todo el proyecto, el enum TS vive en
  `<contexto>/<entidad>/domain/enums/<nombre>.enum.ts` y la columna ORM es
  `@Column({ type: 'enum', enum: MiEnum })` (TypeORM genera el `CREATE TYPE ... AS ENUM(...)` de Postgres).
  Ejemplos: `SaleStatusEnum`, `AccountTypeEnum`, `LocationEnum`, y el más cercano a este caso,
  `ImageOwnerType` (`image.orm-entity.ts:23`). Se sigue el mismo patrón para el nuevo enum.
- **Convención de Value Objects**: cada campo relevante de una entidad de dominio tiene su propio VO que
  extiende `ValueObject<T>` (`src/shared/domain/value-objects/value-object.ts`), con validación en
  `create()` y excepción de dominio dedicada (ej. `EstablishmentNameVO` + `InvalidNameException`, ambas en
  `establishment/domain/`). Se sigue el mismo patrón para el VO del `value` del nuevo registro.
- **Pantalla de configuración existente**: `/configurations/establishment` (`page.tsx`) ya renderiza
  `WorkspaceInformation` (datos generales) y `BranchesInEstablishment` (tabla de sucursales), y ya tiene un
  modal de edición, `EstablishmentUpdateModal.tsx`, que edita `name` y `logoUrl` (este último vía
  `ImageUploader` reutilizable de `image-management`). Es el lugar natural para agregar la gestión de estos
  nuevos datos — mismo patrón de modal + store de UI (`establishment-ui.store.ts`) + hook con
  react-hook-form (`useEstablishmentUpdate.ts`).
- **Server Actions de establecimiento existentes** (`create`, `find-by-id`, `update`,
  `generate-enrollment-key`) siguen el patrón: `'use server'`, instancian el repositorio vía su
  `static create()` (no hay `DependencyFactory` de por medio para repos TypeORM planos — ese factory sólo
  se usa para selección de adaptador según entorno local/cloud, que aquí no aplica).
- **Migraciones**: sólo existen 2 (`1783063705557-schema.ts` baseline, `1786506042497-AddImageAndEstablishmentLogo.ts`
  la más reciente). Esta sería la **tercera**, generada con `pnpm run migration:generate` tras registrar la
  nueva entidad ORM en `src/configuration/databases/typeorm/config/config.ts` (registro manual, TypeORM no
  autodescubre).

**Conclusión**: no hay nada que reutilizar 1:1 (`Address` no aplica por ser 1:1, `Image` no aplica por ser
polimórfica), pero ambas dejan un patrón claro a combinar: **una entidad nueva, propia de este contexto,
en relación 1:many real (FK) con `Establishment`, con un enum discriminador de tipo, reglas de colección
en el use-case, y un índice único parcial en Postgres como respaldo** para los tipos que deben ser únicos.

## Decisiones de diseño propuestas (pendientes de confirmar con el usuario)

Estas son las únicas preguntas de negocio genuinamente abiertas; el resto del diseño se deriva directo de
las convenciones ya existentes en el código:

1. **Dueño del dato: `Establishment`, no `BranchOffice`.** El slogan, redes sociales y sitio web son
   identidad de marca de todo el negocio (igual que `name`/`logoUrl`, que ya viven en `Establishment`), no
   por sucursal. Riesgo aceptado: si en el futuro una sucursal necesita su propio Facebook o teléfono
   distinto al general, este modelo no lo soporta sin una fase 2 (agregar el mismo mecanismo a
   `BranchOffice`, ya sabiendo que el patrón funciona). **Se propone dejarlo así para esta iteración.**
2. **Catálogo inicial del enum `EstablishmentDetailTypeEnum`**: `PHONE_NUMBER`, `WHATSAPP`, `EMAIL`,
   `WEBSITE`, `FACEBOOK`, `INSTAGRAM`, `TIKTOK`, `SLOGAN`. Fácil de ampliar después (agregar un valor al
   enum + migración), no requiere cambios estructurales.
3. **Cardinalidad por tipo**: `PHONE_NUMBER` y `WHATSAPP` admiten **múltiples** filas (como pidió el
   usuario); el resto (`EMAIL`, `WEBSITE`, `FACEBOOK`, `INSTAGRAM`, `TIKTOK`, `SLOGAN`) se tratan como
   **como máximo una fila activa por establecimiento** — reforzado con índice único parcial en Postgres
   (mismo mecanismo que usa `Image` para "una sola imagen primaria"). Si el usuario efectivamente quiere,
   por ejemplo, dos cuentas de Instagram, hay que decírmelo antes de la Fase 2 (cambia el índice).
4. **Validación de formato del `value`**: se propone **validación liviana**, no estricta — `EMAIL` valida
   forma de correo, `PHONE_NUMBER`/`WHATSAPP` sólo dígitos/espacios/guiones/`+` (7–20 caracteres), el resto
   (`WEBSITE`, `FACEBOOK`, `INSTAGRAM`, `TIKTOK`) acepta tanto una URL completa como un texto libre (ej.
   `"Papelería y Novedades La Bonita"`, tal como está hoy hardcodeado), `SLOGAN` sólo largo máximo (150
   caracteres). No se fuerza `https://` porque el dato hoy en producción (nombre de página de Facebook) no
   es una URL.
5. **Espacio físico en el ticket (58mm térmico)**: hoy el ticket sólo tiene espacio para 2 teléfonos + 1
   línea de Facebook. Con una lista abierta, alguien podría cargar 5 teléfonos y romper el layout. Se
   propone: en el ticket, unir todos los `PHONE_NUMBER`/`WHATSAPP` en una sola línea separados por coma
   (igual que hoy), y mostrar como máximo **una línea por cada tipo singleton presente** (si no hay dato de
   ese tipo, la línea simplemente no se imprime — a diferencia de hoy que siempre imprime algo). No se
   trunca ni se limita cuántos tipos puede cargar el usuario en la pantalla de configuración, sólo se
   asume uso razonable (esto es consistente con que hoy nada impide tampoco un nombre de Facebook
   kilométrico).

## Impacto Arquitectural

### Backend (dominio / aplicación / infraestructura)

- **Nuevo sub-entity** `establishment-management/establishment-detail/`, hermano de `establishment/`,
  `branch-office/` y `address/` dentro del mismo bounded context (mismo criterio que ya usa el proyecto:
  sub-entidades relacionadas viven como carpetas hermanas dentro del contexto, cada una con sus 4 capas).
- **`EstablishmentDetailEntity`** (dominio): constructor privado + `create()`/`reconstitute()`, sin
  setters públicos. Campos: `establishmentDetailId`, `establishmentId`, `type
  (EstablishmentDetailTypeEnum)`, `value (EstablishmentDetailValueVO)`, `sortOrder (number)`, `createdAt`,
  `updatedAt`, `deletedAt`. Sin lógica de "sólo uno por tipo" dentro de la entidad (esa regla involucra
  otras filas — vive en el use-case, mismo criterio documentado explícitamente en `ImageEntity`).
- **`EstablishmentDetailTypeEnum`** (`domain/enums/establishment-detail-type.enum.ts`) — catálogo de la
  sección anterior.
- **`EstablishmentDetailValueVO`** (`domain/values-objects/`) — un solo VO genérico (no uno por tipo,
  para no multiplicar clases); valida en `create(type, rawValue)` según el `type` recibido (switch interno),
  siguiendo el mismo estilo de `EstablishmentNameVO` (throw de excepción de dominio dedicada si es inválido).
- **Excepciones nuevas** (`domain/exceptions/`): `InvalidEstablishmentDetailValueException`,
  `EstablishmentDetailNotFoundException`, `DuplicateEstablishmentDetailTypeException` (para el intento de
  agregar un segundo registro de un tipo singleton).
- **`EstablishmentDetailRepository`** (interfaz, `domain/repositories/`): `save`, `findById`,
  `findAllByEstablishmentId(establishmentId)`, `findByEstablishmentIdAndType(establishmentId, type)` (usado
  por el use-case para chequear duplicados de tipos singleton antes de insertar), `delete(id)`.
- **`TypeOrmEstablishmentDetailRepository`** (`infraestruture/persistence/typeorm/repositories/`), con
  `static create()` (mismo patrón que `TypeOrmEstablishmentRepository`), y su mapper ORM↔dominio
  (`establishment-detail.mapper.ts`).
- **`EstablishmentDetailOrmEntity`** (`infraestruture/persistence/typeorm/entities/`): `@ManyToOne(() =>
  EstablishmentOrmEntity, e => e.details, { onDelete: 'CASCADE' }) @JoinColumn({ name: 'establishment_id'
  })`. Se agrega el lado inverso `@OneToMany(() => EstablishmentDetailOrmEntity, d => d.establishment)
  details` en `EstablishmentOrmEntity`. Índice compuesto `(establishment_id, type)` para listar rápido, e
  **índice único parcial** `establishment_id, type WHERE type NOT IN ('PHONE_NUMBER','WHATSAPP') AND
  deleted_at IS NULL` para reforzar la regla de "máximo uno" de los tipos singleton a nivel de base de
  datos (mismo mecanismo que `IDX_image_primary_per_owner` en `image.orm-entity.ts`).
- **Use-cases** (`application/use-cases/`):
  - `AddEstablishmentDetailUseCase` — valida (vía el repositorio) que si `type` es singleton no exista ya
    uno activo para ese `establishmentId`; si existe, lanza `DuplicateEstablishmentDetailTypeException`
    (el frontend, en ese caso, debe ofrecer "editar" en vez de "agregar" — ver Frontend).
  - `UpdateEstablishmentDetailUseCase` — actualiza `value`/`sortOrder` de un registro existente.
  - `DeleteEstablishmentDetailUseCase` — soft delete (`deletedAt`), igual que el resto del proyecto.
  - No se crea un "list" use-case aparte: se agrega la relación `details` a
    `FindEstablishmentByIdUseCase` (vía el repositorio existente, ampliando el `relations` que ya usa
    `TypeOrmEstablishmentRepository.findById`), porque la pantalla de configuración ya carga el
    establecimiento completo con ese use-case.
- **DTOs y mapper de aplicación**: `EstablishmentDetailResponseDto` nuevo; `EstablishmentResponseDto` y el
  mapper `application/mappers/establishment.mapper.ts` se amplían para incluir `details:
  EstablishmentDetailResponseDto[]`. Mismo criterio en el mapper de infraestructura
  (`infraestruture/.../mappers/establishment.mapper.ts`) para el lado ORM↔dominio.
- **Ruta del ticket**: `TypeormSaleRepository.findSaleTicketById()` amplía su `relations` a
  `branchOffice: { address: true, establishment: { details: true } }`.
- **Server Actions** (`presentation/actions/`, todas `'use server'`): `add-establishment-detail.action.ts`,
  `update-establishment-detail.action.ts`, `delete-establishment-detail.action.ts`. Cada una instancia
  `TypeOrmEstablishmentDetailRepository.create()`, arma el use-case y llama `revalidatePath('/configurations/establishment')`
  al terminar (mismo patrón que las Server Actions de `establishment` existentes).
- **Registro en `config.ts`**: agregar `EstablishmentDetailOrmEntity` al arreglo `entities`.

### Frontend (presentación)

- **`IEstablishmentDetail.ts`** (`presentation/interfaces/`) — espejo del DTO. `IEstablishment.ts` gana un
  campo `details: IEstablishmentDetail[]`.
- **`EstablishmentContactInfo.tsx`** (nuevo, `establishment-detail/presentation/ui/` o dentro de
  `establishment/presentation/ui/` junto a `WorkspaceInformation.tsx` — a decidir en Fase de implementación
  según si se prefiere mantenerlo dentro del sub-contexto nuevo o junto a la UI que ya consume
  `IEstablishment`): sección nueva en `/configurations/establishment`, debajo de `WorkspaceInformation` y
  antes de `BranchesInEstablishment`. Agrupa visualmente por tipo (bloque "Teléfonos" con lista + botón
  "Agregar otro", y un bloque "Redes y sitio web" con una fila fija por tipo singleton: si ya existe,
  muestra el valor + botón editar/eliminar; si no existe, muestra botón "Agregar"). Reutiliza `Badge`,
  `Button`, `ButtonOutLine`, `PrimaryTable` — mismos componentes que ya usa el resto de la página, sin
  introducir componentes de UI genéricos nuevos.
- **`EstablishmentDetailFormModal.tsx`** (nuevo) — modal de alta/edición, mismo patrón que
  `EstablishmentUpdateModal.tsx` (`TemplateModal` + `react-hook-form`): `<select>` de `type` (deshabilitado
  en modo edición, ya que cambiar el tipo de un registro existente no tiene sentido de negocio) +
  `TextInput` de `value` con placeholder dinámico según el tipo elegido (ej. "741-107-3337" para
  `PHONE_NUMBER`, "https://miempresa.com" para `WEBSITE`).
- **`useEstablishmentDetailForm.ts`** (hook, mismo patrón que `useEstablishmentUpdate.ts`) — maneja
  create/update, invoca la Server Action correspondiente, refresca estado local.
- **Store de UI**: se amplía `establishment-ui.store.ts` (o se crea uno hermano
  `establishment-detail-ui.store.ts` si `establishment-ui.store.ts` ya está acoplado 1:1 al modal de
  `name`/`logo`) para controlar apertura/cierre del nuevo modal y qué registro se está editando.
- **`Ticket58Document.tsx`**: se reemplazan las líneas 234-236 (`TEL-1/TEL-2` y `FACEBOOK` hardcodeados) y
  la línea 168 comentada (slogan) por lectura de `sale.branchOffice?.establishment?.details`:
  - Slogan (si existe un `SLOGAN` activo) se imprime bajo el encabezado, reemplazando el comentario.
  - Los `PHONE_NUMBER`/`WHATSAPP` se listan unidos por coma en la línea de "contacto" (si no hay ninguno,
    la línea no se imprime).
  - Cada tipo singleton presente (`FACEBOOK`, `INSTAGRAM`, `TIKTOK`, `WEBSITE`, `EMAIL`) imprime su propia
    línea corta (`FACEBOOK: ...`, `INSTAGRAM: ...`, etc.), sólo si tiene dato cargado.
  - Se necesita una función pura pequeña, p. ej. `getEstablishmentDetailsByType(details, type)`, colocada
    junto al componente o en `establishment-detail/presentation/` como utilidad compartida (el ticket es
    cliente de `image-management`/`establishment-management` vía props ya resueltas server-side, no necesita
    Server Actions propias).

### Base de datos

- **Nueva tabla** `establishment_detail`: `establishment_detail_id (PK, bigint)`, `establishment_id (FK →
  establishment, ON DELETE CASCADE)`, `type (enum establishment_detail_type_enum)`, `value (varchar 250)`,
  `sort_order (int, default 0)`, `created_at`, `updated_at`, `deleted_at`.
- **Índice compuesto** `(establishment_id, type)` para listar/filtrar por tipo.
- **Índice único parcial** sobre `(establishment_id, type)` con `WHERE type NOT IN ('PHONE_NUMBER',
  'WHATSAPP') AND deleted_at IS NULL`, para blindar a nivel de Postgres la regla de "un solo activo" en los
  tipos singleton (mismo mecanismo ya usado por `IDX_image_primary_per_owner`).
- **Migración #3** del proyecto (`pnpm run migration:generate AddEstablishmentDetail`), tras registrar
  `EstablishmentDetailOrmEntity` en `config.ts`.

## Plan de Implementación

### Fase 0 — Preparación
1. Confirmar con el usuario las 5 decisiones de diseño listadas arriba (dueño = `Establishment`, catálogo
   inicial del enum, cardinalidad por tipo, nivel de validación del `value`, regla de layout del ticket).
2. Definir el nombre final de carpeta/entidad (`establishment-detail` se usa en este documento como
   nombre de trabajo).

### Fase 1 — Backend: dominio de `establishment-detail`
1. `EstablishmentDetailTypeEnum`.
2. `EstablishmentDetailValueVO` (validación por tipo) + excepción `InvalidEstablishmentDetailValueException`.
3. `EstablishmentDetailEntity` (`create()`/`reconstitute()`, getters, sin setters públicos).
4. `EstablishmentDetailNotFoundException`, `DuplicateEstablishmentDetailTypeException`.
5. `EstablishmentDetailRepository` (interfaz).

### Fase 2 — Backend: persistencia
1. `EstablishmentDetailOrmEntity` + relación inversa `details` en `EstablishmentOrmEntity`.
2. Registrar la nueva entidad ORM en `config.ts`.
3. `pnpm run migration:generate AddEstablishmentDetail` → revisar el SQL generado (tabla, enum, FKs,
   índices) antes de aplicar.
4. `pnpm run migration:run` contra la base local.
5. `TypeOrmEstablishmentDetailRepository` + mapper ORM↔dominio.
6. Ampliar `TypeOrmEstablishmentRepository.findById` (y cualquier otro `find` de establecimiento usado en
   pantallas que necesiten mostrar estos datos) para incluir `relations: { details: true }`.
7. Ampliar `TypeormSaleRepository.findSaleTicketById` para incluir `establishment: { details: true }`.

### Fase 3 — Backend: use-cases, DTOs, mappers y Server Actions
1. `AddEstablishmentDetailUseCase`, `UpdateEstablishmentDetailUseCase`, `DeleteEstablishmentDetailUseCase`.
2. `EstablishmentDetailResponseDto` + mapper de aplicación.
3. Ampliar `EstablishmentResponseDto`/mapper de `establishment` para incluir `details`.
4. `IEstablishmentDetail.ts`, ampliar `IEstablishment.ts`, `IBranchOffice.ts`/`ISale.ts` si hace falta
   propagar el tipo hasta el ticket.
5. Server Actions: `add-establishment-detail.action.ts`, `update-establishment-detail.action.ts`,
   `delete-establishment-detail.action.ts`.

### Fase 4 — Frontend: gestión en `/configurations/establishment`
1. `EstablishmentDetailFormModal.tsx` + hook `useEstablishmentDetailForm.ts`.
2. Store de UI (ampliar `establishment-ui.store.ts` o crear uno hermano).
3. `EstablishmentContactInfo.tsx` (listado agrupado + botones agregar/editar/eliminar), insertado en
   `configurations/establishment/page.tsx`.

### Fase 5 — Frontend: ticket
1. Utilidad `getEstablishmentDetailsByType`.
2. Modificar `Ticket58Document.tsx`: slogan bajo encabezado, teléfonos unidos por coma, una línea por tipo
   singleton presente, sin líneas vacías cuando no hay dato.
3. Confirmar si `TicketCloseCashSession58Document.tsx` (ticket de cierre de caja, interno) también debe
   llevar esta info — por defecto **no**, es un documento operativo, no para el cliente (confirmar con el
   usuario si se requiere de todas formas).

### Fase 6 — Verificación
1. Test unitario de `EstablishmentDetailValueVO` (casos válidos/inválidos por tipo) y de
   `AddEstablishmentDetailUseCase` (rechazo de duplicado en tipo singleton).
2. `tsc --noEmit` sin errores nuevos en los archivos tocados.
3. Verificación end-to-end contra base local: agregar 2 teléfonos + Facebook + slogan desde la UI,
   confirmar que aparecen en el ticket de una venta nueva con el layout esperado.
4. Verificación visual en navegador (`pnpm run dev`) de alta/edición/borrado en `/configurations/establishment`.

## Fuera de alcance en esta iteración

- Datos de contacto **por sucursal** (sólo existe a nivel de establecimiento completo).
- Validación estricta de formato de URLs/handles de redes sociales (se admite texto libre, ver decisión 4).
- Mostrar estos datos en el ticket de cierre de caja (`TicketCloseCashSession58Document.tsx`), salvo que el
  usuario lo pida explícitamente.
- Sincronización de estos datos con la plataforma cloud "EDYOF" (no hay indicio de que el patrón dual
  local/cloud de `establishment-management` aplique aquí; son datos puramente de presentación/impresión).
- Íconos/logos por red social distintos al ícono genérico de `react-icons` — no se solicitó diseño de marca.

## Riesgos y decisiones abiertas

- **Regla de "máximo uno" para tipos no-teléfono**: si el negocio llegara a necesitar, por ejemplo, dos
  cuentas de Instagram (una por línea de producto), el índice único parcial lo bloquearía — hay que
  confirmarlo antes de generar la migración (decisión 3).
- **Nombre final de la carpeta/entidad**: se usó `establishment-detail` como nombre de trabajo por ser el
  más cercano a "datos extra" del pedido original; alternativas descartadas por menos claras:
  `establishment-contact` (excluye al slogan, que no es un "contacto"), `establishment-extra-info` (más
  largo, menos preciso).
- **Ubicación de `EstablishmentContactInfo.tsx`**: dentro de `establishment-detail/presentation/ui/` (junto
  a su propio contexto) vs. dentro de `establishment/presentation/ui/` (junto a `WorkspaceInformation.tsx`,
  que ya consume `IEstablishment` completo). Se deja como decisión de implementación, no de arquitectura —
  cualquiera de las dos es consistente con el resto del proyecto.
