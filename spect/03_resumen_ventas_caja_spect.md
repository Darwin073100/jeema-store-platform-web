# Análisis Técnico: Resumen de ventas, ganancia y monto invertido en el detalle de caja

> Documento retrospectivo. Igual que `02_rendimiento_producto_spect.md`, describe una feature ya
> **implementada** (backend + frontend) el 2026-08-12, dejando registro de la ingeniería detrás de la
> decisión y de qué se construyó exactamente. Reutiliza deliberadamente el mismo enfoque de costeo que esa
> feature anterior, por eso se referencia varias veces a lo largo de este documento.

## Problema

La página de detalle de sesión de caja (`/cash/session/[cashSessionId]`) sólo mostraba tarjetas de saldo
(Fondo Inicial, Fondo Final, Corte) derivadas de los movimientos de `TransactionEntity` (aperturas,
ingresos/egresos manuales), y una tabla de esos mismos movimientos. No respondía a la pregunta de negocio
del dueño del negocio: de las ventas realizadas durante ese turno de caja, **¿cuánto se vendió, cuánto
costó lo vendido, y cuánta ganancia dejó ese turno?**

## Hallazgos sobre el estado del código (previos a implementar)

- **Fondo Inicial/Final/Corte son 100% cálculo de cliente**, no hay ningún use-case de backend detrás:
  `useCashInformation.ts` itera `cashSessionSelected.transactions` (cargado en Zustand) y reduce en el
  navegador. No existía ningún precedente de agregación de caja en el backend que replicar directamente.
- **`CashSessionEntity` ya tenía la relación `sales`** (getter `get sales()`) y el ORM
  (`CashSessionOrmEntity.sales`, `@OneToMany(() => SaleOrmEntity, sale => sale.cashSession)`) ya estaba
  cableado — sólo no se usaba en el repositorio que alimenta esta página
  (`findCashSessionWitTransactions` no incluye `sales` en `relations`). Un método hermano,
  `findCashSessionTicket`, sí carga `sales` (para el ticket imprimible), pero sin `saleDetails`.
- **`sale.cashSessionId`** (`sale_detail` → `sale` → `cash_session_id`, `nullable: false`) es el FK que
  vincula cada venta a su sesión de caja — es la fuente de verdad para "ventas de este turno".
- **Mismo problema de costeo que `02_rendimiento_producto_spect.md`**: `sale_detail` no guarda costo al
  momento de la venta ni referencia a un lote (`lotId`). No hay forma de saber el costo exacto de lo
  vendido en la sesión; sólo se puede aproximar.
- **`GetProductPerformanceUseCase`** (feature anterior, ver `02_rendimiento_producto_spect.md`) ya resuelve
  ese mismo problema con costo promedio ponderado de `Lot.purchasePrice` por producto — se reutilizó el
  mismo criterio para no introducir un segundo método de costeo en el proyecto.
- **Convención de agregación del proyecto** (confirmada de nuevo en este contexto): ningún repositorio usa
  `SUM()`/`getRawMany()`; el patrón consistente es `find()` trayendo relaciones y sumar en memoria dentro
  del use-case. Se replicó igual aquí.
- **`InventoryItem`/`Inventory` no tienen costo** (`purchasePriceAtStock` existe como VO/DTO pero está sin
  cablear, siempre devuelve `0` — dead code detectado también al investigar la feature anterior). Confirma
  que `Lot.purchasePrice` es la única fuente de costo real disponible en el sistema.

## Decisiones de negocio confirmadas con el usuario

1. **Alcance de "ventas realizadas"**: sólo ventas con `status = COMPLETED` de la sesión de caja (mismo
   filtro que usa `SaleDetailRepository.findAllByProductId` para no contar ventas canceladas/pendientes).
2. **Costo de venta ("monto invertido")**: costo promedio ponderado de `Lot.purchasePrice` por producto
   vendido en la sesión (histórico completo del producto, no acotado a fechas de la sesión) — el usuario
   eligió explícitamente esta opción sobre la alternativa de agregar costeo exacto por venta (snapshot de
   costo en `sale_detail`), por ser la de menor impacto (sin migración de esquema) y consistente con lo ya
   construido en `02_rendimiento_producto_spect.md`.
3. **Ganancia**: `totalVentas - montoInvertido` (ganancia bruta simple del turno, no involucra gastos de
   caja registrados como `TransactionEntity`).

## Impacto arquitectural / Solución implementada

### Backend

- **`CashSessionRepository`**
  (`cash-management/cash-session/domain/repositories/cash-session.repository.ts`) y su implementación
  **`TypeormCashSessionRepository`**: nuevo método `findCashSessionWithSalesDetails(cashSessionId)` — trae
  la sesión con relaciones `employee`, `cashRegister`, `sales: { saleDetails: true }` (a diferencia de
  `findCashSessionTicket`, que carga `sales.salePayments` pero no `saleDetails`, insuficiente para calcular
  costo).
- **`GetCashSessionSalesSummaryUseCase`** (nuevo,
  `cash-management/cash-session/application/use-cases/`): orquesta `CashSessionRepository` y `LotRepository`,
  calcula en memoria:
  - Filtra `cashSession.sales` por `status === SaleStatusEnum.COMPLETED`.
  - `totalSales` = suma de `sale.totalAmount` de esas ventas; `salesCount` = cantidad de ventas.
  - Junta todos los `saleDetails` de esas ventas, obtiene los `productId` únicos vendidos en la sesión.
  - Para cada producto único, llama `LotRepository.findAllByProductId(productId)` (en paralelo con
    `Promise.all`) y calcula `avgUnitCost = totalCost / unitsPurchased` — mismo cálculo exacto que
    `GetProductPerformanceUseCase`, incluyendo que **si el producto no tiene lotes, `avgUnitCost = 0`**
    (ver limitación conocida más abajo).
  - `totalInvested` = Σ(`quantity * avgUnitCost[productId]`) sobre todos los `saleDetails` de la sesión.
  - `profit = totalSales - totalInvested`; `marginPercent = profit / totalSales * 100` (0 si no hubo
    ventas, evita división por cero).
- **`CashSessionSalesSummaryResponseDTO`** (nuevo DTO) y **`ICashSessionSalesSummary`** (nueva interfaz de
  presentación, espejo del DTO) — igual que en la feature anterior, se creó una interfaz separada en vez de
  extender `ICashSession` (que ya se usa en varias pantallas: ticket, lista de movimientos, `CashInfo`) para
  no ampliar su superficie ni forzar cambios en sus mappers.
- **`getCashSessionSalesSummaryAction`** (nueva Server Action, `'use server'` + `unstable_noStore()`),
  mismo patrón que `getProductPerformanceAction`: instancia `TypeormCashSessionRepository` y
  `TypeOrmLotRepository` vía sus factories `static create()`, construye el use-case, lo ejecuta y devuelve
  `null` en error (en vez del wrapper `Result<T, E>` que usa `findCashSessionWithTransactionsAction`, para
  mantener consistencia con el precedente más reciente de `getProductPerformanceAction`).

### Frontend

- **`CashSalesSummary.tsx`** (nuevo,
  `cash-management/cash-session/presentation/ui/close/`): componente de servidor (sin `'use client'`, no
  necesita estado ni interacción) que recibe `summary: ICashSessionSalesSummary | null` y renderiza 3
  tarjetas con el mismo estilo visual que `CashInfo.tsx` (`Badge` + ícono de `react-icons/fc` +
  `numberMoneyFormat`, no el estilo `CardGrid`/`react-icons/tb` de `ProductPerformance.tsx`, por estar en
  la misma sección visual que `CashInfo`):
  - **Ventas del día** (azul, `FcSalesPerformance`).
  - **Monto Invertido** (morado, `FcMoneyTransfer`).
  - **Ganancia/Pérdida** (verde si `profit >= 0`, rojo si no, ícono `FcBullish`/`FcBearish`), mismo criterio
    de color condicional que ya usa `ProductPerformance.tsx` para su tarjeta de ganancia.
  - Si `summary` es `null` (falla la carga), las tarjetas muestran `$0.00` en vez de ocultarse, para no
    romper el layout de la página.
- **`src/app/(platform)/cash/session/[cashSessionId]/page.tsx`**: se agregó la llamada a
  `getCashSessionSalesSummaryAction(BigInt(cashSessionId))` junto a las cargas ya existentes, y se agregó
  `<CashSalesSummary summary={salesSummary} />` inmediatamente después de `<CashInfo />` y antes de la
  tabla de movimientos.

### Base de datos

- **Sin migraciones**: toda la información requerida ya existía en el esquema (`sale.cash_session_id`,
  `sale_detail.product_id`, `lot.product_id`/`purchase_price`). No se registró ninguna entidad ORM nueva en
  `config.ts`.

## Archivos creados

- `src/contexts/cash-management/cash-session/application/dtos/cash-session-sales-summary-response.dto.ts`
- `src/contexts/cash-management/cash-session/application/use-cases/get-cash-session-sales-summary.use-case.ts`
- `src/contexts/cash-management/cash-session/presentation/interfaces/ICashSessionSalesSummary.ts`
- `src/contexts/cash-management/cash-session/presentation/actions/get-cash-session-sales-summary.action.ts`
- `src/contexts/cash-management/cash-session/presentation/ui/close/CashSalesSummary.tsx`

## Archivos modificados

- `src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository.ts`
- `src/contexts/cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository.ts`
- `src/app/(platform)/cash/session/[cashSessionId]/page.tsx`

## Verificación realizada

1. **`tsc --noEmit`**: se comparó el conteo de errores del proyecto antes (`git stash`) y después de los
   cambios — mismo baseline de errores preexistentes (ligados a imports rotos `@/features/...` y al tipo
   `PageProps` de Next.js, ninguno de este cambio); ningún archivo nuevo o modificado por esta feature
   aparece en la salida de `tsc`.
2. **`pnpm run lint` / ESLint directo sobre los archivos tocados**: no se pudo ejecutar — falla con
   `TypeError: Converting circular structure to JSON` al resolver la configuración de ESLint 10, un
   problema **preexistente y no relacionado** con este cambio (mismo tipo de rotura de tooling que se
   documentó para `next lint` en `02_rendimiento_producto_spect.md`).
3. **No se escribió test unitario** para `GetCashSessionSalesSummaryUseCase` (a diferencia de
   `GetProductPerformanceUseCase`, que sí tiene uno en `02_rendimiento_producto_spect.md`) — pendiente.
4. **Verificación visual en navegador**: no se realizó en esta sesión — la ruta está protegida por NextAuth
   y no se levantó `pnpm run dev` contra datos reales. Queda pendiente que el usuario confirme visualmente.

## Fuera de alcance / limitaciones conocidas

- **Costeo exacto por venta (FIFO/lote real)**: mismo límite que en `02_rendimiento_producto_spect.md` — no
  es posible sin agregar un snapshot de costo a `sale_detail` (cambio de esquema no solicitado). La
  "ganancia" y el "monto invertido" mostrados son una aproximación con costo promedio ponderado.
- **Productos vendidos sin ningún lote de compra registrado — pendiente de decisión del usuario**: cuando
  un producto no tiene lotes, `avgUnitCost` cae a `$0`, por lo que esas ventas se cuentan como 100%
  ganancia (costo `$0`), infando artificialmente la "Ganancia" mostrada. Se le presentaron al usuario 3
  opciones (dejarlo igual / excluir esas ventas del cálculo de ganancia y mostrarlas aparte como "ventas
  sin costo registrado" / marcar visualmente que el cálculo está incompleto) — **la conversación quedó
  abierta sin que el usuario eligiera una**, así que el comportamiento actual implementado es el de la
  opción 1 (igual que `GetProductPerformanceUseCase`), no una decisión definitiva.
- **`profit` no descuenta gastos de caja**: la ganancia calculada aquí es `ventas - costo estimado de lo
  vendido`, no resta egresos manuales de la sesión (`TransactionEntity` tipo `EXPENSE`, ya mostrados aparte
  en el "Corte"). No se pidió mezclar ambos cálculos.
- **Rango de fechas**: a diferencia de `ProductPerformance.tsx` (que permite filtrar por rango de fechas),
  aquí no aplica — el "rango" es inherentemente la sesión de caja completa (`startTime`–`endTime`), y el
  costo promedio del producto se calcula con su historial completo de lotes, no acotado a la fecha de la
  sesión (mismo criterio que el resto del cálculo de costo promedio en el proyecto).
