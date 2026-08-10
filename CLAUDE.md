# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

JEEMA Store Platform Web — inventory, sales, and product management system for a retail store, with an
optional sync to a separate cloud platform ("EDYOF") for multi-branch enrollment.

## Commands

```bash
pnpm install              # install deps (pnpm is required, see pnpm-workspace.yaml)

pnpm run dev              # dev server, Turbopack (next dev --turbopack)
pnpm run build            # production build, MUST use Webpack (next build --webpack) — see "Turbopack vs Webpack" below
pnpm run start            # run production build
pnpm run lint             # next lint

pnpm test                 # jest --watchAll (runs in watch mode by default)
npx jest path/to/file.test.ts          # run a single test file
npx jest -t "test name"                # run tests matching a name

pnpm run migration:generate <name>     # generate a TypeORM migration after editing an ORM entity
pnpm run migration:run                 # run pending migrations
pnpm run migration:revert              # revert the last migration
```

Database setup: create a Postgres database named `jeema_platform_db` (or match `DATABASE_URL`/`DB_*` in
`.env`, copied from `.env.template`), then run `pnpm run migration:run`. There's also a one-time seed
script at `src/configuration/databases/typeorm/scripts/initial-data-postgres-script.sql` meant to be run
manually via psql/pgAdmin.

## Turbopack vs Webpack — do not "fix" this by unifying them

`dev` uses Turbopack, `build` deliberately uses Webpack (`next build --webpack`). This is not
arbitrary — Turbopack's production minifier renames classes (`BranchOfficeOrmEntity` → `h`) and mishandles
circular imports between TypeORM entities with bidirectional relations, causing
`Entity metadata for X was not found` and TDZ `Cannot access 'X' before initialization` errors at runtime.
Webpack has no such issue with TypeORM's decorator + lazy-relation pattern. Full writeup, workarounds
considered and rejected, and how to check if a future Next.js version has fixed this:
`MIGRATION-NEXT-V15-TO-V16.MD`. Only switch `build` to Turbopack after verifying `next build --turbopack`
works cleanly with the TypeORM entity graph.

Also note: `next.config.ts` sets `typescript.ignoreBuildErrors: true` — `next build` will not fail on type
errors. Run `tsc`/lint separately if you need that signal.

## Architecture

DDD-flavored hexagonal/clean architecture, organized by **bounded context**, not by technical layer at the
top level. Full narrative version (with data-flow diagram) lives in `ARCHITECTURE.md` — this section
summarizes what actually holds in the code today.

```
src/
├── app/                    Next.js App Router — routes only, no business logic
│   ├── api/auth/[...nextauth]/   NextAuth handler (options in src/shared/lib/auth.ts)
│   ├── auth/login/
│   ├── initial/             onboarding wizard: establishment → first-branch-office → first-user
│   └── (platform)/           authenticated app: sale, products, purchases, customers,
│                              cash, transfers, branch-office, configurations
│
├── contexts/                one folder per bounded context, each with one or more sub-entities:
│   authentication-management/ (auth, permission, role)
│   cash-management/           (cash-register, cash-session)
│   configuration-management/
│   employee-management/       (employee, employee-role)
│   establishment-management/  (establishment, branch-office, address)
│   inventory-management/      (inventory, inventory-item, transfer)
│   product-management/        (product, brand, category, season)
│   purchase-management/       (lot, suplier)
│   sale-management/           (sale, sale-detail, sale-payment, customer, payment-method, returns)
│   transaction-management/    (transaction, transaction-type)
│
├── configuration/databases/typeorm/   DataSource config, migrations, migration scripts, SQL seed
│
└── shared/
    ├── domain/               ValueObject base class, DomainException base class, Result<T,E>,
    │                          domain events, ports (TransactionPort), enums
    ├── application/           shared DTOs/mappers
    ├── infrastructure/        di (DependencyFactory), http (FetchHttpClient), typeorm helpers,
    │                          error handling, auth.ts (NextAuth authOptions)
    ├── presentation/          shared hooks/providers/zustand stores
    └── ui/                    shared components/styles/assets
```

### Per-entity layering (inside each `contexts/<context>/<entity>/`)

Every entity subfolder (e.g. `contexts/product-management/product/`) repeats the same 4 layers:

- **domain/** — `entities/` (rich model, private constructor + static `create()`/`reconstitute()` factories,
  no public setters — state changes go through named methods like `updateName()`), `value-objects/`
  (extend `ValueObject<T>`, immutable via `Object.freeze`), `exceptions/` (extend `DomainException`),
  `repositories/` (interface only), `ports/out/` (interfaces for adapters the domain needs).
- **application/** — `use-cases/` (one class per operation, constructor-injected repositories, no framework
  imports), `dtos/`, `mappers/` (domain entity ↔ DTO).
- **infraestructure/** (note: consistently misspelled this way across the codebase — match it, don't
  "fix" it) — `persistence/typeorm/entities/*.orm-entity.ts` (TypeORM `@Entity` classes, separate from the
  domain entity), `persistence/typeorm/repositories/typeorm-*.repository.ts` (implements the domain
  repository interface), `persistence/typeorm/mappers/` (ORM entity ↔ domain entity).
- **presentation/** — `actions/*.action.ts` (Next.js Server Actions, `"use server"`, the only entry point
  from client code into a use case), `hooks/`, `stores/` (Zustand), `ui/` (React components scoped to this
  entity), `interfaces/` (client-side view-model types, e.g. `IProduct.ts`).

New ORM entities must be registered manually in the `entities` array in
`src/configuration/databases/typeorm/config/config.ts` — TypeORM does not auto-discover them here.

### Data flow

```
Client Component ("use client")
   → calls a Server Action ("use server", in presentation/actions/)
      → Server Action builds/calls a use-case (application/use-cases/), injecting a TypeORM repository
         → repository (infraestructure/) talks to the shared TypeORM DataSource (getDataSource())
```

`getDataSource()` / `AppDataSource` (in `config/config.ts`) is a lazy singleton — call `getDataSource()`
to get an initialized `DataSource`, don't instantiate `DataSource` directly.

### Error handling — two different conventions, both intentional

- **Local/domain operations**: throw `DomainException` subclasses (e.g. `ProductNotFoundException`),
  caught at the Server Action / UI boundary.
- **External/HTTP operations** (cloud sync, third-party APIs): return `Result<T, ErrorEntity>`
  (`src/shared/lib/utils/result.ts`, `error.entity.ts`) instead of throwing — see
  `errorHandler`/`handleError` in `src/shared/infrastructure/http|error/`. Don't mix the two within the
  same layer; match whichever pattern the surrounding code in that use case already uses.

### Local + cloud dual-repository pattern (establishment-management, and anywhere else "cloud" appears)

Some aggregates (currently `Establishment`, `BranchOffice`) can optionally be enrolled into a separate
remote "EDYOF" platform via an `enrollmentKey`. These have **two parallel repository interfaces**:
a normal TypeORM-backed one (`EstablishmentRepository`) and an HTTP-backed one
(`CloudEstablishmentRepository`, implemented by `FetchCloudEstablishmentRepository` using `HttpClient` +
`ApiConfig` from `DependencyFactory`, hitting `URL_EDYOF_PLATFORM_API`). Use cases like
`RegisterCloudBranchAndCloudEstablishmentUseCase` call the cloud repo first, then persist the returned
cloud IDs onto the local entity inside `TransactionDBRepository.runInTransaction(...)`. There is a known,
intentionally-left TODO in that use case: local DB failures after a successful cloud call are not
compensated (no rollback on the cloud side) — be aware of this if touching sync logic.

### Dependency injection

Mixed, not unified: `tsyringe` is a dependency but most of the codebase wires dependencies by hand —
either via `static create()` factory methods on repository/use-case classes, or via
`src/shared/infrastructure/di/dependency-factory.ts` (a hand-rolled singleton factory, currently only
covering `HttpClient`/`ApiConfig`). Follow whichever pattern the file you're editing already uses rather
than introducing a third approach.

### Auth

NextAuth v4, configured in `src/shared/lib/auth.ts` (`authOptions`), route handler at
`src/app/api/auth/[...nextauth]/route.ts`. Route protection is in `proxy.ts` (NextAuth middleware):
public under `/auth/*`, `ADMIN`-role-gated under `/admin/*`, everything else requires a session token.

## Testing

Jest + `jest-environment-jsdom` + Testing Library, config in `jest.config.cts` (uses `next/jest`).
`pg-mem` is available as an in-memory Postgres for repository/integration tests without a real DB.
Tests live under `test/`, mirroring the `src/contexts/...` path of what they cover (not colocated next to
source files).
