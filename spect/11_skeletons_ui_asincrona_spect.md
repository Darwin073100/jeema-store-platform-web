# Análisis Técnico: Skeletons para la UI asíncrona

> Documento de seguimiento (**implementación parcial**). Actualizado el 2026-11-06. Registra lo construido
> hasta el commit `0f06955`, las decisiones tomadas, los pendientes y los hallazgos que aparecieron durante
> el trabajo.

## Estado

| Etapa | Estado | Commit |
|---|---|---|
| Base: componentes, sesión inicial y `/sale` | Hecho | `a3edf56` |
| Navbar | Hecho | `0f06955` |
| Carga compartida del workspace y etiqueta del `SideBar` | Propuesto | — |
| Ventas y Caja, y dashboard | Pendiente (`/sale` ya está hecho) | — |
| Catálogo: productos, compras y clientes | Pendiente | — |
| Traspasos y configuración | Pendiente | — |
| Cargas en cliente | Pendiente | — |

El navbar se adelantó a petición del usuario, porque es lo primero que se nota al entrar a la aplicación.

## Problema

La aplicación no tenía ningún skeleton, `loading.tsx` ni `Suspense`. Esto producía tres síntomas:

- Las 27 páginas que esperan datos en el servidor no daban ninguna señal de carga al navegar: la pantalla
  anterior seguía visible hasta que terminaba cada `await`.
- Las cargas en cliente eran inconsistentes: unas usaban spinner, otras texto y otras nada.
- El navbar mostraba `--` hasta que llegaba el workspace.

## Hallazgos que condicionan el diseño

- **`ProtectedRoute` tapaba la carga al recargar.** `SessionProvider` no recibía sesión inicial, así que
  `useSession` empezaba en `loading` y `ProtectedRoute` mostraba un spinner blanco, casi invisible sobre el
  fondo gris. Sin corregirlo, la secuencia al pulsar F5 sería skeleton → spinner → contenido.
- **`TemplateHeader` vive dentro de cada página.** Mientras una página carga también desaparece su título,
  por lo que `PageSkeleton` debe reproducir el encabezado para evitar saltos.
- **`loading.tsx` envuelve a los hijos de su segmento.** Según el modelo de App Router, un
  `(platform)/loading.tsx` no cubre la navegación dentro de una misma sección (`/products` →
  `/products/list`). Además, un `loading.tsx` de sección se hereda en sus subrutas. Por eso cada página con
  datos lleva el suyo. Este comportamiento no se comprobó en el navegador.
- **`useWorkspace` empieza con `isLoading: false`.** El indicador solo cambia dentro de un efecto, así que no
  sirve para el primer render ni para el HTML del servidor.

## Decisiones de diseño

1. **Skeleton solo donde se conoce la forma del contenido:** tablas, tarjetas, detalles y formularios
   precargados.
2. **Se mantiene el spinner** en botones de guardar o eliminar y en modales de PDF o ticket.
3. **Quedan fuera las páginas sin datos:** los menús de `products` y `purchases`, y `branch-office`, que hoy
   tiene datos fijos.
4. **Un `loading.tsx` por página con datos**, con `(platform)/loading.tsx` como respaldo genérico.
5. **Los skeletons de página aparecen con 150 ms de retraso** (`animate-skeleton-reveal`) para evitar
   parpadeos en respuestas rápidas.
6. **Sesión inicial desde el servidor:** `RootLayout` llama a `getServerSession` y la pasa a `AuthProvider`.
   `signIn` y `signOut` de `next-auth` refrescan la sesión por su cuenta, así que login y logout no dependen
   de esa prop. Como efecto, todas las rutas pasan a renderizarse en el servidor, incluido el login.
7. **En el navbar, "cargando" significa sin datos y sin error:** `!isLoaded && !error`. Si la carga falla, se
   conservan el `--` y la inicial del correo.
8. **`DetailSkeleton` y `FormSkeleton` se crearán con su primera pantalla real**, no antes, para no adivinar
   su maquetación.
9. **Para el POS,** el skeleton no debe interferir con el foco del escáner ni con atajos como F7.
10. **En el dashboard,** las tarjetas de acceso se mostrarán al instante y solo `TopProductsSection` esperará
    dentro de un `Suspense`.

## Implementado

### Componentes compartidos

| Componente | Función |
|---|---|
| `shared/ui/components/loadings/Skeleton.tsx` | Bloque base; decorativo y respeta `prefers-reduced-motion` |
| `shared/ui/components/loadings/PageSkeleton.tsx` | Replica `TemplateHeader` y anuncia la carga a lectores de pantalla |
| `shared/ui/components/loadings/TableSkeleton.tsx` | Conserva la cabecera real de `PrimaryTable` y sustituye las filas |
| `shared/ui/components/loadings/CardListSkeleton.tsx` | Versión móvil de las tablas |
| `shared/ui/components/tables/PrimaryTable/PTableSkeletonRows.tsx` | Filas de carga; contraparte de `PTableEmpty` |

Ninguno necesita `"use client"`, así que pueden usarse directamente en un `loading.tsx`.

### Rutas y navbar

- `src/app/(platform)/loading.tsx`: respaldo genérico.
- `src/app/(platform)/sale/loading.tsx`: filtros, tabla de escritorio y tarjetas móviles.
- `shared/ui/components/nav-bar/NavBar.tsx`: skeleton para establecimiento, sucursal, avatar y nombre del
  empleado. El logo y los enlaces no cambian.

### Sesión y estilos

- `src/app/layout.tsx` y `shared/ui/providers/auth-provider.tsx`: sesión inicial desde el servidor.
- `shared/ui/styles/globals.css`: animación `skeleton-reveal`.

### Tests

- `test/shared/ui/components/loadings/TableSkeleton.test.tsx`
- `test/shared/ui/components/nav-bar/NavBar.test.tsx`: carga, datos cargados y error.

## Verificación

| Validación | Resultado |
|---|---|
| Tests de `test/shared` | 6 de 6 pasan |
| Suite completa (ejecutada en la etapa base) | 62 tests pasan; una suite no carga, ver "Problemas existentes" |
| `tsc --noEmit` | 67 errores en total (baseline: 75), ninguno en los archivos tocados |
| ESLint | Sin errores, con una configuración temporal fuera del repo que fija la versión de React |
| `pnpm build` (ejecutado en la etapa base) | Pasa |
| `/sale` en producción sin sesión | El HTML incluye el skeleton |

### No verificado

Durante la implementación no se pudo iniciar sesión ni conectar a la base con el build de producción (error
de SSL). Queda por comprobar manualmente, con **Slow 4G** en DevTools:

- [ ] Skeleton de `/sale` al navegar desde otra sección, en escritorio y móvil.
- [ ] Recarga con F5 sin spinner intermedio.
- [ ] Skeleton del navbar sin cambio de altura.
- [ ] Login y logout tras el cambio de sesión.
- [ ] Navegación entre rutas de una misma sección, para confirmar el comportamiento de `loading.tsx`.

## Limitaciones conocidas

- `/sale/new`, `/sale/[saleId]` y `/sale/returns` heredan el skeleton de tabla de `/sale` hasta tener su propio
  `loading.tsx`.
- En pantallas grandes, los enlaces del navbar pueden moverse un poco al llegar los datos, porque el nombre
  del establecimiento tiene longitud variable. Se evitaría reservando un ancho fijo.
- La etiqueta de establecimiento y sucursal del `SideBar` todavía no tiene skeleton.

## Plan pendiente

### Carga compartida del workspace (propuesto, sin aprobar)

`NavBar`, `SideBar`, `SideBarMovile` y `LogoutModal` llaman por separado a `useWorkspace`, aunque el modal esté
cerrado, por lo que cada carga dispara cuatro peticiones iguales a `userWorkspaceAction`. Next ejecuta los
Server Actions uno tras otro, así que el navbar puede quedar esperando detrás de los demás.

- [ ] Compartir la carga en un único store de Zustand.
- [ ] Agregar el skeleton a la etiqueta del `SideBar`.

### Páginas

- [ ] **Ventas y Caja:** `sale/new`, `sale/[saleId]`, `sale/returns`, `cash`, `cash/session`,
  `cash/session/[cashSessionId]`.
- [ ] **Dashboard:** `Suspense` alrededor de `TopProductsSection`.
- [ ] **Catálogo:** `products/list`, `products/new`, `products/[productId]`, `purchases/list`,
  `purchases/supliers`, `purchases/supliers/[suplierId]`, `customers`, `customers/[customerId]`.
- [ ] **Traspasos y configuración:** `transfers/[productId]`, `transfers/configuration`,
  `transfers/detail/[cloudTransferId]`, `configurations/employees` (lista, `new` y `[employeeId]`),
  `configurations/establishment` (página, `branches/new` y `branches/[branchOfficeId]`),
  `configurations/transactions`, `configurations/users`.

### Cargas en cliente

- [ ] `CloudTransfersList`: usar `PTableSkeletonRows`.
- [ ] `ProductPerformance` y `TopProductsSection`: estado de carga al filtrar.
- [ ] `PrinterConfigurationForm` e `ImageUploader`: reemplazar spinner y texto.
- [ ] `SaleInventoryListModal`: agregar estado de carga a la búsqueda.

### Mejoras acordadas, en commits aparte

- [ ] Usar `Promise.all` donde las consultas sean independientes. Al menos `sale/new`, `products/list` y el
  dashboard ejecutan sus `await` uno tras otro.
- [ ] Agregar `(platform)/error.tsx`, hoy inexistente, como paso separado.
- [ ] Más adelante, indicar la carga en modales con selects, como `useUpdateProductModal`. Se usará un select
  deshabilitado con "Cargando…", no un skeleton.

## Problemas existentes detectados

Ninguno lo causó este trabajo y ninguno se ha corregido.

| Prioridad | Problema | Evidencia |
|---|---|---|
| **Alta** | `proxy.ts` no protege las rutas: está en la raíz y la aplicación usa `src/app` | `middleware-manifest.json` sale vacío y `/sale` sin sesión responde 200 |
| **Alta** | `requireSession` no existe en `src/`, aunque `AGENTS.md` lo describe como la protección de los Server Actions | Búsqueda sin resultados en `src/` |
| Media | `pnpm lint` falla: `eslint-plugin-react` 7.37.5 no funciona con ESLint 10. El hook de lint también marca error en cada edición | `contextOrFilename.getFilename is not a function` |
| Media | `pnpm typecheck:ci` falla | No existe `scripts/typecheck-ratchet.mjs` |
| Baja | `findAllProductsByEstablishmentFilterAction.test.ts` no carga | `Request is not defined` al importar `next/cache` en jsdom |

Con estos fallos, `pnpm validate` no puede pasar hoy.

Sin sesión, solo `ProtectedRoute` redirige, y lo hace en el navegador, después de que el servidor ya procesó la
página. Mover el archivo a `src/proxy.ts` afecta a toda la autenticación: debe hacerse en un commit aparte y
probar login, `/initial/*` y las imágenes de `/uploads`.
