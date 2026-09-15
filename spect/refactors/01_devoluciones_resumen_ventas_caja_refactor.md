# Refactor: Descontar devoluciones del resumen de ventas/ganancia en el corte de caja

> Documento de planeación (pre-implementación). A diferencia de los `*_spect.md` de la carpeta padre, este
> describe un **bug** en una feature ya construida (`03_resumen_ventas_caja_spect.md`) y el plan para
> corregirlo, no una feature terminada.

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
