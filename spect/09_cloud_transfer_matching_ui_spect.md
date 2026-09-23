# Traspaso a la nube — UI de matching/resolución y pantallas de flujo completo

> Elaborado el 2026-09-22. Continúa `spect/08_cloud_transfer_spect.md` (backend, ya implementado). Este
> documento cubre exclusivamente la capa de presentación (`presentation/ui`, `presentation/hooks`,
> `presentation/stores`, rutas de `src/app/(platform)/transfers/*`) construida sobre las 14 (+1, ver
> sección 2) Server Actions ya existentes en
> `src/contexts/inventory-management/cloud-transfer/presentation/actions/`.

## 1. Qué se construyó — resumen de pantallas

| Ruta | Archivo | Propósito |
|---|---|---|
| `/transfers/list` | `src/app/(platform)/transfers/list/page.tsx` | Lista de traspasos entrantes/salientes de la sucursal actual, con refresco manual contra la nube. |
| `/transfers/new` | `src/app/(platform)/transfers/new/page.tsx` | A arma y envía un traspaso multi-producto desde su propio inventario. |
| `/transfers/detail/[cloudTransferId]` | `src/app/(platform)/transfers/detail/[cloudTransferId]/page.tsx` | Detalle + máquina de estados + **tabla de comparación/resolución** (la pieza central). |

`/transfers/list` **ya existía como archivo**, pero contenía código copiado por error de la pantalla de
catálogo de productos (`ProductsPage`, título "Productos", importaba `TableProduct`/`ProductSearch`/etc. de
`product-management`) — no tenía relación alguna con traspasos. `TransfersOptions.tsx` (el menú de
`/transfers`) ya enlazaba a `/transfers/list` con el texto "Lista de traspasos", así que era claramente la
ruta prevista para esta feature y no contenido intencional a preservar. Se sobrescribió por completo; no se
tocó `TransfersOptions.tsx` ni ninguna otra pantalla de `product-management`.

No se tocó el traspaso local (`contexts/inventory-management/transfer/`, `LocalTransferInventoryItemModal`,
`LocalTransferInventoryModal.tsx`) ni ninguna de sus rutas o modales.

## 2. Gaps de backend encontrados — uno corregido, ninguno más grande dejado sin resolver

Instrucción del encargo: corregir solo gaps pequeños y necesarios, marcados claramente; escalar cualquier
cosa más grande en vez de improvisarla. Se encontraron dos, ambos pequeños y mecánicos, ambos corregidos:

### 2.1 `RejectCloudTransferItemUseCase` no tenía Server Action (corregido)

`application/use-cases/reject-cloud-transfer-item.use-case.ts` y su DTO (`application/dtos/
reject-cloud-transfer-item.dto.ts`) ya existían — implementados junto con el resto del backend en
`spect/08`, sección 5.9 — pero **no** estaban en la lista de 14 acciones del contrato (sección 7 de `08`) y
no tenían archivo en `presentation/actions/`. Sin esta acción, la UI de resolución no tiene forma de cerrar
el ciclo de una línea que la sucursal destino decide **no** recibir (mercancía dañada, no corresponde al
pedido, etc.) — y sin eso, `ApproveCloudTransferUseCase` queda permanentemente bloqueado para ese traspaso
(`CloudTransferItemNotResolvedException`, guard de la sección 5.7 de `08`) en cualquier caso real donde una
línea no se pueda ni vincular ni dar de alta como producto nuevo.

**Fix**: se agregó `src/contexts/inventory-management/cloud-transfer/presentation/actions/
reject-cloud-transfer-item.action.ts`, siguiendo exactamente el mismo patrón (try/catch + `handleError`) que
las otras 14 acciones ya existentes. Un archivo nuevo, cero líneas modificadas en use-cases/dominio.

### 2.2 `StartProcessingCloudTransferUseCase` no podía reintentar desde `ERROR` (corregido)

El encargo original pedía explícitamente: *"para `En_Transito` específicamente, un camino de reporte de
error (`errorCloudTransferAction`) con reintento de vuelta vía start-processing"*. Se verificó el código real
(no solo el pseudocódigo de `spect/08`) y se encontró que esto **no podía funcionar tal cual estaba
implementado**:

- `CloudTransferEntity.retryProcessing()` (`ERROR -> IN_TRANSIT`) ya existía en la entidad de dominio
  (`domain/entities/cloud-transfer.entity.ts`), pero **ningún caso de uso ni acción la invocaba nunca**
  (`grep -rn "retryProcessing"` solo encontraba la definición, cero llamadas).
- `StartProcessingCloudTransferUseCase.execute()` llamaba incondicionalmente a
  `header.startProcessing(actingEmployeeId)`, cuyo guard interno (`assertStatusIn([PENDING], ...)`) lanza
  `CloudTransferInvalidStatusTransitionException` si el estado no es `PENDING` — así que volver a invocar
  `startProcessingCloudTransferAction` después de un `errorCloudTransferAction` (estado `ERROR`) habría
  lanzado esa excepción en vez de reintentar.

**Fix** (mínimo, un solo archivo, reutiliza un método de dominio que ya existía y ya estaba diseñado para
esto — no se tocó ningún invariante nuevo): en
`application/use-cases/start-processing-cloud-transfer.use-case.ts`, antes de llamar a
`header.startProcessing(...)`, se agregó:

```ts
if (header.status === CloudTransferStatusEnum.ERROR) {
    header.retryProcessing();
} else {
    header.startProcessing(actingEmployeeId);
}
```

El resto del caso de uso (llamada previa a `cloudTransferApiRepository.startProcessing(...)` y el bucle de
auto-match por barcode después) no cambió — sigue corriendo igual en el camino de reintento, lo cual es
correcto porque las líneas que seguían `PENDING` cuando ocurrió el error siguen necesitando resolución.

**Supuesto no verificable desde este repo**: se asume que el endpoint EDYOF `POST
/cloud-transfers/:id/start-processing` acepta ser llamado de nuevo sobre un traspaso que el servidor tiene en
estado `Error` (el spec de `08` sección 2 solo confirmó los 6 valores de estado, no la matriz de transiciones
válidas del lado servidor). Si la nube rechaza esa segunda llamada, `apiResult.ok` será `false` y la UI ya lo
maneja correctamente (muestra el error, no cambia nada local) — no hay riesgo de estado inconsistente, solo
que el botón "Reintentar procesamiento" no funcionaría hasta que se confirme/ajuste el contrato del lado
EDYOF. Se deja anotado aquí explícitamente en vez de asumirlo silenciosamente.

Ningún otro gap encontrado ameritó tocar código de backend — el resto de la UI se construyó estrictamente
sobre las 14 acciones + interfaces documentadas en `spect/08`.

## 3. Árbol de componentes por pantalla

### 3.1 `/transfers/list`

```
CloudTransfersListPage (server)
└── CloudTransfersList (client)
    ├── FloatMessage
    ├── tabs "Entrantes" / "Saliente" (Button, role=tab)
    ├── Button "Actualizar" (solo en tab Entrantes) → refreshPendingCloudTransfersAction
    ├── Link "Nuevo traspaso" → /transfers/new
    └── PrimaryTable / PTableEmpty
        └── fila por traspaso: id, sucursales cloud, nº items, notas, fecha, CloudTransferStatusBadge,
            Link "Ver" → /transfers/detail/[id]
```

### 3.2 `/transfers/new`

```
NewCloudTransferPage (server)
└── CreateCloudTransferForm (client)
    ├── FloatMessage
    ├── Sección 1: TextInput (toCloudBranchOfficeId, numérico libre) + TextArea (shipmentNotes)
    ├── Sección 2: buscador de producto propio (TextInput + Button)
    │   → resultados (searchCandidateProductsForCloudTransferItemAction, mismo ILIKE que el resto del
    │     catálogo, ver spect/08 sección 5.9)
    │   → al elegir un producto: SelectMenu de lote (product.lots) + SelectMenu de ubicación/stock
    │     (product.inventory.inventoryItems) + cantidad → "Agregar al traspaso"
    ├── Sección 3: carrito (draftItems del store), cantidad editable, quitar línea
    └── Button "Enviar traspaso" → createAndSendCloudTransferAction
```

### 3.3 `/transfers/detail/[cloudTransferId]`

```
CloudTransferDetailPage (server: findCloudTransferByIdAction, o TemplateNotFoundDinamic si no existe)
└── CloudTransferDetail (client)
    ├── FloatMessage
    ├── Cabecera: id, dirección, fecha, CloudTransferStatusBadge, InfoCards (sucursales cloud, notas,
    │   errorMessage si lo hay)
    ├── Avisos condicionales: "guardado local, no enviado" / "líneas sin resolver, no podrás aprobar"
    ├── Botonera de transición de estado (ver tabla sección 4)
    ├── Prompt de motivo (cancelar / reportar error) — TextArea inline, no modal
    └── Si `showResolutionTable` (entrante + En_Transito|Recibida|Aprobada):
        └── CloudTransferItemResolutionCard × N   ← LA PIEZA CENTRAL, ver sección 5
    └── Si no: lista de solo lectura de items (nombre, lote, cantidad, ResolutionStatusBadge si aplica)
```

### 3.4 Piezas de la tabla de resolución

```
CloudTransferItemResolutionCard (uno por item)
├── useCloudTransferItemResolution(item, onResolved) — toda la lógica de matching de ESTE item
├── Columna izquierda: snapshot inmutable que mandó A (InfoCard × 10: barcode, categoría/marca origen,
│   unidad, lote, cantidad, precio compra, proveedor informativo, caducidad, fabricación)
├── Columna derecha, según resolutionStatus:
│   ├── Pending → aviso amarillo explicando la ausencia de match + 3 acciones (buscar/vincular, producto
│   │   nuevo, rechazar)
│   ├── Matched/NewProduct → detalle del producto local ya vinculado (fetch on-demand vía
│   │   findAllProductByIdAction) + badge "Auto-emparejado por código de barras" o "Vinculado manualmente"
│   └── Rejected → motivo, estilo apagado, de solo lectura
├── ProductRelinkSearchModal (abierto vía cloud-transfer-ui.store: resolutionModal='relink')
│   → búsqueda + BarcodeScannerModal (reutilizado de shared/ui/components/scanner) + selección
│   → resolveCloudTransferItemAsExistingProductAction
└── CategoryMappingModal (resolutionModal='category')
    → elegir categoría local existente O crear una nueva (nombre prellenado con el de origen, editable)
    → mapCloudCategoryToLocalCategoryAction, luego resolveCloudTransferItemAsNewProductAction
```

## 4. Botones de transición de estado — tabla completa implementada en `useCloudTransferDetail`

| Dirección | Estado actual | Botón mostrado | Acción | Guard adicional en UI |
|---|---|---|---|---|
| Entrante | `Pendiente` | Empezar a procesar | `startProcessingCloudTransferAction` | — |
| Entrante | `Error` | Reintentar procesamiento | `startProcessingCloudTransferAction` (ver gap 2.2) | — |
| Entrante | `En_Transito` | Confirmar recepción física | `receiveCloudTransferAction` | Ninguno — se deja disponible aunque falten líneas por resolver, porque `ReceiveCloudTransferUseCase` (código real) no valida resolución de items, solo el estado de la cabecera. Se muestra un `title` aclaratorio en el botón. |
| Entrante | `En_Transito` | Reportar error | `errorCloudTransferAction` (con TextArea de motivo obligatorio) | — |
| Entrante | `Recibida` | Aprobar traspaso | `approveCloudTransferAction` | Deshabilitado + `title` si `hasUnresolvedItems` (evita el viaje redondo para recibir `CloudTransferItemNotResolvedException`, aunque el backend igual lo validaría) |
| Saliente | `Pendiente` + sin `remoteCloudTransferId` | Reintentar envío a la nube | `retrySendCloudTransferAction` | — |
| Cualquiera | `Pendiente`\|`En_Transito`\|`Recibida` | Cancelar traspaso | `cancelCloudTransferAction` (con TextArea de motivo opcional) | Deshabilitado si `Aprobada`/`Cancelada`/`Error`, igual que el guard real de `CloudTransferEntity.cancel()` |

La tabla de resolución (`showResolutionTable`) se muestra para traspasos entrantes en `En_Transito`,
`Recibida` y `Aprobada` (en este último caso ya de solo lectura, útil para auditar qué se aprobó).

## 5. UX de la tabla de comparación — decisiones y por qué

Este es el pedido explícito y central de la tarea, así que las decisiones de diseño quedan documentadas con
detalle:

1. **Columna izquierda siempre visible y estática, sin importar el estado de resolución.** El snapshot que
   mandó A (`ICloudTransferItem` sin los campos `matched*`) es un hecho ya ocurrido — viajó por la nube y no
   cambia. Mostrarlo siempre, incluso para items ya resueltos, deja evidencia de "esto es lo que se
   transfirió" sin que el usuario tenga que recordar o volver atrás.

2. **La columna derecha cambia de forma completa según `resolutionStatus`, no solo de color.** Se consideró
   una sola fila de "estado" con un dropdown de acciones, pero se descartó: el caso `Pending` necesita
   explicar *por qué* no hubo match (mensaje contextual: "no trae código de barras" vs "el código no
   coincide con nada de tu catálogo, puede que haya cambiado") antes de pedir una decisión, mientras que
   `Matched`/`NewProduct` necesitan mostrar datos reales del producto local (nombre, categoría, marca, stock
   actual) para que el usuario pueda *verificar* la suposición del sistema, no solo confiar en un badge
   verde. Son necesidades de información distintas, no solo estados de un mismo widget.

3. **Distinción explícita "auto-emparejado por código de barras" vs "vinculado manualmente"**
   (`item.autoMatchedByBarcode`, badge azul vs morado). Esto es lo que pidió el encargo literalmente
   ("surface auto-matched, here's what we assumed" vs "please search"). Sin esta distinción, un usuario
   viendo una línea `Matched` no puede saber si el sistema lo adivinó (y podría estar mal — dos productos
   distintos podrían compartir un barcode reciclado, por ejemplo) o si él mismo ya lo verificó al buscarlo a
   mano. La badge deja claro cuál de los dos escenarios aplica sin que el usuario tenga que ir a revisar
   logs.

4. **El buscador de re-vinculación reutiliza el escáner de código de barras ya existente
   (`BarcodeScannerModal`/`useBarcodeScanner`)**, tal como sugería el punto 7 del encargo. Es precisamente en
   este flujo (barcode cambió entre A y B) donde escanear el producto físico en B es más rápido que teclear
   su nombre — el usuario tiene la caja en la mano.

5. **No se ofrece "cambiar vinculación" para un item ya `Matched`/`NewProduct`/`Rejected`.** Se verificó el
   dominio: `CloudTransferItemEntity` guarda un `assertPending()` privado en `resolveAsExistingProduct()`,
   `resolveAsNewProduct()` y `reject()` — los tres lanzan `CloudTransferItemAlreadyResolvedException` si el
   item no está `Pending`. El propio `spect/08` (sección 3.7) documenta esto como decisión deliberada: "evita
   re-resolver un item ya resuelto sin pasar explícitamente por una acción de deshacer (no incluida en el
   alcance de v1)". La UI respeta esto: una vez resuelto, la columna derecha es de solo lectura. Se documenta
   aquí como limitación conocida (sección 7).

6. **Mapeo de categoría prellena el nombre de origen pero es 100% editable, y el modo "categoría existente"
   es la pestaña por defecto.** Las categorías son establishment-scoped (spect/08 sección 3.6) — el nombre
   que mandó A casi siempre existe ya en B con otro id (o el mismo nombre pero otro criterio), así que
   asumir "categoría existente" primero evita duplicar categorías por descuido; crear una nueva es un paso
   consciente (cambiar de pestaña).

7. **Rechazo de línea es un textarea inline expandible, no un modal aparte.** Es una acción secundaria/rara
   (la línea "normal" se resuelve como existente o nueva) — un modal completo para pedir un motivo de una
   frase se sintió como fricción de más; se prioriza que las dos acciones principales (buscar/vincular,
   producto nuevo) sean las más grandes y visibles.

## 6. Zustand stores

### 6.1 `cloud-transfer-ui.store.ts` (`useCloudTransferUIStore`)

Sigue el mismo patrón que `inventory-item-ui.store.ts` (modal type + loading type + floatMessageState en un
solo store, en vez de `useFloatMessageStore` global):

```ts
{
  listTab: CloudTransferDirectionEnum,               // pestaña activa en /transfers/list
  resolutionModal: 'relink' | 'category' | 'reject' | 'none',
  resolutionItemId: bigint | null,                    // qué item de la tabla de resolución tiene un modal abierto
  cloudTransferLoading: 'listing' | 'refreshing' | 'creating' | 'retrying-send' | 'starting-processing'
                       | 'receiving' | 'approving' | 'cancelling' | 'reporting-error' | 'resolving-item' | 'none',
  floatMessageState: FloatMessageType,
}
```

`resolutionModal`/`resolutionItemId` es un único "slot" de modal abierto compartido por todas las
`CloudTransferItemResolutionCard` de la página (una por línea) — cada card solo renderiza sus propios modales
como abiertos si `resolutionItemId === item.cloudTransferItemId`, así que aunque el estado es global, en la
práctica solo puede haber un modal de resolución abierto a la vez (comportamiento esperado: el usuario
resuelve una línea a la vez).

### 6.2 `cloud-transfer.store.ts` (`useCloudTransferStore`)

```ts
{
  transfers: ICloudTransfer[],           // lista completa (ambas direcciones), filtrada en el hook por listTab
  selectedTransfer: ICloudTransfer | null, // traspaso de la pantalla de detalle actual
  draftItems: DraftCloudTransferItem[],  // carrito de /transfers/new, solo existe en cliente
}

interface DraftCloudTransferItem {
  key: string; // `${productId}-${lotId}-${inventoryItemId}`
  originLocalProductId: bigint;
  originLocalLotId: bigint;
  originLocalInventoryItemId: bigint;
  productName: string;
  productUniversalBarCode: string | null;
  lotNumber: string;
  location: LocationEnum;
  availableQuantity: number;
  quantityToTransfer: number;
}
```

`DraftCloudTransferItem` nunca se envía tal cual — `createAndSendCloudTransferAction` solo recibe
`{originLocalProductId, originLocalLotId, originLocalInventoryItemId, quantityToTransfer}` por item
(`CreateCloudTransferDto`); los demás campos son solo para render del carrito.

## 7. Limitaciones conocidas / seguimientos

- **No hay "deshacer" resolución de item.** Documentado como decisión de v1 en `spect/08` (sección 3.7,
  `CloudTransferItemAlreadyResolvedException`) y respetado por la UI (sección 5.6 arriba). Si el negocio lo
  pide, requiere un nuevo caso de uso de backend (`UndoCloudTransferItemResolutionUseCase` o similar) — fuera
  de alcance de este pase.
- **Resolución de proveedor (`suplier`) no está en el alcance**, igual que documenta `spect/08` sección 9 —
  el lote creado en B siempre queda con `suplierId = null`; `lotSupplierName` del snapshot se muestra solo
  como texto informativo en la columna izquierda de la tabla de comparación.
- **Sin directorio de sucursales en la nube** (`spect/08` sección 8.4): `/transfers/new` pide el
  `toCloudBranchOfficeId` como número libre, con un texto de ayuda explicando la limitación.
- **Reintento de `StartProcessing` desde `Error` no probado contra un servidor EDYOF real** (ver gap 2.2) —
  el fix asume que el endpoint remoto acepta la segunda llamada; si no, el botón simplemente mostrará el
  error de la nube sin romper nada localmente.
- **`CreateCloudTransferForm` pide elegir lote e inventory item por separado** sin validar que ambos
  pertenezcan "juntos" a la misma operación de compra — esto refleja el modelo de datos real
  (`CreateCloudTransferItemDto` pide `originLocalLotId` y `originLocalInventoryItemId` como ids
  independientes, ver `spect/08` sección 5.1) y no una limitación de la UI, pero vale la pena que quien
  pruebe el flujo lo tenga presente: el lote determina qué precio/fecha de compra se snapshotea, el
  inventory item determina de qué ubicación física se descuenta el stock.
- **No se agregó ningún test automatizado** (Jest/Testing Library) para estos componentes — el encargo pidió
  priorizar la construcción del flujo completo y documentar un walkthrough manual (sección 8); dado el
  tiempo disponible se priorizó cobertura de pantallas sobre tests de UI. Sería el siguiente paso natural.

## 8. Cómo probar esto manualmente

No hay E2E automatizado; esto es un walkthrough manual, extremo a extremo, en dos sesiones de navegador (o
una ventana normal + una de incógnito) actuando como sucursal A y sucursal B.

### 8.1 Preparación

1. `pnpm run migration:run` si no se ha corrido ya (crea `cloud_transfer`/`cloud_transfer_item`).
2. Necesitas **dos sucursales enroladas en la nube** (cada una con `cloudBranchOfficeId` no nulo) — esto se
   hace en `/transfers/configuration` (`RegisterCloudBranch.tsx`/`RegisterBranchAndEstablishment.tsx`, ya
   existente, no tocado por este pase). Si no las tienes, regístralas ahí primero (requiere que la API EDYOF
   esté corriendo en `http://localhost:3001`, ver `.env`/`URL_EDYOF_PLATFORM_API`). Anota el
   `cloudBranchOfficeId` de cada una (se muestra en `ConfigInformationCloud.tsx`).
3. **"Actuar como sucursal A" o "sucursal B" en este repo = iniciar sesión con un empleado que pertenezca a
   esa sucursal** (`useAuth`/`useWorkspace`, `src/shared/ui/hooks/auth/useAuth.ts`): el workspace
   (`establishment`/`branchOffice`/`employee`) se deriva del empleado autenticado y se cachea en
   `branchOfficeCookie`/`employeeCookie` — no hay un selector de sucursal aparte. Si solo tienes un usuario,
   crea un segundo empleado asignado a la otra sucursal desde `/configurations/employees`.
4. A necesita al menos un producto con **lote** y **stock en alguna ubicación** (ver `/products`, sección
   "Lotes comprados" e "Inventario" de `LotDetail.tsx`/`InventoryDetail.tsx`) — si no tienes uno, créalo ahí
   primero (no es parte de este pase).

### 8.2 Crear y enviar (actuando como A)

1. Inicia sesión como el empleado de A. Ve a `/transfers/list` → botón "Nuevo traspaso" (o entra directo a
   `/transfers/new`).
2. Ingresa el `cloudBranchOfficeId` de B en "Id de sucursal destino". Escribe una nota de envío opcional.
3. Busca un producto (nombre o código de barras), selecciónalo, elige lote + ubicación de stock + cantidad
   (≤ disponible), "Agregar al traspaso". Repite para 2–3 productos si quieres cubrir varios caminos de
   resolución en el siguiente paso.
4. "Enviar traspaso". Deberías terminar en `/transfers/detail/[id]` con estado `Pendiente` y ver el id remoto
   asignado por la nube. Si ves el aviso amarillo "guardado local, no se pudo enviar", usa "Reintentar envío
   a la nube" (valida el camino `retrySendCloudTransferAction`/`sendError`).
5. Verifica en `/products` que el stock de origen ya bajó (el descuento es inmediato al enviar, sección 5.1
   de `spect/08`).

### 8.3 Procesar y resolver (actuando como B)

1. Cierra sesión, entra como el empleado de B. Ve a `/transfers/list`, pestaña "Entrantes", botón
   "Actualizar" (`refreshPendingCloudTransfersAction`) si el traspaso no aparece todavía. Ábrelo.
2. Estado `Pendiente` → botón "Empezar a procesar". Debería pasar a `En_Transito` y aparecer la tabla de
   resolución con una tarjeta por producto.
3. **Camino 1 — auto-match por barcode**: si uno de los productos que mandaste ya existe en el catálogo de B
   con el mismo `universalBarCode`, esa línea debería llegar directo en `Matched` con la badge "Auto-
   emparejado por código de barras" (esto lo hace el backend en `StartProcessingCloudTransferUseCase`, no la
   UI — solo verifica que se vea correcto).
4. **Camino 2 — re-vinculado manual**: para una línea `Pending` cuyo producto SÍ existe en B pero con otro
   barcode, clic en "Buscar y vincular producto existente", búscalo por nombre (o escanéalo si tienes el
   código físico), selecciónalo. Debería pasar a `Matched` con badge "Vinculado manualmente" y mostrar los
   datos reales del producto de B en la columna derecha.
5. **Camino 3 — producto genuinamente nuevo**: para una línea `Pending` sin equivalente en B, clic en "Es un
   producto nuevo". En el modal, prueba ambos modos: elige una categoría local existente para una línea, y
   para otra usa "Crear categoría nueva" con el nombre prellenado (o cámbialo). Confirma. La línea debería
   pasar a `NewProduct` y, si vas a `/products`, deberías ver el producto nuevo ya en el catálogo de B (sin
   stock todavía — el stock se crea recién en el paso de aprobar).
6. (Opcional) Prueba "Rechazar línea" en alguna para validar el camino 4.
7. Con todas las líneas resueltas (o rechazadas), botón "Confirmar recepción física" → estado `Recibida`.
8. Botón "Aprobar traspaso" (debería estar habilitado solo si no quedan líneas `Pending` — si dejaste alguna
   sin resolver a propósito, verifica que el botón esté deshabilitado con el título explicativo, o que si lo
   fuerzas desde otra pestaña el error `CloudTransferItemNotResolvedException` se muestre limpio en el
   FloatMessage rojo, no como stack trace). Al aprobar, estado pasa a `Aprobada`.
9. **Confirma que el stock realmente subió**: ve a `/products` en B, busca los productos vinculados
   (`Matched`) y el producto nuevo (`NewProduct`) — cada uno debería tener un lote nuevo y stock incrementado
   en la ubicación sugerida por el snapshot (o `almacen` por defecto).

### 8.4 Casos adicionales rápidos

- **Cancelar**: crea otro traspaso de prueba y cancélalo en distintos estados (`Pendiente`, `En_Transito`,
  `Recibida`) desde ambos lados — verifica que el botón desaparece una vez `Aprobada`.
- **Reportar error + reintentar**: en `En_Transito`, usa "Reportar error" con un mensaje, verifica que pasa a
  `Error` y que el mensaje se muestra en la cabecera. Luego usa "Reintentar procesamiento" (mismo botón que
  "Empezar a procesar" pero con label distinto) y confirma que vuelve a `En_Transito` sin perder las líneas
  ya resueltas previamente.

## 9. Verificación técnica realizada

- `npx tsc --noEmit` sobre todo el proyecto: cero errores nuevos atribuibles a los archivos de este pase (se
  comparó contra la baseline de errores preexistentes del repo, todos en módulos `@/features/*` legacy y
  `@nestjs/common` ausente, ninguno relacionado con `cloud-transfer` ni con las 3 rutas nuevas).
- `pnpm run build` (Next.js 16, Webpack, tal como exige `CLAUDE.md`): **compila exitosamente**
  (`✓ Compiled successfully`), las 3 rutas nuevas (`/transfers/list`, `/transfers/new`,
  `/transfers/detail/[cloudTransferId]`) aparecen correctamente en el resumen de rutas como `ƒ` (dinámicas,
  por el uso de `cookies()`/datos por request — igual que el resto de rutas autenticadas del repo).
- **No se corrió el flujo end-to-end contra una base de datos real ni contra un servidor EDYOF real** desde
  este entorno (no hay Postgres ni la API EDYOF corriendo aquí) — el walkthrough de la sección 8 queda para
  que se ejecute manualmente en un entorno con ambos servicios disponibles.
