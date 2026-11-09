# 14 — Top de productos vendidos en el inicio

> Documento retrospectivo: describe un cambio **ya implementado** en la rama `development` el 2026-11-08, sin
> commit todavía. Las rutas fueron comprobadas en esa fecha. Lo que no se pudo comprobar está en "Verificación
> pendiente".

## Problema

La pantalla de inicio (`/`) muestra dos rankings: "Más vendido por volumen" y "Más vendido por monto". Solo
permitía filtrar por rango de fechas y siempre mostraba 10 productos.

Se pidió:

- Poder ver más de 10 registros, hasta un top 100.
- Filtrar por categoría (ejemplo: lo más vendido de Papelería en agosto, top 100).
- Mantener el comportamiento por defecto: top 10, todas las categorías, mes actual.
- Hacer los filtros más accesibles, sobre todo el filtro por mes.

## Hallazgos sobre el código anterior

1. **Todo se calculaba en memoria.** `TypeOrmProductRepository.findAllByBranchOffice` cargaba todos los productos
   con ventas en el periodo, junto con **todos** sus `saleDetails`. Después, el caso de uso sumaba, ordenaba y
   cortaba en JavaScript. Con un top 100 o con meses de mucho movimiento, el costo crece con el número de
   detalles de venta, no con el número de filas que se muestran.
2. **No se filtraba por sucursal.** El `where` filtraba productos del establecimiento que contiene la sucursal,
   más ventas `COMPLETED` del periodo, pero **no** `sale.branch_office_id`. Así, el ranking "de la sucursal"
   sumaba las ventas de todas las sucursales del establecimiento.
3. **Se hacían dos viajes iguales.** La página y el hook llamaban al action dos veces, una por cada orden, y cada
   llamada repetía toda la carga.
4. **El action no tenía autorización ni validación.** `findTopProductsByBranchOfficeAction` no verificaba la
   sesión, aceptaba un `limit` arbitrario del cliente y convertía cualquier error en `[]`.
5. **Los datos llegaban a usuarios sin permiso.** `page.tsx` calculaba el top en el servidor para cualquier
   usuario y lo pasaba como props. `HideElement` solo lo ocultaba en el navegador, pero los datos ya viajaban en
   el payload de RSC. Es el problema 7 de la spec 12.
6. **El caso de uso mutaba el DTO.** `dto.dateFinish.setDate(...)` modificaba la fecha recibida.
7. **`requireSession` no existía**, aunque `AGENTS.md` lo describe. Ya estaba registrado en la spec 12.

## Reglas de negocio

1. Solo cuentan ventas con estado `COMPLETED` de la **sucursal activa** (cookie `branchOfficeCookie`).
2. Por cada producto se calculan las unidades (`SUM(sale_detail.quantity)`) y el monto
   (`SUM(sale_detail.subtotal_item)`). Igual que antes, las devoluciones no se descuentan.
3. Se generan dos rankings con el mismo filtro: por unidades y por monto, ambos descendentes. En caso de empate
   se ordena por nombre de producto, de forma ascendente.
4. **Prioridad del periodo:** rango (`dateInit`/`dateFinish`) → mes (`month`) → mes actual.
   - En un rango, el día final es inclusivo. Internamente el periodo es semiabierto: `[inicio, fin + 1 día)`.
   - Si falta uno de los extremos del rango, se completa con el inicio o el fin del mes actual. Es el mismo
     criterio que se usaba antes y el de `FindCashSessionAllByBranchOfficeUseCase`.
   - Si el inicio es posterior al fin, se responde con error 400 (`InvalidSalesPeriodException`).
5. El mes actual se determina con `TimeMaster('America/Mexico_City')`.
6. Límite: por defecto 10; el action acepta de 1 a 100 y el caso de uso lo acota a ese mismo rango. La UI ofrece
   10, 25, 50 y 100.
7. Categoría: opcional; vacía significa todas.
8. Solo pueden ver el top los roles `global_admin`, `establishment_manager` y `branch_office_management`. Son los
   mismos que tenía el `HideElement` anterior. La regla ahora se aplica **en el servidor**.

## Fuera de alcance

- Descontar devoluciones del ranking.
- Validar que el usuario tenga acceso a la sucursal de la cookie. La cookie la escribe el cliente; ver el
  problema 4 de la spec 12.
- Exportar el ranking (CSV, impresión).
- Migrar el resto de actions a `requireSession`.

## Diseño

### Dominio

- `domain/read-models/top-selling-product.read-model.ts` (nuevo):
  - `TopSellingProductsCriteria`: `dateInit`, `dateFinish` (exclusivo), `categoryId: bigint | null`,
    `orderBy: FilterTopEnum`, `limit`.
  - `TopSellingProduct`: `productId`, `name`, `categoryName`, `quantitySales`, `totalSales`.
- `ProductRepository`: se reemplaza `findAllByBranchOffice(branchOfficeId, dateInit, dateFinish)` por
  `findTopSellingByBranchOffice(branchOfficeId, criteria)`. El método anterior solo lo usaba este caso de uso.
- `domain/exceptions/invalid-sales-period.exception.ts` (nuevo): `DomainException` con estado 400.
- `FilterTopEnum` se conserva y ahora indica el orden de la consulta.

### Caso de uso

`FindTopProductsByBranchOfficeUseCase.execute(branchOfficeId, dto)`:

- Resuelve el periodo según la regla 4 sin mutar el DTO. Las fechas `YYYY-MM-DD` se interpretan como
  medianoche local con `new Date(y, m - 1, d)`.
- Acota el límite (constantes exportadas `TOP_PRODUCTS_DEFAULT_LIMIT = 10` y `TOP_PRODUCTS_MAX_LIMIT = 100`).
- Ejecuta las dos consultas en paralelo (`Promise.all`).
- Devuelve `TopProductsResponseDto`: `{ byQuantity, byTotal, dateInit, dateFinish }`. Las fechas van en formato
  `YYYY-MM-DD` y `dateFinish` es inclusiva. La UI las usa para mostrar el periodo consultado.

DTOs:

- `FilterTopRequestDTO`: `limit?`, `categoryId?` (string), `month?` (`YYYY-MM`), `dateInit?` y `dateFinish?`
  (`YYYY-MM-DD`). Las fechas viajan como texto para evitar el desfase de zona horaria que produce serializar un
  `Date` desde el navegador.
- `ProductsTopByBranchOfficeResponseDto` agrega `categoryName`.

### Persistencia

`TypeOrmProductRepository.findTopSellingByBranchOffice` hace una sola consulta agregada sobre `sale_detail`:

```sql
SELECT p.product_id, p.name AS "productName", MAX(c.name) AS "categoryName",
       SUM(sd.quantity) AS "quantitySales", SUM(sd.subtotal_item) AS "totalSales"
FROM sale_detail sd
JOIN sale s ON s.sale_id = sd.sale_id
JOIN product p ON p.product_id = sd.product_id
LEFT JOIN category c ON c.category_id = p.category_id
WHERE s.branch_office_id = :branchOfficeId AND s.status = 'COMPLETED'
  AND s.created_at >= :dateInit AND s.created_at < :dateFinish
  [AND p.category_id = :categoryId]
GROUP BY p.product_id, p.name
ORDER BY "<métrica>" DESC, p.name ASC
LIMIT :limit
```

- TypeORM agrega `deleted_at IS NULL` a la tabla principal y a cada join. Se comprobó en el SQL generado.
- `pg` devuelve `bigint` y `decimal` como texto; el repositorio los convierte con `BigInt()` y `Number()`.
- `MAX(c.name)` en vez de `GROUP BY c.name`: ver "Decisiones".
- No requiere migración.

### Server Action

`findTopProductsByBranchOfficeAction(filter = {})`:

1. `requireSession({ roles: [...] })` con los tres roles de la regla 8.
2. Valida el filtro con yup y `stripUnknown`. Los textos vacíos se convierten en `null`, y `categoryId`,
   `month` y las fechas se validan con regex.
3. Lee la sucursal de `branchOfficeCookie`, igual que el resto de los actions.
4. Devuelve `Result.success(TopProductsResponseDto)` o, si algo falla, `handleError(...)`. Ya no devuelve `[]`:
   un acceso denegado llega como `ok: false` con estado 403.

El archivo es `'use server'` y por eso solo exporta la función. La lista de roles es una constante interna.

### Autorización: `requireSession` (versión mínima)

Nuevo `src/shared/infrastructure/auth/require-session.ts`:

- Lee la sesión con `getServerSession(authOptions)`. Si no hay sesión, lanza `UnauthenticatedException` (401).
- Para `roles` y `permissions` basta con **al menos uno** de cada lista; la comparación no distingue mayúsculas.
  Si no se cumple, lanza `ForbiddenException` (403).
- Devuelve `session.user`.

**No cubre toda la fase 3 de la spec 12.** No consulta al usuario en la base para detectar desactivaciones,
no obtiene la sucursal ni el establecimiento del servidor y no tiene tests propios. Hay que completarlo cuando
se ejecute esa fase.

### Página `/`

- Llama al action una vez y sin filtro.
- Si el resultado es `ok`, pide las categorías con `findAllCategoriesByEstablishmentAction` y renderiza
  `TopProductsSection`. Si no, no renderiza la sección y no se envía ningún dato al cliente.
- Se eliminó `HideElement` de esta sección.

### UI

`useTopProductsSection` y `TopProductsSection`:

- **Barra de filtros que se aplica al cambiar**, sin botón:
  - Selector segmentado **Mes | Rango** con botones que usan `aria-pressed`.
  - Mes: `<input type="month">`, que inicia en el mes que devolvió el servidor, no en el del navegador.
  - Rango: dos `<input type="date">` con `min` y `max` cruzados. Al cambiar a rango se precarga el periodo
    visible y no se repite la consulta. Solo se consulta cuando ambas fechas están completas.
  - Categoría: `SelectMenu` con la opción vacía "Todas las categorías".
  - Mostrar: Top 10, 25, 50 o 100.
- Muestra el texto "Del 1 nov 2026 al 30 nov 2026" o el mensaje de error, con `aria-live="polite"`.
- Durante la carga muestra un spinner y baja la opacidad de las tablas; la sección lleva `aria-busy`.
- Si no hay resultados muestra `PTableEmpty`. Las tablas tienen `max-h-[40rem]` con scroll para el top 100.
- Cuando se ven todas las categorías, cada producto muestra su categoría debajo del nombre.
- Contra respuestas fuera de orden, un contador de peticiones (`useRef`) hace que solo la última actualice las
  tablas.
- Se usa estado controlado (`useState`) en vez de react-hook-form, porque no hay envío de formulario.

Cambios compatibles en `shared/ui`:

- `SelectMenu`: prop opcional `placeholder`. Por defecto sigue mostrando "Selecciona una opción"; con `null` se
  oculta la opción vacía.
- `TextInput`: el tipo `'month'` se agrega a la unión de `type`.

## Decisiones y alternativas

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Agregación en SQL | Seguir agregando en memoria | El costo dependía del total de detalles de venta, no del top pedido |
| Un action devuelve ambos rankings | Dos llamadas, como antes | Una sola autorización, validación y ida y vuelta |
| Fechas como texto `YYYY-MM-DD` / `YYYY-MM` | `Date` serializado desde el cliente | `new Date('2026-08-01')` se interpreta como UTC y en México se recorre al día anterior |
| `MAX(category.name)` | `GROUP BY ..., category.name` | Son equivalentes en Postgres, porque cada producto tiene una sola categoría. Pero pg-mem confunde dos columnas `name` en el `GROUP BY` y devolvía el nombre de la categoría como nombre del producto. Se reprodujo de forma aislada |
| Alias `productName` | Alias `name` | Evita la ambigüedad con columnas `name` |
| Read model en `domain/read-models/` | Devolver `ProductEntity` | El ranking es una proyección; reconstituir entidades completas no aporta nada |
| `requireSession` mínimo ahora | Esperar la fase 3 de la spec 12 | `AGENTS.md` lo exige en todo action modificado |
| Autorizar en servidor y quitar `HideElement` | Mantener `HideElement` | `HideElement` no evita que los datos viajen al cliente |

## Riesgos

- **Las cifras cambian.** Al filtrar por sucursal (hallazgo 2), en establecimientos con varias sucursales el
  ranking muestra números menores que antes. Es la corrección esperada, pero conviene avisar a los usuarios.
- **Índices.** No se encontraron índices declarados sobre `sale` ni `sale_detail` en las migraciones. Si la
  consulta se vuelve lenta, conviene evaluar un índice en `sale(branch_office_id, status, created_at)` y otro en
  `sale_detail(sale_id)`, mediante `/new-migration`.
- **Zona horaria.** Los límites del periodo se construyen en la hora local del proceso de Node, igual que antes
  con `TimeMaster.getCurrentMonthRange`. Si el servidor no está en la zona de la tienda, los bordes del día se
  desplazan.
- **Logs ruidosos.** Cuando un usuario sin rol abre `/`, el 403 pasa por `handleError`, que hace
  `console.error` con el stack. No afecta la funcionalidad.
- **Cookie de sucursal.** La sucursal sigue saliendo de una cookie escrita por el cliente (spec 12, problema 4).

## Plan de implementación

### backend

- [x] Read model `TopSellingProductsCriteria` / `TopSellingProduct`.
- [x] `InvalidSalesPeriodException`.
- [x] `ProductRepository.findTopSellingByBranchOffice` en lugar de `findAllByBranchOffice`.
- [x] Consulta agregada en `TypeOrmProductRepository`. Se quitó el import de `Between`, que ya no se usaba.
- [x] `FindTopProductsByBranchOfficeUseCase`: resolución del periodo, límite y ambos rankings.
- [x] DTOs `FilterTopRequestDTO` y `TopProductsResponseDto`.
- [x] `requireSession` mínimo.
- [x] Action con `requireSession`, yup y `Result`.

### frontend

- [x] `page.tsx`: autorización en servidor y carga de categorías.
- [x] `useTopProductsSection`: filtros controlados, aplicación automática y control de respuestas fuera de
  orden.
- [x] `TopProductsSection`: barra de filtros, periodo visible y estados de carga, error y vacío.
- [x] `SelectMenu.placeholder` y `TextInput` con `type="month"`.

### tester

- [x] Tests del caso de uso con repositorio falso.
- [x] Tests del repositorio sobre pg-mem.
- [ ] Tests de `requireSession` (pendiente para la fase 3 de la spec 12).

### Cierre

- [ ] `pnpm validate`: no se puede correr completo; ver "Verificación pendiente".
- [ ] `code-reviewer` y `security-auditor` sobre el diff.
- [ ] Commit `FEATURE-IA:`.

## Pruebas

| Archivo | Qué cubre |
|---|---|
| `test/contexts/product-management/product/application/use-cases/find-top-products-by-branch-office.use-case.test.ts` | Valores por defecto (mes actual, todas las categorías, top 10, ambos órdenes); un mes concreto con fin exclusivo; el rango tiene prioridad sobre el mes e incluye el día final; acotado del límite; error 400 si el rango está invertido |
| `test/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product-top-selling.repository.test.ts` | SQL real sobre pg-mem: suma por producto entre varias ventas; excluye otra sucursal, ventas sin completar, el día anterior al periodo y el primer instante después; orden por unidades y por monto; filtro de categoría; límite |

Resultado el 2026-11-08: 102 de 102 tests pasan. La suite `findAllProductsByEstablishmentFilterAction.test.ts`
falla con `ReferenceError: Request is not defined`, y ya fallaba antes de este cambio (se comprobó con
`git stash`). `tsc --noEmit` reporta 66 errores, los mismos que antes del cambio; no hay errores nuevos.

## Preguntas abiertas para el usuario

1. ¿El ranking debe descontar las devoluciones? Hoy, igual que antes, no las descuenta.
2. ¿Se avisa a los usuarios de que las cifras ahora son solo de la sucursal activa?
3. ¿Se crea ya el índice sobre `sale`, o se espera a medir con datos reales?

## Verificación pendiente

- **No se probó en el navegador.** Hay que revisar la barra de filtros, el cambio entre mes y rango, el top 100
  con scroll y que un usuario sin rol no vea la sección ni reciba sus datos.
- **No se ejecutó contra PostgreSQL real**, solo contra pg-mem. Hay que confirmar que `MAX(category.name)` y el
  orden por alias funcionan igual.
- **`pnpm lint` está roto en todo el repo.** `eslint-plugin-react` 7.37.5 no es compatible con ESLint 10.7.0
  (`contextOrFilename.getFilename is not a function`).
- **`pnpm typecheck:ci` no corre**, porque falta `scripts/typecheck-ratchet.mjs`. La comparación de errores de
  tipos se hizo a mano con `tsc --noEmit`.
