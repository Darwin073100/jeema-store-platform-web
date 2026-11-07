# 13 — Compras y egresos

> Documento prospectivo (plan de implementación, **feature aún no construida**). Elaborado el 2026-11-06 a
> partir del código de la rama `development`. Todas las rutas y líneas fueron comprobadas en esa fecha. Lo que
> no se pudo comprobar está en "Verificación pendiente". No se consultaron datos reales de la base: solo se
> ejecutó `pnpm migration:show`, que muestra las 14 migraciones aplicadas y ninguna pendiente.

## Problema

Los lotes se registran sueltos. Ningún dato une un lote con la compra que lo originó, y el dinero que sale para
pagar mercancía no aparece como egreso: el usuario lo calcula a mano. Además, `transaction.purchase_id` existe
desde el esquema inicial pero no apunta a nada.

Se necesita crear una compra, anexarle lotes y controlar su egreso, sin falsear la ganancia ni descuadrar el
corte de caja.

**Nombre recomendado: `Purchase` / "Compra".** Slice `src/contexts/purchase-management/purchase/`, tabla
`purchase`, PK `purchase_id`. Coincide con el contexto y con la columna que ya existe en `transaction`.

## Hallazgos sobre el código actual

### Inventario de `purchase_id`

La búsqueda de `purchase_?id` en todo el repo da 64 coincidencias en 28 archivos. **Solo una columna real se
llama `purchase_id`: la de `transaction`.** El resto es `lot_unit_purchase_id`, la PK de otra tabla.

| Tabla / entidad | Campo | Dónde | Qué es | Qué pasa en esta spec |
|---|---|---|---|---|
| `transaction` | `purchase_id` bigint nullable | `1783063705557-schema.ts:39`, `transaction.orm-entity.ts:16-17`, `transaction.entity.ts:13`, mappers y DTO | Referencia sin destino. **Sin FK** (las FK de esa tabla son las líneas 87-91) y sin relación ORM ni índice | Pasa a ser FK real a `purchase`, con índice y relación |
| `lot` | no tiene | `1783063705557-schema.ts:23`, `lot.orm-entity.ts` | Solo `purchase_price` y `purchase_unit`, que son datos del lote | Se **agrega** `purchase_id` nullable |
| `lot_unit_purchase` | `lot_unit_purchase_id` (PK) | `schema.ts:20`, `lot-unit-purchase.orm-entity.ts:7-8` | Falso positivo, no referencia a una compra | Sin cambios |
| `cloud_transfer_item` | no tiene | `1790047308947-CreateCloudTransferTables.ts:16` | Solo `lot_purchase_price` y `lot_purchase_unit`, parte del snapshot del lote | Sin cambios |
| `sale_detail`, `inventory_item` | no tienen | sus `*.orm-entity.ts` | Tampoco tienen `lot_id` | Sin cambios |
| Script SQL inicial | no aparece | `initial-data-postgres-script.sql` | Solo siembra los tipos de transacción de las líneas 95 y 102 | Se reutilizan esos tipos |

Conclusión: "algunas entidades traen ese id" es en realidad una sola, `transaction`.

`TransactionEntity.create` recibe `null` en `purchaseId` en todos los llamadores salvo
`register-transaction.use-case.ts:81`, que usa `dto.purchaseId`. La UI manda `null`
(`useCashTransactionModal.ts:59`), pero el action es un POST público y acepta cualquier valor. **No se comprobó si
hay filas con valor en la base**: la migración debe verificarlo (ver Persistencia).

### Qué es `lot_unit_purchase`

Es una presentación alternativa de compra de un lote, por ejemplo "caja de 12 a $100"
(`useLotUnitPurchaseDescriptionInputs.ts:4-7`). Solo se captura y se muestra (`LotDetail.tsx`). Los cálculos de
costo no lo usan: `useLotInformation.ts:17`, `get-product-performance.use-case.ts:47` y
`recalculate-product-average-cost.use-case.ts:77` usan `lot.initialQuantity * lot.purchasePrice`. **No es una
compra y no entra en el total.**

### Doble conteo en el resumen financiero

`get-transactions-financial-summary.use-case.ts`:

- `totalInvested` es el **costo de lo vendido**: suma `(quantity - unidades devueltas) * unitCostAtSale` de las
  ventas completadas (líneas 61-65). `unitCostAtSale` se congela al vender con `product.averageCost`
  (`register-sale-detail.use-case.ts:104`).
- `profitBeforeExpenses = totalIncomes - totalInvested` (línea 68).
- `totalExpenses` suma los egresos no excluidos (líneas 72-78).
- `profitAfterExpenses = profitBeforeExpenses - totalExpenses` (línea 81).
- `grossTotal = totalIncomes - totalExpenses` (línea 91), sin restar `totalInvested`.

Por tanto, **el doble conteo es real**: una compra registrada como egreso normal resta la mercancía en
`totalExpenses` al comprarla y en `totalInvested` al venderla. Afecta a `profitAfterExpenses`. `grossTotal` no
tiene doble conteo porque nunca resta `totalInvested`.

Esto **ya ocurre hoy** en pequeño: `Pago a Proveedor por Compra` es seleccionable en el modal de caja porque el
filtro de `useCashTransactionModal.ts:30-36` no lo quita, y entra en `totalExpenses`.

Lo que ve el usuario hoy (`TransactionInformation.tsx`): Ingresos, Invertido, Ganancia, Egresos e "Ingreso bruto -
Egresos". La última tarjeta muestra `grossTotal`, pero su tooltip (línea 51) describe `profitAfterExpenses`. Ese
valor no se muestra como cifra: solo decide el icono y el margen del tooltip.

### Caja

- `transaction.cash_session_id` es nullable (`transaction.orm-entity.ts:20-21`) y el listado usa `leftJoin`
  (`typeorm-transaction.repository.ts:61-67`). **Una transacción sin sesión aparece en movimientos y no afecta al
  corte**, porque el corte solo lee `cashSession.transactions`.
- `useCashInformation.ts:34-48` suma como salida todo egreso de la sesión, salvo el retiro de corte. Un egreso con
  `cash_session_id` baja el efectivo esperado, que es lo correcto para un pago en efectivo.
- `register-transaction.use-case.ts:39-71` exige sesión abierta y fondos suficientes.
- `cash_register` tiene `branch_office_id`; `cash_session` llega a la sucursal por esa relación.
- `findByEmployeeId` devuelve la sesión abierta del empleado (`typeorm-cash-session.repository.ts:58-72`).

### Caminos que crean lotes

| Camino | Quién lo llama | Comportamiento actual |
|---|---|---|
| `registerLotWithInventoryItemAction` → `RegisterLotWithInventoryItemUseCase` | `useRegisterLotModal.ts:141` | Único camino de lote suelto en la UI. **Sin transacción**: lote, costo y stock se guardan por separado. Con `itemId = 0` no suma stock (línea 37) |
| `registerLotAction` → `RegisterLotUseCase` | **Nadie en la UI** | Código muerto, pero sigue siendo un endpoint público |
| `registerCompleteProductAction` → `RegisterCompleteProductUseCase` | `useRegisterCompleteProduct.ts:492` | Lote opcional (`lotCheck`). `saveCompleteProduct` abre su propio `queryRunner` (`typeorm-product.repository.ts:158`). No actualiza `averageCost` |
| `ApproveCloudTransferUseCase` | Aprobación de traspaso | Crea el lote con `saveTransactional` dentro de `runInTransaction` (líneas 73-97), con `suplierId` siempre null |
| `ResolveCloudTransferItemAsNewProductUseCase` | Resolución de traspaso | **No crea lote** (línea 99 pasa `undefined`). El lote nace en `approve()` |

### Otros hechos que condicionan el diseño

- **`requireSession` no existe.** No hay `src/shared/infrastructure/auth/` y `git grep requireSession` no da
  resultados en `src/` ni `test/`, aunque `AGENTS.md` la describe. `12_seguridad_autorizacion_spect.md` lo confirma
  y la planea en su fase 3.
- **Los lotes son globales por producto**, sin sucursal. `findReport` filtra por
  `product.establishment.branchOffices` (`typeorm-lot.repository.ts:161-172`), así que `/purchases/list` muestra
  los lotes de **todo el establecimiento**, no de la sucursal, aunque la página diga "Lista de todas las compras".
- **Las rutas actuales**: `/purchases` es un menú de tarjetas y `/purchases/list` lista **lotes** con tarjetas de
  cantidad e "Inversión".
- **Un lote no sabe a qué `inventory_item` sumó stock.** `update-lot` y `delete-lot` no tocan inventario ni costo.
- **`sale_detail` no tiene `lot_id`**: no se puede saber qué lote se vendió. El FIFO de
  `RecalculateProductAverageCostUseCase` es una simulación de costeo (líneas 16-17).
- **Varios repositorios no participan de la transacción activa.** `updateAverageCost`
  (`typeorm-product.repository.ts:431-439`), `LotRepository.save` y `delete`, y todas las lecturas usan el
  repositorio global. `InventoryItemRepository.save` lee fuera de la transacción y escribe dentro. Dos líneas del
  mismo `inventory_item` dentro de una transacción perderían una suma.
- `UpdateLotUseCase` reconstruye la entidad con datos del cliente (líneas 32-49). Hoy no borra nada porque
  `LotRepository.save` copia campos concretos (líneas 117-125), pero `LotMapper.toOrm` con esa entidad sí pisaría
  `createdAt` y cualquier campo no incluido.
- `runInTransaction` es reentrante (`TypeormTransactionDBRepository.ts`), lo que permite componer casos de uso
  como hace `CalculateSaleUseCase` con `RegisterSalePaymentUseCase`.
- No hay ningún bloqueo pesimista en `src/`: `FOR UPDATE` sería un patrón nuevo.
- Proveedores (`suplier`) y productos son por establecimiento; `inventory` e `inventory_item` son por sucursal.
- `transaction_type` son datos. Hay ids fijos en código (`BigInt(3)`, `(11)`, `(13)`, `(15)`), así que no conviene
  alterar esa tabla. Esta spec reutiliza dos tipos que ya existen.

## Reglas de negocio

### Compra y lotes

1. Una compra pertenece a una sucursal, la de la sesión. Registra empleado, fecha, proveedor opcional, folio
   opcional y notas.
2. Una compra tiene 0..N lotes y un lote pertenece a una compra como máximo. Una compra sin lotes es válida:
   permite crearla y anexar lotes después.
3. El proveedor de la compra debe ser del establecimiento de la sucursal. Cada lote ligado toma el proveedor de su
   compra. Cambiar el proveedor de la compra lo cambia en sus lotes.
4. Cada lote anexado debe tener cantidad mayor que 0 y precio mayor o igual a 0. Su producto debe ser del
   establecimiento.
5. Si el producto tiene control de stock, el lote debe indicar un `inventory_item` de ese producto en esa sucursal.
   El stock sube por la cantidad del lote y queda registrado en `lot.inventory_item_id`.
6. `total_amount = round2(Σ lot.initialQuantity × lot.purchasePrice)` sobre los lotes no eliminados.
   `lot_unit_purchase` no participa.

### Qué caminos exigen compra

7. Todo lote comprado se crea desde una compra (`AddLotsToPurchaseUseCase`). Se eliminan `registerLotAction` y
   `registerLotWithInventoryItemAction`.
8. Un lote recibido por traspaso en la nube **nunca** tiene compra y nunca genera egreso: el dinero no salió aquí.
9. El alta completa de producto con lote obliga a elegir explícitamente entre "Compra" (ligado a una compra de la
   sucursal) y "Existencia inicial" (`purchase_id` NULL, sin egreso).

### Pagos y egreso

10. El egreso se genera **al pagar**, no al crear la compra. Cada pago es una `transaction` de tipo `Pago a
    Proveedor por Compra` con `purchase_id`.
11. Un pago puede ser **desde caja** (con la sesión abierta del empleado, en la misma sucursal, con fondos
    suficientes) o **fuera de caja** (`cash_session_id` NULL: transferencia u otro origen). Solo el primero afecta
    al corte.
12. La sesión de caja la resuelve el servidor a partir del empleado. El cliente nunca envía `cashSessionId`.
13. Compra a crédito es simplemente una compra con saldo: se registra sin pago y se abona después, tantas veces como
    haga falta y de cualquier origen.
14. `paid_amount = Σ pagos − Σ reembolsos`, calculado desde las transacciones de la compra.
    `saldo = total_amount − paid_amount`.
15. Un pago no puede superar el saldo pendiente. Debe ser mayor que 0.
16. El estado de pago se **deriva**, no se guarda: `Pendiente` (pagado 0 y total mayor que 0), `Parcial`, `Pagada`
    (saldo 0) y `Saldo a favor` (saldo negativo).
17. Las transacciones de una compra son inmutables: nunca se editan ni se borran. Una corrección genera un
    movimiento nuevo, de modo que un corte ya cerrado nunca cambia.
18. Si el total baja por debajo de lo pagado, la compra queda con `Saldo a favor`. Cuando el proveedor devuelve el
    dinero se registra un reembolso: una `transaction` de tipo `Devolución de Compra a Proveedor` con `purchase_id`,
    desde caja o fuera de ella, y no mayor que el saldo a favor.

### Edición y borrado de lotes ligados

19. Se puede editar precio, cantidad y fechas de un lote ligado, tenga o no ventas. No se puede cambiar su producto,
    su compra ni su proveedor directamente.
20. Al cambiar precio o cantidad se recalculan total y saldo en la misma transacción. Las ventas ya hechas no
    cambian: su `unitCostAtSale` está congelado.
21. Al cambiar la cantidad, el stock del `inventory_item` del lote se ajusta por la diferencia. Si `inventory_item_id`
    es NULL, no se ajusta stock y la UI lo advierte.
22. Eliminar un lote ligado resta su cantidad del stock y recalcula el total.
23. Ningún ajuste puede dejar stock negativo: se rechaza con 409. Como `sale_detail` no tiene `lot_id`, **esta es la
    protección frente a unidades ya vendidas**: si ya no queda stock para revertir, no se puede.
24. Una compra solo se puede eliminar si no tiene lotes y su `paid_amount` es 0.
25. Lotes históricos y de traspaso (`purchase_id` NULL) conservan su comportamiento actual de edición y borrado.

### Resumen financiero

26. Los pagos de compra y sus reembolsos **aparecen en la lista de movimientos pero no suman** a `totalExpenses` ni
    a `totalIncomes`, igual que las devoluciones a clientes. Se aplica por nombre de tipo, también a registros
    históricos.
27. `totalPurchases = Σ pagos de compra − Σ reembolsos` del periodo se muestra aparte como "Compras".
28. `cashFlow = totalIncomes − totalExpenses − totalPurchases` se muestra como "Flujo neto".
29. Las fórmulas de `profitBeforeExpenses`, `profitAfterExpenses` y `grossTotal` no cambian.
30. El egreso cuenta en el periodo en que se **registra el pago** (`transaction.created_at`), no en `purchase_date`.
31. `Pago a Proveedor por Compra` y `Devolución de Compra a Proveedor` dejan de poder registrarse a mano: solo se
    crean desde una compra. El servidor lo rechaza, no solo la UI.

### Costo promedio

32. Anexar lotes actualiza `Product.averageCost` con la fórmula incremental actual, dentro de la transacción.
33. Editar o eliminar un lote ligado recalcula el costo con `RecalculateProductAverageCostUseCase` **después del
    commit**.
34. La compra no cambia las fórmulas de costo. `backfill-average-cost.ts` no cambia.

### Seguridad

35. Toda operación sobre una compra verifica que pertenezca a la sucursal de la sesión; si no, responde 404.
36. Empleado, sucursal y establecimiento salen de la sesión, nunca del cliente ni de cookies.

## Fuera de alcance

- Sincronizar compras con EDYOF. La compra es local: no hay repositorio cloud ni compensación.
- Generar compras para lotes históricos, y ligar lotes existentes a una compra.
- Órdenes de compra, recepción parcial y aprobaciones.
- Devolver mercancía al proveedor como flujo propio. El reembolso solo registra dinero.
- Impuestos, descuentos y flete dentro de la compra. El flete sigue siendo `Gasto por Flete o Transporte`.
- Anular una compra completa en un solo paso. Se hace eliminando lotes, reembolsando y eliminando la compra.
- Fecha de pago retroactiva.
- Detectar facturas duplicadas por folio.
- Capturar `lot_unit_purchase` en el formulario de compra: se sigue haciendo desde el detalle del lote.
- Corregir la deuda listada en Riesgos.

## Diseño

### Modelo de datos

```
branch_office 1───N purchase N───1 suplier (opcional)
employee      1───N purchase
purchase      1───N lot           lot.purchase_id          nullable
purchase      1───N transaction   transaction.purchase_id  nullable, ya existe
inventory_item 1──N lot           lot.inventory_item_id    nullable
```

### Dominio

Nuevo slice `src/contexts/purchase-management/purchase/`:

```
domain/
  entities/purchase.entity.ts
  enums/purchase-payment-status.enum.ts     PENDING, PARTIAL, PAID, OVERPAID
  enums/purchase-payment-source.enum.ts     CASH_SESSION, OUTSIDE_CASH
  value-objects/purchase-amount.vo.ts       >= 0, máximo 2 decimales
  value-objects/purchase-invoice-number.vo.ts   máximo 50 caracteres, nullable
  exceptions/purchase-not-found.exception.ts    404
  exceptions/purchase-validate.exception.ts     400
  exceptions/purchase-conflict.exception.ts     409
  repositories/purchase.repository.ts
application/  use-cases/  dtos/  mappers/
infraestructure/persistence/typeorm/{entities,repositories,mappers}/
presentation/ actions/ hooks/ stores/ ui/ interfaces/
```

`PurchaseEntity`, con constructor privado, `create()` y `reconstitute()`:

- Datos: `purchaseId`, `branchOfficeId`, `suplierId`, `employeeId`, `purchaseDate`, `invoiceNumber`, `notes`,
  `totalAmount`, `paidAmount`.
- Getters derivados: `balance` y `paymentStatus`. Comparan en centavos enteros para evitar errores de `number`.
- `applyTotals(total, paid)`, `updateDetails(...)`.
- `ensureCanPay(amount)`, `ensureCanRefund(amount)` y `ensureCanBeDeleted(lotCount)`: lanzan
  `PurchaseConflictException`.

Cambios en dominios existentes:

| Archivo | Cambio |
|---|---|
| `lot/domain/entities/lot.entity.ts` | Agrega `purchaseId` e `inventoryItemId` (`bigint \| null`) a `create`, `reconstitute` y getters |
| `lot/domain/repositories/lot.repository.ts` | `findAllByPurchaseId`, `updateTransactional`, `deleteTransactional` |
| `inventory-item/domain/repositories/inventory-item.repository.ts` | `findByIdForUpdate` |
| `product/domain/repositories/product.repository.ts` | `updateAverageCostTransactional` |
| `transaction/domain/repositories/transaction.repository.ts` | `findAllByPurchaseId` |
| `cash-session/domain/repositories/cash-session.repository.ts` | `lockById` |
| `transaction-type/domain/constants/transaction-type-names.constant.ts` | `PURCHASE_PAYMENT_TRANSACTION_TYPE_NAME`, `PURCHASE_REFUND_TRANSACTION_TYPE_NAME` |
| `transaction-type/domain/constants/excluded-transaction-type-names.constant.ts` | `PURCHASE_EXPENSE_TRANSACTION_TYPE_NAMES`, `PURCHASE_INCOME_TRANSACTION_TYPE_NAMES`, en minúsculas |
| `product/domain/services/average-cost.calculator.ts` (nuevo) | Función pura con la fórmula, hoy duplicada en dos casos de uso que se eliminan |
| `cash-session/domain/services/cash-session-balance.calculator.ts` (nuevo) | Cálculo de fondos, extraído de `register-transaction.use-case.ts:47-59` para no duplicarlo |

Los métodos transaccionales resuelven el manager **dentro del método** con `transactionDB.getManager()`, nunca en
el constructor (ver `spect/08_cloud_transfer_spect.md`, sección 5.5).

### Casos de uso

| Caso de uso | Input | Output | Transacción |
|---|---|---|---|
| `RegisterPurchaseUseCase` | `RegisterPurchaseDTO`: sesión, `suplierId`, `purchaseDate`, `invoiceNumber`, `notes`, `lots[]`, `payment \| null` | `PurchaseResponseDTO` | Sí. Compone los dos siguientes |
| `AddLotsToPurchaseUseCase` | `purchaseId`, `branchOfficeId`, `lots[]` | `PurchaseResponseDTO` | Sí |
| `RegisterPurchasePaymentUseCase` | `purchaseId`, `amount`, `source`, `reference`, `employeeId`, `branchOfficeId` | `PurchaseResponseDTO` | Sí |
| `RegisterPurchaseRefundUseCase` | Igual que el pago | `PurchaseResponseDTO` | Sí |
| `RecalculatePurchaseTotalsUseCase` | `purchaseId` | `PurchaseEntity` | Sí. Interno, sin action |
| `UpdatePurchaseUseCase` | `purchaseId`, `branchOfficeId`, datos de cabecera | `PurchaseResponseDTO` | Sí: propaga el proveedor a los lotes |
| `DeletePurchaseUseCase` | `purchaseId`, `branchOfficeId` | `void` | Sí |
| `FindPurchaseByIdUseCase` | `purchaseId`, `branchOfficeId` | Detalle con lotes y movimientos | No |
| `FindAllPurchasesByBranchOfficeUseCase` | `branchOfficeId`, fechas, proveedor, estado | `PurchaseResponseDTO[]` | No |

`PurchaseLotLineDTO`: `productId`, `purchasePrice`, `initialQuantity`, `purchaseUnit`, `inventoryItemId | null`,
`expirationDate`, `manufacturingDate`, `receivedDate`. El `lotNumber` lo genera el servidor con `uuid`.

`PurchasePaymentInputDTO`: `amount`, `source`, `reference | null`. La referencia se guarda en
`transaction.description`.

**Flujo de `AddLotsToPurchaseUseCase`**, siguiendo el patrón de `CalculateSaleUseCase` (validar fuera, escribir
dentro):

1. Fuera de la transacción: validar productos, `inventory_item` por sucursal y producto, y leer `Product` y stock.
2. Abrir `runInTransaction`.
3. `findByIdForUpdate` de la compra y verificar la sucursal.
4. Guardar cada lote con `saveTransactional`, con `purchaseId`, `suplierId` e `inventoryItemId`.
5. Agrupar por `inventory_item`, recorrer en orden ascendente de id, bloquear con `findByIdForUpdate`, sumar y
   guardar con `saveTransactional`.
6. Agrupar por producto, calcular **una vez** el nuevo promedio con todas sus líneas y guardar con
   `updateAverageCostTransactional`.
7. `RecalculatePurchaseTotalsUseCase`.

Agrupar en los pasos 5 y 6 evita perder sumas cuando dos líneas comparten producto o ubicación.

**Flujo de `RegisterPurchasePaymentUseCase`:**

1. Resolver el tipo con `findByName`. Si falta, `TransactionTypeInvalidException`, como en
   `register-credit-payment.use-case.ts:105-108`.
2. Si `source = CASH_SESSION`, obtener la sesión con `findByEmployeeId`. Debe existir y su caja debe ser de la
   sucursal.
3. En la transacción: bloquear compra, recalcular, `ensureCanPay`.
4. Si es desde caja: bloquear la sesión y comprobar fondos con `CashSessionBalanceCalculator`.
5. Crear `TransactionEntity` con `purchaseId` y `cashSessionId`, o `null`.
6. Recalcular totales y guardar la compra.

`RegisterPurchaseRefundUseCase` es igual, con `ensureCanRefund`, tipo de ingreso y sin chequeo de fondos.

**Orden de bloqueos** en todos los casos, para evitar interbloqueos: compra, sesión de caja, `inventory_item` por
id ascendente.

**Casos de uso existentes que cambian:**

| Caso de uso | Cambio |
|---|---|
| `UpdateLotUseCase` | Carga el lote. Si `purchaseId` es null: comportamiento actual. Si no: `runInTransaction` con bloqueo de compra e item, ajuste de stock, `updateTransactional` y recálculo. Después del commit, `RecalculateProductAverageCostUseCase` |
| `DeleteLotUseCase` | Igual que el anterior, con `deleteTransactional` |
| `RegisterCompleteProductUseCase` | `RCPLot` gana `purchaseId: bigint \| null`. Si viene: `runInTransaction`, bloqueo de compra, validación de sucursal, `saveCompleteProduct`, costo y recálculo |
| `RegisterTransactionUseCase` | Rechaza los dos tipos de compra con 409. Usa el calculador extraído |
| `GetTransactionsFinancialSummaryUseCase` | Excluye los tipos de compra en las líneas 19-22 y 72-77. Agrega `totalPurchases` y `cashFlow` |

`saveCompleteProduct` debe unirse a la transacción activa: se envuelve en `transactionDB.runInTransaction` y
`queryRunner.manager` se reemplaza por `transactionDB.getManager()`. `TypeOrmProductRepository` gana el parámetro
`transactionDB` en su constructor. Hay que actualizar `cloud-transfer-flow.integration.test.ts:129`, que lo
construye directamente.

**Se eliminan:** `RegisterLotUseCase`, `RegisterLotWithInventoryItemUseCase` y sus actions.

**No cambian:** `ApproveCloudTransferUseCase`, porque `LotEntity.create` deja `purchaseId` en null;
`ResolveCloudTransferItemAsNewProductUseCase`; `RecalculateProductAverageCostUseCase`; los casos de uso de
`lot_unit_purchase`.

### Persistencia

Código nuevo en `infraestructure`. `lot` conserva su carpeta `infraestructura`: no se renombra.

**Tabla `purchase`:**

| Columna | Tipo | Notas |
|---|---|---|
| `purchase_id` | BIGSERIAL PK | |
| `branch_office_id` | bigint NOT NULL | FK `branch_office` |
| `suplier_id` | bigint NULL | FK `suplier` |
| `employee_id` | bigint NOT NULL | FK `employee` |
| `purchase_date` | date NOT NULL | Default fecha actual |
| `invoice_number` | varchar(50) NULL | Folio del proveedor |
| `notes` | text NULL | |
| `total_amount` | decimal(14,2) NOT NULL default 0 | Caché recalculada en cada escritura |
| `paid_amount` | decimal(14,2) NOT NULL default 0 | Caché recalculada en cada escritura |
| `created_at`, `updated_at`, `deleted_at` | timestamptz | Vía `TemplateOrmEntity` |

**Columnas nuevas en `lot`:** `purchase_id` bigint NULL (FK `purchase`) e `inventory_item_id` bigint NULL (FK
`inventory_item`).

**FK nueva:** `transaction.purchase_id` → `purchase.purchase_id`. Todas las FK con `ON DELETE NO ACTION`.

**Índices:** `purchase(branch_office_id, purchase_date)`, `purchase(suplier_id)`, `lot(purchase_id)`,
`transaction(purchase_id)`.

**ORM:**

- Crear `purchase.orm-entity.ts` y registrarla en `entities` de `config.ts:50-58`.
- Agregar `@ManyToOne` a `LotOrmEntity` y `TransactionOrmEntity`. `TransactionMapper.toOrm` construye un literal
  tipado, así que debe incluir la relación nueva.
- `LotMapper.toDomain` y `toOrm` incluyen ambos campos.
- `LotRepository.save` sigue copiando sus campos concretos, sin tocar `purchaseId`.
- Registrar `PurchaseOrmEntity` en `create-pgmem-cloud-transfer-datasource.ts`. Si no, `Lot` y `Transaction`
  referencian una entidad desconocida y fallan los tests de traspasos.
- Probar `pnpm build`: relaciones nuevas en un grafo circular (ver "Turbopack vs Webpack" en `AGENTS.md`).

**Migración 1, `CreatePurchaseAndLinkLots`** (generada y revisada a mano):

1. **Verificación previa.** Antes de cualquier cambio:
   `SELECT COUNT(*) FROM "transaction" WHERE purchase_id IS NOT NULL`. Si es mayor que 0, lanzar un error claro y
   abortar. La FK fallaría de todos modos porque `purchase` estará vacía, y esos valores no deben borrarse sin
   revisarlos.
2. `CREATE TABLE purchase` y sus FK.
3. `ALTER TABLE lot ADD` de ambas columnas nullable, sin default. No reescribe la tabla.
4. FK e índices.
5. `down` en orden inverso. Revertir elimina los vínculos: solo es seguro antes de usar el feature.

**No hay backfill.** Los lotes existentes quedan con `purchase_id` NULL y no se crean compras. Inventar compras
históricas generaría egresos con fechas y montos que nadie registró. Reportes:

- El resumen financiero no cambia por esos lotes, porque nunca tuvieron transacción.
- `/purchases/lots` los muestra con la marca "Sin compra" y un filtro.
- El costo promedio y el rendimiento de producto los siguen usando.

**Migración 2, `SeedPurchasePermissions`.** Sembrar permisos tiene una trampa: según `AGENTS.md`, en una instalación
nueva se corre `migration:run` y luego el script inicial, que inserta `permission` con ids fijos del 1 al 10 (línea
26). Si la migración insertara permisos con la secuencia, ocuparía esos ids y **el script fallaría**. Por eso:

- La migración inserta solo si ya hay roles: `INSERT ... SELECT ... WHERE EXISTS (SELECT 1 FROM role WHERE name =
  'global_admin') ON CONFLICT (name) DO NOTHING`. Las asignaciones usan `NOT EXISTS` porque no se confirmó un
  índice único en `role_permission`.
- `initial-data-postgres-script.sql` agrega los mismos permisos y asignaciones por nombre, sin id fijo, después de
  los `setval` de las líneas 46 y 88.
- `down` borra las asignaciones y luego los permisos.

### Server Actions

Todos empiezan con `requireSession`, fuera del `try` o dejando pasar su error, y sus errores no se convierten en
listas vacías (ver spec 12). Validan con yup: ids enteros positivos, dinero con máximo 2 decimales y mayor que 0,
precio con máximo 4 decimales, cantidad con máximo 3, y máximo 200 líneas.

| Action | Permiso | Notas |
|---|---|---|
| `registerPurchaseAction` | `purchase:create`, y `purchase:pay` si trae pago | Nuevo |
| `addLotsToPurchaseAction` | `purchase:create` | Nuevo |
| `updatePurchaseAction` | `purchase:update` | Nuevo |
| `deletePurchaseAction` | `purchase:update` | Nuevo |
| `registerPurchasePaymentAction` | `purchase:pay` | Nuevo |
| `registerPurchaseRefundAction` | `purchase:pay` | Nuevo |
| `findAllPurchasesAction` | `purchase:read` | Nuevo |
| `findPurchaseByIdAction` | `purchase:read` | Nuevo |
| `updateLotAction` | `purchase:update` | Modificado |
| `deleteLotAction` | `purchase:update` | Modificado |
| `registerCompleteProductAction` | Sesión, y `purchase:create` si trae compra | Modificado |
| `registerTransactionAction` | Sesión | Modificado: `purchaseId` deja de aceptarse del cliente y va siempre `null`; empleado y sucursal salen de la sesión |

`findReportsLotsAction` también se modifica para el filtro "Sin compra": lleva `purchase:read`.

**Permisos a sembrar** (propuesta, pendiente de la matriz de la spec 12):

| Permiso | global_admin | establishment_manager | branch_office_management | cajero | seller |
|---|---|---|---|---|---|
| `purchase:read` | Sí | Sí | Sí | Sí | No |
| `purchase:create` | Sí | Sí | Sí | No | No |
| `purchase:update` | Sí | Sí | Sí | No | No |
| `purchase:pay` | Sí | Sí | Sí | Sí | No |

Los permisos viajan en el JWT (`auth.ts:85`). Si `requireSession` los leyera de ahí, los usuarios tendrían que volver
a iniciar sesión. La spec 12 propone leerlos de la base, lo que lo evita.

### UI

| Ruta | Contenido |
|---|---|
| `/purchases` | Menú: Nueva compra, Compras, Lotes, Proveedores |
| `/purchases/list` | **Cambia:** lista compras de la sucursal con folio, fecha, proveedor, total, pagado, saldo y estado |
| `/purchases/new` | Formulario de compra |
| `/purchases/[purchaseId]` | Detalle: datos, lotes, movimientos, anexar lote, pagar, reembolsar |
| `/purchases/lots` | **Nueva:** el contenido actual de `/purchases/list`, con columna "Compra" y filtro "Sin compra" |

**Formulario de compra:** cabecera, tabla de líneas y sección de pago con tres opciones: "Desde caja", "Fuera de caja"
y "A crédito, pagar después". El monto se propone igual al total y puede reducirse. El total se muestra antes de
confirmar. Las líneas viven en un store de Zustand y se guardan en una sola operación.

**Reutilizar:** `TemplateHeader`, `ProtectedRoute`, `PrimaryTable` (`PCol`, `PRow`, `PTableEmpty`,
`PTableSkeletonRows`), `ReportCard`, `ReportCardGrid`, `Badge`, `Button`, `TextInput`, `SelectMenu`, `RadioInput`,
`TemplateModal` o `ResponsiveModal`, `TableSkeleton`, `CardListSkeleton`, y el componente de `scanner` para
capturar productos.

**Componentes nuevos** en `purchase/presentation/ui/`: `FormRegisterPurchase`, `PurchaseLotLines`,
`PurchasePaymentSection`, `PurchasePaymentModal`, `PurchaseRefundModal`, `PurchaseActionsBar`,
`TablePurchasesDesktop`, `ListMovilePurchases`, `PurchaseInformation`, `PurchaseDetail`.

**Cambios en UI existente:**

| Archivo | Cambio |
|---|---|
| `useRegisterLotModal.ts`, `RegisterLotModal.tsx` | Selector de compra obligatorio y uso de `addLotsToPurchaseAction` |
| `LotDetail.tsx` | Enlace "Compra #N". Aviso de que editar cambia el total |
| `useUpdateLotModal.ts`, `UpdateLotModal.tsx` | Proveedor deshabilitado en lotes ligados. Aviso de stock si no hay `inventoryItemId` |
| `useRegisterCompleteProduct.ts`, su formulario | Con `lotCheck`, elegir "Compra" o "Existencia inicial" |
| `useCashTransactionModal.ts:30-36` | Filtra los dos tipos de compra |
| `TransactionInformation.tsx`, `useTransactionInformation.ts` | Tarjetas "Compras" y "Flujo neto". Corrige el tooltip de la línea 51 |
| `TransactionMovementsDesktopTable.tsx:24-33`, `TransactionMovementsCardList.tsx` | Badge azul para compras, con tooltip y enlace a la compra |
| `TransactionMovementsReportDocument.tsx` | Líneas COMPRAS y FLUJO NETO |
| `ITransactionsFinancialSummary.ts`, DTO de respuesta | `totalPurchases`, `cashFlow` |

**Atajos:** sin teclas de función nuevas en esta versión. Escanear o pulsar Enter agrega la línea. Estados de carga,
error y vacío explícitos en cada pantalla.

**Qué verá el usuario.** Periodo con ventas por $10,000 cuyo costo fue $6,000, renta por $1,000 y compras pagadas
por $8,000:

| Tarjeta | Si la compra fuera egreso normal | Con esta spec |
|---|---|---|
| Ingresos | 10,000 | 10,000 |
| Invertido | 6,000 | 6,000 |
| Ganancia | 4,000 | 4,000 |
| Egresos | 9,000 | **1,000** |
| Compras (nueva) | no existe | **8,000** |
| `profitAfterExpenses` | **−5,000 (pérdida falsa)** | 3,000 |
| Ingreso bruto - Egresos | 1,000 | 9,000 |
| Flujo neto (nueva) | no existe | **1,000** |

El 3,000 es la ganancia real del periodo y el 1,000 es lo que realmente quedó después de reponer mercancía. Son
números distintos y los dos son correctos.

## Decisiones y alternativas

| Tema | Elegida | Descartada | Por qué |
|---|---|---|---|
| Egreso sin doble conteo | Mostrar la compra en la lista y excluirla de `totalExpenses`, con tarjeta propia | Egreso normal | Resta la mercancía dos veces |
| | | Quitar `totalInvested` y usar compras como costo | Rompe el margen por periodo: se compra un mes y se vende otro |
| Exclusión | Por nombre de tipo | Por `purchaseId !== null` | Sigue el precedente, es simple y corrige también los pagos manuales históricos, que ya tenían doble conteo. Como contrapartida, cambian cifras de periodos pasados (pregunta 3) |
| Tarjeta "Ingreso bruto - Egresos" | Conservar la fórmula y agregar "Flujo neto" | Restar compras en `grossTotal` | Cambiaría en silencio un número que el usuario conoce |
| Estados de compra | Sin estado guardado: pago derivado de total y pagado | Borrador, confirmada y cancelada | Una compra sin lotes ya cubre la captura gradual. Agregar estados suma reglas en cada caso de uso sin resolver nada adicional |
| Monto del egreso | Transacciones inmutables con saldo derivado | Editar la transacción al editar un lote | Alteraría cortes ya cerrados. Con varios pagos tampoco está claro cuál editar |
| | | Bloquear edición con pagos | Un error de precio en una línea quedaría sin arreglo |
| Registro de pagos | `transaction.purchase_id` como libro de pagos | Tabla `purchase_payment` | La columna ya existe. Origen y referencia bastan. Si después se necesita el método de pago, se puede agregar |
| Crédito | Saldo pendiente, egreso al pagar | Egreso al recibir la mercancía | Mantiene coherencia con las ventas a crédito: el movimiento ocurre cuando se mueve el dinero |
| Total | Caché recalculada desde los lotes | Calcularlo en cada lectura | Mismo criterio de `paidAmount` en la spec 10. Permite listar y filtrar sin agregaciones |
| Enlace del lote | `lot.purchase_id` directo | Tabla intermedia | Un lote pertenece a una compra como máximo |
| Reversión de stock | `lot.inventory_item_id` | Deducirlo por producto y sucursal | Con varias ubicaciones no se puede saber dónde entró |
| Ventas de un lote | Rechazar si el stock no alcanza | Agregar `lot_id` a `sale_detail` | Es un cambio mayor del POS, fuera de este feature |
| Histórico | `purchase_id` NULL, sin backfill | Crear compras automáticas | Inventaría egresos |
| Origen del lote | `purchase_id` NULL más traspaso | Columna `origin` | Nadie necesita hoy esa distinción en un reporte |
| Concurrencia | `FOR UPDATE` sobre compra, sesión e item | Bloqueo optimista con reintentos | Dos cajas pagando la misma compra deben serializarse. Es más simple que reintentar |
| Costo al corregir | Recalcular después del commit | Dentro de la transacción | `calculate()` lee con el repositorio global y no vería los cambios sin confirmar. El costo se puede recalcular de nuevo; el dinero no |
| Sucursal del lote | La aporta la compra | Agregar sucursal a `lot` | Rompería la decisión de que el lote es global por producto |
| Traspasos | Sin compra ni egreso | Generar compra en destino | El dinero no sale en el destino |

## Riesgos

**Dependencias**

- **`requireSession` no existe.** Es prerrequisito bloqueante: la spec 12 debe entregar al menos su fase 3 con
  `employeeId`, `branchOfficeId` y `establishmentId`. No debe usarse el contexto de cookies para operaciones con
  dinero.
- `AGENTS.md` describe `requireSession` como existente. Hay que corregirlo en el mismo PR.
- La spec 12 advierte que `pnpm validate` falla por motivos ajenos. Comprobar el estado antes de empezar, para no
  atribuir esos fallos a este feature.

**Datos**

- Excluir por nombre cambia el resultado de periodos pasados si hay pagos manuales `Pago a Proveedor por Compra`. La
  tarea 1 mide cuántos hay antes de desplegar.
- Si una base tiene esos nombres de tipo editados, `findByName` falla. El error es claro, pero bloquea los pagos.
- `purchase_id` con valores en `transaction` aborta la migración a propósito.

**Comportamiento**

- El egreso cuenta en la fecha de registro. Capturar hoy una compra pagada el mes pasado la deja en este mes.
- El total de la compra puede no coincidir con la factura si esta lleva impuestos, descuentos o flete.
- Un error de captura en una compra pagada desde caja requiere corregir y registrar el reembolso: quedan dos
  movimientos. Es deliberado, y mostrar el total antes de confirmar lo reduce.
- La protección de stock trabaja sobre el `inventory_item` del lote. Si el stock se movió de almacén a venta, se
  rechaza aunque haya producto en otra ubicación: hay que moverlo antes.
- "Existencia inicial" es una salida fácil. Si se usa por comodidad, el egreso se pierde.
- Un lote creado desde el alta completa con compra queda con `inventory_item_id` NULL, porque ese formulario reparte
  cantidades por ubicación. Sus correcciones no ajustan stock.

**Concurrencia y técnica**

- Las ventas no bloquean `inventory_item`. `DiscountInventoryItemUseCase` lee fuera de la transacción y escribe un
  valor absoluto, así que una venta simultánea puede sobrescribir la suma de una compra. Es deuda existente que el
  bloqueo nuevo reduce pero no elimina.
- El promedio móvil tiene una carrera ya documentada (`register-lot-with-inventory-item.use-case.ts:54-56`).
- Si falla el recálculo posterior al commit, el costo queda desactualizado hasta usar "Recalcular costo". El dinero
  no se ve afectado. Debe registrarse en el log.
- Es el primer uso de `FOR UPDATE` en el repo y no se comprobó su soporte en pg-mem.
- El total usa `number`. Se mitiga con redondeo final y comparación en centavos.

**Deuda relacionada que no se corrige aquí**

- Una venta por transferencia registra el total con `sale.cashSessionId` (`register-sale-payment.use-case.ts:73-82`),
  y no encontré tratamiento de transferencias en `cash-management`. Parece inflar el efectivo esperado del corte. Las
  compras no deben copiar ese patrón.
- `RegisterCompleteProductUseCase` no actualiza `averageCost`, así que un producto nuevo con existencia inicial vende
  con costo 0 hasta recalcular. Esta spec solo lo cubre cuando se liga a una compra.
- `update-lot` y `delete-lot` en lotes sin compra siguen sin tocar stock ni costo.
- `saveWithItems` mezcla dos conexiones (`typeorm-lot.repository.ts:50` y `:67`). Queda sin uso al eliminar
  `RegisterLotUseCase`.
- Los ids fijos de `transaction_type` en caja y devoluciones siguen siendo frágiles.
- El tooltip de "Invertido" habla de "promedio ponderado por lote", algo que ya no es exacto.

## Plan de implementación

Orden: database → backend → frontend → tester. Requiere aprobar esta spec y resolver las preguntas 1 a 5.

### Tarea 0: prerrequisitos

- [ ] 0.1 → `backend` → Entregar `requireSession` según la fase 3 de la spec 12. **Aceptación:** existe con tests y
  devuelve empleado, sucursal, establecimiento, roles y permisos actuales.
- [ ] 0.2 → `backend` → Registrar el estado de `pnpm validate` antes de empezar. **Aceptación:** lista de fallos
  previos anotada en el PR.

### database

- [ ] 1 → `database` → Ejecutar, con autorización del usuario, las consultas de solo lectura: filas con
  `purchase_id` y conteo y suma de pagos manuales por tipo. **Aceptación:** resultados anotados en esta spec.
- [ ] 2 → `database` → Crear `purchase.orm-entity.ts`, relaciones en `lot` y `transaction`, registro en `config.ts`.
  **Aceptación:** `pnpm typecheck:ci` no sube errores y `pnpm build` termina.
- [ ] 3 → `database` → Migración `CreatePurchaseAndLinkLots` con verificación previa. **Aceptación:** `up` y `down`
  corren en una base de prueba, y `up` aborta si hay `purchase_id` con valor.
- [ ] 4 → `database` → Migración `SeedPurchasePermissions` y bloque en el script inicial. **Aceptación:** funciona en
  una base existente y en una nueva, en el orden `migration:run` y luego script, sin conflicto de ids.

### backend

- [ ] 5 → `backend` → Dominio de `purchase`: entidad, VOs, enums, excepciones, repositorio. **Aceptación:** tests de
  dominio de la tarea 16 pasan.
- [ ] 6 → `backend` → `Lot` con `purchaseId` e `inventoryItemId` en dominio y mappers. **Aceptación:** la edición de
  un lote no altera esos campos.
- [ ] 7 → `backend` → Métodos transaccionales de `Lot`, `InventoryItem`, `Product`, `Transaction` y `CashSession`, y
  `TypeormPurchaseRepository`. **Aceptación:** resuelven el manager dentro del método.
- [ ] 8 → `backend` → Calculadores de costo y de fondos. **Aceptación:** sin duplicación, con tests del caso de uso de
  transacciones existente en verde.
- [ ] 9 → `backend` → `RecalculatePurchaseTotals`, `AddLotsToPurchase`, `RegisterPurchasePayment`,
  `RegisterPurchaseRefund`, `RegisterPurchase`. **Aceptación:** si falla cualquier paso, no queda nada persistido.
- [ ] 10 → `backend` → `UpdateLotUseCase` y `DeleteLotUseCase` con la rama de lote ligado. **Aceptación:** reglas 19
  a 25.
- [ ] 11 → `backend` → `UpdatePurchase`, `DeletePurchase`, `FindPurchaseById`, `FindAllPurchasesByBranchOffice`.
  **Aceptación:** una compra de otra sucursal responde 404.
- [ ] 12 → `backend` → `GetTransactionsFinancialSummaryUseCase`, constantes, DTO e interfaz. **Aceptación:** el ejemplo
  de la tabla "Qué verá el usuario" pasa como test.
- [ ] 13 → `backend` → `RegisterTransactionUseCase` y su action, y `saveCompleteProduct` en la transacción activa con
  `RegisterCompleteProductUseCase`. **Aceptación:** reglas 9 y 31, y `cloud-transfer-flow.integration.test.ts` en verde.
- [ ] 14 → `backend` → Actions nuevos y modificados con yup. Eliminar `registerLotAction`,
  `registerLotWithInventoryItemAction` y sus casos de uso. Actualizar `AGENTS.md`. **Aceptación:** cada action llama a
  `requireSession` y ninguno usa cookies ni acepta `employeeId`, `branchOfficeId` o `cashSessionId` del cliente.

### frontend

- [ ] 15a → `frontend` → Mover la lista de lotes a `/purchases/lots`, y crear `/purchases/list` y el menú.
  **Aceptación:** estados de carga, error y vacío, y filtro "Sin compra".
- [ ] 15b → `frontend` → `/purchases/new`. **Aceptación:** crea una compra de contado, una desde fuera de caja y una a
  crédito, y muestra el total antes de confirmar.
- [ ] 15c → `frontend` → `/purchases/[purchaseId]`, con anexar lote, pagar y reembolsar. **Aceptación:** muestra saldo,
  estado y movimientos.
- [ ] 15d → `frontend` → `RegisterLotModal`, `UpdateLotModal`, `LotDetail` y alta completa de producto. **Aceptación:**
  no queda en la UI ningún camino para crear un lote suelto sin decisión explícita.
- [ ] 15e → `frontend` → Modal de caja, tarjetas, tabla, lista móvil y ticket. **Aceptación:** los tipos de compra no
  se ofrecen en caja, y las compras se distinguen de los egresos.

### tester

- [ ] 16 → `tester` → Tests de "Pruebas" y `PurchaseOrmEntity` en `create-pgmem-cloud-transfer-datasource.ts`.
  **Aceptación:** `pnpm test` en verde.
- [ ] 17 → `tester` → Confirmar si pg-mem soporta `FOR UPDATE`; si no, cubrir esos casos con fakes y dejarlo anotado.
  **Aceptación:** decisión documentada en el test.

### Cierre

- [ ] 18 → `pnpm validate`, sin fallos nuevos frente a la tarea 0.2.
- [ ] 19 → `code-reviewer` y `security-auditor` sobre el diff: toca dinero, caja y Server Actions.

## Pruebas

**Dominio (`test/contexts/purchase-management/purchase/domain/`)**

- `PurchaseEntity`: estados derivados en sus cuatro casos, saldo en centavos sin error de punto flotante.
- `ensureCanPay`: rechaza 0, negativo y monto mayor al saldo, y acepta el saldo exacto.
- `ensureCanRefund`: rechaza sin saldo a favor o por encima de él.
- `ensureCanBeDeleted`: rechaza con lotes o con pagado distinto de 0.
- VOs: monto negativo, más de 2 decimales, folio mayor a 50.
- `AverageCostCalculator`: stock 0, varias líneas del mismo producto, y resultado igual a la fórmula actual.

**Casos de uso (`test/contexts/purchase-management/purchase/application/use-cases/`)**

- `RegisterPurchase`: de contado desde caja, fuera de caja, a crédito, parcial y sin lotes.
- `RegisterPurchase`: si falla el pago no quedan compra, lotes ni stock.
- `AddLotsToPurchase`: dos líneas con igual producto e item suman ambas; producto de otro establecimiento; item de
  otra sucursal; proveedor heredado; total redondeado.
- `RegisterPurchasePayment`: sin caja abierta, caja de otra sucursal, sin fondos, sobrepago, y varios abonos hasta
  liquidar. Fuera de caja no toca la sesión.
- `RegisterPurchaseRefund`: desde caja y fuera de caja, y sin saldo a favor.
- `UpdateLot` ligado: el precio cambia total y saldo sin tocar transacciones; la cantidad ajusta stock; rechazo por
  stock negativo; compra pagada pasa a `Saldo a favor`; las ventas y su `unitCostAtSale` no cambian.
- `UpdateLot` sin compra: comportamiento idéntico al actual.
- `DeleteLot` ligado: revierte stock y total; rechaza si ya no hay stock; con `inventory_item_id` NULL no toca stock.
- `DeletePurchase`: con lotes, con pagos y vacía.
- `UpdatePurchase`: propaga el proveedor.
- Una sesión cerrada no cambia tras corregir un lote pagado desde ella.
- Una compra de otra sucursal da 404 en cada caso de uso.
- `RegisterCompleteProduct`: con compra suma al total; con existencia inicial no genera nada.
- `ApproveCloudTransfer`: el lote queda sin compra y no crea transacción.

**Existentes a ampliar**

- `get-transactions-financial-summary.use-case.test.ts`: el pago no suma en `totalExpenses`; el reembolso no suma en
  `totalIncomes`; `profitAfterExpenses` no cambia al agregar una compra; `totalPurchases` neto; `cashFlow`; la tabla
  de ejemplo completa.

**Nuevos sobre casos de uso existentes** (hoy no tienen test)

- `FindAllManyFilterTransactionsUseCase`: los pagos y reembolsos de compra siguen en la lista.
- `RegisterTransactionUseCase`: rechaza los dos tipos de compra.

**Componentes**

- Formulario de compra: suma de total, validaciones, tres opciones de pago.
- Modal de caja: no ofrece los tipos de compra.

## Preguntas abiertas para el usuario

1. **¿Te parece correcto ver las compras en su propia tarjeta y no dentro de "Egresos"?** Recomendación: sí. Aparecen
   en la lista de movimientos, con tarjetas "Compras" y "Flujo neto", y la ganancia no se falsea. Si prefieres verlas
   dentro de "Egresos", habría que quitar el costo de lo vendido del cálculo de ganancia, y el margen por periodo
   dejaría de ser fiable.
2. **¿El egreso de una compra a crédito cuenta al pagar o al recibir la mercancía?** Recomendación: al pagar, igual que
   las ventas a crédito. Lo que se debe aparece como saldo en Compras.
3. **Los pagos que ya registraste a mano como "Pago a Proveedor por Compra", ¿dejan de restar a la ganancia?**
   Recomendación: sí, porque hoy se restan dos veces. Consecuencia: la ganancia de periodos pasados puede subir en
   los reportes. Necesito medirlo con la tarea 1 antes de desplegar.
4. **¿Quién puede hacer qué?** Recomendación: la matriz de permisos de arriba. El cajero consulta y paga, pero no crea
   compras; `seller` no accede. Si tus cajeros reciben mercancía, habría que darles `purchase:create`.
5. **¿Mantenemos "Existencia inicial" al dar de alta un producto con lote?** Recomendación: sí, para cargar inventario
   que ya tenías, sin inventar un egreso. La alternativa es exigir siempre una compra, incluso de costo 0.
6. **¿Quieres ligar lotes históricos a compras?** Recomendación: no por ahora; quedan como "Sin compra" y se ven en
   `/purchases/lots`. Si quieres cuadrar el mes en curso, se puede agregar después una acción de ligado manual.
7. **¿El egreso debe poder fecharse en el pasado?** Recomendación: no en esta versión; cuenta el día que se registra.
   Si capturas facturas atrasadas con frecuencia, conviene agregar una fecha de pago.
8. **¿El precio del lote incluye IVA y descuentos?** Recomendación: capturar el costo real pagado por unidad, con IVA
   y descuento aplicados, para que el total coincida con lo que sale de tu dinero. El flete sigue como
   `Gasto por Flete o Transporte`.

## Verificación pendiente

- **Datos reales:** no se consultó la base. No se sabe si `transaction.purchase_id` tiene valores ni cuántos pagos
  manuales existen.
- **Nombres sembrados:** se asume que `Pago a Proveedor por Compra` y `Devolución de Compra a Proveedor` existen tal
  cual en producción.
- **Soporte de pg-mem para `FOR UPDATE`:** no probado.
- **`pnpm build` con la relación nueva:** no probado.
- **Corte con ventas por transferencia:** deducido del código, no reproducido.
- **Selector de productos del formulario:** se propone reutilizar la búsqueda de `findByLocationAndBranchOffice`.
  `frontend` debe confirmar que encaja con productos sin stock en la ubicación.
- **Productos sin control de stock:** se asume que `existsAnyForInventory` en falso los identifica, como en
  `calculate-sale.use-case.ts:113`.
