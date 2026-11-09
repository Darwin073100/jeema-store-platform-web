# AGENTS.md — Guía del proyecto para agentes de código

Guía canónica para cualquier agente (Claude Code, Codex, Cursor, Copilot…). `CLAUDE.md` la importa y
añade solo lo específico de Claude Code. Si algo aquí contradice al código, **el código manda**: corrige
este archivo en el mismo PR.

## Proyecto

JEEMA Store Platform Web — punto de venta, inventario, compras y caja para tiendas con varias sucursales,
con sincronización opcional a la plataforma en la nube "EDYOF".

Stack: Next.js 16 (App Router, Server Actions) · React 19 · TypeScript 5 · TypeORM 0.3 · PostgreSQL ·
NextAuth v4 · Zustand · Tailwind CSS v4 · react-hook-form + yup · Jest + Testing Library + pg-mem · pnpm.

## Comandos

```bash
pnpm install                    # pnpm es obligatorio
pnpm dev                        # dev server (Turbopack)
pnpm build                      # build de producción (Webpack — ver "Turbopack vs Webpack")

pnpm lint                       # ESLint (incluye las reglas de capas de Arquitectura Limpia)
pnpm typecheck                  # tsc completo (hay errores históricos, ver "Deuda conocida")
pnpm typecheck:ci               # trinquete: falla solo si SUBEN los errores de tipos
pnpm test                       # Jest una vez        · pnpm test:watch para modo watch
pnpm test <ruta|patrón>         # un archivo / carpeta · pnpm test -t "nombre" por nombre de test
pnpm format <archivos>          # Prettier sobre archivos concretos (no formatear todo el repo)
pnpm validate                   # lint + typecheck:ci + test — correr antes de dar algo por terminado

pnpm migration:generate <Nombre>  # tras modificar una entidad ORM
pnpm migration:show               # qué migraciones están aplicadas / pendientes (solo lectura)
pnpm migration:run                # aplica pendientes      · migration:revert deshace la última
```

Setup de BD: crear la base de `DATABASE_URL` (copiar `.env.template` a `.env`), `pnpm migration:run`, y
ejecutar una vez `src/configuration/databases/typeorm/scripts/initial-data-postgres-script.sql`.

## Arquitectura

Arquitectura limpia / hexagonal con DDD, organizada por **bounded context** (no por capa técnica):

```
src/
├── app/                 Rutas del App Router. Sin lógica de negocio: componen UI de presentation/.
│   ├── auth/login/  initial/ (onboarding)  (platform)/ (app autenticada)  api/auth/[...nextauth]/
├── contexts/<contexto>/<entidad>/      ← un "slice" vertical por entidad
│   ├── domain/            entities/ value-objects/ exceptions/ repositories/ (interfaces) ports/out/
│   ├── application/       use-cases/ dtos/ mappers/ (entidad de dominio ↔ DTO)
│   ├── infraestructure/   persistence/typeorm/{entities,repositories,mappers}/  http/ (APIs externas)
│   └── presentation/      actions/ (Server Actions) hooks/ stores/ (Zustand) ui/ interfaces/
├── configuration/databases/typeorm/    DataSource, migraciones, scripts, transaction-db (puerto + impl.)
└── shared/                domain/ application/ infrastructure/ (auth, di, http, error, qz, storage) lib/ ui/
```

Contextos: authentication, cash, configuration, employee, establishment, image, inventory, product,
purchase, sale, transaction (todos con sufijo `-management`).

### Regla de dependencias (la valida `pnpm lint`)

```
presentation / app  →  application  →  domain
infraestructure     →  domain   (implementa sus interfaces)
```

- **domain/** no importa nada de fuera: ni TypeORM, ni Next, ni React, ni `application/`, ni `infraestructure/`.
- **application/** solo conoce `domain/`. Para hablar con BD/HTTP define un repositorio o puerto en
  `domain/` y recibe la implementación por constructor.
- **UI (`presentation/ui`, `presentation/hooks`, `shared/ui`)** nunca importa infraestructura; llega al
  servidor exclusivamente vía Server Actions.

### Flujo de una petición

```
Componente cliente ("use client")
  → Server Action (presentation/actions/*.action.ts, "use server")
      1. requireSession()                 ← autorización
      2. validar input                     ← nunca confiar en el cliente
      3. componer: repos TypeORM (*.create()) + use case (new)
      4. useCase.execute(dto)
      5. revalidatePath(...) si muta
      6. return Result.success(Mapper.toX(result))   |   catch → handleError(error, "nombreAction")
  → Use case (application/) → Repositorio (interface de domain/, impl. en infraestructure/)
  → getDataSource()  (singleton perezoso; nunca `new DataSource`)
```

## Convenciones obligatorias para código nuevo

### Dominio
- Entidades ricas: constructor privado + `static create()` (valida invariantes) y `static reconstitute()`
  (desde BD, sin validar). Sin setters públicos: cambios vía métodos con nombre (`updateName()`).
- Value objects extienden `ValueObject<T>` (inmutables). Errores de negocio extienden `DomainException`
  con el `statusCode` adecuado (400 validación, 404 no encontrado, 409 conflicto).
- Documentar clases y funciones públicas con JSDoc (`/** ... */`), en español.

### Aplicación
- Un caso de uso = una clase = un método `execute(dto)`. Dependencias por constructor, tipadas con las
  **interfaces** de `domain/`, nunca con clases `Typeorm*`.
- Escrituras que tocan más de un agregado (venta + inventario + pago + transacción…) van dentro de
  `TransactionDBRepository.runInTransaction(...)`. Ver `CalculateSaleUseCase` como referencia.
- Los DTO de respuesta viven en `application/dtos/`. **No** importar `presentation/interfaces/I*` desde
  `application/` (es deuda existente; no la extiendas).

### Server Actions (seguridad)
- Un Server Action es un **endpoint POST público**: `proxy.ts` protege páginas, no actions. Todo action
  nuevo o modificado empieza con `await requireSession({ roles?, permissions? })`
  (`src/shared/infrastructure/auth/require-session.ts`).
- El id del usuario/empleado que ejecuta la operación sale de la sesión, no del DTO del cliente.
- Validar el input (yup, ya es dependencia) antes de llamar al caso de uso.
- Nombres: `<verbo>-<entidad>.action.ts`, función `<verbo><Entidad>Action`.

### Infraestructura / TypeORM
- Entidades ORM `*.orm-entity.ts`, separadas de las de dominio; mapper ORM ↔ dominio en
  `persistence/typeorm/mappers/`. Registrar cada entidad nueva en el arreglo `entities` de
  `src/configuration/databases/typeorm/config/config.ts` (no hay autodiscovery).
- `synchronize` siempre `false`. Todo cambio de esquema = migración generada + revisada a mano.
- **Nunca editar una migración ya commiteada**: crear otra nueva.
- Dinero: columnas `decimal(14,2)`. `pg` las devuelve como `string`: convertir en el mapper.
- Ids: `bigint` → `bigint`/`string` en TS; no usar `number` para ids.
- Integraciones HTTP (nube EDYOF) devuelven `Result<T, ErrorEntity>` en vez de lanzar.

### Nombres de carpetas
La carpeta de infraestructura tiene cuatro grafías en el repo (`infraestructure` ×26, `infraestruture`,
`infraestructura`, `infrastructure` en `shared/`). **Código nuevo usa `infraestructure`.** No renombres
carpetas existentes salvo en un PR dedicado a eso.

### Frontend
- Server Components por defecto; `"use client"` solo donde hay interacción.
- Reutilizar `src/shared/ui/components/*` (buttons, inputs, modals, tables, cards…) antes de crear otro.
  Si un componente sirve a más de un contexto, va a `shared/ui`.
- Estilos con Tailwind v4. Formularios con react-hook-form + yup. Estado global de UI con Zustand en
  `presentation/stores/`.
- Estados de carga, error y vacío explícitos; atajos de teclado (el POS los usa: F7, etc.) sin romper
  la accesibilidad.

### Tests
- En `test/`, replicando la ruta de `src/` (`test/contexts/<ctx>/<entidad>/application/use-cases/...`).
- Prioridad: dominio y casos de uso. Repositorios reales sobre **pg-mem** (ver
  `test/contexts/image-management/image/test-utils/create-pgmem-image-datasource.ts`); APIs externas con
  fakes (`fake-*.ts`).
- Tests que no necesitan DOM: anotar `/** @jest-environment node */`.
- Tests contra BD real: solo con `RUN_DB_TESTS=true`.

### Git
- Commits: `FEATURE:`, `BUG:`, `REFACTOR:`, `FEATURE-IA:` (hecho con IA) + descripción en español.
- Features grandes: spec previa en `spect/NN_nombre_spect.md` (siguiente número libre).
- No mezclar refactors de formato/lint con un feature.

## Gotchas que ya costaron caro

**Turbopack vs Webpack.** `dev` usa Turbopack, `build` usa Webpack a propósito: el minificador de
Turbopack renombra clases y rompe las relaciones bidireccionales de TypeORM
(`Entity metadata for X was not found`, `Cannot access 'X' before initialization`). Detalle en
`MIGRATION-NEXT-V15-TO-V16.MD`. No unificar sin probar `next build --turbopack` con todo el grafo.

**Nube EDYOF (dual repository).** `Establishment`, `BranchOffice` y las transferencias tienen repo local
(TypeORM) y repo cloud (HTTP, `Fetch*Repository` + `DependencyFactory`). Los casos de uso llaman primero a
la nube y luego persisten en local dentro de una transacción. Si la BD local falla después de un éxito en
la nube **no hay compensación** (TODO conocido): tenerlo en cuenta al tocar sincronización.

**Inyección de dependencias.** `tsyringe` está instalado pero no se usa: el cableado es manual en cada
Server Action (`Typeorm*Repository.create()` + `new UseCase(...)`). No introducir un tercer mecanismo.

**Auth.** NextAuth v4, `src/shared/lib/auth.ts`. `proxy.ts` (middleware): `/auth/*` público, `/admin/*`
requiere rol `ADMIN`, el resto requiere sesión. La sesión incluye `id`, `roles`, `permissions`.

**Configuración por máquina.** SSL de BD con `DB_SSL`, IPs de red local con `ALLOWED_DEV_ORIGINS`. No
editar `config.ts` ni `next.config.ts` para eso.

**Tooling (ESLint 10, Windows).** No quitar `settings.react.version` de `eslint.config.mjs`: sin ella,
`eslint-plugin-react` 7.x intenta detectar React con una API que ESLint 10 eliminó y el lint se cae en todo el
repo. En scripts y hooks, ejecutar herramientas con `process.execPath` + la ruta de su script, no con `npx`
(en Windows es `npx.cmd` y `execFileSync` falla con `ENOENT`). Detalle en
`spect/refactors/03_lint_hooks_y_validate_refactor.md`.

## Deuda conocida (no la agraves; redúcela cuando toques el archivo)

| Deuda | Estado | Guardia |
|---|---|---|
| Server Actions sin `requireSession` | ~132 de 133 | Revisión (`code-reviewer`, `security-auditor`) |
| Errores de TypeScript ocultos por `ignoreBuildErrors` | 57 (+9 en `.next/types`, no cuentan) | `pnpm typecheck:ci` (trinquete `.tsc-baseline`, baja solo) |
| Errores de lint históricos | 319 | `eslint-suppressions.json` (`pnpm lint:prune` al arreglar) |
| `application/` importa `presentation/interfaces` | ~50 imports | regla de capas en ESLint |
| Inputs de Server Actions sin validar | casi todos | revisión |
