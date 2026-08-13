# Análisis Técnico: Rendimiento del producto (ventas, compras, ganancia/pérdida, inventario)

> Documento retrospectivo. A diferencia de `01_gestion_imagenes_spect.md` (planificación a futuro), este
> documento describe una feature ya **implementada y verificada** de punta a punta (backend + frontend) el
> 2026-08-12, dejando registro de la ingeniería detrás de la decisión y de qué se construyó exactamente.

## Problema

La página de detalle de producto (`/products/[productId]`) sólo mostraba datos estáticos del producto,
inventario y lotes comprados, pero no respondía a la pregunta de negocio: **¿este producto se ha vendido
bien?** Faltaba una vista que consolidara, por producto: unidades y dinero vendido, unidades y dinero
comprado, ganancia/pérdida estimada, y el valor en dinero del inventario actual.

## Hallazgos sobre el estado del código (previos a implementar)

- **`inventory.product_id` es `UNIQUE`** — un producto vive en una sola sucursal (`InventoryOrmEntity`
  tiene `@OneToOne` hacia `Product`). Lo que hoy se ve como "ubicación" (`venta`/`almacén`/`dañado`/
  `viajando` en `InventoryItem.location`) es intra-sucursal, no inter-sucursal. Por esto la nueva sección
  no repite el desglose por sucursal (ya cubierto por `InventoryDetail.tsx`) y sólo valoriza el stock
  total en dinero.
- **`sale_detail` no tiene `lotId`** — no existe costeo exacto por lote consumido (no hay FIFO real). El
  costo de lo vendido sólo puede aproximarse.
- **Convención de agregación del proyecto**: ningún repositorio del código usa `SUM()`/`getRawMany()` de
  SQL — el patrón 100% consistente es `find()`/`createQueryBuilder().getMany()` trayendo relaciones, y
  sumar en memoria dentro del use-case (ejemplos usados como plantilla:
  `FindTopProductsByBranchOfficeUseCase` para ventas, `FindReportLotsUseCase`/`TypeOrmLotRepository.findReport`
  para compras). Se replicó ese mismo estilo para no introducir un patrón nuevo aislado.
- **`SaleDetailMapper.toDomainEntity`** ya mapea correctamente las relaciones `sale` y `returns`, por lo
  que no fue necesario tocar el mapper para exponer `sale.createdAt` y `returns[]` al use-case.
- **No existe componente `Tabs`** en `src/shared/ui` — las 3 secciones actuales del detalle de producto
  (`ProductDetail`, `InventoryDetail`, `LotDetail`) están simplemente apiladas verticalmente.
- **Excepción de nombres de carpeta**: `purchase-management/lot` usa `infraestructura/` (español
  completo) mientras `product-management/product` y `sale-management/sale-detail` usan `infraestructure/`
  (la ortografía mixta documentada en `CLAUDE.md`). Se respetó cada convención existente al agregar
  archivos nuevos en cada contexto.

## Decisiones de negocio confirmadas con el usuario

1. **Costo de venta**: costo promedio ponderado de `lot.purchasePrice` de todos los lotes del producto
   (no hay costeo exacto por lote). Se indica explícitamente en la UI como "estimado".
2. **UI**: nueva sección apilada, sin construir un componente `Tabs` nuevo (evita infraestructura de UI
   no solicitada).
3. **Rango de datos**: histórico completo por defecto, con filtro de fechas opcional aplicable sin
   recargar la página.

## Impacto arquitectural / Solución implementada

### Backend

- **`SaleDetailRepository`** (`sale-management/sale-detail/domain/repositories/sale-detail.repository.ts`)
  y su implementación **`TypeormSaleDetailRepository`**: nuevo método
  `findAllByProductId(productId, dateInit?, dateFinish?)` — filtra `sale.status = COMPLETED`, acota por
  `sale.createdAt` cuando se pasan fechas, y carga las relaciones `sale` y `returns`.
- **`LotRepository`** (`purchase-management/lot/domain/repositories/lot.repository.ts`) y su
  implementación **`TypeOrmLotRepository`**: nuevo método `findAllByProductId(productId, dateInit?,
  dateFinish?)`, calcado de `findReport()` pero filtrando por `productId` en vez de sucursal.
- **`GetProductPerformanceUseCase`** (nuevo, `product-management/product/application/use-cases/`):
  orquesta `ProductRepository.findById` (para inventario/stock actual), `SaleDetailRepository` y
  `LotRepository`, y calcula en memoria:
  - Ventas: unidades vendidas, unidades devueltas, unidades netas, $ bruto, $ devuelto, $ neto, última
    venta.
  - Compras: unidades compradas, $ comprado, costo promedio unitario, última compra.
  - Resultado: costo estimado de lo vendido (`avgUnitCost * netUnitsSold`), ganancia/pérdida
    (`netRevenue - estimatedCOGS`), margen % sobre venta neta.
  - Inventario: stock actual total, valor a precio de venta, valor a costo promedio.
  - Se evita división por cero cuando no hay compras (`avgUnitCost = 0`) o no hay ventas
    (`marginPercent = 0`).
- **`ProductPerformanceResponseDTO`** (nuevo DTO) y **`IProductPerformance`** (nueva interfaz de
  presentación, espejo del DTO) — se creó una interfaz separada en vez de extender la `IProduct` global,
  para no afectar otras pantallas que ya consumen esa interfaz.
- **`getProductPerformanceAction`** (nueva Server Action, `'use server'` + `unstable_noStore()`), mismo
  patrón que `find-product-by-id.action.ts`: instancia los tres repositorios vía sus factories
  `static create()`, construye el use-case y lo ejecuta.

### Frontend

- **`ProductPerformance.tsx`** (nuevo, `product-management/product/presentation/ui/product-detail/`):
  componente cliente (`'use client'`) que recibe `productId` + `initialPerformance` (precargado por el
  Server Component de la página) y mantiene estado local para el filtro de fechas, invocando
  `getProductPerformanceAction` directamente desde el cliente al aplicar/limpiar el filtro (sin recargar
  la página).
  - Reutiliza exclusivamente componentes ya existentes: `CardGrid`, `Badge` (verde/rojo para
    ganancia/pérdida), `Button`, y los formateadores compartidos `numberMoneyFormat`, `numberBasicFormat`,
    `formatDateShort`, `formatDateForInput`. No se modificó `CardPrimary` (tiene un `<Link>` no aplicable
    aquí) ni se creó componente de UI nuevo en `shared/`.
  - Muestra una nota visible aclarando que la ganancia y el costo de stock son estimados (costo promedio
    ponderado), dada la limitación de costeo exacto por lote.
- **`src/app/(platform)/products/[productId]/page.tsx`**: se agregó la llamada a
  `getProductPerformanceAction(BigInt(productId))` junto a las cargas ya existentes, y se agregó
  `<ProductPerformance />` como 4ª sección, debajo de `LotDetail`.

### Base de datos

- **Sin migraciones**: toda la información requerida ya existía en el esquema (`sale_detail.productId`,
  `lot.productId`, `inventory.inventoryItems`). No se registró ninguna entidad ORM nueva en
  `config.ts`.

## Archivos creados

- `src/contexts/product-management/product/application/dtos/product-performance-response.dto.ts`
- `src/contexts/product-management/product/application/use-cases/get-product-performance.use-case.ts`
- `src/contexts/product-management/product/presentation/interfaces/IProductPerformance.ts`
- `src/contexts/product-management/product/presentation/actions/get-product-performance.action.ts`
- `src/contexts/product-management/product/presentation/ui/product-detail/ProductPerformance.tsx`
- `test/contexts/product-management/product/application/use-cases/get-product-performance.use-case.test.ts`

## Archivos modificados

- `src/contexts/sale-management/sale-detail/domain/repositories/sale-detail.repository.ts`
- `src/contexts/sale-management/sale-detail/infraestructure/persistence/typeorm/repositories/typeorm-sale-detail.repository.ts`
- `src/contexts/purchase-management/lot/domain/repositories/lot.repository.ts`
- `src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/repositories/typeorm-lot.repository.ts`
- `src/app/(platform)/products/[productId]/page.tsx`

## Verificación realizada

1. **Test unitario** del `GetProductPerformanceUseCase` con repositorios mockeados (`jest.fn()`) y
   entidades de dominio construidas vía `reconstitute()`: cubre el cálculo de costo promedio ponderado,
   ventas netas tras devoluciones, margen, y el caso sin compras/ventas registradas (sin división por
   cero). **2/2 pruebas pasan.**
2. **`tsc --noEmit`**: sin errores nuevos en ningún archivo tocado (los errores preexistentes que arroja
   el comando en el resto del proyecto son ajenos a este cambio, consistentes con
   `typescript.ignoreBuildErrors: true` documentado en `CLAUDE.md`).
3. **Ejecución end-to-end contra la base de datos local real**: se corrió el `GetProductPerformanceUseCase`
   completo (vía script `tsx` ad-hoc, sin pasar por HTTP/autenticación) para el producto `876` y otro
   producto adicional, confirmando que las cifras cuadran (unidades vendidas + stock restante = unidades
   compradas, valorización de stock consistente con el costo promedio calculado).
4. **Verificación visual en navegador**: no se pudo completar — la ruta está protegida por NextAuth
   (`ProtectedRoute` + middleware) y no se contó con credenciales de sesión en este entorno. Queda
   pendiente que el usuario confirme visualmente en `pnpm run dev`.
5. **`pnpm run lint`**: falla de forma **preexistente y no relacionada** — Next.js 16.2.10 eliminó el
   subcomando `next lint`; el script del proyecto (`"lint": "next lint"`) queda roto independientemente de
   este cambio.

## Fuera de alcance / limitaciones conocidas

- **Costeo exacto por lote (FIFO)**: no es posible sin agregar `lotId` a `sale_detail` (cambio de esquema
  no solicitado). La ganancia mostrada es una aproximación con costo promedio ponderado, aclarada en la UI.
- **Desglose de stock por sucursal**: no aplica con el modelo actual (`inventory.product_id` único); ya
  cubierto de forma distinta (por ubicación) en `InventoryDetail.tsx`.
- **`lotUnitPurchases`** (presentaciones alternativas de compra de un mismo lote) se excluyeron
  deliberadamente del total de compras para evitar doble conteo de costo — sólo se suma el lote base
  (`purchasePrice * initialQuantity`).
- No se agregó ningún componente `Tabs` genérico ni gráficas — decisión confirmada con el usuario para
  mantener el alcance mínimo.
