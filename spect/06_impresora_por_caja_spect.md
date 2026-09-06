# Análisis Técnico: Impresora térmica por caja registradora (1 caja = 1 impresora)

> Documento prospectivo (plan de implementación, **feature aún no construida**). Elaborado el 2026-09-05
> tras análisis del estado actual del código (módulo `printer-configuration` construido en
> [05_impresion_automatica_tickets_spect.md](./05_impresion_automatica_tickets_spect.md)). Sirve como
> especificación para la implementación y como guía de migración manual para bases de datos de clientes
> ya en producción.

## Problema

`PrinterConfiguration` hoy se resuelve **por sucursal (`branch_office_id`)**, no por caja. Cuando una
sucursal tiene dos o más cajas registradoras (`CashRegister`) operando en paralelo con cajeros distintos,
**todas** comparten la misma búsqueda de impresora activa (`usePrintTicket` →
`findPrinterConfigurationByBranchAction(branchOffice.branchOfficeId)`), y `usePrintTicket.ts:40-45` toma
la primera configuración activa que cumpla la condición — es decir, los dos cajeros terminan imprimiendo
(o intentando imprimir) en el mismo destino físico, sin importar en cuál caja está cada uno parado.

Se requiere que la relación sea **1 caja → 1 impresora**: cada `CashRegister` tiene su propia
`PrinterConfiguration`, independiente de las demás cajas de la misma sucursal.

## Hallazgos sobre el estado actual del código

- **Tabla `printer_configuration`** (creada en la migración `1787801025682-add-printer-configuration.ts`)
  tiene `branch_office_id` como FK simple (`@ManyToOne`, **no** `unique`) — el esquema ya permitía más de
  una fila por sucursal, y el propio comentario del repositorio de dominio lo confirma:
  `domain/repositories/printer-configuration.repository.ts:12-16` — *"una sucursal puede tener más de una
  impresora configurada, distinguidas por `label`"* — pero **nada en la app deja elegir cuál usar por
  caja**; `usePrintTicket.ts:40-45` simplemente toma la primera activa que matchee la condición.
- **Punto de resolución único**: `usePrintTicket.ts:28,36` obtiene `branchOffice` de
  `useWorkspace()` y llama `findPrinterConfigurationByBranchAction(branchOffice.branchOfficeId)`. Es el
  único lugar que hay que redirigir hacia "caja actual" en vez de "sucursal actual".
- **4 puntos de consumo** de `usePrintTicket().printTicket`, todos iguales en su necesidad de saber la
  caja activa en ese momento:
  - `useTicketSale.tsx` (impresión automática al finalizar venta)
  - `useReprintTicketSale.tsx` (reimpresión manual de venta)
  - `useCashClosedTicketModal.tsx` (impresión de cierre de caja)
  - `useCashClosedTicketListModal.tsx` (impresión de listado de cierre)
- **Fuente de "caja actual" más confiable ya existe en el dominio, no en el store de cliente**: la venta
  (`Sale`) tiene `cashSessionId` (`sale.entity.ts:23,202`) y la `CashSession` tiene `cashRegisterId`
  (`cash-session.orm-entity.ts` — confirmado por la relación inversa
  `CashRegisterOrmEntity.cashSessions`). `FindSaleTicketByIdUseCase`/`SaleMapper.toIResponse` ya hidratan
  `sale.cashSession` cuando existe (`sale-mapper.ts:39,65`), así que **`ISale.cashSession.cashRegisterId`
  es la fuente correcta para `useTicketSale`/`useReprintTicketSale`** — no `useCashStore`.
  - Para cierre de caja (`useCashClosedTicketModal`/`useCashClosedTicketListModal`) la `CashSession`
    involucrada ya trae `cashRegisterId` directamente.
  - **`useCashStore().cashRegisterSelected`** (zustand, `cash.store.ts:22-23,55-59`) existe pero es estado
    efímero de cliente usado solo por la pantalla de administración de cajas (abrir/cerrar sesión,
    activar/desactivar caja) — **no** se debe usar como fuente de verdad para imprimir, porque se pierde en
    un refresh de página aunque la sesión de caja siga abierta en backend. Se descarta como fuente de
    `cashRegisterId` al imprimir; se usa únicamente para la UI de configuración (elegir qué caja configurar
    desde el formulario de admin, donde si el usuario refresca, simplemente vuelve a elegir).
- **Patrón 1:1 ya existente a imitar**: `BranchOffice ↔ Address`
  (`branch-office.orm-entity.ts:28-29,35-37` + `address.orm-entity.ts:38-39`) — columna FK `unique` en el
  lado dueño + `@OneToOne`/`@OneToOne` inverso con referencia por nombre de string (evita import circular).
- **Multi-tenant real es "on-prem"**: cada sucursal/cliente corre su propia base de datos (no hay un solo
  Postgres compartido para todos los clientes — de ahí el pedido explícito del usuario de mostrar cada
  migración para aplicarla él mismo, manualmente, en cada base de datos de cliente ya en producción con
  `printer_configuration` existente).

## Decisión de diseño

1. **`PrinterConfiguration` pasa a pertenecer a `CashRegister`, no a `BranchOffice`.** Se reemplaza la
   columna `branch_office_id` por `cash_register_id`, con constraint `UNIQUE` (1:1 real a nivel de base de
   datos, no solo de convención en el código).
2. **`branch_office_id` se elimina** de `printer_configuration` una vez migrados los datos — es
   redundante: `CashRegister` ya sabe su `branch_office_id`, y `PrinterConfiguration` puede llegar a la
   sucursal atravesando `CashRegister` si algún caso de uso lo necesitara. Evita duplicar el dato y evita
   que quede desincronizado si una caja se reasigna de sucursal.
3. **`label` se conserva** en el dominio — deja de ser necesaria para "distinguir varias impresoras de una
   misma sucursal" (ya no puede haber más de una por caja), pero sigue siendo útil como nombre amigable
   mostrado en la UI ("Impresora mostrador", "Epson caja 2"). No se elimina para no forzar una migración de
   UI adicional fuera de alcance.
4. **La resolución de impresora al imprimir se hace por `cashRegisterId`**, obtenido de la fuente de datos
   correcta según el flujo (ver hallazgos arriba: `sale.cashSession.cashRegisterId` para
   venta/reimpresión, `cashSession.cashRegisterId` para cierre de caja) — nunca desde
   `useCashStore().cashRegisterSelected`.
5. **Registrar una segunda `PrinterConfiguration` para la misma caja debe fallar** con una excepción de
   dominio clara (`PrinterConfigurationAlreadyExistsException`), no con un error crudo de constraint SQL —
   el flujo correcto para "cambiar la impresora de una caja" es *editar* (`update`) la configuración
   existente de esa caja, no crear una nueva.

## Impacto arquitectural

### Backend (dominio → aplicación → infraestructura → acciones)

**`contexts/configuration-management/printer-configuration/`**

- `domain/entities/printer-configuration.entity.ts`: renombrar `_branchOfficeId`/`branchOfficeId` →
  `_cashRegisterId`/`cashRegisterId` en constructor privado, `create()`, `reconstitute()` y getter. Sin
  otros cambios de comportamiento.
- `domain/repositories/printer-configuration.repository.ts`: `findByBranchOffice(branchOfficeId):
  Promise<PrinterConfigurationEntity[]>` → **`findByCashRegister(cashRegisterId):
  Promise<PrinterConfigurationEntity | null>`** (cardinalidad 1:1, ya no array). Mantener `findById`,
  `save`, `update`.
- `domain/exceptions/`: nueva `printer-configuration-already-exists.exception.ts` (`extends
  DomainException`) — "Esta caja ya tiene una impresora configurada; edítala en vez de crear una nueva."
- `application/use-cases/register-printer-configuration.use-case.ts`: el `Command` cambia
  `branchOfficeId` → `cashRegisterId`; antes de `PrinterConfigurationEntity.create(...)` llamar
  `repository.findByCashRegister(cashRegisterId)` y lanzar
  `PrinterConfigurationAlreadyExistsException` si ya existe una.
- `application/use-cases/find-printer-configuration-by-branch-office.use-case.ts` → renombrar a
  **`find-printer-configuration-by-cash-register.use-case.ts`**
  (`FindPrinterConfigurationByCashRegisterUseCase`), retorna `PrinterConfigurationEntity | null` (no
  array).
- `application/use-cases/update-printer-configuration.use-case.ts`: sin cambios de forma (opera por
  `printerConfigurationId`).
- `application/mappers/printer-configuration.mapper.ts` + `dtos/printer-configuration-response.dto.ts`:
  `branchOfficeId` → `cashRegisterId`.
- `infraestructura/persistence/typeorm/entities/printer-configuration.orm-entity.ts`: quitar columna
  `branch_office_id` + relación `@ManyToOne` a `BranchOfficeOrmEntity`; agregar columna `cash_register_id`
  (`unique: true`) + `@OneToOne('CashRegisterOrmEntity', (cr) => cr.printerConfiguration, {onDelete:
  'CASCADE'}) @JoinColumn({name: 'cash_register_id'})`.
- `infraestructura/persistence/typeorm/repositories/typeorm-printer-configuration.repository.ts`:
  `findByBranchOffice` → `findByCashRegister` (`findOne` en vez de `find`).
- `infraestructura/persistence/typeorm/mappers/printer-configuration.mapper.ts`: `branchOfficeId` →
  `cashRegisterId`.
- `presentation/actions/find-printer-configuration-by-branch.action.ts` → renombrar a
  **`find-printer-configuration-by-cash-register.action.ts`**
  (`findPrinterConfigurationByCashRegisterAction(cashRegisterId)`), retorna `{ printerConfiguration:
  IPrinterConfiguration | null }` (ya no `{ printerConfigurations: [] }`).
- `presentation/actions/register-printer-configuration.action.ts` /
  `update-printer-configuration.action.ts`: sin cambios de forma, solo el `Command`/DTO que reciben.
- `presentation/interfaces/IPrinterConfiguration.ts`: `branchOfficeId` → `cashRegisterId`.

**`contexts/cash-management/cash-register/`**

- `domain/entities/cash-register.entity.ts`: agregar campo opcional hidratado `_printerConfiguration:
  PrinterConfigurationEntity | null` (mismo patrón que `_branchOffice`/`_cashSessions`, poblado solo por
  el repositorio cuando el caso de uso lo pida) — usado por la pantalla de administración para mostrar
  "Caja 1 — impresora configurada / sin configurar" sin una segunda llamada al servidor por caja.
- `infraestructura/entities/cash-register.orm-entity.ts`: agregar
  `@OneToOne('PrinterConfigurationOrmEntity', (pc) => pc.cashRegister) printerConfiguration:
  PrinterConfigurationOrmEntity | null;` (lado inverso, no dueño de la FK).
- `presentation/interfaces/ICashRegister.ts`: agregar `printerConfiguration: IPrinterConfiguration |
  null`.
- Reutilizar la acción ya existente `find-all-cash-register-by-branch-office-id.action.ts` para poblar el
  selector de cajas en la nueva UI (con `relations: { printerConfiguration: true }` opcional en esa
  consulta si se decide mostrar el estado "configurada/sin configurar" en el listado).

**`contexts/sale-management/sale/`** (para tener `cashRegisterId` disponible sin volver a llamar al
backend)

- Verificar que `FindSaleTicketByIdUseCase` (usado por `findTicketBySaleIdAction`, el mismo que alimenta
  `useTicketSale`/`useReprintTicketSale`) efectivamente pide la relación `cashSession` al repositorio — si
  no la trae, agregarla (`relations: { cashSession: true }` o equivalente) para que
  `ISale.cashSession.cashRegisterId` llegue poblado al cliente. Sin este dato, el frontend no puede saber
  qué caja imprimió la venta.

### Frontend

- **`usePrintTicket.ts`**: cambia su firma de entrada — deja de leer `useWorkspace().branchOffice`
  internamente y pasa a **recibir `cashRegisterId: bigint` como parámetro explícito** de `printTicket(blob,
  cashRegisterId, options)` (más simple y explícito que inferir de contexto global, y evita acoplar el hook
  a un store específico). Llama a `findPrinterConfigurationByCashRegisterAction(cashRegisterId)`.
- **`useTicketSale.tsx`** / **`useReprintTicketSale.tsx`**: obtener `cashRegisterId` de
  `result.value.cashSession?.cashRegisterId` (la venta ya cargada) y pasarlo a `printTicket`. Si viene
  `null` (venta sin sesión de caja asociada — no debería pasar en flujo normal, pero cubrir el caso),
  omitir la impresión silenciosa con el mismo aviso no bloqueante ya existente.
- **`useCashClosedTicketModal.tsx`** / **`useCashClosedTicketListModal.tsx`**: obtener `cashRegisterId`
  directamente de la `CashSession` que están cerrando/mostrando.
- **`PrinterConfigurationForm.tsx`** + **`app/(platform)/configurations/printer/page.tsx`**: hoy el
  formulario carga/graba una sola configuración por sucursal. Pasa a:
  1. Cargar la lista de cajas de la sucursal actual (acción ya existente
     `findAllCashRegisterByBranchOfficeIdAction`).
  2. Mostrar un selector de caja al tope del formulario (dropdown simple — no se justifica una ruta
     dinámica `/configurations/printer/[cashRegisterId]` para un número típicamente pequeño de cajas por
     sucursal).
  3. Al elegir una caja, cargar su configuración vía `findPrinterConfigurationByCashRegisterAction` (puede
     ser `null` → mostrar formulario vacío para "registrar"); al guardar, usar `register` o `update` según
     corresponda, igual que hoy.
  4. Mostrar junto a cada caja del selector un indicador simple (● configurada / ○ sin configurar) para que
     el admin vea de un vistazo qué cajas faltan.
- **`ConfigurationOptions.tsx`**: sin cambios de navegación (sigue siendo `/configurations/printer`, ahora
  con selector de caja adentro).

## Base de datos — plan de migración en dos pasos (para ejecutar manualmente en cada cliente)

Esta es la parte que se pide mostrar paso a paso **antes** de tocar nada, porque cada cliente ya tiene
filas reales en `printer_configuration` ligadas a `branch_office_id`, y decidir a qué caja pertenece cada
fila existente es una decisión de negocio que **solo el usuario puede tomar por sitio** (cuántas cajas
tiene esa sucursal, cuál de ellas es la que ya usa esa impresora física). Por eso el cambio de esquema se
parte en dos migraciones con un paso manual de datos en medio — nunca se hace en una sola migración
irreversible.

Convención del proyecto: cada migración se genera con `pnpm run migration:generate <nombre>` después de
editar la/s ORM entity/entities correspondientes (no se escriben migraciones SQL a mano desde cero) — los
nombres de constraints (`FK_...`, `UQ_...`) que aparecen abajo son ilustrativos del **cambio de esquema
esperado**; los nombres reales los define TypeORM al generarse contra cada base de datos y se confirmarán
en el momento de la implementación.

### Paso 1 — agregar la columna nueva, sin tocar la vieja todavía

Migración `AddCashRegisterToPrinterConfiguration<timestamp>`:

```sql
-- up
ALTER TABLE "printer_configuration" ADD COLUMN "cash_register_id" bigint;
ALTER TABLE "printer_configuration"
  ADD CONSTRAINT "FK_printer_configuration_cash_register"
  FOREIGN KEY ("cash_register_id") REFERENCES "cash_register"("cash_register_id") ON DELETE CASCADE;

-- down
ALTER TABLE "printer_configuration" DROP CONSTRAINT "FK_printer_configuration_cash_register";
ALTER TABLE "printer_configuration" DROP COLUMN "cash_register_id";
```

En este punto la tabla queda con **ambas** columnas (`branch_office_id` y `cash_register_id`,
esta última nullable) — la app todavía sigue leyendo por `branch_office_id` hasta que el código del Paso
Backend se despliegue, así que este paso es seguro de correr solo, con antelación, sin downtime.

### Paso manual (por cada cliente, ejecutado por el usuario vía psql/pgAdmin) — NO es una migración de TypeORM

Antes de continuar al Paso 2, para **cada fila** de `printer_configuration` en esa base de datos, decidir
a qué `cash_register_id` de esa `branch_office_id` pertenece, y actualizarla:

```sql
-- Ver qué hay que resolver en este cliente:
SELECT pc.printer_configuration_id, pc.branch_office_id, pc.label, pc.target,
       cr.cash_register_id, cr.name AS caja
FROM printer_configuration pc
LEFT JOIN cash_register cr ON cr.branch_office_id = pc.branch_office_id
ORDER BY pc.branch_office_id;

-- Ejemplo: la sucursal tiene una sola caja ("Caja 1") que ya usa esta impresora:
UPDATE printer_configuration
SET cash_register_id = (
  SELECT cash_register_id FROM cash_register
  WHERE branch_office_id = printer_configuration.branch_office_id AND name = 'Caja 1'
)
WHERE printer_configuration_id = <id de la fila>;
```

**Si una sucursal tiene más de una caja y cada una necesita su propia impresora**, la fila existente solo
puede quedar asignada a **una** caja — para las demás cajas de esa sucursal hay que **crear filas nuevas**
(no se puede duplicar automáticamente porque el `target`/IP de cada impresora física es distinto):

```sql
INSERT INTO printer_configuration
  (branch_office_id, cash_register_id, label, connection_type, target, paper_width_mm,
   auto_print_on_sale, open_cash_drawer, copies, is_active, created_at)
VALUES
  (<branch_office_id>, <cash_register_id de la otra caja>, 'Impresora Caja 2', 'QZ_NETWORK',
   '192.168.1.X:9100', 58, true, false, 1, true, now());
```

**No avanzar al Paso 2 hasta confirmar que TODAS las filas de `printer_configuration` tienen
`cash_register_id` distinto de `NULL`** — el Paso 2 falla (o peor, deja cajas sin impresora) si queda
alguna fila sin asignar. Verificar con:

```sql
SELECT count(*) FROM printer_configuration WHERE cash_register_id IS NULL; -- debe dar 0
```

### Paso 2 — hacer obligatoria/única la columna nueva y retirar la vieja

Migración `MakeCashRegisterRequiredOnPrinterConfiguration<timestamp>` (**solo después** del paso manual
anterior, y solo después de desplegar el código backend que ya lee por `cash_register_id`):

```sql
-- up
ALTER TABLE "printer_configuration" ALTER COLUMN "cash_register_id" SET NOT NULL;
ALTER TABLE "printer_configuration"
  ADD CONSTRAINT "UQ_printer_configuration_cash_register" UNIQUE ("cash_register_id");
ALTER TABLE "printer_configuration" DROP CONSTRAINT "FK_817ec5c4fff969f38f610c11aa5"; -- FK original a branch_office (verificar nombre real con \d printer_configuration en cada cliente)
ALTER TABLE "printer_configuration" DROP COLUMN "branch_office_id";

-- down (reversible: branch_office_id es derivable desde cash_register)
ALTER TABLE "printer_configuration" ADD COLUMN "branch_office_id" bigint;
UPDATE printer_configuration pc
  SET branch_office_id = cr.branch_office_id
  FROM cash_register cr
  WHERE cr.cash_register_id = pc.cash_register_id;
ALTER TABLE "printer_configuration" ALTER COLUMN "branch_office_id" SET NOT NULL;
ALTER TABLE "printer_configuration"
  ADD CONSTRAINT "FK_817ec5c4fff969f38f610c11aa5"
  FOREIGN KEY ("branch_office_id") REFERENCES "branch_office"("branch_office_id") ON DELETE CASCADE;
ALTER TABLE "printer_configuration" DROP CONSTRAINT "UQ_printer_configuration_cash_register";
ALTER TABLE "printer_configuration" ALTER COLUMN "cash_register_id" DROP NOT NULL;
```

**Importante para cada cliente**: el nombre real de la constraint FK original a `branch_office_id`
(`FK_817ec5c4fff969f38f610c11aa5` en el repo de desarrollo) puede variar si esa base de datos fue creada de
forma distinta. Verificar con `\d printer_configuration` en psql (o el panel de constraints en pgAdmin)
antes de correr el `DROP CONSTRAINT` de ese cliente, y ajustar el nombre si difiere.

### Orden de despliegue recomendado por cliente

1. Correr Paso 1 (migración, columna nullable) — sin downtime, no rompe la app actual.
2. Ejecutar el paso manual de datos (`UPDATE`/`INSERT` de arriba) con calma, sitio por sitio.
3. Verificar `count(*) WHERE cash_register_id IS NULL = 0`.
4. Desplegar el código nuevo del backend/frontend (esta feature).
5. Correr Paso 2 (migración, `NOT NULL` + `UNIQUE` + drop de la columna vieja).

## Plan de implementación (orden de ejecución en este repo)

1. **Backend — dominio y aplicación**: renombrar `branchOfficeId` → `cashRegisterId` en
   `PrinterConfigurationEntity`, repositorio (interfaz), use-cases (`register`, `find-by-cash-register`),
   nueva excepción `PrinterConfigurationAlreadyExistsException`.
2. **Backend — infraestructura**: editar `printer-configuration.orm-entity.ts` (columna + relación 1:1) y
   agregar el lado inverso en `cash-register.orm-entity.ts`; actualizar repositorio TypeORM y mappers.
3. **Backend — generar Migración Paso 1** (`pnpm run migration:generate AddCashRegisterToPrinterConfiguration`)
   contra la base de desarrollo, **sin correrla todavía en ningún cliente** — mostrar el archivo generado
   para validar que coincide con lo esperado en esta spec.
4. **Backend — acciones**: renombrar/actualizar server actions (`register`, `update`,
   `find-printer-configuration-by-cash-register`).
5. **Backend — sale-management**: confirmar/ajustar que `FindSaleTicketByIdUseCase` hidrata `cashSession`
   en la respuesta.
6. **Frontend — hooks de impresión**: `usePrintTicket`, `useTicketSale`, `useReprintTicketSale`,
   `useCashClosedTicketModal`, `useCashClosedTicketListModal` — resolver `cashRegisterId` según el flujo
   correspondiente (ver sección Frontend arriba).
7. **Frontend — UI de configuración**: `PrinterConfigurationForm.tsx` con selector de caja +
   `ICashRegister`/`IPrinterConfiguration` actualizados.
8. **Verificación local** (ver checklist abajo) antes de generar la Migración Paso 2.
9. **Backend — generar Migración Paso 2** (`pnpm run migration:generate MakeCashRegisterRequiredOnPrinterConfiguration`)
   contra la base de desarrollo **solo después** de que el código de los pasos 1-8 esté funcionando en
   desarrollo con datos migrados manualmente ahí también (repetir el paso manual de datos en la base de
   desarrollo antes de generar esta migración, igual que se hará en cada cliente).
10. **Entrega al usuario**: contenido exacto de ambas migraciones + los `SELECT`/`UPDATE`/`INSERT` del paso
    manual, para que el usuario los aplique él mismo en cada base de datos de cliente ya en producción, en
    el orden descrito en "Orden de despliegue recomendado por cliente".

## Archivos a crear

- `src/contexts/configuration-management/printer-configuration/domain/exceptions/printer-configuration-already-exists.exception.ts`
- `src/contexts/configuration-management/printer-configuration/application/use-cases/find-printer-configuration-by-cash-register.use-case.ts`
  (reemplaza a `find-printer-configuration-by-branch-office.use-case.ts`)
- `src/contexts/configuration-management/printer-configuration/presentation/actions/find-printer-configuration-by-cash-register.action.ts`
  (reemplaza a `find-printer-configuration-by-branch.action.ts`)
- Migración `AddCashRegisterToPrinterConfiguration<timestamp>.ts`
- Migración `MakeCashRegisterRequiredOnPrinterConfiguration<timestamp>.ts`

## Archivos a modificar

- `src/contexts/configuration-management/printer-configuration/domain/entities/printer-configuration.entity.ts`
- `src/contexts/configuration-management/printer-configuration/domain/repositories/printer-configuration.repository.ts`
- `src/contexts/configuration-management/printer-configuration/application/use-cases/register-printer-configuration.use-case.ts`
- `src/contexts/configuration-management/printer-configuration/application/mappers/printer-configuration.mapper.ts`
- `src/contexts/configuration-management/printer-configuration/application/dtos/printer-configuration-response.dto.ts`
- `src/contexts/configuration-management/printer-configuration/infraestructura/persistence/typeorm/entities/printer-configuration.orm-entity.ts`
- `src/contexts/configuration-management/printer-configuration/infraestructura/persistence/typeorm/mappers/printer-configuration.mapper.ts`
- `src/contexts/configuration-management/printer-configuration/infraestructura/persistence/typeorm/repositories/typeorm-printer-configuration.repository.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/actions/register-printer-configuration.action.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/actions/update-printer-configuration.action.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/interfaces/IPrinterConfiguration.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/hooks/usePrintTicket.ts`
- `src/contexts/configuration-management/printer-configuration/presentation/ui/PrinterConfigurationForm.tsx`
- `src/contexts/cash-management/cash-register/domain/entities/cash-register.entity.ts`
- `src/contexts/cash-management/cash-register/infraestructure/entities/cash-register.orm-entity.ts`
- `src/contexts/cash-management/cash-register/presentation/interfaces/ICashRegister.ts`
- `src/contexts/sale-management/sale/presentation/hooks/useTicketSale.tsx`
- `src/contexts/sale-management/sale/presentation/hooks/useReprintTicketSale.tsx`
- `src/contexts/cash-management/cash-session/presentation/hooks/useCashClosedTicketModal.tsx`
- `src/contexts/cash-management/cash-session/presentation/hooks/useCashClosedTicketListModal.tsx`
- (posible) `src/contexts/sale-management/sale/application/use-cases/find-sale-ticket-by-id.use-case.ts` o
  su repositorio, si `cashSession` no viene hidratado hoy.

## Verificación pendiente (a ejecutar durante la implementación)

1. `tsc --noEmit` sin nuevos errores atribuibles a este módulo.
2. Migrar datos de prueba localmente (repetir el paso manual sobre la base de desarrollo) y confirmar que
   `pnpm run migration:run` corre ambas migraciones sin error en un entorno limpio.
3. Abrir dos sesiones de caja distintas (dos `CashRegister` de la misma sucursal, cada una con su propia
   `PrinterConfiguration` apuntando a un destino distinto — puede ser dos impresoras del SO en desarrollo)
   y confirmar que una venta hecha en la Caja 1 imprime solo en la impresora de la Caja 1, y una venta en
   la Caja 2 solo en la de la Caja 2.
4. Confirmar que reimpresión (`useReprintTicketSale`) e impresión de cierre de caja también resuelven la
   impresora de la caja correcta, no la de la sucursal.
5. Confirmar que registrar una segunda `PrinterConfiguration` para una caja que ya tiene una activa falla
   con `PrinterConfigurationAlreadyExistsException` y se muestra un mensaje claro en el formulario (no un
   error crudo de constraint SQL).
6. Confirmar que una venta sin `cashSession` asociada (si el flujo lo permite en algún caso legado) no
   rompe `useTicketSale` — debe degradar a "no imprimir" con el aviso no bloqueante ya existente, igual que
   hoy cuando no hay impresora activa.

## Fuera de alcance / limitaciones conocidas

- No se automatiza la decisión de "a qué caja pertenece cada `PrinterConfiguration` existente" — es
  inherentemente una decisión de negocio por sitio, ejecutada manualmente por el usuario (ver paso manual
  de la sección de migración).
- No se toca `openCashDrawer` (sigue como placeholder de fase 2, ya documentado en el spec 05).
- No se agrega ruta dinámica `/configurations/printer/[cashRegisterId]` — se resuelve con un selector en la
  misma página, dado el volumen típico de cajas por sucursal; si en el futuro una sucursal llega a tener
  muchas cajas, revisar si conviene una ruta por caja.
- No se decidió si, al desactivar (`deactivate`) una `CashRegister`, su `PrinterConfiguration` asociada
  debe desactivarse en cascada automáticamente o quedar tal cual — queda para una decisión de negocio
  aparte si surge el caso.
