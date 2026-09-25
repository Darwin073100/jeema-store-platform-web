# Análisis Técnico: Ventas a crédito

> Documento prospectivo (plan de implementación, **feature aún no construida**). Elaborado el 2026-09-24
> tras análisis del estado actual de `sale-management`, `sale-payment`, `transaction-management` e
> `inventory-management`. Sirve como especificación para la implementación, delegando tareas por capa a
> los agentes `backend` (`.claude/agents/backend.md`) y `frontend` (`.claude/agents/frontend.md`) según
> `AGENTS.md`.

## Problema

Hoy una venta solo tiene dos destinos finales de cobro: `PENDING` (posponer, sin descuento de inventario,
sin pago) o `COMPLETED` (cobro completo inmediato, con descuento de inventario y `SalePayment` registrado).
No existe forma de dejar una venta **entregada al cliente pero con saldo pendiente** ("fiado"/crédito): el
inventario debe descontarse porque el producto ya salió de la tienda, pero el dinero se recibirá en abonos
posteriores, cada uno con su propio método de pago (efectivo o transferencia) y su propio movimiento de
caja (`Transaction`).

## Hallazgos sobre el estado actual del código

- **`SaleEntity`** (`sale/domain/entities/sale.entity.ts`) no tiene ningún campo de "monto pagado" ni
  "saldo pendiente" — solo `updateStatus(value)` genérico (línea 287) y setters igual de genéricos para
  cada monto. El saldo hoy solo podría derivarse sumando `SalePayment` vs `totalAmount`.
- **`RegisterSalePaymentUseCase`** (`sale-payment/application/use-cases/register-sale-payment.use-case.ts:45`)
  exige `sale.status === COMPLETED` para aceptar cualquier pago — bloquea de raíz un flujo de abonos sobre
  una venta abierta en crédito.
- El mismo use-case **solo crea una `TransactionEntity` si el pago cubre el 100% del total**
  (línea 64-76), y lo hace **hardcodeando `transactionTypeId = BigInt(1)`** — un abono parcial hoy no deja
  ningún rastro en `transaction`.
- **El descuento de inventario solo ocurre si `status === COMPLETED`**
  (`calculate-sale.use-case.ts:96-119`); el guard interno de la línea 98 además solo acepta
  `INITIALIZED | COMPLETED | PENDING`. Cualquier status nuevo debe agregarse explícitamente a ambos
  puntos o el stock nunca se descontará al marcar crédito.
- **`CustomerEntity`** no tiene ningún campo de crédito (sin límite, sin balance). Sí existe ya el flag
  `saleDefault` que marca al cliente "Público en General" — usado como *fallback* cuando no se elige
  cliente explícito (`useSalePayment.ts:138,208`).
- **`PaymentMethodEntity`** solo tiene dos filas sembradas: `Efectivo` (`requiresReference: false`) y
  `Transferencia` (`requiresReference: true`) — sin enum, el frontend las matchea por
  `.toLowerCase() === 'efectivo' | 'transferencia'` (`useSalePayment.ts:40,52`) y están **hardcodeadas en
  el JSX** de `SalePaymentModal.tsx`. No se necesita un tercer método "Crédito": el abono siempre se paga
  con uno de estos dos.
- **`transaction_type` no es un enum sino datos** sembrados en
  `initial-data-postgres-script.sql:91-115`. Al momento de este análisis no existía ningún tipo de abono a
  crédito; **durante la redacción de este documento el usuario agregó directamente al script** la fila
  `'Abono a un Credito'` (`initial-data-postgres-script.sql:116-117`, ver decisión de nombre en la sección
  siguiente) — el resto de este plan usa ese nombre exacto para `findByName`.
- Toda venta y transacción exige una `CashSession` abierta (`cashSessionRepo.isClosedCashSession(...)`,
  patrón repetido en `RegisterSaleUseCase` y `CalculateSaleUseCase`) — un abono a crédito debe seguir el
  mismo patrón para aparecer en el corte de caja.
- **`SaleStatusEnum`** se compara puntualmente (no con `switch` exhaustivo) en ~10 lugares: badges de
  color en `HeaderDetail.tsx`, `useSaleList.ts` (sin `default`, un status nuevo da `undefined` de color),
  `CustomerSaleList.tsx`/`CustomerInformation.tsx`, y filtros de reportes en
  `typeorm-sale-detail.repository.ts:111`, `typeorm-product.repository.ts:398`,
  `get-transactions-financial-summary.use-case.ts:38`, `get-cash-session-sales-summary.use-case.ts:17`.
  Agregar un valor nuevo no rompe la compilación, pero cada punto necesita revisión manual explícita.
- **El botón de UI más cercano a "volver a cobrar una venta pendiente" está comentado**
  (`HeaderDetail.tsx:45-52`) — es el punto de partida natural para el botón "Abonar a crédito".
- El status se persiste como `@Column({type: 'enum', enum: SaleStatusEnum})` en Postgres — agregar un
  valor requiere `ALTER TYPE ... ADD VALUE`, generado automáticamente por
  `pnpm run migration:generate` al editar el enum + la ORM entity.

## Decisión de diseño

1. **Nuevo valor de enum `CREDIT = 'credito'`** en `SaleStatusEnum` — no se reutiliza `PENDING`, porque
   `PENDING` hoy significa explícitamente "sin descuento de inventario, sin pago" (posponer venta), y
   crédito necesita lo contrario: inventario descontado de inmediato, pago diferido.
2. **`SaleEntity` gana un campo persistido `paidAmount`** (nuevo VO `SalePaidAmountVO`, mismo patrón que
   `SaleInAmountVO`: no negativo), con getter `paidAmount` y un getter derivado (no persistido)
   `balanceAmount = totalAmount - paidAmount`. Se recalcula siempre a partir de la suma real de
   `SalePayment` de la venta en cada escritura (nunca se confía ciegamente en el valor cacheado al
   validar), evitando drift; sirve como caché de lectura rápida para listados/detalle.
3. **Marcar una venta como crédito exige un cliente real** (`customer.saleDefault === false`) — sin esto
   no hay a quién cobrarle el saldo después. Se valida en el use-case, no en el dominio (necesita
   repositorio).
4. **Marcar como crédito NO acepta abono inicial en el mismo paso** (alcance mínimo pedido): al pasar a
   `CREDIT`, `paidAmount` queda en `0` y se descuenta inventario, igual que `COMPLETED`. Todo pago —
   incluido un primer abono el mismo día— pasa por el flujo de "abonar a crédito" por separado. Permitir
   abono inicial en el mismo checkout queda como extensión futura (ver "Fuera de alcance").
5. **Cada abono genera exactamente una `TransactionEntity`** (tipo "Abono a un Credito", ingreso) por el
   monto total abonado en ese evento, y uno o más `SalePayment` (uno por método de pago usado, igual que
   el patrón ya existente de pago mixto) — replica el mismo patrón que `RegisterSalePaymentUseCase` usa
   hoy para el pago completo (una transacción agregada, N `SalePayment` de detalle).
6. **Cuando el abono deja `paidAmount === totalAmount`, la venta pasa automáticamente a `COMPLETED`** —
   así los reportes/filtros que ya asumen `COMPLETED` como "venta liquidada" siguen siendo correctos sin
   tocarlos, y el ciclo de vida vuelve al flujo estándar ya descrito por el usuario
   (INITIALIZED → [CREDIT] → COMPLETED).
7. **No se agrega un método de pago "Crédito"** ni un `creditLimit`/balance en `Customer` — el abono
   siempre usa Efectivo/Transferencia ya existentes, y controlar un límite de crédito por cliente queda
   fuera de alcance de esta iteración (no fue pedido explícitamente).
8. **Se reemplaza el `transactionTypeId = BigInt(1)` hardcodeado** en `RegisterSalePaymentUseCase` por una
   búsqueda por nombre (`TransactionTypeRepository.findByName`, agregar si no existe) — se aprovecha que
   ya hay que tocar este archivo para créditos, y el nuevo caso de uso de abono necesita el mismo mecanismo
   de todos modos, así que evita tener dos formas distintas de resolver un `transactionTypeId` en el mismo
   módulo.
9. **Nuevo caso de uso dedicado `RegisterCreditPaymentUseCase`** (no se reutiliza
   `RegisterSalePaymentUseCase`) — las reglas de negocio difieren lo suficiente (exige `status === CREDIT`
   en vez de `COMPLETED`, valida que el abono no exceda el saldo restante en vez de exigir el total exacto,
   y siempre crea `Transaction`, no solo cuando se liquida el 100%) como para que forzarlas dentro del
   mismo método con banderas condicionales sea más confuso que un caso de uso propio.

## Impacto arquitectural

### Backend (dominio → aplicación → infraestructura → acciones)

**`contexts/sale-management/sale/`**

- `domain/enums/sale-status.enum.ts`: agregar `CREDIT = 'credito'`.
- `domain/value-objects/sale-paid-amount.vo.ts` **(nuevo)**: mismo patrón que `sale-in-amount.vo.ts`
  (valida `>= 0`).
- `domain/entities/sale.entity.ts`: agregar `_paidAmount: SalePaidAmountVO` a constructor/`create`/
  `reconstitute`, getter `paidAmount`, getter derivado `balanceAmount` (`totalAmount - paidAmount`), y
  `updatePaidAmount(value: number)` (mismo estilo que `updateTotalAmount`, etc.).
- `application/dtos/calculate-sale.dto.ts`: sin cambios de forma — `status` ya acepta cualquier
  `SaleStatusEnum`.
- `application/use-cases/calculate-sale.use-case.ts`:
  - Línea 42-44: al validar el cliente, si `dto.status === CREDIT` cambiar `existById` por `findById` y
    validar `!customer.saleDefault` (lanzar `SaleConflictException` — "Selecciona un cliente para
    registrar una venta a crédito.").
  - Línea 96 y 98: agregar `CREDIT` junto a `COMPLETED` en ambos condicionales, para que el descuento de
    inventario también corra al marcar crédito.
  - Línea 120-122: el bloque `registerSalePaymentUseCase` sigue disparando solo para `COMPLETED` (crédito
    no registra pagos en este paso, ver decisión 4).
  - Inicializar `sale.updatePaidAmount(0)` explícitamente cuando `dto.status === CREDIT` (aunque el
    default ya sea 0, deja la intención explícita en el código).
- `application/mappers/sale.mapper.ts` (dominio → DTO/`ISale`): agregar `paidAmount`/`balanceAmount` a la
  salida.
- `infraestructura/persistence/typeorm/entities/sale.orm-entity.ts`: agregar
  `@Column('numeric', {precision: 14, scale: 4, default: 0}) paidAmount: number;`.
- `infraestructura/persistence/typeorm/mappers/*` (ORM ↔ dominio): incluir `paidAmount` en ambas
  direcciones.
- `presentation/interfaces/ISale.ts`: agregar `paidAmount: number` y `balanceAmount: number`.
- Revisar y corregir los imports rotos hacia `src/features/...` en
  `presentation/hooks/details/usePayment.ts` (ruta inexistente, ver hallazgo en la investigación) al tocar
  este archivo para el botón "Abonar a crédito" — no dejarlo roto de paso.

**`contexts/sale-management/sale-payment/`**

- `application/dtos/register-credit-payment.dto.ts` **(nuevo)**: `{ saleId, employeeId, cashRegisterId,
  payments: { paymentMethodId: bigint, amountPaid: number, referenceNumber?: string }[] }`.
- `application/use-cases/register-credit-payment.use-case.ts` **(nuevo)**, `RegisterCreditPaymentUseCase`:
  1. Buscar la venta; si no existe → `SalePaymentNotFoundException`.
  2. Validar `sale.status === CREDIT`; si no → `SalePaymentConflictException` ("La venta no está en
     crédito.").
  3. Validar `cashSessionRepo.isClosedCashSession(cashRegisterId)`; si no hay sesión abierta →
     `SaleConflictException`.
  4. Sumar `amountPaid` del/los DTO(s); validar `> 0`.
  5. Recalcular el saldo real sumando `salePaymentRepository.findAllBySaleId(saleId)` (no confiar solo en
     `sale.paidAmount` cacheado, igual que hace hoy `RegisterSalePaymentUseCase` en sus líneas 51-61);
     validar `abono <= saldoRestante`, si no → `SalePaymentConflictException` ("El abono excede el saldo
     pendiente de la venta.").
  6. Validar que cada `paymentMethodId` exista.
  7. Dentro de `transactionDB.runInTransaction`: guardar los `SalePayment` (uno por método de pago),
     buscar el `transactionType` "Abono a un Credito" por nombre (`transactionTypeRepository.findByName`),
     crear **una** `TransactionEntity` por el monto total del abono con `cashSessionId = sesión activa`,
     `sale.updatePaidAmount(nuevoTotalPagado)`, y si `nuevoTotalPagado === totalAmount` →
     `sale.updateStatus(COMPLETED)`; guardar la venta actualizada.
  8. Retornar `{ sale, salePayments }` (o el DTO que el frontend necesite para refrescar saldo/estado sin
     recargar toda la página).
- `application/use-cases/register-sale-payment.use-case.ts`: reemplazar el `transactionTypeId =
  BigInt(1)` (línea 66) por búsqueda vía `transactionTypeRepository.findByName(...)` con el nombre exacto
  sembrado para "Ingreso por Venta de Mercancía" (ver decisión 8) — cambio acotado, no se toca el resto del
  método.
- `presentation/actions/register-credit-payment.action.ts` **(nuevo)**: construye/inyecta
  `RegisterCreditPaymentUseCase` igual que `finish-sale.action.ts` lo hace con `CalculateSaleUseCase`
  (mismo estilo de wiring manual).

**`contexts/transaction-management/transaction-type/`**

- `domain/repositories/transaction-type.repository.ts`: **verificar si ya existe** un método
  `findByName(name: string): Promise<TransactionTypeEntity | null>`; si no, agregarlo a la interfaz y a
  `typeorm-transaction-type.repository.ts`.
- `domain/constants/`: agregar constantes con los nombres exactos usados por el código (evita strings
  mágicos repetidos entre `register-sale-payment.use-case.ts` y `register-credit-payment.use-case.ts`),
  ej. `CREDIT_PAYMENT_TRANSACTION_TYPE_NAME = 'Abono a un Credito'`.
- Revisar `excluded-transaction-type-names.constant.ts`: decidir si "Abono a un Credito" debe excluirse de
  algún resumen financiero para no contar dos veces el ingreso cuando la venta finalmente se completa
  (recomendación: **no excluirlo** — es dinero real entrando a caja en el momento del abono, a diferencia
  de la venta en sí que en `CREDIT` no genera ingreso).

**`contexts/sale-management/customer/`**: sin cambios de esquema (ver decisión 7) — solo se usa el
`saleDefault` ya existente para bloquear crédito al cliente por defecto.

### Frontend

- **`sale/presentation/ui/SalePaymentModal.tsx`** (modal de checkout): agregar una tercera acción
  **"Crédito"** (atajo sugerido `F4`) junto a "Posponer" (F3) y "Cobrar" (F2). Deshabilitada si el cliente
  seleccionado es el de `saleDefault` (Público en General), con hint visible explicando por qué.
- **`sale/presentation/hooks/useSalePayment.ts`**: nuevo `handleCreditSale()` — llama `finishSaleAction`
  con `status: SaleStatusEnum.CREDIT` y `salePayments: []` (mismo shape que `handleFinishSale`, línea
  121-188, pero status distinto); tras éxito, imprimir/mostrar comprobante indicando "VENTA A CRÉDITO —
  Saldo pendiente: $X" (reusar el flujo de impresión ya existente para `COMPLETED` si aplica).
- **Badges de status** — tocar los 3 puntos duplicados para el nuevo valor `CREDIT` (color sugerido:
  naranja/ámbar, distinto de `PENDING` azul y `COMPLETED` verde):
  - `sale/presentation/ui/detail/HeaderDetail.tsx`
  - `sale/presentation/hooks/useSaleList.ts` (`handleBadgeType`, agregar el `case` faltante — hoy no tiene
    `default` y devolvería `undefined`)
  - `customer/presentation/ui/details/CustomerSaleList.tsx` y `CustomerInformation.tsx`
  - Dado que los tres se tocan de todos modos, extraer un único helper compartido (ej.
    `sale/presentation/utils/sale-status-badge.ts`, `getSaleStatusBadge(status): {label, color}`) y
    consumirlo desde los tres lugares en vez de triplicar el mapeo otra vez.
- **`sale/presentation/ui/detail/HeaderDetail.tsx`**: reactivar/adaptar el botón comentado
  (líneas 45-52) como **"Abonar a crédito"**, visible solo si `sale.status === CREDIT`, abre el nuevo
  modal de abono.
- **`CreditPaymentModal.tsx` (nuevo)**, en `sale/presentation/ui/detail/`: formulario de abono — muestra
  saldo pendiente (`sale.balanceAmount`), input de monto para Efectivo y Transferencia (mismo patrón visual
  que `SalePaymentModal.tsx`, reusando el hardcodeo actual de los dos métodos — no se generaliza el
  selector dinámico de métodos de pago en esta iteración, es deuda técnica preexistente fuera de alcance),
  valida en cliente que la suma no exceda el saldo antes de enviar, llama a la nueva
  `registerCreditPaymentAction`.
- **`sale/presentation/ui/detail/FinancialSummary.tsx`** / **`SalePayments.tsx`**: mostrar "Saldo
  pendiente: $X" cuando `status === CREDIT`, y listar los abonos ya registrados (reusa el listado de
  `SalePayment` que ya se muestra para ventas `COMPLETED`).
- **`sale/presentation/ui/detail/SaleDetailList.tsx:60`**: extender la condición `=== COMPLETED` para
  incluir `CREDIT` (una vez marcada crédito, ya no se deben poder seguir agregando/quitando productos —
  el inventario ya se descontó).

## Base de datos — migración

A diferencia del caso "impresora por caja", este cambio **no requiere una decisión de negocio por sitio**
(no hay ambigüedad en cómo rellenar `paid_amount` para filas existentes ni en qué nombre debe tener el
nuevo `transaction_type`), así que puede resolverse en **una sola migración generada**, sin paso manual
intermedio por cliente.

Convención del proyecto: se genera con `pnpm run migration:generate AddCreditSupportToSale` después de
editar `sale-status.enum.ts` y `sale.orm-entity.ts` — los nombres de constraint son ilustrativos, los
reales los define TypeORM al generarse.

```sql
-- up (auto-generado por TypeORM al agregar el valor de enum + la columna)
ALTER TYPE "sale_status_enum" ADD VALUE 'credito';
ALTER TABLE "sale" ADD COLUMN "paid_amount" numeric(14,4) NOT NULL DEFAULT 0;

-- up (agregado a mano dentro del mismo archivo generado — migration:generate no crea sentencias de datos)
UPDATE "sale" SET "paid_amount" = "total_amount" WHERE "status" IN ('completada', 'reembolsada');

INSERT INTO "transaction_type" ("name", "description", "account_type") VALUES
  ('Abono a un Credito', 'Cuando un cliente abona a un credito que ha solicitado de mercancía.', 'Ingreso');

-- down
DELETE FROM "transaction_type" WHERE "name" = 'Abono a un Credito';
ALTER TABLE "sale" DROP COLUMN "paid_amount";
-- Postgres no soporta quitar un valor de un enum sin recrear el tipo; el down documenta esta limitación
-- y no intenta revertir el ADD VALUE (mismo trade-off que cualquier ALTER TYPE ... ADD VALUE en Postgres).
```

**Nota**: el `INSERT INTO transaction_type ('Abono a un Credito', ...)` de
`initial-data-postgres-script.sql:116-117` **ya fue agregado directamente al script** (junto con
`'Aumento de efectivo en caja'`) — cubre instalaciones nuevas. La migración de arriba solo hace falta para
sembrar la misma fila en bases de datos **ya existentes** (desarrollo y clientes on-prem que ya corrieron
el script antes de este cambio); el texto de `description` debe copiarse tal cual del script para que
ambas fuentes queden idénticas y `findByName('Abono a un Credito')` resuelva siempre la misma fila sin
importar por cuál de las dos vías se sembró.

Nota sobre la restricción de Postgres (<12) de no poder *usar* un valor de enum recién agregado dentro de
la misma transacción en que se agregó: no aplica aquí, porque el `UPDATE` de backfill filtra por los
status existentes (`completada`, `reembolsada`), no por `'credito'` — el valor nuevo no se consume en esta
misma migración.

## Plan de implementación (orden de ejecución, por capa)

1. **[backend]** Enum + VO + entidad: `sale-status.enum.ts` (agregar `CREDIT`), `sale-paid-amount.vo.ts`
   (nuevo), `sale.entity.ts` (`_paidAmount`, getters, `updatePaidAmount`).
2. **[backend]** `transaction-type.repository.ts`: verificar/agregar `findByName`; agregar constantes de
   nombres en `domain/constants/`.
3. **[backend]** ORM: `sale.orm-entity.ts` (+columna), mappers ORM↔dominio, mapper dominio→DTO,
   `ISale.ts` — generar la migración `AddCreditSupportToSale<timestamp>` y completar a mano el `INSERT`
   de `transaction_type` (ver sección de migración).
4. **[backend]** `calculate-sale.use-case.ts`: validación de cliente real para `CREDIT`, extender guards de
   descuento de inventario (líneas 96/98), inicializar `paidAmount`.
5. **[backend]** `register-sale-payment.use-case.ts`: reemplazar `transactionTypeId` hardcodeado por
   `findByName`.
6. **[backend]** Nuevo `register-credit-payment.use-case.ts` + `register-credit-payment.dto.ts` +
   `register-credit-payment.action.ts`.
7. **[backend]** Revisión puntual (no cambio automático) de los 4 filtros `=== COMPLETED` en reportes
   (`typeorm-sale-detail.repository.ts:111`, `typeorm-product.repository.ts:398`,
   `get-transactions-financial-summary.use-case.ts:38`, `get-cash-session-sales-summary.use-case.ts:17`) —
   decidir por caso si deben incluir `CREDIT` (ver recomendaciones en "Verificación pendiente").
8. **[frontend]** Helper compartido `getSaleStatusBadge(status)` + reemplazar los 3 puntos duplicados
   (`HeaderDetail.tsx`, `useSaleList.ts`, `CustomerSaleList.tsx`/`CustomerInformation.tsx`).
9. **[frontend]** Checkout: botón/atajo "Crédito" en `SalePaymentModal.tsx` + `handleCreditSale()` en
   `useSalePayment.ts`, deshabilitado sin cliente real.
10. **[frontend]** Detalle de venta: reactivar botón "Abonar a crédito" en `HeaderDetail.tsx` (corrigiendo
    de paso los imports rotos de `usePayment.ts`), nuevo `CreditPaymentModal.tsx`, saldo pendiente en
    `FinancialSummary.tsx`/`SalePayments.tsx`, bloqueo de edición de detalle en `SaleDetailList.tsx`.
11. **Verificación end-to-end** (checklist abajo) antes de dar la feature por terminada.

## Archivos a crear

- `src/contexts/sale-management/sale/domain/value-objects/sale-paid-amount.vo.ts`
- `src/contexts/sale-management/sale-payment/application/dtos/register-credit-payment.dto.ts`
- `src/contexts/sale-management/sale-payment/application/use-cases/register-credit-payment.use-case.ts`
- `src/contexts/sale-management/sale-payment/presentation/actions/register-credit-payment.action.ts`
- `src/contexts/sale-management/sale/presentation/utils/sale-status-badge.ts`
- `src/contexts/sale-management/sale/presentation/ui/detail/CreditPaymentModal.tsx`
- Migración `AddCreditSupportToSale<timestamp>.ts`

## Archivos a modificar

- `src/contexts/sale-management/sale/domain/enums/sale-status.enum.ts`
- `src/contexts/sale-management/sale/domain/entities/sale.entity.ts`
- `src/contexts/sale-management/sale/application/use-cases/calculate-sale.use-case.ts`
- `src/contexts/sale-management/sale/application/mappers/sale.mapper.ts`
- `src/contexts/sale-management/sale/infraestructura/persistence/typeorm/entities/sale.orm-entity.ts`
- `src/contexts/sale-management/sale/infraestructura/persistence/typeorm/mappers/*` (ORM↔dominio)
- `src/contexts/sale-management/sale/presentation/interfaces/ISale.ts`
- `src/contexts/sale-management/sale/presentation/ui/SalePaymentModal.tsx`
- `src/contexts/sale-management/sale/presentation/hooks/useSalePayment.ts`
- `src/contexts/sale-management/sale/presentation/hooks/useSaleList.ts`
- `src/contexts/sale-management/sale/presentation/hooks/details/usePayment.ts`
- `src/contexts/sale-management/sale/presentation/ui/detail/HeaderDetail.tsx`
- `src/contexts/sale-management/sale/presentation/ui/detail/FinancialSummary.tsx`
- `src/contexts/sale-management/sale/presentation/ui/detail/SalePayments.tsx`
- `src/contexts/sale-management/sale/presentation/ui/detail/SaleDetailList.tsx`
- `src/contexts/sale-management/customer/presentation/ui/details/CustomerSaleList.tsx`
- `src/contexts/sale-management/customer/presentation/ui/details/CustomerInformation.tsx`
- `src/contexts/sale-management/sale-payment/application/use-cases/register-sale-payment.use-case.ts`
- `src/contexts/transaction-management/transaction-type/domain/repositories/transaction-type.repository.ts`
- `src/contexts/transaction-management/transaction-type/infraestructura/.../typeorm-transaction-type.repository.ts`
- `src/contexts/transaction-management/transaction-type/domain/constants/` (nueva constante de nombre)
- ~~`src/configuration/databases/typeorm/scripts/initial-data-postgres-script.sql`~~ — ya no requiere
  cambio: la fila `'Abono a un Credito'` ya fue agregada directamente al script
  (`initial-data-postgres-script.sql:116-117`), cubre instalaciones nuevas. Solo queda pendiente el
  `INSERT` equivalente dentro de la migración (ver sección "Base de datos — migración") para bases de
  datos ya existentes.
- `src/contexts/sale-management/sale/infraestructura/persistence/typeorm/repositories/typeorm-sale-detail.repository.ts`
  (si se decide incluir `CREDIT`, punto 7 del plan)
- `src/contexts/sale-management/product/.../typeorm-product.repository.ts` (idem)
- `src/contexts/transaction-management/transaction/application/use-cases/get-transactions-financial-summary.use-case.ts`
  (idem)
- `src/contexts/cash-management/cash-session/application/use-cases/get-cash-session-sales-summary.use-case.ts`
  (idem)

## Verificación pendiente (a ejecutar durante la implementación)

1. `tsc --noEmit` sin nuevos errores atribuibles a este módulo (y confirmar que corregir
   `usePayment.ts` no destapa errores preexistentes ocultos).
2. `pnpm run migration:run` en limpio; confirmar backfill (`paid_amount = total_amount` para ventas
   `completada`/`reembolsada` ya existentes) y el `INSERT` de "Abono a un Credito".
3. Flujo feliz: crear venta → marcar `Crédito` con cliente real → confirmar que el inventario se descontó
   (mismo comportamiento que `Cobrar`) y `paidAmount = 0`.
4. Intentar marcar `Crédito` con el cliente por defecto (Público en General) → debe rechazar con mensaje
   claro.
5. Registrar un abono parcial (efectivo) → confirmar `SalePayment` creado, `TransactionEntity` tipo "Abono
   a un Credito" con el `cashSessionId` de la sesión activa, `sale.paidAmount` actualizado, `status` sigue
   en `CREDIT`.
6. Registrar un abono mixto (efectivo + transferencia) que complete el saldo restante exacto → confirmar
   que `status` pasa a `COMPLETED` automáticamente.
7. Intentar abonar más del saldo pendiente → debe rechazar con `SalePaymentConflictException`.
8. Intentar abonar sin sesión de caja abierta → debe rechazar igual que el checkout normal.
9. Confirmar que los badges de status muestran `CREDIT` correctamente en: listado de ventas, detalle de
   venta, listado de ventas del cliente, resumen del cliente.
10. Revisar uno por uno los 4 reportes listados en el punto 7 del plan y decidir explícitamente (con el
    usuario si hace falta) si deben incluir ventas `CREDIT`, documentando la decisión final en este mismo
    archivo antes de cerrar la feature.
11. Confirmar que una venta `CREDIT` ya no permite agregar/quitar productos desde `SaleDetailList.tsx`.

## Fuera de alcance / limitaciones conocidas

- **Sin límite de crédito por cliente** (`creditLimit`/balance en `Customer`) — no fue pedido; si se
  necesita a futuro, es una extensión aditiva sobre este diseño (nuevo VO opcional + validación en
  `calculate-sale.use-case.ts` al marcar `CREDIT`).
- **Sin abono inicial en el mismo paso de marcar crédito** — todo pago pasa por "Abonar a crédito" después
  de guardada la venta (decisión 4).
- **Sin vista de "cuentas por cobrar"** (listado de clientes con crédito abierto y su saldo total) — el
  saldo por venta ya queda disponible (`sale.balanceAmount`) y es la base para construir ese reporte
  después si se pide explícitamente.
- **No se generaliza el selector de métodos de pago** (sigue hardcodeado a Efectivo/Transferencia en el
  JSX) — deuda técnica preexistente, no introducida ni resuelta por esta feature.
- **No se agregan intereses, moras ni vencimientos** sobre el saldo de crédito.

---

## Adenda (2026-09-24): fecha/empleado por pago + comprobante imprimible del historial de abonos

> Pedido por el usuario tras revisar la primera entrega de la feature en el detalle de venta (`/sale/1889`,
> ver captura adjunta al pedido): cada pago listado debe mostrar cuándo se hizo y qué empleado lo recibió,
> y debe poder imprimirse un comprobante con el historial de abonos y el saldo pendiente.

### Problema adicional

`SalePayments.tsx` ya muestra cada pago (método + monto), y `SalePaymentEntity.createdAt` ya existe en el
dominio, pero **no se muestra** en pantalla. Más importante: **`SalePaymentEntity` no tiene ningún campo
de empleado** — ni en `RegisterSalePaymentUseCase` (pago completo al cobrar) ni en
`RegisterCreditPaymentUseCase` (abono a crédito) se persiste quién recibió el dinero, aunque ambos
casos de uso ya reciben un `employeeId` en su DTO (se usa hoy solo para la `TransactionEntity`, nunca se
guarda en el `SalePayment`). Tampoco existe ningún comprobante imprimible del historial de pagos — solo
existe el ticket de la venta original (`Ticket58Document.tsx`), que no lista abonos.

### Decisiones de diseño

1. **`SalePaymentEntity` gana `employeeId` (obligatorio, no nullable)** — el empleado que procesó ese pago
   específico, tomado del `employeeId` que ya trae cada caso de uso que crea un `SalePayment`
   (`RegisterSalePaymentUseCase` usa el empleado de la venta/checkout; `RegisterCreditPaymentUseCase` usa
   el empleado que registra el abono, que puede ser distinto al que hizo la venta original). Se hidrata
   opcionalmente la relación `employee` (mismo patrón que `_employee` en `SaleEntity`/`TransactionEntity`)
   para mostrar nombre en UI/ticket sin llamadas adicionales.
2. **Backfill determinista, sin paso manual**: para los `SalePayment` ya existentes en la base (todos
   creados antes de esta adenda, todos del flujo de pago completo al cobrar), `employee_id = sale.employee_id`
   de la venta a la que pertenecen — no hay ambigüedad de negocio que decidir por sitio, así que va en una
   sola migración con `UPDATE ... FROM sale` + `SET NOT NULL`, igual que se hizo con `paid_amount`.
3. **El comprobante de historial de pagos sigue el patrón ya existente de tickets 58mm** (`Ticket58Document.tsx`
   + `usePrintTicket`), como documento nuevo — no se reutiliza el ticket de venta, porque su layout es de
   productos/totales de una compra puntual, no de una lista de abonos en el tiempo.
4. **El comprobante se imprime en la caja activa de quien lo solicita** (misma resolución de
   `cashRegisterId` ya usada por `CreditPaymentModal`, vía la sesión de caja activa del empleado actual),
   no en la caja donde se originó la venta — el saldo se puede consultar/imprimir desde cualquier caja
   abierta, a diferencia del ticket de venta original que sí pertenece a una caja fija.
5. **No requiere una nueva server action de datos**: la página de detalle de venta ya carga `ISale`
   completo (incluido `salePayments`); el comprobante se genera client-side a partir de esos mismos datos
   ya en memoria — solo hace falta que el backend hidrate `employee` en la relación `salePayments` que ya
   se consulta hoy.

### Impacto arquitectural

**Backend**

- `sale-payment/domain/entities/sale-payment.entity.ts`: agregar `_employeeId: bigint` (constructor,
  `create()`, `reconstitute()`, getter) y `_employee: EmployeeEntity | null` (hidratable, mismo patrón que
  `_sale`/`_paymentMethod`).
- `sale-payment/infraestructure/entities/sale-payment.orm-entity.ts`: columna
  `@Column({type:'bigint', name:'employee_id', nullable:false})` + relación
  `@ManyToOne(() => EmployeeOrmEntity) @JoinColumn({name:'employee_id'}) employee?: EmployeeOrmEntity | null;`
  (copiar el import de `EmployeeOrmEntity` exactamente como está en `sale.orm-entity.ts:5` — su ruta usa
  la carpeta `infraestruture`, con esa otra variante de misspelling, no confundir con `infraestructura`).
- `sale-payment/infraestructure/mappers/sale-payment.mapper.ts` y
  `sale-payment/application/mappers/sale-payment.mapper.ts`: mapear `employeeId`/`employee` en ambas
  direcciones (ORM↔dominio, dominio→`ISalePayment`/DTO).
- `sale-payment/presentation/interfaces/ISalePayment.ts`: agregar `employeeId: bigint` y
  `employee: IEmployee | null` (usar la interfaz de empleado ya existente en el proyecto).
- `sale-payment/application/use-cases/register-sale-payment.use-case.ts`: cambiar la firma a
  `execute(dtos: RegisterSalePaymentDTO[], employeeId: bigint)` y pasar `employeeId` a cada
  `SalePaymentEntity.create(...)`. Actualizar su único llamador,
  `calculate-sale.use-case.ts` (`this.registerSalePaymentUseCase.execute(dto.salePayments, dto.employeeId)`).
- `sale-payment/application/use-cases/register-credit-payment.use-case.ts`: pasar `dto.employeeId`
  (ya presente en `RegisterCreditPaymentDTO`) a cada `SalePaymentEntity.create(...)`.
- `sale/infraestructure/persistence/typeorm/repositories/typeorm-sale.repository.ts`: agregar
  `employee: true` dentro de `salePayments: { paymentMethod: true, employee: true }` en
  `findFinishSaleById` (línea ~62, alimenta el detalle de venta) y `findSaleTicketById` (línea ~81, por si
  se decide extender el ticket original a futuro) — sin este cambio `ISalePayment.employee` llegaría
  siempre `null` en el detalle aunque el dato ya esté guardado.
- Migración `AddEmployeeToSalePayment<timestamp>` (generada con
  `pnpm run migration:generate AddEmployeeToSalePayment` tras editar el ORM entity), con backfill agregado
  a mano en el mismo archivo:
  ```sql
  -- up (auto-generado: columna + FK)
  ALTER TABLE "sale_payment" ADD COLUMN "employee_id" bigint;
  -- up (a mano)
  UPDATE "sale_payment" sp SET "employee_id" = s."employee_id"
    FROM "sale" s WHERE s."sale_id" = sp."sale_id" AND sp."employee_id" IS NULL;
  ALTER TABLE "sale_payment" ALTER COLUMN "employee_id" SET NOT NULL;
  ALTER TABLE "sale_payment" ADD CONSTRAINT "FK_sale_payment_employee"
    FOREIGN KEY ("employee_id") REFERENCES "employee"("employee_id");
  -- down: inverso, dropear FK/constraint/columna.
  ```

**Frontend**

- `sale/presentation/ui/detail/SalePayments.tsx`: mostrar por cada pago la fecha
  (`formatDate`/`formatDateShort` + hora, mismos helpers que ya usa `Ticket58Document.tsx`) y el empleado
  (`p.employee?.firstName p.employee?.lastName`), además de lo que ya muestra (método + monto).
- Nuevo documento `sale/presentation/documents/CreditPaymentHistoryTicket58Document.tsx` — mismo layout
  base 58mm que `Ticket58Document.tsx` (logo, encabezado de establecimiento, folio/fecha), pero con una
  tabla de abonos (fecha, empleado, método, monto) en vez de productos, y el saldo pendiente
  (`sale.balanceAmount`) destacado al final en vez de totales de compra.
- Nuevo hook `sale/presentation/hooks/details/useCreditPaymentHistoryTicket.tsx` — recibe la `ISale` ya
  cargada en la página de detalle (no hace fetch propio), genera el PDF con `pdf(doc).toBlob()` igual que
  `useReprintTicketSale.tsx`, resuelve `cashRegisterId` de la sesión de caja activa del empleado actual
  (misma fuente que ya usa `CreditPaymentModal`, revisar cómo la obtiene) y llama a `printTicket` de
  `usePrintTicket`.
- Botón **"Imprimir historial de pagos"** en `sale/presentation/ui/detail/SalePayments.tsx` (o
  `HeaderDetail.tsx`, el que tenga más sentido visualmente junto a los demás botones de acción), visible
  cuando `(data.salePayments?.length ?? 0) > 0`.

### Archivos a crear (adenda)

- `src/contexts/sale-management/sale/presentation/documents/CreditPaymentHistoryTicket58Document.tsx`
- `src/contexts/sale-management/sale/presentation/hooks/details/useCreditPaymentHistoryTicket.tsx`
- Migración `AddEmployeeToSalePayment<timestamp>.ts`

### Archivos a modificar (adenda)

- `src/contexts/sale-management/sale-payment/domain/entities/sale-payment.entity.ts`
- `src/contexts/sale-management/sale-payment/infraestructure/entities/sale-payment.orm-entity.ts`
- `src/contexts/sale-management/sale-payment/infraestructure/mappers/sale-payment.mapper.ts`
- `src/contexts/sale-management/sale-payment/application/mappers/sale-payment.mapper.ts`
- `src/contexts/sale-management/sale-payment/presentation/interfaces/ISalePayment.ts`
- `src/contexts/sale-management/sale-payment/application/use-cases/register-sale-payment.use-case.ts`
- `src/contexts/sale-management/sale-payment/application/use-cases/register-credit-payment.use-case.ts`
- `src/contexts/sale-management/sale/application/use-cases/calculate-sale.use-case.ts`
- `src/contexts/sale-management/sale/infraestructure/persistence/typeorm/repositories/typeorm-sale.repository.ts`
- `src/contexts/sale-management/sale/presentation/ui/detail/SalePayments.tsx`

### Verificación pendiente (adenda)

1. `tsc --noEmit` sin errores nuevos; correr de nuevo la suite de tests que el spec original ya tenía que
   tocar (`register-sale-payment.use-case` se le cambió la firma — revisar si tiene test propio).
2. Backfill: confirmar en la base local que todos los `sale_payment` existentes quedaron con
   `employee_id` igual al `employee_id` de su venta.
3. Registrar un pago completo al cobrar (checkout normal) → confirmar que el `SalePayment` creado trae el
   `employeeId` del cajero que cobró.
4. Registrar un abono a crédito → confirmar que el `SalePayment` trae el `employeeId` de quien registró el
   abono (no necesariamente el vendedor original).
5. En el detalle de venta, confirmar que cada pago listado muestra fecha y empleado correctos.
6. Imprimir el comprobante de historial de pagos con una venta en crédito con 2+ abonos → confirmar que
   lista todos los abonos con fecha/empleado/método/monto y el saldo pendiente correcto, y que imprime en
   la impresora de la caja activa (no la de la venta original).
