# Traspaso a la nube (cloud_transfer) — arquitectura completa

> Documento de diseño (**la feature NO está construida todavía** — esto es el plano para implementarla).
> Elaborado el 2026-09-21. Feature slug: **`cloud_transfer`**.
>
> **Nota de numeración**: la tarea original que generó este documento pedía archivar el futuro pase de UI
> de matching/resolución (tabla de comparación producto-vs-producto) en `spect/08_..._spect.md`. Ese número
> ya lo ocupa este documento (siguiente disponible tras `07_escaneo_camara_https_lan_spect.md`). El
> siguiente agente que construya esa UI debe archivar su documento como **`spect/09_..._spect.md`**, no `08`.
>
> Esta feature es **aditiva**: el traspaso local de un solo item entre ubicaciones de una misma sucursal
> (`src/contexts/inventory-management/transfer/`, `TransferEntity`, `TransferStatusEnum`, `LocalTransferUseCase`)
> **no se toca, no se modifica, no se reutiliza como base de datos compartida**. El traspaso a la nube vive
> en un agregado completamente nuevo y paralelo.

## 1. Análisis Técnico

### Problema

JEEMA Store Platform necesita mover mercancía de una sucursal A a una sucursal B que puede estar corriendo
en una instalación local completamente distinta (base de datos distinta), conectadas únicamente a través de
una plataforma en la nube ("EDYOF", ya construida, documentada en `http://localhost:3001/api/docs`). A
arma una lista de varios productos (multi-item, a diferencia del `TransferEntity` local que es de un solo
item) y la envía; B la recibe, tiene que decidir para cada producto si hace match con algo que ya tiene en
su catálogo (por `universal_bar_code`) o si es un producto nuevo — y si es nuevo, decidir a qué categoría
local mapearlo (las categorías son *establishment-scoped*, sus ids no son portables entre instalaciones).

### Impacto Arquitectural

- **Backend**: nuevo bounded-context-entity `src/contexts/inventory-management/cloud-transfer/` (4 capas
  completas). Extiende (sin romper) `InventoryRepository`/`InventoryItemRepository`/`LotRepository`/
  `ProductRepository` con métodos `*Transactional` nuevos. Corrige un gap de configuración real
  (`ApiCloudTransferConfigImpl` lee variables de entorno que no existen en `.env.template`).
- **Frontend**: 12 nuevas Server Actions (contrato para una UI futura, fuera de alcance de este documento
  salvo las firmas). Ningún componente visual se diseña aquí.
- **Base de datos**: 2 tablas nuevas (`cloud_transfer`, `cloud_transfer_item`), sin tocar ninguna tabla
  existente. Ambas registradas manualmente en `src/configuration/databases/typeorm/config/config.ts`.

### Propuesta de Solución

Un agregado nuevo `CloudTransferEntity` (cabecera, 1 por traspaso) + `CloudTransferItemEntity` (1 fila por
producto transferido, con snapshot completo + campos de resolución del lado B), con dos puertos de
persistencia (`CloudTransferRepository`/`CloudTransferItemRepository`, locales vía TypeORM) y un puerto HTTP
(`CloudTransferApiRepository`, hacia los 8 endpoints de EDYOF), siguiendo el patrón local+cloud ya usado en
`establishment-management`. Detalle completo en las secciones 2–10.

### Plan de Implementación

Ver sección 10 (checklist ordenado para el implementador backend).

---

## 2. Hechos verificados del repo (no asumidos del resumen de la tarea)

Verificado directamente antes de diseñar, porque la tarea pedía no confiar ciegamente en el resumen:

- **Ortografía real de `transfer/` (el sibling a imitar)**: la carpeta de infraestructura se llama
  `infraestructure/` (con "c", **distinto** del typo `infraestruture` que usa `establishment-management` —
  hay DOS typos distintos conviviendo en el repo, cada contexto tiene el suyo). La carpeta de value objects
  se llama `value-objets/` (falta la "c" de "objects"). Además, a diferencia de `establishment-management`
  y `product-management`, `transfer/infraestructure/` es **plana**: `entities/`, `mappers/`, `repositories/`
  directamente, **sin** el nivel intermedio `persistence/typeorm/...`. Este documento sigue exactamente la
  convención plana de `transfer/`, no la anidada de `establishment-management`.
- **`.env.template`** ya declara `URL_EDYOF_PLATFORM_API=http://localhost:3001` y
  `PREFIX_EDYOF_PLATFORM_API=/api/v1` — **correcto** respecto al servidor real (confirmado, ver más abajo).
  Pero `ApiCloudTransferConfigImpl` (`src/shared/infrastructure/config/api-cloud-transfer.config.ts`) lee
  `URL_JEEMA_TRANSFER_PLATFORM_API` / `PREFIX_JEEMA_TRANSFER_PLATFORM_API` (nombres que **no existen** en
  `.env.template`), con defaults `http://localhost:3001` + `/api` (sin `/v1`). Hoy, en la práctica, cualquier
  llamada a través de esta config apunta a `/api` en vez de `/api/v1` — un bug real, no hipotético. Ver
  decisión en sección 8.
- **`spect/07_escaneo_camara_https_lan_spect.md` ya existe** (no hay que crearlo), y confirma que la
  carpeta `spect/` ya tiene contenido 01–07 — de ahí la corrección de numeración en la nota superior.
- **La API EDYOF de `http://localhost:3001/api/docs` SÍ es alcanzable** desde este entorno. Se descargó su
  spec en `http://localhost:3001/api/docs-json` y se inspeccionó directamente (no se adivinó nada del
  contrato). Hallazgos clave:
  - Los 8 endpoints del flujo existen exactamente como se describió.
  - **No hay ningún `securitySchemes` declarado y ningún endpoint tiene `security` — no requiere token/API
    key hoy.** Confirmado además empíricamente: `GET /api/v1/cloud-transfers/999999` responde `404` con un
    body de error (no `401`).
  - El body de error real que devuelve el servidor (confirmado con una llamada real) es:
    `{"statusCode":404,"message":["No se encontró el traspaso."],"path":"...","error":"Not Found","timestamp":"..."}`
    — esto **coincide exactamente** con la forma de `ErrorEntity` (`src/shared/lib/utils/error.entity.ts`:
    `{error, message, path, statusCode, timestamp}`), así que `handleError()` (la rama
    `error.status && error.data`) lo normaliza sin ningún adaptador adicional.
  - Los `requestBody` de los 8 endpoints están completamente documentados en el spec (schemas exactos, ver
    sección 4.3). El **response body de éxito no tiene schema ni ejemplo** en el spec (NestJS/Swagger no
    documentó las respuestas 200/201 más allá de la descripción) — esto es un hueco real, no un descuido
    mío; queda como pregunta abierta explícita en sección 8.
  - `unitOfMeasure` en `ProductBlockCommand`/`LotBlockCommand` usa exactamente los mismos valores que
    `ForSaleEnum` (`kg, l, m, pc, doc, paquete, caja, set`) — se puede pasar el valor del enum local
    directamente, sin tabla de traducción.
  - `suggestedLocation` en `InventoryBlockCommand` usa exactamente los mismos valores que `LocationEnum`
    local (`venta, almacen, dañado, viajando`) — mismo passthrough directo, sin traducción.
  - Los strings de estado que la API usa en sus descripciones de respuesta son: `Pendiente`, `En_Transito`
    (con guión bajo), `Recibida`, `Aprobada`, `Cancelada`, `Error`. **`En_Transito` con guión bajo es
    distinto del valor local `TransferStatusEnum.IN_TRANSIT = 'En Transito'` (con espacio)** — ver decisión
    de diseño en sección 3.2, es la razón por la que este agregado usa su propio enum de estado en vez de
    reutilizar `TransferStatusEnum`.
  - No existe ningún endpoint para *listar/buscar* sucursales en la nube (solo
    `POST /cloud-branch-offices` y `POST /cloud-branch-offices/all` para *crear*). Esto significa que hoy
    no hay forma de que el operador de A busque/seleccione la sucursal destino B desde un directorio — debe
    conocer su `cloudBranchOfficeId` de antemano (dato compartido fuera de banda, p. ej. por teléfono con la
    otra tienda). Ver pregunta abierta en sección 8.

---

## 3. Modelo de dominio

### 3.1 Ubicación en el árbol de carpetas

Nueva entidad `cloud-transfer`, sibling de `transfer/` dentro de `inventory-management`, siguiendo su
convención plana verificada arriba:

```
src/contexts/inventory-management/cloud-transfer/
├── domain/
│   ├── entities/
│   │   ├── cloud-transfer.entity.ts                  # Agregado raíz (cabecera del traspaso)
│   │   └── cloud-transfer-item.entity.ts              # Entidad hija (1 línea de producto)
│   ├── enums/
│   │   ├── cloud-transfer-status.enum.ts              # Espeja los strings de estado de la API EDYOF
│   │   ├── cloud-transfer-direction.enum.ts           # Saliente/Entrante (ver 3.3)
│   │   └── cloud-transfer-item-resolution-status.enum.ts
│   ├── value-objets/                                  # (typo intencional, igual que transfer/)
│   │   ├── cloud-transfer-shipment-notes.vo.ts         # maxLength 500 (igual que shipmentNotes de la API)
│   │   ├── cloud-transfer-error-message.vo.ts          # maxLength 1000 (igual que errorMessage de la API)
│   │   └── cloud-transfer-item-quantity.vo.ts          # > 0, espeja TransferQuantityRequiredVO
│   ├── exceptions/
│   │   ├── cloud-transfer-not-found.exception.ts
│   │   ├── cloud-transfer-invalid-status-transition.exception.ts
│   │   ├── cloud-transfer-duplicate.exception.ts       # violación de idempotencia local
│   │   ├── cloud-transfer-item-not-found.exception.ts
│   │   ├── cloud-transfer-item-not-resolved.exception.ts  # approve() con items aún PENDING
│   │   ├── cloud-transfer-item-already-resolved.exception.ts
│   │   └── invalid-cloud-transfer.exception.ts         # errores genéricos de VO
│   └── repositories/
│       ├── cloud-transfer.repository.ts                # Puerto local (TypeORM)
│       ├── cloud-transfer-item.repository.ts            # Puerto local (TypeORM), hijo
│       └── cloud-transfer-api.repository.ts             # Puerto HTTP (EDYOF, 8 métodos)
├── application/
│   ├── dtos/
│   │   ├── create-cloud-transfer.dto.ts
│   │   ├── cloud-transfer-response.dto.ts               # DTO de salida hacia acciones/UI
│   │   ├── start-processing-cloud-transfer.dto.ts
│   │   ├── receive-cloud-transfer.dto.ts
│   │   ├── approve-cloud-transfer.dto.ts
│   │   ├── error-cloud-transfer.dto.ts
│   │   ├── cancel-cloud-transfer.dto.ts
│   │   ├── resolve-cloud-transfer-item-as-existing-product.dto.ts
│   │   ├── resolve-cloud-transfer-item-as-new-product.dto.ts
│   │   ├── map-cloud-category-to-local-category.dto.ts
│   │   └── search-candidate-products-for-cloud-transfer-item.dto.ts
│   ├── mappers/
│   │   └── cloud-transfer.mapper.ts                     # Dominio -> IResponse (para acciones)
│   └── use-cases/
│       ├── create-and-send-cloud-transfer.use-case.ts
│       ├── retry-send-cloud-transfer.use-case.ts         # reintento del POST si quedó solo local
│       ├── list-cloud-transfers-for-branch.use-case.ts   # listado local (saliente + entrante)
│       ├── refresh-pending-cloud-transfers.use-case.ts   # GET pending/:toCloudBranchId + upsert local
│       ├── find-cloud-transfer-by-id.use-case.ts
│       ├── refresh-cloud-transfer-from-cloud.use-case.ts # GET :id, resincroniza espejo local
│       ├── start-processing-cloud-transfer.use-case.ts   # incl. auto-match por barcode
│       ├── receive-cloud-transfer.use-case.ts
│       ├── approve-cloud-transfer.use-case.ts            # mutación real de inventario/lote
│       ├── error-cloud-transfer.use-case.ts
│       ├── cancel-cloud-transfer.use-case.ts
│       ├── search-candidate-products-for-cloud-transfer-item.use-case.ts
│       ├── resolve-cloud-transfer-item-as-existing-product.use-case.ts
│       ├── resolve-cloud-transfer-item-as-new-product.use-case.ts
│       └── map-cloud-category-to-local-category.use-case.ts
├── infraestructure/                                      # (typo intencional, igual que transfer/)
│   ├── entities/
│   │   ├── cloud-transfer.orm-entity.ts
│   │   └── cloud-transfer-item.orm-entity.ts
│   ├── mappers/
│   │   ├── cloud-transfer.mapper.ts                      # orm <-> dominio, cabecera
│   │   └── cloud-transfer-item.mapper.ts                 # orm <-> dominio, item
│   ├── repositories/
│   │   ├── typeorm-cloud-transfer.repository.ts
│   │   └── typeorm-cloud-transfer-item.repository.ts
│   └── http/                                              # subcarpeta nueva (transfer/ no tiene análogo;
│       │                                                  # separa claramente lo HTTP de lo TypeORM dentro
│       │                                                  # de la misma infraestructure/ plana)
│       ├── mappers/
│       │   └── cloud-transfer-api.mapper.ts               # dominio/DTO <-> wire shape EDYOF (strings)
│       └── repositories/
│           └── fetch-cloud-transfer.repository.ts         # implementa CloudTransferApiRepository
└── presentation/
    ├── actions/                                           # 12 Server Actions, ver sección 7
    │   ├── create-and-send-cloud-transfer.action.ts
    │   ├── retry-send-cloud-transfer.action.ts
    │   ├── list-cloud-transfers-for-branch.action.ts
    │   ├── refresh-pending-cloud-transfers.action.ts
    │   ├── find-cloud-transfer-by-id.action.ts
    │   ├── start-processing-cloud-transfer.action.ts
    │   ├── receive-cloud-transfer.action.ts
    │   ├── approve-cloud-transfer.action.ts
    │   ├── error-cloud-transfer.action.ts
    │   ├── cancel-cloud-transfer.action.ts
    │   ├── search-candidate-products-for-cloud-transfer-item.action.ts
    │   ├── resolve-cloud-transfer-item-as-existing-product.action.ts
    │   ├── resolve-cloud-transfer-item-as-new-product.action.ts
    │   └── map-cloud-category-to-local-category.action.ts
    └── interfaces/
        ├── ICloudTransfer.ts                              # view-model cliente, cabecera
        └── ICloudTransferItem.ts                           # view-model cliente, item
    # ui/ deliberadamente OMITIDA — ver sección 9, es el alcance de spect/09_..._spect.md
```

### 3.2 `CloudTransferStatusEnum` — por qué es un enum NUEVO, no una extensión de `TransferStatusEnum`

El resumen de la tarea sugería añadir `ERROR='Error'` a `TransferStatusEnum` (el enum del traspaso local de
un solo item) y reutilizarlo. **Se descarta esa ruta** tras verificar el contrato real de la API EDYOF: el
valor que la nube usa para "en tránsito" es literalmente `En_Transito` (guión bajo), mientras que
`TransferStatusEnum.IN_TRANSIT` ya vale `'En Transito'` (espacio) — son strings distintos. Forzar la
reutilización obligaría a una capa de traducción string↔string solo para ese caso, y además acoplaría el
ciclo de vida de dos agregados que son conceptualmente independientes (uno es local/síncrono/un-item, el
otro es una máquina de estados remota/multi-item). Se opta por un enum propio que **espeja exactamente**
los strings que la API devuelve, así el mapeo wire→dominio es un cast directo sin tabla de traducción:

```ts
// src/contexts/inventory-management/cloud-transfer/domain/enums/cloud-transfer-status.enum.ts
export enum CloudTransferStatusEnum {
  PENDING = 'Pendiente',
  IN_TRANSIT = 'En_Transito',
  RECEIVED = 'Recibida',
  APPROVED = 'Aprobada',
  CANCELLED = 'Cancelada',
  ERROR = 'Error',
}
```

`TransferStatusEnum` (el del traspaso local) **no se modifica** — no hay ninguna necesidad real de tocarlo
para esta feature, ya que `CloudTransferEntity` no lo usa ni lo referencia.

```ts
// cloud-transfer-direction.enum.ts
export enum CloudTransferDirectionEnum {
  OUTGOING = 'Saliente', // esta instalación es A (creó y envió el traspaso)
  INCOMING = 'Entrante', // esta instalación es B (lo recibió vía GET pending)
}

// cloud-transfer-item-resolution-status.enum.ts
export enum CloudTransferItemResolutionStatusEnum {
  PENDING = 'Pending',
  MATCHED = 'Matched',
  NEW_PRODUCT = 'NewProduct',
  REJECTED = 'Rejected',
}
```
(Estos 4 valores usan el naming literal que pidió la tarea original — es una excepción deliberada a la
convención "labels en español" del resto del repo, porque es estado interno de resolución de *este* app, no
un label de negocio mostrado tal cual en un enum de dominio como `TransferStatusEnum`; la UI que se
construya en `spect/09` es libre de traducirlo a español para mostrarlo.)

### 3.3 Por qué `fromBranchOfficeId`/`toBranchOfficeId` son ambos nullable

A y B casi nunca comparten la misma base de datos (esa es la razón de ser de la sincronización EDYOF: "sync
a una plataforma cloud separada para enrollment multi-sucursal", CLAUDE.md). Una fila de `cloud_transfer` en
la base de datos de A conoce su propia sucursal local (`fromBranchOfficeId`, FK real) pero **no** conoce el
id local de B (B no existe como fila en la tabla `branch_office` de A) — solo conoce su id opaco de la nube
(`toCloudBranchOfficeId`). Simétricamente, la fila espejo que B crea al hacer `GET pending` conoce su propio
`toBranchOfficeId` (FK real) pero no un `fromBranchOfficeId` local válido. Por eso el agregado modela las 4
columnas de sucursal así:

| Campo | Tipo | Siempre presente | Es FK local |
|---|---|---|---|
| `fromBranchOfficeId` | `bigint \| null` | Solo si esta instalación es A | Sí (a `branch_office`) |
| `fromCloudBranchOfficeId` | `bigint` | Siempre | No (opaque, precedente `cloud_branch_office_id`) |
| `toBranchOfficeId` | `bigint \| null` | Solo si esta instalación es B | Sí (a `branch_office`) |
| `toCloudBranchOfficeId` | `bigint` | Siempre | No (opaque) |
| `direction` | `CloudTransferDirectionEnum` | Siempre | — |

`direction` se guarda explícito (no derivado en cada query) para poder indexar/filtrar "lo que envié" vs
"lo que recibí" sin tener que inferirlo de qué columna es null.

### 3.4 `CloudTransferEntity` (agregado raíz)

Seguimos el patrón ya usado por `TransferEntity`: constructor privado, factories estáticos, getters, métodos
`updateX()`/verbos de negocio con guardas de invariante (nada de setters públicos crudos).

```ts
// domain/entities/cloud-transfer.entity.ts
export class CloudTransferEntity {
  private readonly _cloudTransferId: bigint;                 // PK local; es el "localTransferId" que se
                                                               // envía a la API (String(_cloudTransferId))
  private _remoteCloudTransferId: bigint | null;              // id asignado por EDYOF, null hasta que el
                                                               // POST inicial tiene éxito
  private _direction: CloudTransferDirectionEnum;
  private _fromBranchOfficeId: bigint | null;
  private _fromCloudBranchOfficeId: bigint;
  private _toBranchOfficeId: bigint | null;
  private _toCloudBranchOfficeId: bigint;
  private _status: CloudTransferStatusEnum;
  private _shipmentNotes: CloudTransferShipmentNotesVO | null;
  private _resolutionNotes: string | null;                    // último notes pasado a receive/approve/cancel
  private _errorMessage: CloudTransferErrorMessageVO | null;
  private _requestedByEmployeeId: bigint | null;               // empleado de A que creó el traspaso
  private _processedByEmployeeId: bigint | null;                // empleado de B que hizo start-processing/receive/approve
  private _lastSyncedAt: Date | null;                          // último GET exitoso desde la nube
  private readonly _createdAt: Date;
  private _updatedAt: Date | null;
  private _items: CloudTransferItemEntity[];

  private constructor(/* ...todos los campos de arriba en orden... */) { /* ... */ }

  // --- Factories ---
  static create(
    fromBranchOfficeId: bigint,
    fromCloudBranchOfficeId: bigint,
    toCloudBranchOfficeId: bigint,
    requestedByEmployeeId: bigint,
    shipmentNotes: string | null,
    items: CloudTransferItemEntity[],
  ): CloudTransferEntity; // direction=OUTGOING, status=PENDING, remoteCloudTransferId=null, toBranchOfficeId=null

  /** Construye/actualiza la fila espejo local a partir de un GET pending o GET :id de la nube. */
  static fromCloudSnapshot(
    remoteCloudTransferId: bigint,
    fromCloudBranchOfficeId: bigint,
    toCloudBranchOfficeId: bigint,
    toBranchOfficeId: bigint,
    status: CloudTransferStatusEnum,
    shipmentNotes: string | null,
    items: CloudTransferItemEntity[],
  ): CloudTransferEntity; // direction=INCOMING

  static reconstitute(/* todos los campos, incluido cloudTransferId real */): CloudTransferEntity;

  // --- Getters: uno por campo, igual que TransferEntity ---

  // --- Verbos de negocio (transiciones de estado; cada uno valida el estado actual y lanza
  //     CloudTransferInvalidStatusTransitionException si la transición no es válida) ---
  markAsCreatedInCloud(remoteCloudTransferId: bigint): void;         // (local) PENDING -> PENDING, solo fija remoteCloudTransferId
  startProcessing(processedByEmployeeId: bigint): void;              // PENDING -> IN_TRANSIT
  receive(processedByEmployeeId: bigint, notes: string | null): void; // IN_TRANSIT -> RECEIVED
  approve(processedByEmployeeId: bigint, notes: string | null): void; // RECEIVED -> APPROVED
  markError(errorMessage: string): void;                             // IN_TRANSIT -> ERROR
  retryProcessing(): void;                                           // ERROR -> IN_TRANSIT
  cancel(reason: string | null): void;                               // PENDING|IN_TRANSIT|RECEIVED -> CANCELLED
                                                                      // (lanza si ya está APPROVED, igual que la API)
  markSynced(): void;                                                // actualiza _lastSyncedAt = new Date()
  addItem(item: CloudTransferItemEntity): void;                      // solo permitido si status === PENDING
}
```

### 3.5 `CloudTransferItemEntity` (hija)

```ts
// domain/entities/cloud-transfer-item.entity.ts
export class CloudTransferItemEntity {
  private readonly _cloudTransferItemId: bigint;
  private _cloudTransferId: bigint;
  private _lineNumber: number;

  // Referencias al origen en A (null cuando esta fila es un espejo recibido en B)
  private _originLocalProductId: bigint | null;
  private _originLocalLotId: bigint | null;
  private _originLocalInventoryItemId: bigint | null;

  // --- Snapshot de producto (ver 3.6 para el porqué de cada campo) ---
  private _productUniversalBarCode: string | null;
  private _productName: string;
  private _productSku: string | null;
  private _productCategoryName: string;
  private _productCategoryDescription: string | null;
  private _productBrandName: string | null;
  private _productDescription: string | null;
  private _productUnitOfMeasure: ForSaleEnum;
  private _productImageUrl: string | null;

  // --- Snapshot de lote ---
  private _lotNumber: string;
  private _lotPurchasePrice: number;
  private _lotPurchaseUnit: ForSaleEnum;
  private _lotTransferredQuantity: CloudTransferItemQuantityVO;
  private _lotExpirationDate: Date | null;
  private _lotManufacturingDate: Date | null;
  private _lotOriginReceivedDate: Date | null;
  private _lotSupplierName: string | null; // informativo únicamente, ver 3.6

  // --- Snapshot de inventario (sugerencias, no obligan a B) ---
  private _inventorySuggestedSalePriceOne: number | null;
  private _inventorySuggestedSalePriceMany: number | null;
  private _inventorySuggestedSaleQuantityMany: number | null;
  private _inventorySuggestedSalePriceSpecial: number | null;
  private _inventoryOriginQuantityOnHand: number | null;
  private _inventorySuggestedLocation: LocationEnum | null;

  // --- Resolución del lado B ---
  private _resolutionStatus: CloudTransferItemResolutionStatusEnum;
  private _matchedLocalProductId: bigint | null;
  private _matchedLocalCategoryId: bigint | null;
  private _matchedLocalInventoryId: bigint | null;
  private _matchedLocalLotId: bigint | null;           // se fija recién en approve()
  private _matchedLocalInventoryItemId: bigint | null;  // se fija recién en approve()
  private _autoMatchedByBarcode: boolean;
  private _rejectionReason: string | null;

  private readonly _createdAt: Date;
  private _updatedAt: Date | null;

  private constructor(/* ... */) { /* ... */ }

  static create(/* snapshot fields + cloudTransferId + lineNumber, sin ids de origen (uso en B) o con ellos (uso en A) */): CloudTransferItemEntity; // resolutionStatus=PENDING
  static reconstitute(/* todos los campos */): CloudTransferItemEntity;

  // --- Verbos de negocio ---
  autoMatchByBarcode(matchedLocalProductId: bigint, matchedLocalInventoryId: bigint | null): void; // resolutionStatus -> MATCHED, autoMatchedByBarcode=true
  resolveAsExistingProduct(matchedLocalProductId: bigint, matchedLocalInventoryId: bigint | null): void; // -> MATCHED, autoMatchedByBarcode=false
  resolveAsNewProduct(matchedLocalProductId: bigint, matchedLocalCategoryId: bigint, matchedLocalInventoryId: bigint): void; // -> NEW_PRODUCT
  reject(reason: string): void; // -> REJECTED
  attachApprovedStock(matchedLocalLotId: bigint, matchedLocalInventoryItemId: bigint): void; // llamado solo dentro de ApproveCloudTransferUseCase

  // --- Getters: uno por campo ---
}
```

### 3.6 Diseño del snapshot — por qué cada campo, y las 2 reglas de negocio que resuelve

Objetivo explícito del negocio: que B, al procesar cada item, tenga **todo** lo necesario sin que falte
ningún id y sin que haya conflicto de ids no portables entre instalaciones.

1. **Match directo por barcode** (`productUniversalBarCode` presente y ya existe en el catálogo de B): B
   solo necesita `productUniversalBarCode` para encontrar el producto (vía
   `ProductRepository.findByEstablishmentAndUniversalBarCode`, ver sección 5.6) y los campos de `lot`/
   `inventory` para crear el lote e incrementar stock. **No** necesita `productCategoryName` ni
   `productBrandName` en este camino — pero se envían siempre igual porque el auto-match puede fallar
   (producto no encontrado) y en ese caso el flujo cae al camino 2 sin tener que volver a pedir datos.
2. **Producto nuevo** (barcode no encontrado, o ausente): B necesita crear un producto local. Como
   `category_id`/`brand_id` de A **no son portables** (categorías son *establishment-scoped*, ver
   `category.orm-entity.ts`: `establishment_id` + índice único compuesto con `name`), el snapshot manda el
   **nombre** de la categoría (`productCategoryName`) y de la marca (`productBrandName`), nunca el id de A.
   La resolución de qué categoría LOCAL de B corresponde a ese nombre es una decisión humana explícita (ver
   sección 5.7, `MapCloudCategoryToLocalCategoryUseCase` / `ResolveCloudTransferItemAsNewProductUseCase`).

Campos que **no** intentan resolución automática y quedan solo como texto informativo, por decisión
deliberada de acotar el alcance a lo que la tarea pidió explícitamente (solo categoría requiere decisión
humana):

- `lotSupplierName`: el lote creado en B siempre tiene `suplierId = null`. Igual que las categorías, los
  proveedores (`suplier`) son *establishment-scoped* y tendrían el mismo problema de portabilidad de ids —
  pero la tarea original **no** pidió una UI de resolución de proveedor, solo de categoría. Resolverlo
  también implicaría una segunda pantalla de mapeo humano no solicitada. Se guarda el nombre solo como dato
  de referencia visible en el detalle del traspaso.
- `productSku`: informativo; B **no** intenta reutilizar el SKU de A (los SKUs son UUIDs generados por
  `RegisterProductUseCase`/`RegisterCompleteProductUseCase` vía `uuid()`, no tienen significado de negocio
  portable).

### 3.7 Excepciones nuevas

Todas extienden `DomainException` (constructor `(message: string, statusCode?: number)`), siguiendo
exactamente el patrón de `transfer-conflict.exception.ts`/`transfer-not-found.exception.ts`:

- `CloudTransferNotFoundException`
- `CloudTransferInvalidStatusTransitionException` — lanzada por los verbos de `CloudTransferEntity` cuando
  se intenta una transición fuera de la máquina de estados (p. ej. `approve()` sobre algo `PENDING`).
- `CloudTransferDuplicateException` — guard de idempotencia local antes de llamar a la API (ver 5.1).
- `CloudTransferItemNotFoundException`
- `CloudTransferItemNotResolvedException` — lanzada por `ApproveCloudTransferUseCase` si queda algún item
  con `resolutionStatus === PENDING`.
- `CloudTransferItemAlreadyResolvedException` — evita re-resolver un item ya `MATCHED`/`NEW_PRODUCT`/
  `REJECTED` sin pasar explícitamente por una acción de "deshacer" (no incluida en el alcance de v1).
- `InvalidCloudTransferException` — errores genéricos de los VO (notas muy largas, cantidad ≤ 0, etc).

---

## 4. Repositorios (puertos de dominio)

### 4.1 `CloudTransferRepository` (local, agregado raíz)

```ts
// domain/repositories/cloud-transfer.repository.ts
export const CLOUD_TRANSFER_REPOSITORY = Symbol('CLOUD_TRANSFER_REPOSITORY');

export interface CloudTransferRepository extends TemplateRepository<CloudTransferEntity> {
  findByRemoteCloudTransferId(remoteCloudTransferId: bigint): Promise<CloudTransferEntity | null>;
  /** Idempotencia local: evita crear dos cabeceras para el mismo envío si el usuario reintenta el submit. */
  findByFromBranchOfficeIdUnsent(fromBranchOfficeId: bigint, shipmentNotesHash?: string): Promise<CloudTransferEntity | null>;
  findAllByBranchOffice(branchOfficeId: bigint, direction?: CloudTransferDirectionEnum): Promise<CloudTransferEntity[]>;
  findAllPendingResolutionByBranchOffice(branchOfficeId: bigint): Promise<CloudTransferEntity[]>;
  /**
   * Variante que participa en `TransactionDBRepository.runInTransaction(...)`. A diferencia de
   * `TypeormTransferRepository.save()` (que NO threadea el manager transaccional, gap ya detectado en el
   * repo), esta implementación debe resolver `transactionDB.getManager().getRepository(...)` DENTRO del
   * cuerpo del método (en cada llamada), no en el constructor — ver nota de corrección en sección 5.5.
   */
  saveTransactional(entity: CloudTransferEntity): Promise<CloudTransferEntity>;
}
```

### 4.2 `CloudTransferItemRepository` (local, hija)

```ts
// domain/repositories/cloud-transfer-item.repository.ts
export const CLOUD_TRANSFER_ITEM_REPOSITORY = Symbol('CLOUD_TRANSFER_ITEM_REPOSITORY');

export interface CloudTransferItemRepository extends TemplateRepository<CloudTransferItemEntity> {
  findAllByCloudTransferId(cloudTransferId: bigint): Promise<CloudTransferItemEntity[]>;
  updateTransactional(entity: CloudTransferItemEntity): Promise<CloudTransferItemEntity>; // misma nota que arriba
}
```

### 4.3 `CloudTransferApiRepository` (HTTP, hacia EDYOF)

Retorna `Promise<Result<T, ErrorEntity>>` — **nunca lanza** — siguiendo `CloudBranchOfficeRepository`. Los
DTO de entrada/salida de cada método usan los nombres EXACTOS de los schemas confirmados en el spec real
(`CreateCloudTransferCommand`, `TransferItemCommand`, `ProductBlockCommand`, `LotBlockCommand`,
`InventoryBlockCommand`, `StartProcessingCloudTransferCommand`, `ReceiveCloudTransferCommand`,
`ApproveCloudTransferCommand`, `ErrorCloudTransferCommand`, `CancelCloudTransferCommand`):

```ts
// domain/repositories/cloud-transfer-api.repository.ts
export interface CloudTransferApiRepository {
  create(dto: CreateCloudTransferHttpDto): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
  findPendingByToCloudBranchId(toCloudBranchId: bigint): Promise<Result<ICloudTransferApiResponse[], ErrorEntity>>;
  findById(remoteCloudTransferId: bigint): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
  startProcessing(remoteCloudTransferId: bigint, actingBranchId: bigint): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
  receive(remoteCloudTransferId: bigint, actingBranchId: bigint, notes?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
  approve(remoteCloudTransferId: bigint, actingBranchId: bigint, notes?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
  reportError(remoteCloudTransferId: bigint, actingBranchId: bigint, errorMessage: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
  cancel(remoteCloudTransferId: bigint, actingBranchId: bigint, reason?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
}
```

`CreateCloudTransferHttpDto` (application/dtos, forma exacta del wire body, confirmada contra
`http://localhost:3001/api/docs-json`):

```ts
interface CreateCloudTransferHttpDto {
  fromCloudBranchId: string;   // bigint como string, igual que el resto de la API EDYOF
  toCloudBranchId: string;
  localTransferId: string;     // = String(cloudTransferId) de nuestra fila local
  shipmentNotes?: string;      // maxLength 500
  items: TransferItemHttpDto[];
}
interface TransferItemHttpDto {
  originLocalProductId: string; // requerido por el schema
  originLocalLotId?: string;
  originLocalInventoryItemId?: string;
  product: {
    universalBarCode?: string;
    name: string;               // requerido
    sku?: string;
    categoryName: string;       // requerido
    categoryDescription?: string;
    brandName?: string;
    description?: string;
    unitOfMeasure: string;      // requerido, valores ForSaleEnum
    imageUrl?: string;
  };
  lot: {
    lotNumber: string;          // requerido
    purchasePrice: string;      // requerido, decimal-como-string
    purchaseUnit: string;       // requerido, valores ForSaleEnum
    transferredQuantity: string;// requerido, decimal-como-string
    expirationDate?: string;
    manufacturingDate?: string;
    originReceivedDate?: string;
    supplierName?: string;
  };
  inventory: {
    suggestedSalePriceOne?: string;
    suggestedSalePriceMany?: string;
    suggestedSaleQuantityMany?: string;
    suggestedSalePriceSpecial?: string;
    originQuantityOnHand?: string;
    suggestedLocation?: string; // valores LocationEnum
  };
}
```

**Pregunta abierta explícita (no adivinada)**: el spec de OpenAPI de EDYOF **no** documenta el schema de
respuesta 200/201 de ninguno de los 8 endpoints (solo la `description` de texto). `ICloudTransferApiResponse`
de abajo es una inferencia razonable por convención (comparado con el shape real que sí se confirmó de
`POST /cloud-establishments`: ids como string, `createdAt`/`updatedAt`/`deletedAt`, arrays anidados) — **el
implementador debe hacer un POST real de prueba contra una instancia EDYOF con sucursales reales antes de
terminar `cloud-transfer-api.mapper.ts`**, y ajustar los nombres de campo si difieren:

```ts
interface ICloudTransferApiResponse {
  cloudTransferId: string;
  fromCloudBranchId: string;
  toCloudBranchId: string;
  localTransferId: string;
  status: string; // uno de CloudTransferStatusEnum
  shipmentNotes: string | null;
  items: Array<{
    cloudTransferItemId: string;
    originLocalProductId: string;
    originLocalLotId: string | null;
    originLocalInventoryItemId: string | null;
    product: { /* eco de ProductBlockCommand */ };
    lot: { /* eco de LotBlockCommand */ };
    inventory: { /* eco de InventoryBlockCommand */ };
  }>;
  createdAt: string;
  updatedAt: string | null;
}
```

---

## 5. Casos de uso

Cada caso de uso recibe sus repositorios por constructor (sin framework de DI), igual que
`LocalTransferUseCase`/`RegisterCloudBranchAndCloudEstablishmentUseCase`.

### 5.1 `CreateAndSendCloudTransferUseCase`

```
constructor(
  cloudTransferRepository: CloudTransferRepository,
  cloudTransferItemRepository: CloudTransferItemRepository,
  cloudTransferApiRepository: CloudTransferApiRepository,
  branchOfficeRepository: BranchOfficeRepository,
  employeeRepository: EmployeeRepository,
  productRepository: ProductRepository,
  categoryRepository: CategoryRepository,
  brandRepository: BrandRepository,
  lotRepository: LotRepository,
  inventoryRepository: InventoryRepository,
  inventoryItemRepository: InventoryItemRepository,
  transactionDB: TransactionDBRepository,
)
execute(dto: CreateCloudTransferDto): Promise<{ transfer: CloudTransferEntity; sendResult: Result<void, ErrorEntity> }>
```

`CreateCloudTransferDto` — **el cliente solo manda ids locales + cantidad**, nunca el contenido del
snapshot (nombre de categoría, marca, etc.) — el use case reconstruye el snapshot leyendo las entidades
reales server-side. Esto evita que un cliente comprometido pueda inyectar datos arbitrarios (p. ej. un
nombre de categoría falso) hacia el catálogo de otra tienda a través de la nube:

```ts
interface CreateCloudTransferDto {
  fromBranchOfficeId: bigint;
  toCloudBranchOfficeId: bigint; // sin directorio de sucursales en la API (ver 8), se captura como input libre
  shipmentNotes: string | null;
  requestedByEmployeeId: bigint;
  items: Array<{
    originLocalProductId: bigint;
    originLocalLotId: bigint;
    originLocalInventoryItemId: bigint;
    quantityToTransfer: number; // puede ser menor al quantityOnHand del inventory_item de origen
  }>;
}
```

Lógica:

1. Verificar que `fromBranchOfficeId` existe y tiene `cloudBranchOfficeId` no nulo (si no, lanzar
   `InvalidCloudTransferException` — la sucursal no está enrolada en la nube, precondición dura).
2. Verificar `requestedByEmployeeId` existe.
3. Por cada item: cargar `Product`/`Category`/`Brand?`/`Lot`/`InventoryItem` reales por sus ids locales y
   construir el snapshot (`CloudTransferItemEntity.create(...)`) — si algún id no existe, lanzar
   `CloudTransferItemNotFoundException` con detalle de cuál.
4. **Descontar** `quantityToTransfer` del `InventoryItem` de origen en A (reutilizando
   `DiscountInventoryItemUseCase`, el mismo que usa `LocalTransferUseCase`) — el stock sale de A
   inmediatamente al enviar, no espera a que B apruebe (igual filosofía que el traspaso local: la
   mercancía físicamente sale de A cuando se despacha, no cuando B confirma).
5. `transactionDB.runInTransaction(async () => { header = CloudTransferEntity.create(...); return
   cloudTransferRepository.saveTransactional(header) })` — inserta cabecera + items localmente primero
   (status `PENDING`, `remoteCloudTransferId = null`), junto con el descuento de stock del paso 4, **en la
   misma transacción** (si el POST a la nube falla después, el descuento de stock ya quedó confirmado
   localmente — es intencional: la mercancía salió físicamente).
6. **Después** de que la transacción anterior confirma (para tener ya el PK autogenerado
   `header.cloudTransferId`, que es el valor que se manda como `localTransferId`), llamar
   `cloudTransferApiRepository.create({ ..., localTransferId: String(header.cloudTransferId) })`.
7. Si `sendResult.ok`: `header.markAsCreatedInCloud(BigInt(sendResult.value.cloudTransferId))`;
   `cloudTransferRepository.save(header)` (update simple, no transaccional, solo fija
   `remoteCloudTransferId`).
8. Si `!sendResult.ok`: el traspaso queda persistido localmente con `remoteCloudTransferId = null` — el
   stock YA se descontó en A. La UI debe mostrar "traspaso guardado, no se pudo enviar a la nube" y ofrecer
   reintentar (`RetrySendCloudTransferUseCase`). El endpoint de creación en EDYOF es idempotente por
   `(fromCloudBranchId, localTransferId)`, así que reintentar con el mismo `cloudTransferId` local es seguro
   aunque el primer intento sí haya llegado al servidor mnos la respuesta se perdió en la red.
9. Retornar `{ transfer: header, sendResult }`.

> Nota de orden invertido respecto al patrón copiado: `RegisterCloudBranchAndCloudEstablishmentUseCase`
> llama primero a la nube y *luego* persiste localmente los ids que la nube devuelve. Aquí es al revés
> porque la clave de idempotencia (`localTransferId`) la define **nuestro propio PK autogenerado**, que
> tiene que existir *antes* de poder llamar a la API. Es una desviación deliberada del patrón copiado, no un
> descuido — documentada aquí explícitamente para que el implementador no la "corrija" sin querer.

### 5.2 `RetrySendCloudTransferUseCase`

Reutiliza los pasos 6–8 de arriba para una cabecera existente con `status === PENDING` y
`remoteCloudTransferId === null`. Sin mutación de stock (ya se hizo en el create original).

### 5.3 `ListCloudTransfersForBranchUseCase` / `FindCloudTransferByIdUseCase`

Lecturas locales simples (`findAllByBranchOffice`/`findById`), sin llamar a la nube.

### 5.4 `RefreshPendingCloudTransfersUseCase` (B ejecuta `GET pending/:toCloudBranchId`)

```
constructor(cloudTransferRepository, cloudTransferItemRepository, cloudTransferApiRepository, branchOfficeRepository)
execute(localBranchOfficeId: bigint): Promise<Result<CloudTransferEntity[], ErrorEntity>>
```

1. Cargar `branch = branchOfficeRepository.findById(localBranchOfficeId)`; requiere `cloudBranchOfficeId`.
2. `result = cloudTransferApiRepository.findPendingByToCloudBranchId(branch.cloudBranchOfficeId)`.
3. Si `!result.ok`, retornar el error tal cual (la UI puede mostrar "sin conexión a la nube, mostrando lo
   último sincronizado" y listar lo que ya hay local).
4. Por cada transferencia remota: buscar espejo local por `findByRemoteCloudTransferId`; si no existe,
   crearlo vía `CloudTransferEntity.fromCloudSnapshot(...)` con `toBranchOfficeId = localBranchOfficeId`; si
   existe, refrescar solo `status`/`items` (upsert) y llamar `markSynced()`.
5. Retornar la lista local actualizada (`findAllByBranchOffice(localBranchOfficeId, INCOMING)`).

### 5.5 `StartProcessingCloudTransferUseCase` — auto-match por barcode

```
constructor(
  cloudTransferRepository, cloudTransferItemRepository, cloudTransferApiRepository,
  productRepository, inventoryRepository, branchOfficeRepository, employeeRepository,
)
execute(localCloudTransferId: bigint, actingEmployeeId: bigint): Promise<Result<CloudTransferEntity, ErrorEntity>>
```

1. Cargar cabecera + items; validar `direction === INCOMING` y `toBranchOfficeId` no nulo.
2. `header.startProcessing(...)` se llama recién DESPUÉS de que la llamada a la nube confirme éxito (ver
   paso 4) — la entidad lanza `CloudTransferInvalidStatusTransitionException` si el estado local ya no es
   `PENDING`, evitando doble-click.
3. Cargar `branch`; requiere `cloudBranchOfficeId`.
4. `result = cloudTransferApiRepository.startProcessing(header.remoteCloudTransferId, branch.cloudBranchOfficeId)`.
   Si falla, retornar el error sin tocar nada local.
5. Si tiene éxito: `header.startProcessing(actingEmployeeId)`; `cloudTransferRepository.save(header)`.
6. **Auto-match por barcode** — por cada item con `resolutionStatus === PENDING` Y
   `productUniversalBarCode` no vacío:
   - `candidate = productRepository.findByEstablishmentAndUniversalBarCode(branch.establishmentId, item.productUniversalBarCode)`.
   - Si hay candidato: buscar su inventario en ESTA sucursal —
     `(await inventoryRepository.findAllByProductId(candidate.productId)).find(inv => inv.branchOfficeId === branch.branchOfficeId)`
     (se reutiliza `findAllByProductId`, ya existente en `InventoryRepository`, filtrando en memoria por
     sucursal — se evita añadir un método nuevo al repo para esto porque el volumen por producto es
     trivial).
   - `item.autoMatchByBarcode(candidate.productId, inventoryMatch?.inventoryId ?? null)`;
     `cloudTransferItemRepository.save(item)`.
   - Si no hay candidato: el item queda `PENDING` — requiere resolución humana (sección 5.7/5.8).
7. Items sin `productUniversalBarCode` quedan siempre `PENDING` — nunca hay auto-match sin barcode
   (invariante explícito del negocio, no hay heurística por nombre).
8. Retornar la cabecera con items actualizados.

> **Corrección importante sobre el patrón `*Transactional` copiado**: en
> `TypeOrmBranchOfficeRepository`, `branchTransactionRepository` se resuelve UNA VEZ en el constructor
> (`this.transactionDB.getManager().getRepository(...)`) — pero en ese momento (cuando la Server Action hace
> `await TypeOrmBranchOfficeRepository.create()`) todavía no se ha entrado a ningún
> `runInTransaction(...)`, así que `getManager()` devuelve el manager global no-transaccional, capturado y
> reutilizado después aunque el código sí entre a una transacción más tarde. Es decir, el "transactional"
> repo de branch-office corre en la práctica sobre una conexión aparte de la transacción activa. Para que
> `CloudTransferRepository.saveTransactional()`, `CloudTransferItemRepository.updateTransactional()` y los
> métodos transaccionales nuevos de `InventoryRepository`/`InventoryItemRepository`/`LotRepository` (sección
> 5.6) sean *realmente* atómicos con la llamada a `approve()` de la nube, cada método `*Transactional` debe
> resolver `this.transactionDB.getManager().getRepository(OrmEntity)` **dentro del cuerpo del método, en
> cada llamada** — no cachear la instancia en el constructor. Esto es una corrección deliberada sobre el
> patrón literal que se pidió copiar, con la razón documentada aquí para que no se "revierta" sin contexto.

### 5.6 `ReceiveCloudTransferUseCase`

Confirmación física, sin mutación de inventario (así lo especifica la API: "inventory NOT yet touched").

```
execute(localCloudTransferId, actingEmployeeId, notes?): Promise<Result<CloudTransferEntity, ErrorEntity>>
```
1. `result = cloudTransferApiRepository.receive(header.remoteCloudTransferId, branch.cloudBranchOfficeId, notes)`.
2. Si éxito: `header.receive(actingEmployeeId, notes)`; guardar.

### 5.7 `ApproveCloudTransferUseCase` — la mutación real de stock

**Decisión de diseño explícita** (la tarea original tenía 3 pistas parcialmente contradictorias sobre
cuándo exactamente se muta inventario — ver razonamiento abajo): la mutación de `lot`/`inventory_item`
ocurre en `approve()`, no en `start-processing` ni en `receive()`. Razonamiento: (a) el endpoint `receive`
dice explícitamente "inventory NOT yet touched" y ocurre *después* de `start-processing`, así que
`start-processing` tampoco pudo haber mutado inventario ya (si no, `receive` no podría decir "todavía no" a
esa altura); (b) el endpoint `approve` se describe como el punto en que "B must have already created/updated
local product/lot/inventory_item records" — la lectura consistente con (a) es que ese "already" describe el
efecto de completar la propia llamada a `approve`, no una precondición de un paso anterior. La creación del
**producto** (catálogo, sin stock) para el caso "producto nuevo" sí ocurre antes, en el momento de
resolución (sección 5.8) — crear una fila de catálogo no es "tocar inventario" y así la UI puede mostrar
inmediatamente a qué producto local quedó mapeado cada item, sin esperar al approve final.

```
constructor(
  cloudTransferRepository, cloudTransferItemRepository, cloudTransferApiRepository,
  branchOfficeRepository, lotRepository, inventoryItemRepository, transactionDB,
)
execute(localCloudTransferId: bigint, actingEmployeeId: bigint, notes?: string): Promise<Result<CloudTransferEntity, ErrorEntity>>
```

1. Cargar cabecera + items; validar `header.status === RECEIVED`.
2. Validar que **ningún** item tenga `resolutionStatus === PENDING` — si lo hay, lanzar
   `CloudTransferItemNotResolvedException` (no se puede aprobar un traspaso con líneas sin decidir).
3. Cargar `branch`.
4. `result = cloudTransferApiRepository.approve(header.remoteCloudTransferId, branch.cloudBranchOfficeId, notes)`.
   Si falla, retornar el error — **nada local se toca todavía** (el patrón dual local+cloud: la nube se
   llama primero).
5. Si tiene éxito, `transactionDB.runInTransaction(async () => { ... })`:
   - Por cada item con `resolutionStatus !== REJECTED` (o sea `MATCHED` o `NEW_PRODUCT`, ambos ya tienen
     `matchedLocalProductId` + `matchedLocalInventoryId` concretos a esta altura):
     - Crear el lote: `LotEntity.create(matchedLocalProductId, null /* suplierId, ver 3.6 */, item.lotNumber,
       item.lotPurchasePrice, item.lotPurchaseUnit, item.lotTransferredQuantity, item.lotExpirationDate,
       item.lotManufacturingDate, item.lotOriginReceivedDate ?? new Date())` →
       `lotRepository.saveTransactional(lot)` (**método nuevo**, ver sección 5.9).
     - Buscar/crear `InventoryItem` en `item.inventorySuggestedLocation ?? LocationEnum.STOCK` para
       `matchedLocalInventoryId` (mismo patrón `findByLocation`-o-crear que usa `LocalTransferUseCase`), y
       sumar `item.lotTransferredQuantity` a `quantityOnHand` →
       `inventoryItemRepository.saveTransactional(inventoryItem)` (**método nuevo**, ver 5.9).
     - `item.attachApprovedStock(lot.lotId, inventoryItem.inventoryItemId)` →
       `cloudTransferItemRepository.updateTransactional(item)`.
   - `header.approve(actingEmployeeId, notes)` → `cloudTransferRepository.saveTransactional(header)`.
   - Retornar `header`.
6. Igual que el TODO ya aceptado en `RegisterCloudBranchAndCloudEstablishmentUseCase`: si el paso 5 falla
   DESPUÉS de que el paso 4 (llamada a la nube) tuvo éxito, no hay compensación automática del lado nube (la
   nube ya quedó en `Aprobada`, terminal). Mismo gap intencionalmente aceptado, no se intenta resolver aquí.

### 5.8 `ErrorCloudTransferUseCase` / `CancelCloudTransferUseCase`

Simétricos a `ReceiveCloudTransferUseCase`: llaman al endpoint correspondiente, y solo si tiene éxito
invocan `header.markError(errorMessage)` / `header.cancel(reason)` y guardan. Sin mutación de inventario
(`cancel` puede darse hasta `RECEIVED`, antes de que exista cualquier stock creado).

### 5.9 Casos de uso de resolución (matching) — el contrato para la UI de `spect/09`

```ts
// SearchCandidateProductsForCloudTransferItemUseCase
constructor(productRepository: ProductRepository)
execute(dto: { establishmentId: bigint; searchText: string }): Promise<ProductEntity[]>
// Reutiliza el mismo método ILIKE que ya usa la búsqueda de productos existente
// (ProductRepository.findAllByEstablishmentAndName), no se crea lógica de búsqueda nueva.
```

```ts
// ResolveCloudTransferItemAsExistingProductUseCase
constructor(cloudTransferItemRepository, productRepository, inventoryRepository)
execute(dto: { cloudTransferItemId: bigint; matchedLocalProductId: bigint }): Promise<CloudTransferItemEntity>
// Verifica que el producto exista y pertenezca al establishment de B; busca (o deja null) su Inventory en
// esta sucursal; item.resolveAsExistingProduct(...); guarda. NO muta stock.
```

```ts
// MapCloudCategoryToLocalCategoryUseCase
constructor(categoryRepository: CategoryRepository)
execute(dto: { establishmentId: bigint; localCategoryId?: bigint; newCategoryName?: string; newCategoryDescription?: string | null })
  : Promise<CategoryEntity>
// Si viene localCategoryId, valida que exista y pertenezca al establishment (mapeo a categoría existente).
// Si viene newCategoryName, crea una CategoryEntity nueva (CategoryEntity.create(...) + categoryRepository.save).
// Devuelve la CategoryEntity resuelta; la UI la usa como input inmediato de ResolveCloudTransferItemAsNewProductUseCase.
```

```ts
// ResolveCloudTransferItemAsNewProductUseCase
constructor(cloudTransferItemRepository, productRepository, categoryRepository, brandRepository, inventoryRepository)
execute(dto: {
  cloudTransferItemId: bigint;
  establishmentId: bigint;
  branchOfficeId: bigint;
  localCategoryId: bigint;       // ya resuelto vía MapCloudCategoryToLocalCategoryUseCase
  localBrandId?: bigint;         // opcional, resuelto por el mismo mecanismo si aplica (fuera de detalle aquí,
                                  // mismo patrón que categoría, se puede omitir en v1 dejando brandId null)
}): Promise<CloudTransferItemEntity>
```
1. Carga el item; toma su snapshot (`productName`, `productUniversalBarCode`, `productSku`,
   `productUnitOfMeasure`, `productDescription`, `productImageUrl`).
2. Crea `Product` + `Inventory` (sin lote, sin `inventory_item`, stock en cero) reutilizando el mismo camino
   que `RegisterCompleteProductUseCase`/`productRepository.saveCompleteProduct` ya usa hoy para crear
   producto+inventario juntos (con `dto.lot = null`, ya que el lote se crea recién en `approve()`, sección
   5.7).
3. `item.resolveAsNewProduct(newProduct.productId, dto.localCategoryId, newInventory.inventoryId)`; guarda.

```ts
// RejectCloudTransferItemUseCase (implícito en el enum, no listado explícitamente en la tarea pero
// necesario para que ApproveCloudTransferUseCase pueda avanzar con líneas que B decide no recibir)
constructor(cloudTransferItemRepository)
execute(dto: { cloudTransferItemId: bigint; reason: string }): Promise<CloudTransferItemEntity>
```

---

## 6. ORM y plan de migración

### 6.1 `CloudTransferOrmEntity`

```ts
// infraestructure/entities/cloud-transfer.orm-entity.ts
@Entity({ name: 'cloud_transfer' })
export class CloudTransferOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'cloud_transfer_id' })
  cloudTransferId: bigint;
  @Column({ type: 'bigint', name: 'remote_cloud_transfer_id', nullable: true, unique: true })
  remoteCloudTransferId: bigint | null;
  @Column({ type: 'enum', enum: CloudTransferDirectionEnum, name: 'direction' })
  direction: CloudTransferDirectionEnum;
  @Column({ type: 'bigint', name: 'from_branch_office_id', nullable: true })
  fromBranchOfficeId: bigint | null;
  @Column({ type: 'bigint', name: 'from_cloud_branch_office_id' })
  fromCloudBranchOfficeId: bigint;
  @Column({ type: 'bigint', name: 'to_branch_office_id', nullable: true })
  toBranchOfficeId: bigint | null;
  @Column({ type: 'bigint', name: 'to_cloud_branch_office_id' })
  toCloudBranchOfficeId: bigint;
  @Column({ type: 'enum', enum: CloudTransferStatusEnum, name: 'status' })
  status: CloudTransferStatusEnum;
  @Column({ type: 'varchar', length: 500, name: 'shipment_notes', nullable: true })
  shipmentNotes: string | null;
  @Column({ type: 'text', name: 'resolution_notes', nullable: true })
  resolutionNotes: string | null;
  @Column({ type: 'varchar', length: 1000, name: 'error_message', nullable: true })
  errorMessage: string | null;
  @Column({ type: 'bigint', name: 'requested_by_employee_id', nullable: true })
  requestedByEmployeeId: bigint | null;
  @Column({ type: 'bigint', name: 'processed_by_employee_id', nullable: true })
  processedByEmployeeId: bigint | null;
  @Column({ type: 'timestamptz', name: 'last_synced_at', nullable: true })
  lastSyncedAt: Date | null;
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;
  // Sin deletedAt: cancelar es un status (CANCELLED), no un soft-delete.

  @ManyToOne(() => BranchOfficeOrmEntity) @JoinColumn({ name: 'from_branch_office_id' })
  fromBranchOffice: BranchOfficeOrmEntity | null;
  @ManyToOne(() => BranchOfficeOrmEntity) @JoinColumn({ name: 'to_branch_office_id' })
  toBranchOffice: BranchOfficeOrmEntity | null;
  @ManyToOne(() => EmployeeOrmEntity) @JoinColumn({ name: 'requested_by_employee_id' })
  requestedByEmployee: EmployeeOrmEntity | null;
  @ManyToOne(() => EmployeeOrmEntity) @JoinColumn({ name: 'processed_by_employee_id' })
  processedByEmployee: EmployeeOrmEntity | null;
  @OneToMany(() => CloudTransferItemOrmEntity, (item) => item.cloudTransfer, { cascade: true })
  items: CloudTransferItemOrmEntity[];
}
```

Índices: `@Index(['fromBranchOfficeId', 'status'])`, `@Index(['toBranchOfficeId', 'status'])`,
`@Index(['direction'])`. `remoteCloudTransferId` ya es `unique: true` (Postgres permite múltiples `NULL` en
una columna única, así que no molesta a las filas aún no enviadas).

### 6.2 `CloudTransferItemOrmEntity`

```ts
// infraestructure/entities/cloud-transfer-item.orm-entity.ts
@Entity({ name: 'cloud_transfer_item' })
@Index(['cloudTransferId'])
@Index(['cloudTransferId', 'resolutionStatus'])
@Index(['productUniversalBarCode'])
export class CloudTransferItemOrmEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', name: 'cloud_transfer_item_id' })
  cloudTransferItemId: bigint;
  @Column({ type: 'bigint', name: 'cloud_transfer_id' })
  cloudTransferId: bigint;
  @Column({ type: 'int', name: 'line_number' })
  lineNumber: number;

  @Column({ type: 'bigint', name: 'origin_local_product_id', nullable: true })
  originLocalProductId: bigint | null;
  @Column({ type: 'bigint', name: 'origin_local_lot_id', nullable: true })
  originLocalLotId: bigint | null;
  @Column({ type: 'bigint', name: 'origin_local_inventory_item_id', nullable: true })
  originLocalInventoryItemId: bigint | null;

  @Column({ type: 'varchar', length: 100, name: 'product_universal_bar_code', nullable: true })
  productUniversalBarCode: string | null;
  @Column({ type: 'varchar', length: 150, name: 'product_name' })
  productName: string;
  @Column({ type: 'varchar', length: 50, name: 'product_sku', nullable: true })
  productSku: string | null;
  @Column({ type: 'varchar', length: 100, name: 'product_category_name' })
  productCategoryName: string;
  @Column({ type: 'text', name: 'product_category_description', nullable: true })
  productCategoryDescription: string | null;
  @Column({ type: 'varchar', length: 100, name: 'product_brand_name', nullable: true })
  productBrandName: string | null;
  @Column({ type: 'text', name: 'product_description', nullable: true })
  productDescription: string | null;
  @Column({ type: 'enum', enum: ForSaleEnum, name: 'product_unit_of_measure' })
  productUnitOfMeasure: ForSaleEnum;
  @Column({ type: 'varchar', length: 255, name: 'product_image_url', nullable: true })
  productImageUrl: string | null;

  @Column({ type: 'varchar', length: 50, name: 'lot_number' })
  lotNumber: string;
  @Column({ type: 'decimal', precision: 12, scale: 4, name: 'lot_purchase_price' })
  lotPurchasePrice: string;
  @Column({ type: 'enum', enum: ForSaleEnum, name: 'lot_purchase_unit' })
  lotPurchaseUnit: ForSaleEnum;
  @Column({ type: 'decimal', precision: 18, scale: 3, name: 'lot_transferred_quantity' })
  lotTransferredQuantity: string;
  @Column({ type: 'date', name: 'lot_expiration_date', nullable: true })
  lotExpirationDate: Date | null;
  @Column({ type: 'date', name: 'lot_manufacturing_date', nullable: true })
  lotManufacturingDate: Date | null;
  @Column({ type: 'date', name: 'lot_origin_received_date', nullable: true })
  lotOriginReceivedDate: Date | null;
  @Column({ type: 'varchar', length: 150, name: 'lot_supplier_name', nullable: true })
  lotSupplierName: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'inventory_suggested_sale_price_one', nullable: true })
  inventorySuggestedSalePriceOne: string | null;
  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'inventory_suggested_sale_price_many', nullable: true })
  inventorySuggestedSalePriceMany: string | null;
  @Column({ type: 'decimal', precision: 18, scale: 4, name: 'inventory_suggested_sale_quantity_many', nullable: true })
  inventorySuggestedSaleQuantityMany: string | null;
  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'inventory_suggested_sale_price_special', nullable: true })
  inventorySuggestedSalePriceSpecial: string | null;
  @Column({ type: 'decimal', precision: 18, scale: 3, name: 'inventory_origin_quantity_on_hand', nullable: true })
  inventoryOriginQuantityOnHand: string | null;
  @Column({ type: 'enum', enum: LocationEnum, name: 'inventory_suggested_location', nullable: true })
  inventorySuggestedLocation: LocationEnum | null;

  @Column({ type: 'enum', enum: CloudTransferItemResolutionStatusEnum, name: 'resolution_status', default: CloudTransferItemResolutionStatusEnum.PENDING })
  resolutionStatus: CloudTransferItemResolutionStatusEnum;
  @Column({ type: 'bigint', name: 'matched_local_product_id', nullable: true })
  matchedLocalProductId: bigint | null;
  @Column({ type: 'bigint', name: 'matched_local_category_id', nullable: true })
  matchedLocalCategoryId: bigint | null;
  @Column({ type: 'bigint', name: 'matched_local_inventory_id', nullable: true })
  matchedLocalInventoryId: bigint | null;
  @Column({ type: 'bigint', name: 'matched_local_lot_id', nullable: true })
  matchedLocalLotId: bigint | null;
  @Column({ type: 'bigint', name: 'matched_local_inventory_item_id', nullable: true })
  matchedLocalInventoryItemId: bigint | null;
  @Column({ type: 'boolean', name: 'auto_matched_by_barcode', default: false })
  autoMatchedByBarcode: boolean;
  @Column({ type: 'text', name: 'rejection_reason', nullable: true })
  rejectionReason: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date | null;

  @ManyToOne(() => CloudTransferOrmEntity, (t) => t.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cloud_transfer_id' })
  cloudTransfer: CloudTransferOrmEntity;
  @ManyToOne(() => ProductOrmEntity) @JoinColumn({ name: 'matched_local_product_id' })
  matchedLocalProduct: ProductOrmEntity | null;
  @ManyToOne(() => CategoryOrmEntity) @JoinColumn({ name: 'matched_local_category_id' })
  matchedLocalCategory: CategoryOrmEntity | null;
  @ManyToOne(() => InventoryOrmEntity) @JoinColumn({ name: 'matched_local_inventory_id' })
  matchedLocalInventory: InventoryOrmEntity | null;
  @ManyToOne(() => LotOrmEntity) @JoinColumn({ name: 'matched_local_lot_id' })
  matchedLocalLot: LotOrmEntity | null;
  @ManyToOne(() => InventoryItemOrmEntity) @JoinColumn({ name: 'matched_local_inventory_item_id' })
  matchedLocalInventoryItem: InventoryItemOrmEntity | null;
}
```

`origin_local_*` y `from_branch_office_id`/`to_branch_office_id`/`from_cloud_branch_office_id`/
`to_cloud_branch_office_id` de la cabecera **no llevan FK** (columnas `bigint` opacas simples), siguiendo
exactamente el precedente de `branch_office.cloud_branch_office_id`/`establishment.cloud_establishment_id`
— son ids que pueden referirse a filas que no existen en ESTA base de datos. Los `matched_local_*` de abajo
**sí llevan FK** porque siempre son ids de la propia base de datos de B (`ON DELETE SET NULL`, para no
bloquear el borrado de un producto/categoría/lote si algún día se permite borrarlos).

### 6.3 Registro en `config.ts`

Agregar a los imports y al array `entities` de
`src/configuration/databases/typeorm/config/config.ts`:

```ts
import { CloudTransferOrmEntity } from 'src/contexts/inventory-management/cloud-transfer/infraestructure/entities/cloud-transfer.orm-entity';
import { CloudTransferItemOrmEntity } from 'src/contexts/inventory-management/cloud-transfer/infraestructure/entities/cloud-transfer-item.orm-entity';
// ...
entities: [
  // ...existentes...
  CloudTransferOrmEntity, CloudTransferItemOrmEntity,
],
```

### 6.4 Comando de migración

Después de crear ambas ORM entities y registrarlas, generar con:

```bash
pnpm run migration:generate src/configuration/databases/typeorm/migrations/CreateCloudTransferTables
```

y revisar el SQL generado contra el detalle de columnas/índices/FKs de 6.1/6.2 antes de correr
`pnpm run migration:run`. **No se escribe el archivo de migración a mano en este documento**, por
instrucción explícita de la tarea.

---

## 7. Server Actions (contrato para backend e implementación futura de UI)

Todas `'use server'`, en `presentation/actions/`, siguiendo el patrón de
`local-transfer.action.ts`/`register-cloud-branch-and-cloud-establishment.action.ts`: construyen
repositorios vía `static create()`, arman el/los caso(s) de uso, envuelven con `handleError`/`Result`, y
usan `cookies()` para extraer `employeeId`/`branchOfficeId` de `employeeCookie`/`branchOfficeCookie` cuando
la acción no los recibe explícitamente como parámetro (igual que `localTransferAction`).

```ts
// create-and-send-cloud-transfer.action.ts
export async function createAndSendCloudTransferAction(
  command: Omit<CreateCloudTransferDto, 'fromBranchOfficeId' | 'requestedByEmployeeId'>
): Promise<{ ok: boolean; value?: ICloudTransfer; sendError?: ErrorEntity; error?: ErrorEntity }>

// retry-send-cloud-transfer.action.ts
export async function retrySendCloudTransferAction(cloudTransferId: bigint)
  : Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }>

// list-cloud-transfers-for-branch.action.ts
export async function listCloudTransfersForBranchAction(direction?: 'Saliente' | 'Entrante')
  : Promise<{ ok: boolean; value?: ICloudTransfer[]; error?: ErrorEntity }>

// refresh-pending-cloud-transfers.action.ts
export async function refreshPendingCloudTransfersAction()
  : Promise<{ ok: boolean; value?: ICloudTransfer[]; error?: ErrorEntity }>

// find-cloud-transfer-by-id.action.ts
export async function findCloudTransferByIdAction(cloudTransferId: bigint)
  : Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }>

// start-processing-cloud-transfer.action.ts
export async function startProcessingCloudTransferAction(cloudTransferId: bigint)
  : Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }>

// receive-cloud-transfer.action.ts
export async function receiveCloudTransferAction(cloudTransferId: bigint, notes?: string)
  : Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }>

// approve-cloud-transfer.action.ts
export async function approveCloudTransferAction(cloudTransferId: bigint, notes?: string)
  : Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }>

// error-cloud-transfer.action.ts
export async function errorCloudTransferAction(cloudTransferId: bigint, errorMessage: string)
  : Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }>

// cancel-cloud-transfer.action.ts
export async function cancelCloudTransferAction(cloudTransferId: bigint, reason?: string)
  : Promise<{ ok: boolean; value?: ICloudTransfer; error?: ErrorEntity }>

// search-candidate-products-for-cloud-transfer-item.action.ts
export async function searchCandidateProductsForCloudTransferItemAction(searchText: string)
  : Promise<{ ok: boolean; value?: IProduct[]; error?: ErrorEntity }>

// resolve-cloud-transfer-item-as-existing-product.action.ts
export async function resolveCloudTransferItemAsExistingProductAction(
  cloudTransferItemId: bigint, matchedLocalProductId: bigint
): Promise<{ ok: boolean; value?: ICloudTransferItem; error?: ErrorEntity }>

// map-cloud-category-to-local-category.action.ts
export async function mapCloudCategoryToLocalCategoryAction(
  dto: { localCategoryId?: bigint; newCategoryName?: string; newCategoryDescription?: string | null }
): Promise<{ ok: boolean; value?: ICategory; error?: ErrorEntity }>

// resolve-cloud-transfer-item-as-new-product.action.ts
export async function resolveCloudTransferItemAsNewProductAction(
  dto: { cloudTransferItemId: bigint; localCategoryId: bigint; localBrandId?: bigint }
): Promise<{ ok: boolean; value?: ICloudTransferItem; error?: ErrorEntity }>
```

`ICloudTransfer`/`ICloudTransferItem` (presentation/interfaces, view-models cliente): espejan 1:1 los
getters de `CloudTransferEntity`/`CloudTransferItemEntity`, mismo estilo que `IBranchOffice`/`ITransfer`.

---

## 8. Decisiones de configuración (env vars, auth)

### 8.1 Variables de entorno — canónicas: `URL_EDYOF_PLATFORM_API` / `PREFIX_EDYOF_PLATFORM_API`

`.env.template` **ya** declara estas dos con los valores correctos (`http://localhost:3001` +
`/api/v1`, confirmado contra el servidor real). El problema está solo en
`src/shared/infrastructure/config/api-cloud-transfer.config.ts`, que lee nombres distintos
(`URL_JEEMA_TRANSFER_PLATFORM_API`/`PREFIX_JEEMA_TRANSFER_PLATFORM_API`) con un default de prefijo
incorrecto (`/api` en vez de `/api/v1`). **Decisión: corregir la clase, no el `.env.template`** (que ya
está bien):

```ts
// src/shared/infrastructure/config/api-cloud-transfer.config.ts — cambio mínimo
const baseApiUrl = process.env.URL_EDYOF_PLATFORM_API || 'http://localhost:3001';
const apiPrefix = process.env.PREFIX_EDYOF_PLATFORM_API || '/api/v1';
```

Esto arregla el bug real de hoy (cualquier llamada existente a través de `ApiCloudTransferConfigImpl`
apunta a `/api` en vez de `/api/v1`) y deja el nombre de la clase (`ApiCloudTransferConfigImpl`) sin tocar
para minimizar el diff — aunque, dado que ahora se usa explícitamente para EDYOF/cloud-transfer, sería
razonable (no bloqueante) renombrarla a `ApiEdyofConfigImpl` en un PR aparte.

### 8.2 `DependencyFactory` en vez de `new ApiCloudTransferConfigImpl()` directo

El patrón copiado (`FetchCloudBranchOffice.create()`) instancia `new FetchHttpClient()` +
`new ApiCloudTransferConfigImpl()` directamente, ignorando `DependencyFactory.getHttpClient()`/
`getApiConfig()` que ya existen exactamente para esto. **Mejora deliberada para el código nuevo**:
`FetchCloudTransferRepository.create()` debe usar `DependencyFactory.getHttpClient()` y
`DependencyFactory.getApiConfig()` en vez de instanciar directo — sin tocar `FetchCloudBranchOffice`
existente (fuera de alcance de esta feature).

### 8.3 Autenticación — pregunta cerrada para v1, abierta para producción

Confirmado contra el spec real (`components.securitySchemes` vacío, ningún endpoint con `security`, y
`GET /cloud-transfers/999999` responde `404` no `401`): **la API EDYOF no requiere token hoy**. Por lo tanto
`FetchCloudTransferRepository` no manda `Authorization` (usa `apiConfig.getAuthenticatedHeaders()` sin
`token` — el método soporta pasar uno igual, así que el día que EDYOF exija auth el único cambio es
inyectarlo, sin refactor de firma).

**Abierto explícitamente para antes de producción**: hoy, cualquiera que alcance el host `:3001` puede
crear/mutar traspasos de cualquier `fromCloudBranchId`/`toCloudBranchId` sin verificación de que quien llama
realmente controla esa sucursal — no hay ninguna guarda del lado servidor visible en el spec. Es un hueco de
seguridad real del lado de EDYOF (fuera del alcance de este repo, que solo consume la API), pero vale
dejarlo anotado para cuando se despliegue fuera de una LAN de confianza.

### 8.4 Directorio de sucursales en la nube — pregunta abierta

No existe ningún endpoint `GET` para listar/buscar sucursales EDYOF (solo `POST` para crearlas). El
operador de A tiene que conocer el `cloudBranchOfficeId` de B de antemano. Para v1 se modela como un campo
de captura libre en `CreateCloudTransferDto.toCloudBranchOfficeId` (número), sin selector/buscador. Si EDYOF
agrega un endpoint de directorio más adelante, `CreateAndSendCloudTransferUseCase` no cambia — solo se
agregaría un nuevo caso de uso de búsqueda del lado de la UI.

---

## 9. Fuera de alcance de este documento

- **La UI real de matching/resolución** (tabla comparativa item-vs-producto-local, buscador con
  re-linkeo, formulario de "crear categoría nueva", árbol de componentes React, estilos) — se documentará
  en **`spect/09_..._spect.md`** (corrección de numeración, ver nota al inicio) por un pase de frontend
  separado, construyendo sobre las Server Actions de la sección 7 y el modelo de datos de la sección 3.
- Compensación/rollback del lado nube si una mutación local falla después de una llamada a la nube exitosa
  (gap aceptado explícitamente, igual que en `RegisterCloudBranchAndCloudEstablishmentUseCase`).
- Resolución humana de **proveedor** (`suplier`) — el lote creado en B siempre queda con `suplierId = null`
  (ver 3.6); si el negocio pide esto más adelante, es una extensión simétrica a la resolución de categoría.
- Un directorio/selector de sucursales en la nube (no existe endpoint hoy, ver 8.4).
- Reintentos automáticos/colas en background para `RetrySendCloudTransferUseCase` — v1 es reintento manual
  disparado por el usuario desde la UI.
- Notificaciones push/tiempo real de "tienes un traspaso pendiente" — B se entera vía `RefreshPending...`
  (poll manual o al entrar a la pantalla), no hay websockets/webhooks en este diseño.
- Auditoría completa de transiciones de estado (solo se guarda `resolutionNotes` con el último valor, no un
  historial línea por línea).

---

## 10. Plan de implementación (orden sugerido para el backend)

1. **Corregir `ApiCloudTransferConfigImpl`** (sección 8.1) — cambio de 2 líneas, sin riesgo, desbloquea
   todo lo demás con la URL correcta.
2. Crear los 3 enums nuevos (`domain/enums/`) y los 3 VOs (`domain/value-objets/`).
3. Crear `CloudTransferItemEntity` y `CloudTransferEntity` (dominio puro, sin dependencias de infra) +
   excepciones (sección 3.7). Escribir tests unitarios de las transiciones de estado antes de seguir (igual
   rigor que se esperaría de `TransferEntity`).
4. Crear `CloudTransferOrmEntity`/`CloudTransferItemOrmEntity`, registrar en `config.ts` (sección 6.3),
   correr `pnpm run migration:generate` y revisar el SQL a mano contra la sección 6.1/6.2 antes de
   `migration:run`.
5. Implementar `TypeormCloudTransferRepository`/`TypeormCloudTransferItemRepository` (con la corrección de
   `*Transactional` de la sección 5.5 — resolver el manager dentro del método, no en el constructor).
6. **Antes de escribir `FetchCloudTransferRepository`**: hacer un `POST /api/v1/cloud-transfers` real de
   prueba contra la instancia EDYOF (con un par de `fromCloudBranchId`/`toCloudBranchId` reales, creados
   previamente vía `POST /cloud-branch-offices`) para confirmar el shape exacto de la respuesta 201 y
   ajustar `ICloudTransferApiResponse`/`cloud-transfer-api.mapper.ts` (sección 4.3, marcado como inferido
   sin confirmar).
7. Implementar `FetchCloudTransferRepository` vía `DependencyFactory` (sección 8.2), con los 8 métodos.
8. Añadir los métodos `*Transactional` nuevos a `InventoryRepository`/`InventoryItemRepository`/
   `LotRepository` (domain port + implementación TypeORM), necesarios solo para `ApproveCloudTransferUseCase`
   (sección 5.7) — mismo patrón de resolución del manager en el cuerpo del método.
9. Implementar los 14 casos de uso en el orden: `CreateAndSendCloudTransferUseCase` →
   `RetrySendCloudTransferUseCase` → lecturas (`List.../Find.../RefreshPending...`) →
   `StartProcessingCloudTransferUseCase` → `ReceiveCloudTransferUseCase` → resolución
   (`SearchCandidateProducts.../ResolveAsExistingProduct.../MapCloudCategoryToLocalCategory.../
   ResolveAsNewProduct...`) → `ApproveCloudTransferUseCase` (el más complejo, dejarlo al final cuando ya
   están probados individualmente el resto de las piezas) → `ErrorCloudTransferUseCase` →
   `CancelCloudTransferUseCase`.
10. Implementar las 14 Server Actions (sección 7), reusando el patrón cookie-based de
    `local-transfer.action.ts` para `employeeId`/`branchOfficeId` donde aplique.
11. Escribir tests de integración bajo `test/contexts/inventory-management/cloud-transfer/...` (mirroring
    la ruta de `src/`, usando `pg-mem` como ya hace el resto del repo) cubriendo al menos: creación +
    idempotencia de reintento, auto-match por barcode exitoso y fallido, ciclo completo
    pending→processing→received→approved con una línea `MATCHED` y una `NEW_PRODUCT`, y el guard de
    `ApproveCloudTransferUseCase` rechazando items `PENDING`.
12. Entregar el contrato de la sección 7 al agente de frontend para `spect/09_..._spect.md`.
