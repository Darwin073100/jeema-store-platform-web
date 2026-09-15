# Refactor: Descontar devoluciones del resumen de ventas/ganancia en el corte de caja

> **Implementado.** A diferencia de los `*_spect.md` de la carpeta padre, este documento describe un
> **bug** que había en una feature ya construida (`03_resumen_ventas_caja_spect.md`) y el plan que se siguió
> para corregirlo. Durante la implementación se detectó y corrigió el mismo bug en una segunda pantalla
> (`/configurations/transactions`) — ver "Extensión implementada: paridad en Movimientos Financieros" al
> final del documento.

## Problema

En `/cash/session/[cashSessionId]` (pantalla "Caja 1" del corte), la tarjeta **"Ventas del día"** muestra
la suma bruta de `sale.totalAmount` de las ventas `COMPLETED` de la sesión, sin restar las devoluciones
hechas sobre esas mismas ventas. **"Monto Invertido"** tiene el mismo problema: suma
`quantity * unitCostAtSale` de **todos** los `sale_detail` de la sesión, incluyendo unidades que ya fueron
devueltas por el cliente.

Ejemplo real capturado en pantalla (`localhost:3000/cash/session/258`):

- Venta 2498: +$140.00, Venta 2499: +$150.00 → suma bruta $290.00.
- Devolución 2500: -$20.00, Devolución 2501: -$10.00 (movimientos de tipo Egreso, "Devolución por Venta al
  Cliente").
- El **Corte** ($260.00, calculado en el cliente a partir de `TransactionEntity`, ver
  `useCashInformation.ts`) ya refleja neto: $700 fondo inicial + $290 ingresos - $30 egresos - $700 retiro
  final... (el punto es que el corte SÍ descuenta la devolución).
- Pero la tarjeta **"Ventas del día" sigue mostrando $290.00**, no $260.00. Y "Monto Invertido"/"Ganancia"
  se calculan sobre las 10 unidades vendidas originalmente, no sobre las 5 que el cliente realmente se
  quedó (usando el ejemplo del usuario: venden 10 agujas, devuelven 5 → las estadísticas deben reflejar 5).

Esto **engaña al dueño del negocio**: cree que vendió/invirtió/ganó más de lo que realmente pasó en ese
turno, justo la pregunta de negocio que `03_resumen_ventas_caja_spect.md` dice resolver.

## Hallazgos sobre el estado del código

- **El bug está sólo en `GetCashSessionSalesSummaryUseCase`**
  (`src/contexts/cash-management/cash-session/application/use-cases/get-cash-session-sales-summary.use-case.ts`).
  No es un problema de diseño nuevo — es un caso de **paridad no aplicada**: la feature hermana
  `GetProductPerformanceUseCase` (`02_rendimiento_producto_spect.md`,
  `src/contexts/product-management/product/application/use-cases/get-product-performance.use-case.ts`) que
  originalmente compartía el mismo enfoque de costeo, **ya fue corregida** para restar devoluciones
  (`unitsReturned`, `netUnitsSold`, `returnsAmount`, `netRevenue`, `estimatedCOGS` calculado sobre
  `netUnitsSold`), pero esa corrección nunca se replicó en el resumen de caja. Este refactor es exactamente
  ese mismo parche, aplicado al segundo lugar donde hacía falta.
- **El modelo de devoluciones ya tiene todo lo necesario, sin cambios de esquema**:
  - `ReturnsEntity` / tabla `returns` (`sale-management/returns`) registra devoluciones **por
    `sale_detail_id`**, con `quantityReturn` y `amountReturn` — una devolución nunca excede lo vendido en
    ese detalle (`ReturnsProductsUseCase` valida `currentTotalAmountReturns <= saleDetailExist.subtotalItem`
    y `currentTotalQuantityReturns <= saleDetailExist.quantity` antes de guardar).
  - `SaleDetailOrmEntity` ya tiene la relación `@OneToMany(() => ReturnsOrmEntity) returns` y
    `SaleDetailMapper` ya mapea `ormEntity.returns → domainEntity.returns` cuando la relación se carga — no
    hace falta tocar el mapper.
  - `SaleDetailRepository.findAllByProductId` (usado por `GetProductPerformanceUseCase`) ya carga
    `relations: { sale: true, returns: true }` — es la referencia exacta a replicar.
- **`CashSessionRepository.findCashSessionWithSalesDetails`**
  (`cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository.ts:120`) hoy
  carga `relations: { employee, cashRegister, sales: { saleDetails: true } }` — **no** incluye
  `saleDetails.returns`. Ese es el único cambio necesario en la capa de persistencia.
- **`sale.totalAmount` nunca se decrementa al devolver** (confirmado revisando `ReturnsProductsUseCase`
  completo): una devolución sólo crea filas en `returns` y un `TransactionEntity` tipo Egreso — el `Sale`
  original queda con su `totalAmount` bruto para siempre. Confirma que `sale.totalAmount` **no** es una
  fuente confiable de "ventas netas"; hay que restar `returns.amountReturn` explícitamente, igual que hace
  `GetProductPerformanceUseCase` con `grossRevenue - returnsAmount`.
- **`SaleStatusEnum.REFUNDED` existe pero nunca se usa** (`ReturnsProductsUseCase` nunca hace
  `sale.updateStatus(REFUNDED)`, ni parcial ni total). No se puede filtrar "ventas devueltas" por status —
  confirma que la única fuente de verdad de una devolución es la tabla `returns`, vía `saleDetail.returns`.
- **Convención de agregación del proyecto** (igual que documentó `03_resumen_ventas_caja_spect.md`): sin
  `SUM()`/`getRawMany()`, `find()` con relaciones + reducción en memoria dentro del use-case. Este refactor
  la respeta.
- **Decisión de negocio ya resuelta para "sesión de la devolución"**: una `ReturnsEntity` no tiene
  `cash_session_id` propio — sólo el `TransactionEntity` (Egreso) generado junto con ella lo tiene, y puede
  no coincidir con la sesión donde se hizo la venta original si el cliente devuelve en un turno distinto.
  Este refactor **neta la devolución contra la sesión de la venta original** (vía `saleDetail.returns`,
  sin filtrar por la sesión de la devolución), replicando exactamente el criterio ya usado por
  `GetProductPerformanceUseCase` (que tampoco filtra devoluciones por fecha/sesión). Ver "Fuera de alcance"
  para la implicación de este criterio.

## Impacto arquitectural

- **Backend**: cambia sólo la capa `infraestructure` (relación cargada) y `application` (cálculo) de
  `cash-session`. Sin cambios de dominio (`ReturnsEntity`/`SaleDetailEntity` no se tocan), sin migraciones.
- **Frontend**: `CashSalesSummary.tsx` gana 2 tarjetas/indicadores informativos nuevos (unidades y monto
  devuelto), pero las 3 tarjetas existentes siguen recibiendo los mismos nombres de prop — sólo cambia el
  valor numérico que reciben.
- **Base de datos**: ninguno. Todo el dato ya existe (`returns.quantity_return`, `returns.amount_return`).

## Propuesta de solución

### 1. `TypeormCashSessionRepository.findCashSessionWithSalesDetails`

Agregar `returns: true` a la relación de `saleDetails`, igual que ya hace
`SaleDetailRepository.findAllByProductId`:

```ts
relations: {
    employee: true,
    cashRegister: true,
    sales: {
        saleDetails: {
            returns: true,
        },
    },
},
```

### 2. `GetCashSessionSalesSummaryUseCase`

Replicar el mismo patrón neto que `GetProductPerformanceUseCase` (unitsSold/unitsReturned/netUnitsSold y
grossRevenue/returnsAmount/netRevenue), pero a nivel de sesión de caja en vez de producto:

```ts
const completedSales = (cashSession.sales ?? []).filter(sale => sale.status === SaleStatusEnum.COMPLETED);
const salesCount = completedSales.length;
const saleDetails = completedSales.flatMap(sale => sale.saleDetails ?? []);

const grossSales = completedSales.reduce((acc, sale) => acc + sale.totalAmount, 0);
const returnsAmount = saleDetails.reduce(
    (acc, detail) => acc + (detail.returns?.reduce((sum, item) => sum + item.amountReturn, 0) ?? 0),
    0,
);
const totalSales = grossSales - returnsAmount; // neto, lo que realmente se quedó el negocio

// Costo: sólo de las unidades que el cliente realmente se quedó (quantity - quantityReturn),
// usando el costo congelado unitCostAtSale (mismo criterio que GetProductPerformanceUseCase).
const totalInvested = saleDetails.reduce((acc, detail) => {
    const unitsReturned = detail.returns?.reduce((sum, item) => sum + item.quantityReturn, 0) ?? 0;
    const netQuantity = detail.quantity - unitsReturned;
    return acc + netQuantity * (detail.unitCostAtSale ?? 0);
}, 0);

const profit = totalSales - totalInvested;
const marginPercent = totalSales > 0 ? (profit / totalSales) * 100 : 0;
```

Con los datos de la captura: `grossSales = 290`, `returnsAmount = 30` → `totalSales = 260` (coincide con el
Corte). Monto Invertido y Ganancia bajan proporcionalmente a las 5 agujas que sí se quedó el cliente, no 10.

### 3. DTO / interfaz de presentación

Extender `CashSessionSalesSummaryResponseDTO` e `ICashSessionSalesSummary` (mismo shape en ambos, como ya
hace el resto del código) con los campos intermedios, para que la UI pueda mostrar el desglose si se desea
más adelante y para que quede trazable de dónde sale `totalSales`:

```ts
export interface CashSessionSalesSummaryResponseDTO {
    cashSessionId: bigint;
    salesCount: number;
    grossSales: number;      // nuevo: bruto, sin descontar devoluciones
    returnsAmount: number;   // nuevo: total devuelto en $ de esta sesión
    totalSales: number;      // ya existía — ahora neto (grossSales - returnsAmount)
    totalInvested: number;   // ya existía — ahora calculado sobre unidades netas
    profit: number;
    marginPercent: number;
}
```

(`ICashSessionSalesSummary` se actualiza igual, en paralelo — así se mantuvo hasta ahora en este archivo).

### 4. Frontend — `CashSalesSummary.tsx`

Sin romper el layout de 3 tarjetas: la tarjeta "Ventas del día" pasa a leer el `totalSales` ya neto (sin
tocar su JSX), y se le agrega un subtítulo pequeño opcional cuando `returnsAmount > 0`, ej.
`"$290.00 - $30.00 devuelto"`, para que el dueño del negocio entienda por qué el número bajó respecto a lo
que recuerda haber vendido — evita que el fix se vea como "ahora falta dinero". Detalle de estilo a
definir en implementación, no es parte de la lógica de negocio de este documento.

### 5. Consistencia — no se toca `GetProductPerformanceUseCase`

Ya está correcto; se usa como referencia, no como archivo a modificar.

## Plan de implementación

1. `TypeormCashSessionRepository.findCashSessionWithSalesDetails`: agregar `saleDetails.returns` a
   `relations`.
2. `GetCashSessionSalesSummaryUseCase`: implementar `grossSales`/`returnsAmount`/`totalSales` neto y
   `totalInvested` sobre unidades netas, como en la sección anterior.
3. Actualizar `CashSessionSalesSummaryResponseDTO` e `ICashSessionSalesSummary` con los campos nuevos.
4. Actualizar `getCashSessionSalesSummaryAction` sólo si el mapper de acción arma el objeto campo por campo
   (verificar; si sólo hace `return result`, no requiere cambio).
5. `CashSalesSummary.tsx`: consumir `totalSales` neto (ya lo hace, sin cambio de lógica) y, opcionalmente,
   mostrar `returnsAmount` como subtítulo/indicador cuando sea > 0.
6. Test unitario para `GetCashSessionSalesSummaryUseCase` (no existía ninguno, ver limitación conocida en
   `03_resumen_ventas_caja_spect.md`) cubriendo al menos: venta sin devolución, venta con devolución
   parcial (caso "10 agujas, devuelven 5"), venta con devolución total, producto sin `unitCostAtSale`
   (legacy, debe seguir sin explotar).
7. Verificar visualmente en `/cash/session/[cashSessionId]` contra una sesión con devoluciones reales (la
   de la captura, sesión 258, sirve como caso de prueba manual: se espera "Ventas del día" = $260.00).

## Extensión implementada: paridad en "Movimientos Financieros" (`/configurations/transactions`)

Durante la implementación se corroboró, a pedido del usuario, si `GetTransactionsFinancialSummaryUseCase`
(la tarjeta "Ingresos"/"Invertido"/"Ganancia..." de `/configurations/transactions`) tenía el mismo bug que
el resumen de caja. **Sí lo tenía**, con el agravante de que ese use-case sí trata explícitamente los
egresos (a diferencia de la tarjeta de caja, que ni los mostraba): contaba el ingreso bruto de la venta,
el costo de **todas** las unidades vendidas (sin descontar las devueltas), y además restaba el monto
devuelto **otra vez** como un egreso normal (`Devolución por Venta al Cliente` es `accountType = 'Egreso'`
y no estaba en `EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES`) — es decir, `profitAfterExpenses` penalizaba el
costo de la mercancía devuelta dos veces (una vía costo no descontado, otra vía el egreso) sin nunca
devolver ese costo a "lo que el negocio realmente conservó".

Se corrigió con el mismo patrón que el resumen de caja, más un cambio adicional que resuelve directamente
los dos pedidos del usuario ("que el egreso se reste en automático a ingresos" y "ocultar esa transacción,
que sólo se vea en caja y en detalle de venta"):

1. **`TypeormSaleRepository.findManyWithDetailsByIds`**: se agregó `saleDetails.returns` a `relations`
   (antes sólo cargaba `saleDetails: true`, sin `returns` — no había forma de netear).
2. **`GetTransactionsFinancialSummaryUseCase`**: `totalIncomes` ahora es `grossIncomes - returnsAmount`
   (neteado contra `saleDetail.returns[].amountReturn`, igual que en caja) y `totalInvested` se calcula
   sobre `quantity - quantityReturn` por detalle, en vez de `quantity` completo.
3. **`RETURN_TRANSACTION_TYPE_NAMES`** (constante nueva, mismo archivo): `['devolución por venta al
   cliente']`. Primer intento de este refactor fue reutilizar `EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES`
   para además ocultar la devolución de la lista/tabla/Excel de `/configurations/transactions` — el
   usuario pidió revertir esa parte: **quiere seguir viendo la fila en la lista/tabla**, sólo que no se
   trate como un egreso más en los totales ni visualmente. Por eso se separó en dos constantes:
   - `EXCLUDED_EXPENSE_TRANSACTION_TYPE_NAMES` queda como estaba originalmente (sólo `'retiro de
     efectivo/corte de caja'`) — sigue afectando tanto la lista (`FindAllManyFilterTransactionsUseCase`)
     como los totales.
   - `RETURN_TRANSACTION_TYPE_NAMES` sólo la usa `GetTransactionsFinancialSummaryUseCase`, únicamente para
     excluir la devolución de `expenseTransactions`/`totalExpenses` (evita el doble conteo descrito
     arriba, ya que su monto se restó de `totalIncomes` en el paso 2) — **no** afecta la lista, por lo que
     la fila sigue apareciendo en la tabla, tarjetas y export a Excel de esta pantalla.
   - Tampoco afecta al detalle de caja (`/cash/session/[id]`) ni al detalle de venta
     (`ReturnsProductsModal.tsx`, `FinancialSummary.tsx`, `SaleDetailList.tsx`): ninguno lee estas
     constantes, la devolución se sigue viendo igual ahí.
4. **UI — distinguir visualmente la fila sin tratarla como egreso**: en
   `TransactionMovementsDesktopTable.tsx` y `TransactionMovementsCardList.tsx`, la fila de una transacción
   con `transactionType.name === 'Devolución por Venta al Cliente'` usa `Badge type="purple"` (con un
   `title` explicando por qué) en vez del `red` que usan los demás Egresos, y en la tarjeta móvil el monto
   también se pinta en morado en vez de rojo. El resto de la fila (folio, monto, descripción, etc.) no
   cambia.
5. **DTO/interfaz**: `TransactionsFinancialSummaryResponseDTO` e `ITransactionsFinancialSummary` ganaron
   `grossIncomes`/`returnsAmount`, igual que se hizo en `CashSessionSalesSummaryResponseDTO`.
6. **`TransactionInformation.tsx`**: la tarjeta "Ingresos" gana el mismo subtítulo informativo que
   "Ventas del día" en caja (`$350.00 - $100.00 devuelto`) cuando `returnsAmount > 0`, para que no se lea
   como que "falta dinero".

### Pregunta del usuario: ¿los ingresos sin `saleId` cuentan como ganancia pura?

**Sí, confirmado en el código** (y esto no se tocó en este refactor — se deja documentado porque el
usuario preguntó explícitamente). El propio código ya tenía esta nota antes de este refactor:

> "los ingresos manuales (sin saleId) cuentan en totalIncomes pero no aportan aquí a totalInvested, ya que
> no tienen costo atribuible"

Es decir: cualquier `TransactionEntity` de tipo `Ingreso` sin `saleId` (p. ej. `Intereses Ganados`, `Venta
de Activo Fijo`, `Devolución de Compra a Proveedor`) entra 100% a `profitBeforeExpenses`/`profitAfterExpenses`
sin costo asociado, porque `totalInvested` sólo se calcula a partir de `saleDetails` de ventas con
`saleId`. Para tipos como "Intereses Ganados" esto es correcto (no tienen costo real). Pero se encontró un
**riesgo concreto no pedido para corregir ahora**: en el modal de movimiento manual de caja
(`useCashTransactionModal.ts`), el tipo `'Ingreso por Venta de Mercancía'` **no está excluido** de las
opciones seleccionables manualmente (línea comentada: `// .filter(item => item.name !== 'Ingreso por
Venta de Mercancía')`), y ese flujo siempre manda `saleId: null`. Si un cajero registra ahí un ingreso de
ese tipo (en vez de hacerlo por el flujo real de venta), se contará como ganancia 100% sin costo,
exactamente el escenario que preocupa al usuario. **Queda pendiente de decisión**: ¿ocultar esa opción del
modal (como ya se hizo con "Devolución por Venta al Cliente" en el mismo archivo), o dejarlo así porque
hay un caso de uso legítimo para registrarlo manualmente?

## Fuera de alcance / limitaciones conocidas (heredadas o nuevas)

- **Devolución en una sesión de caja distinta a la de la venta**: con el criterio elegido (netear contra la
  sesión de la venta original, no la de la devolución), si el cliente devuelve en un turno posterior, el
  resumen de la sesión **ya cerrada** de la venta original cambiará retroactivamente al recalcularse (la
  consulta es en vivo, no un snapshot). Esto es consistente con cómo ya se comporta
  `GetProductPerformanceUseCase` y con la ausencia de snapshot en el resto de esta feature, pero es una
  decisión de producto que vale la pena confirmar con el usuario antes de dar el refactor por cerrado.
- **`sale.totalAmount` sigue sin actualizarse en la devolución**: fuera de alcance de este refactor tocar
  `ReturnsProductsUseCase` para decrementarlo — se prefiere no tocar el caso de uso de devoluciones
  (afecta impresión de tickets, historial de venta, etc.) y en su lugar calcular neto en el use-case de
  resumen, igual que ya se decidió para `GetProductPerformanceUseCase`.
- **`SaleStatusEnum.REFUNDED` sigue sin usarse**: no se activa como parte de este refactor; es un problema
  de UX de otra pantalla (ej. lista/detalle de ventas no muestra que una venta tuvo devolución), no de la
  caja.
- **Costeo aproximado**: hereda la misma limitación de `03_resumen_ventas_caja_spect.md` —
  `unitCostAtSale` es un snapshot de `Product.averageCost` al momento de la venta, no costeo FIFO exacto
  por lote.
- **`'Ingreso por Venta de Mercancía'` manual sin `saleId`**: ver sección anterior — riesgo detectado pero
  no corregido en este refactor, requiere decisión del usuario.

## Archivos modificados (implementación)

- `src/contexts/cash-management/cash-session/infraestructure/repositories/typeorm-cash-session.repository.ts`
- `src/contexts/cash-management/cash-session/application/use-cases/get-cash-session-sales-summary.use-case.ts`
- `src/contexts/cash-management/cash-session/application/dtos/cash-session-sales-summary-response.dto.ts`
- `src/contexts/cash-management/cash-session/presentation/interfaces/ICashSessionSalesSummary.ts`
- `src/contexts/cash-management/cash-session/presentation/ui/close/CashSalesSummary.tsx`
- `src/contexts/sale-management/sale/infraestructure/persistence/typeorm/repositories/typeorm-sale.repository.ts`
- `src/contexts/transaction-management/transaction-type/domain/constants/excluded-transaction-type-names.constant.ts`
- `src/contexts/transaction-management/transaction/application/use-cases/get-transactions-financial-summary.use-case.ts`
- `src/contexts/transaction-management/transaction/application/dtos/transactions-financial-summary-response.dto.ts`
- `src/contexts/transaction-management/transaction/presentation/interfaces/ITransactionsFinancialSummary.ts`
- `src/contexts/transaction-management/transaction/presentation/ui/TransactionInformation.tsx`
- `src/contexts/transaction-management/transaction/presentation/ui/TransactionMovementsDesktopTable.tsx`
- `src/contexts/transaction-management/transaction/presentation/ui/TransactionMovementsCardList.tsx`

## Archivos de test creados

- `test/contexts/cash-management/cash-session/application/use-cases/get-cash-session-sales-summary.use-case.test.ts`
- `test/contexts/transaction-management/transaction/application/use-cases/get-transactions-financial-summary.use-case.test.ts`

## Verificación realizada

1. **`tsc --noEmit`**: sin errores nuevos en ningún archivo tocado (67 errores preexistentes en el
   proyecto, ninguno relacionado a este cambio — mismo tipo de baseline que documentan los demás `*_spect.md`).
2. **`pnpm test` (jest) sobre los archivos nuevos**: 5/5 tests pasan, cubriendo devolución parcial (10
   agujas, devuelven 5), venta sin devolución, sesión/lista vacía (sin dividir por cero), venta no
   `COMPLETED` excluida, e ingreso manual sin `saleId` (`Apertura de Caja`) excluido del cálculo.
3. **Suite completa (`npx jest --watchAll=false`)**: sin regresiones — 32/32 tests individuales pasan; la
   única suite que falla (`findAllProductsByEstablishmentFilterAction.test.ts`, `Request is not defined`)
   es un problema de entorno de Next/jsdom preexistente, no relacionado a los archivos de este refactor.
4. **Verificación visual en navegador**: pendiente — no se levantó `pnpm run dev` contra datos reales en
   esta sesión. La sesión de caja 258 de la captura original sirve como caso manual esperado: "Ventas del
   día" debería pasar de $290.00 a $260.00.
