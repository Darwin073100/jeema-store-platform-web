# Refactor: Lista de productos en `/sale/new` — clic derecho, orden de la lista y atajo F8

> **Aprobado, sin implementar.** Redactado el 2026-11-07. Igual que `01_devoluciones_resumen_ventas_caja_refactor.md`,
> describe un **bug** en una pantalla ya construida (el POS de nueva venta) y el plan para corregirlo. Además
> incluye cambios de interacción pedidos por el usuario. El trabajo se divide en **tres partes** que se
> implementan y suben por separado, en este orden:
>
> 1. **Botones y clic derecho:** corregir el bug, scroll propio de la lista, modal único para editar y
>    eliminar, y abrirlo con clic derecho o con el botón `⋮`.
> 2. **Orden de la lista:** los productos aparecen en el orden en que llegaron a la venta.
> 3. **Atajos:** `F8` edita el último producto agregado.

## Estado

| Parte | Estado | Commit |
|---|---|---|
| 1. Botones, clic derecho y modal único | Hecho | `197889f` |
| 2. Orden de la lista por llegada | Hecho (más reciente primero) | `dad5cfe` |
| 3. Atajo F8 | Implementado, en prueba manual | — |

## Decisiones del usuario (2026-11-07)

- Se quitan el lápiz y la papelera de cada fila, pero **se deja un botón `⋮`** por fila que abre el mismo
  modal que el clic derecho.
- La lista se ordena **por el orden en que llega cada producto** a la venta. Al implementar la Parte 2 el
  usuario eligió **el más reciente arriba** (`saleDetailId DESC`).
- **`F8` edita el último producto agregado.**

## Problema

En `/sale/new`, con muchos productos en la venta:

1. La lista crece hacia abajo y hay que hacer scroll de toda la página para ver los últimos productos. El
   buscador del escáner y los botones F4/F5/F6 quedan fuera de la vista.
2. Al pulsar el botón **editar** (lápiz) de un producto de la parte inferior, la página **salta hasta
   arriba** y el modal **no se abre**. Lo mismo pasa con el botón **eliminar** (papelera).
3. Editar y eliminar son dos botones y dos modales distintos (`UpdateDetailModal` y
   `DeleteDetailConfirmModal`). El usuario quiere una sola acción: clic derecho sobre la fila abre un modal
   donde se cambia la cantidad o se elimina el producto.
4. El orden de los productos no está garantizado (ver Parte 2).

## Causa raíz del bug

El salto no lo provoca el botón ni el modal. Lo provoca el efecto que mantiene el foco en el input del
escáner, en [useSale.ts:22-52](../../src/contexts/sale-management/sale/presentation/hooks/useSale.ts#L22-L52):

```ts
const maintainFocus = (e?: Event) => {
    if (e?.target instanceof HTMLElement) {           // ← un <svg>/<path> NO es HTMLElement
        const tagName = e.target.tagName.toLowerCase();
        if (tagName === 'button' || (tagName === 'input' && e.target !== inputRef.current)) {
            return;                                    // ← solo exime si el target ES el <button>
        }
    }
    if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();                     // ← sin preventScroll: desplaza la página
    }
};
document.addEventListener('mousedown', maintainFocus);
document.addEventListener('mouseup', maintainFocus);
```

Secuencia al pulsar el lápiz de una fila de abajo:

1. El `mousedown` cae sobre el **icono** (`<svg>` o `<path>` de `HiPencilSquare`), no sobre el `<button>`.
   Un `SVGElement` no es `HTMLElement`, así que la excepción para botones no se aplica.
2. Se llama a `inputRef.current.focus()`. El navegador desplaza la página para mostrar el input, que está
   arriba del todo.
3. El `mouseup` ocurre ahora sobre otro elemento, porque el contenido se movió bajo el cursor. El navegador
   solo emite `click` si `mousedown` y `mouseup` caen en el mismo elemento, así que **no hay click** y el
   modal no se abre.

Por eso el bug solo aparece con muchos productos: si la fila está visible sin scroll, el foco cambia pero
la página no se mueve y el click sí llega. También explica por qué el botón móvil "Editar cantidad" casi
siempre funciona: es un botón con texto y el target suele ser el propio `<button>`.

Problemas relacionados en el mismo efecto:

- Un `mousedown` dentro de un modal abierto (sobre un texto, un label o el fondo) también devuelve el foco
  al input del escáner, que queda **detrás** del modal. Si el lector escanea en ese momento, el código se
  escribe en el buscador y el `Enter` puede agregar un producto con el modal abierto.
- El efecto vive en `useSale()`, y `useSale()` se llama desde `useUpdateDetailModal` y `useDeleteDetail`,
  que a su vez se llaman **en cada fila** (`SaleDetailItem`, `SaleDetailItemMovile`). Con 50 productos se
  registran más de 200 listeners en `document`. Solo el de `SaleProductSearch` tiene un `inputRef` real; los
  demás no hacen nada, pero se ejecutan en cada clic.

## Hallazgos sobre el estado del código

- **Cada fila instancia dos hooks pesados.** `SaleDetailItem` llama a `useDeleteDetail()` y
  `useUpdateDetailModal()` solo para obtener dos funciones de apertura
  ([SaleDetailItem.tsx:19-20](../../src/contexts/sale-management/sale/presentation/ui/SaleDetailItem.tsx#L19-L20)).
  `useUpdateDetailModal` crea cuatro `useState` y tres `useEffect` que dependen de `saleModals`,
  `detailQuantity` y `saleFor`. Al abrir o cerrar cualquier modal, todas las filas recalculan y se vuelven a
  renderizar.
- **El modal de edición abre tarde.** `handleLoadUpdateDetail` espera a
  `searchInventoryItemInformationAction` y solo después llama a `openSaleModal`
  ([useUpdateDetailModal.ts:34-38](../../src/contexts/sale-management/sale/presentation/hooks/useUpdateDetailModal.ts#L34-L38)).
  Durante esa espera no hay ninguna señal, y parece que el clic no hizo nada.
- **La lista no tiene contenedor de scroll.** La tabla está en un `div` con `overflow-hidden` y sin altura
  máxima ([SaleProductList.tsx:49](../../src/contexts/sale-management/sale/presentation/ui/SaleProductList.tsx#L49)).
  El scroll es el de la ventana. `SaleSummary` ya es `sticky top-4`, así que el resumen sí acompaña al
  scroll, pero el buscador no.
- **Fila vacía.** Sin productos se renderiza `<SaleDetailItem />` sin datos (una fila con ceros), en lugar de
  un estado vacío explícito como pide `AGENTS.md`.
- **Import heredado.** `useDeleteDetail` tipa el detalle con `SaleDetailEntity` de
  `src/features/sale/...` (carpeta antigua) en lugar de `ISaleDetail`.
- **Cantidad 0.** `CreateSaleAndAddDetailUseCase` rechaza `quantity <= 0`. Hoy el input del modal permite
  escribir 0 y el error solo aparece al enviar.
- **Volver a escanear un producto no crea un detalle nuevo.** `RegisterSaleDetailUseCase` busca el detalle
  por código de barras (`findByBarCode`) y, si existe, lo actualiza: conserva su `saleDetailId`. Por eso
  ordenar por `saleDetailId` equivale a ordenar por el momento en que el producto entró por primera vez a la
  venta.
- **Todas las cargas pasan por `findById`.** Escanear o agregar desde el catálogo (`CreateSaleAndAddDetailUseCase`)
  y refrescar tras borrar (`findSaleWithDetailAction` → `FindByIdSaleUseCase`) devuelven la venta mediante
  `TypeormSaleRepository.findById`, que carga `saleDetails` **sin `order`**. PostgreSQL no garantiza el
  orden sin `ORDER BY`: tras un `UPDATE` (cambiar una cantidad) la fila puede moverse al final.
- **Teclas F ocupadas.** F2, F3 y F4 en `SalePaymentModal`; F4, F5 y F6 en la lista; F7 en `NavBar`. **F8
  está libre.**
- **`TemplateModal` registra `Escape` con dependencias vacías** (`useEffect(..., [])`), así que guarda el
  primer `onClose`. Hoy funciona porque `closeSaleModal` de Zustand es estable. Queda anotado para no
  depender de eso con callbacks nuevos.

---

## Parte 1 — Botones, clic derecho y modal único

Solo frontend. Todo en `src/contexts/sale-management/sale/presentation/`.

### Objetivos

1. Ningún clic en la lista de productos mueve la página ni se pierde.
2. Con muchos productos, el buscador, los botones F4/F5/F6 y el resumen siguen a la vista. Solo la lista
   hace scroll.
3. Clic derecho sobre un producto, o el botón `⋮`, abre un modal único para cambiar la cantidad, cambiar
   menudeo/mayoreo o eliminarlo.
4. El flujo funciona con teclado y en pantallas táctiles, donde no existe el clic derecho.
5. Tras cerrar el modal, el foco vuelve al buscador sin desplazar la página.

### Decisiones

1. **El guardián de foco sale de `useSale` a su propio hook** (`useScannerFocus`) y se usa una sola vez, en
   `SaleProductSearch`. Reglas nuevas:
   - Exime cualquier clic cuyo target esté **dentro** de un elemento interactivo:
     `target.closest('button, a, input, select, textarea, [role="button"], [role="dialog"], [data-keep-focus]')`.
     Usar `closest` sobre `Element` (no `HTMLElement`) resuelve el caso de los iconos SVG.
   - **No actúa mientras haya un modal abierto** (`saleModals !== 'none'`).
   - Enfoca con `focus({ preventScroll: true })`. Devolver el foco al escáner nunca debe desplazar la página.
   - Escucha solo `mouseup` (o `pointerup`), no `mousedown`. Así el foco cambia después del click, no en
     medio.
2. **La lista tiene su propio scroll.** El contenedor de la tabla pasa a `overflow-y-auto` con altura máxima
   relativa al viewport (`max-h-[calc(100dvh-<offset>)]`, con el offset medido a partir del alto real del
   navbar, el encabezado y el buscador). El `<thead>` pasa a `sticky top-0`. En móvil (`< xl`) se conserva el
   scroll de página, porque la barra inferior fija ya reserva espacio con `--jeema-mobile-sale-summary-h`.
3. **Al agregar o actualizar un producto, la lista se desplaza a esa fila** (`scrollIntoView({ block:
   'nearest' })` dentro del contenedor) y la resalta durante 1,5 s. Para eso se guarda
   `lastTouchedDetailId` en el store; la Parte 3 lo reutiliza para F8.
4. **Un solo modal: `SaleDetailModal`** reemplaza a `UpdateDetailModal` y `DeleteDetailConfirmModal`.
   Contiene:
   - Encabezado con imagen, nombre, código, unidad y precios de menudeo y mayoreo.
   - Input de cantidad con foco automático, el botón "Aplicar menudeo/mayoreo" y el total calculado. La
     lógica actual se mueve sin cambiar las reglas de precio.
   - Botón primario **Aplicar cambios** (`Enter`), deshabilitado si la cantidad es ≤ 0 o no cambió. Con
     cantidad 0 aparece el texto "Para quitar el producto usa Eliminar".
   - Botón **Eliminar de la venta**, en rojo y separado a la izquierda. El primer clic cambia el pie del
     modal a una confirmación en línea ("¿Eliminar 3 × Coca-Cola 600 ml?" con **Sí, eliminar** y
     **Volver**). No se abre un segundo modal.
   - Atajo `Supr` dentro del modal: lleva a la confirmación de borrado. `Esc` cierra o, si la confirmación
     está visible, vuelve al modo edición.
5. **El modal se abre al instante.** Muestra los datos del detalle, que ya están en el store. Los precios
   de inventario muestran un skeleton (componente `Skeleton` de la spec 11) mientras llega
   `searchInventoryItemInformationAction`. "Aplicar menudeo/mayoreo" queda deshabilitado hasta que llegan.
   Si la petición falla, se puede seguir editando la cantidad y eliminando el producto.
6. **Cómo se abre el modal:**

   | Dispositivo | Acción |
   |---|---|
   | Escritorio | Clic derecho sobre la fila (`onContextMenu` + `preventDefault`), doble clic o botón `⋮`. |
   | Teclado | Fila enfocable (`tabIndex=0`): `Enter`, tecla `ContextMenu` o `Shift+F10`. El `⋮` también es enfocable. |
   | Táctil | Tocar la tarjeta o su `⋮`. Android emite `contextmenu` con pulsación larga, pero iOS no, así que se usa `onClick`. |

7. **Botón `⋮` en lugar del lápiz y la papelera.** Va en la última columna de la tabla y en la esquina de
   la tarjeta móvil. Es un `ButtonOutLine` gris con el icono `HiEllipsisVertical`,
   `aria-label="Opciones de <producto>"` y `aria-haspopup="dialog"`. Llama a `onOpen(detail)` con
   `stopPropagation`, para que el clic no active también el de la fila o la tarjeta. Bajo la tabla va una
   pista: "Clic derecho o ⋮ sobre un producto para editar o eliminar".
8. **Las filas no usan hooks de modal.** Reciben un único `onOpen(detail)` desde `SaleProductList`. Toda la
   lógica de edición y borrado vive en un solo hook, `useSaleDetailModal`, que solo usa `SaleDetailModal`.
   Las filas pasan a ser componentes de presentación con `React.memo`.
9. **Estado vacío explícito:** sin productos, una fila con el mensaje "Escanea un producto para empezar" en
   lugar de la fila con ceros.
10. **Sin cambios de servidor en esta parte.** Se siguen usando `CreateSaleAndAddDetailAction` y
    `physicalDeleteSaleDetailAction` como hoy. Su falta de `requireSession` y de validación es deuda de la
    spec 12.

### Diseño por archivo

| Archivo | Cambio |
|---|---|
| `hooks/useScannerFocus.ts` | **Nuevo.** Guardián de foco con las reglas de la decisión 1. Recibe `inputRef` y `enabled`. |
| `hooks/useSale.ts` | Quitar el `useEffect` de foco y el `inputRef`. Queda solo la lógica de búsqueda y cálculo. Fijar `lastTouchedDetailId` al agregar un producto. |
| `ui/SaleProductSearch.tsx` | Crear el `inputRef` y llamar a `useScannerFocus({ inputRef, enabled: saleModals === 'none' })`. |
| `hooks/useInventoryListModal.ts` | Fijar `lastTouchedDetailId` al agregar desde el catálogo (F4). |
| `hooks/useSaleDetailModal.ts` | **Nuevo.** Fusiona `useUpdateDetailModal` y `useDeleteDetail`. Expone `openDetail(detail)` (abre al instante y carga precios), `applyQuantity`, `toggleSaleFor`, `deleteDetail`, `mode: 'edit' \| 'confirmDelete'` e `isLoadingPrices`. Los mensajes flotantes repetidos pasan a un helper local `notify(type, summary, description, ms)`. |
| `ui/SaleDetailModal.tsx` | **Nuevo.** Modal unificado (decisión 4), sobre `TemplateModal`. |
| `ui/SaleDetailItem.tsx` | Sin hooks. Props `saleDetail`, `onOpen` y `highlighted`. Fila con `tabIndex=0`, `onContextMenu`, `onDoubleClick`, `onKeyDown`, `aria-haspopup="dialog"` y `data-keep-focus`. La última columna lleva solo el `⋮`. `React.memo`. |
| `ui/SaleDetailItemMovile.tsx` | Igual: sin hooks, la tarjeta llama a `onOpen` al tocarla y lleva `⋮` en la esquina. Se quitan la papelera y "Editar cantidad". |
| `ui/SaleProductList.tsx` | Contenedor con scroll y `thead` sticky, estado vacío, scroll y resalte de `lastTouchedDetailId`, pista de uso, y `<SaleDetailModal />` en lugar de los dos modales. |
| `stores/types/sale-modals-type.ts` | Quitar `'deleteDetailModal'`; renombrar `'updateDetailModal'` a `'saleDetailModal'`. |
| `stores/sale.process.store.ts` | Añadir `lastTouchedDetailId: bigint \| null` y su setter; se limpia con `resetSaleProcessStore`. |
| `hooks/useUpdateDetailModal.ts`, `hooks/useDeleteDetail.ts`, `ui/UpdateDetailModal.tsx`, `ui/DeleteDetailConfirmModal.tsx` | **Eliminar** cuando el modal nuevo funcione. Hoy solo los usa esta pantalla. |

`useSale().handleUpdateSaleDetails` y `hancleCalculateDetailPrice` se siguen usando desde el hook nuevo.
Como el efecto de foco ya no estará en `useSale`, llamarlo desde el hook del modal deja de registrar
listeners.

Cómo saber qué detalle se agregó: la respuesta de `CreateSaleAndAddDetailAction` trae la venta completa, no
el detalle. Se localiza el detalle por `productBarCodeAtSale` dentro de `result.value.saleDetails`, la misma
clave con la que el servidor decide si actualiza o crea.

### Tareas

- [x] `frontend`: `useScannerFocus` con `closest(...)`, `preventScroll` y `enabled`; usarlo en
      `SaleProductSearch`; quitar el efecto de `useSale`.
- [x] `frontend`: contenedor con scroll y `thead` sticky; estado vacío.
- [x] `frontend`: `lastTouchedDetail` en el store, fijado desde escáner, catálogo y modal; scroll y resalte.
- [x] `frontend`: `useSaleDetailModal` y `SaleDetailModal` (edición, confirmación en línea, skeleton de
      precios); actualizar `SaleModalsType`.
- [x] `frontend`: `SaleDetailItem` y `SaleDetailItemMovile` sin hooks, con clic derecho, doble clic,
      teclado, toque y `⋮`; pista de uso.
- [x] `frontend`: borrar los dos hooks y los dos modales antiguos, junto con el import de `src/features/...`.
- [x] `tester`: `useScannerFocus.test.tsx` (5 casos).
- [x] `tester`: `SaleDetailItem.test.tsx` (fila y tarjeta móvil, 7 casos).
- [x] `tester`: `SaleDetailModal.test.tsx` (5 casos).
- [x] Prueba manual del usuario y commit.

### Cambios respecto al plan (durante la implementación)

- **Sin atajo `Supr` en el modal.** El foco está en el input de cantidad y `Supr` ya sirve para borrar
  dígitos; usarlo como atajo de eliminar provocaría borrados accidentales.
- **`Esc` siempre cierra el modal**, también en la confirmación. `TemplateModal` registra su `Escape` una
  sola vez y cerrar no es destructivo, así que no vale la pena un manejo especial.
- **Teclado:** la fila solo maneja `Enter`. La tecla de menú y `Shift+F10` ya emiten `contextmenu` en el
  navegador, así que entran por el mismo manejador que el clic derecho.
- **El foco también se queda en `<label>`** (además de botones e inputs), para no interrumpir el clic en
  los labels de los formularios de la página.
- **Clic izquierdo sobre una fila devuelve el foco al escáner.** No se marca la fila con `data-keep-focus`:
  si conservara el foco, el `Enter` de un escaneo posterior abriría el modal de esa fila.
- **El store guarda `lastTouchedDetail: { saleDetailId, touchedAt }`** en vez de solo el id. Así, al volver
  a escanear el mismo producto, la lista se desplaza y lo resalta otra vez.
- **Si fallan los precios de inventario**, el modal permite eliminar pero no cambiar la cantidad: el cálculo
  de menudeo/mayoreo (`hancleCalculateDetailPrice`) necesita el inventario.
- **«Volver» recibe el foco en la confirmación**, no «Sí, eliminar»: un `Enter` o un escaneo accidental no
  borra el producto.
- **Límite de cantidad: 99 999.** Por encima se avisa «¿Escaneaste un código por error?» y no se envía.

### Problemas del entorno detectados

- `pnpm lint` falla al arrancar: `eslint-plugin-react@7.37.5` usa `context.getFilename()`, que ESLint 10
  eliminó, al detectar la versión de React. Se valida con una configuración temporal que añade
  `settings: { react: { version: "19.0" } }`. El hook de Claude Code reporta «errores» vacíos por la misma
  causa. Arreglo sugerido (PR aparte): añadir ese `settings` a `eslint.config.mjs`.
- `pnpm typecheck:ci` falla porque `scripts/typecheck-ratchet.mjs` no existe en el repo. Con `tsc --noEmit`
  el total bajó de 69 a 66 errores (se borraron archivos con imports rotos a `src/features/...`) y no hay
  errores en los archivos de esta parte.

### Criterios de aceptación

1. Con 50 productos, el buscador y los botones F4/F5/F6 no salen de la vista. Solo hace scroll la tabla, y
   su cabecera queda fija.
2. Al escanear un producto, la tabla se desplaza hasta esa fila y la resalta.
3. Clic derecho sobre cualquier fila, incluida la última, abre el modal al instante y sin mover la página.
   No aparece el menú del navegador.
4. El `⋮` de la última fila abre el mismo modal, también si se pulsa justo sobre el icono.
5. En el modal: cambiar la cantidad y pulsar `Enter` aplica el cambio; "Eliminar" pide confirmación y
   después quita el producto; `Esc` cierra.
6. Al cerrar el modal, escanear un código lo agrega a la venta. El foco volvió al buscador sin desplazar la
   página.
7. Con el modal abierto, hacer clic sobre su texto no devuelve el foco al buscador.
8. En un teléfono o tablet, tocar una tarjeta o su `⋮` abre el modal.
9. Los atajos F4, F5, F6 y F7 siguen funcionando, y el catálogo (F4) devuelve el foco al buscador al
   cerrarse.

---

## Parte 2 — Orden de la lista por llegada

Backend y tests. Depende de la Parte 1 solo para el resalte: no hace falta esperar a la Parte 1 para
implementarla, pero se sube después para no mezclar PRs.

### Regla

Los productos se muestran en el orden en que **entraron por primera vez** a la venta, **el más reciente
arriba**. Volver a escanear un producto o cambiar su cantidad **no lo mueve**: se queda en
su posición, la lista se desplaza hasta él y lo resalta (Parte 1, decisión 3).

### Diseño

- `TypeormSaleRepository.findById` añade
  `order: { saleDetails: { saleDetailId: 'DESC' } }` al `findOne` (se planeó `ASC`; el usuario lo cambió a
  `DESC` antes del commit). Como `saleDetailId` es un `bigint`
  autoincremental y el servidor actualiza el detalle existente en lugar de crear otro, ese orden es el de
  llegada.
- Se ordena en la consulta y no en el cliente, para que el orden sea igual en cualquier pantalla que use
  `findById` (por ejemplo, al continuar una venta).
- Sin migración: `sale_detail_id` es la clave primaria y ya tiene índice.
- El mismo orden se aplica en `findSaleTicketById` (ticket impreso), `findFinishSaleById` (detalle de una
  venta terminada) y la relectura de `save()`, para que el ticket y el detalle coincidan con la pantalla.
  Se define una sola vez como la constante `SALE_DETAILS_IN_ARRIVAL_ORDER`.
- `findManyWithDetailsByIds` se deja igual: solo alimenta cálculos de resúmenes, donde el orden no importa.

### Tareas

- [x] `backend`: `SALE_DETAILS_IN_ARRIVAL_ORDER` en `findById`, `findSaleTicketById`, `findFinishSaleById` y
      `save()`.
- [x] `tester`: `typeorm-sale.repository.test.ts` sobre pg-mem (reutiliza el `DataSource` de
      `cloud-transfer`, que ya registra todo el grafo de entidades). Inserta los detalles con ids 3, 1, 2;
      comprueba el orden en `findById`, tras actualizar una cantidad, y en el ticket y el detalle. Sin el
      cambio fallaban 2 de los 3 casos: tras el `UPDATE`, pg-mem movía el detalle al final, como puede
      pasar en Postgres. Con la Parte 3 se ajustó a `DESC` (espera 3, 2, 1) y se subió el timeout a 30 s.
- [x] Prueba manual del usuario y commit.

### Criterios de aceptación (con el orden final, el más reciente arriba)

1. Escanear A, B y C muestra C, B, A de arriba abajo.
2. Cambiar la cantidad de A, o escanearlo otra vez, lo deja en su lugar (abajo).
3. Eliminar B deja C, A.
4. Recargar la página (o continuar la venta) muestra el mismo orden.

---

## Parte 3 — Atajo F8: editar el último producto agregado

Solo frontend. Requiere la Parte 1 (`SaleDetailModal` y `lastTouchedDetailId`).

### Regla

`F8` abre `SaleDetailModal` sobre el **último producto agregado**, que es el que el cajero acaba de
escanear o elegir en el catálogo. Si ese producto ya estaba en la venta y se volvió a escanear, también
cuenta como el último agregado, porque es el que acaba de cambiar.

### Diseño

- El destino es `lastTouchedDetailId`. Si es `null` (por ejemplo, tras recargar la página o continuar una
  venta), se usa el detalle con mayor `saleDetailId`, que es el último en llegar según la Parte 2.
- Si ese id ya no existe en `sale.saleDetails` (se eliminó), se usa la misma regla de respaldo.
- Se registra en `useSaleProductList` junto a F4/F5/F6: `F8: () => openLastDetail()`.
- **Solo actúa sin modales abiertos** (`saleModals === 'none'`). Así no interfiere con `SalePaymentModal`,
  que usa F2 a F4, ni con el propio modal de detalle.
- Sin productos en la venta, muestra un mensaje flotante amarillo: "No hay productos en la venta".
- Antes de abrir el modal, desplaza la lista hasta esa fila, para que el cajero vea cuál se está editando.
- Pistas visibles: un badge `F8` en la pista bajo la tabla ("Clic derecho o ⋮ para editar · F8 último
  producto") y en el `title` del `⋮` de la fila que F8 abriría.

### Tareas

- [x] `frontend`: regla de destino en `findLastAddedDetail` (`utils/sale-detail.ts`, función pura) y
      `openLastAddedDetail()` en `useSaleProductList`; `F8` registrado junto a F4/F5/F6.
- [x] `frontend`: pistas visuales: `F8` en la pista bajo la tabla y «(F8)» en el `title` del `⋮` de la fila
      destino.
- [x] `tester`: `utils/sale-detail.test.ts` (4 casos de la regla) y `hooks/useSaleProductList.test.tsx`
      (4 casos del atajo: último tocado, respaldo al de mayor id, sin productos, modal abierto).
- [ ] Prueba manual del usuario y commit.

### Criterios de aceptación

1. Escanear un producto y pulsar F8 abre su modal con el input de cantidad enfocado. Escribir la cantidad y
   pulsar `Enter` la aplica, sin tocar el ratón.
2. Volver a escanear un producto que ya estaba y pulsar F8 abre ese producto, aunque no sea el último de la
   lista.
3. Tras recargar la página, F8 abre el último producto en llegar (el primero de la lista).
4. Con el modal de pago abierto, F8 no hace nada.

---

## Riesgos

- **Escáner con modal abierto.** Al desactivar el guardián con un modal abierto, el foco queda en el input
  de cantidad. Un escaneo accidental escribiría el código como cantidad. Mitigación: el input de cantidad
  rechaza valores de más de 6 dígitos con un aviso, sin enviar.
- **Altura de la tabla.** El `max-h` depende del alto del encabezado, que cambia según el título de la caja
  y el ancho de pantalla. Si un valor fijo no basta, se mide con `ResizeObserver`, igual que
  `SaleSummaryMovile`.
- **Regresión en otros flujos que usan `useSale`.** `useInventoryListModal` también lo usa. Al quitar el
  efecto de foco hay que comprobar que el catálogo (F4) sigue devolviendo el foco al buscador al cerrarse.
- **F8 en el navegador.** F8 no tiene acción por defecto en Chrome ni Edge en Windows, y `useKeyDown` hace
  `preventDefault` igualmente. En algunos portátiles F8 controla el volumen o el brillo si no se pulsa `Fn`;
  es el mismo caso que las demás teclas F del POS.

## Fuera de alcance

- Autorización y validación de `CreateSaleAndAddDetailAction` y `physicalDeleteSaleDetailAction` (spec 12).
- Virtualizar la lista: con los volúmenes de una venta (decenas de productos) basta con quitar los hooks de
  cada fila y usar `React.memo`.
- Cambios a `TemplateModal` o `Modal` compartidos, salvo la nota sobre las dependencias de `Escape`.
- Otros atajos además de F8.
