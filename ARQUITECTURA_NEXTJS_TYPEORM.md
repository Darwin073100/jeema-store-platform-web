# Arquitectura Next.js + TypeORM (MVC)

## 📋 Estructura de Carpetas Recomendada

```
src/
├── configuration/
│   └── databases/typeorm/
│       └── config/
│           └── typeorm-connection.ts          ← Módulo servidor (NO "use server")
│
├── contexts/[feature]/[entity]/
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── exceptions/
│   ├── application/
│   │   ├── use-cases/
│   │   └── mappers/
│   ├── infraestructure/
│   │   └── persistence/typeorm/
│   │       ├── entities/    (ORM Entities)
│   │       └── repositories/ (TypeOrmRepository)
│   └── presentation/
│       └── actions/         ← Server Actions ("use server")
│
└── app/
    └── [pages]              ← Client Components ("use client") - llamann Server Actions
```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│  Client Component ("use client")                            │
│  - USA componentes interactivos (forms, buttons, etc)       │
│  - Llama server actions                                     │
└────────────────────┬────────────────────────────────────────┘
                     │ llama
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Server Action ("use server")                               │
│  - async function findAllProductsAction() { ... }           │
│  - Importa repositorios y casos de uso                      │
│  - Ejecuta lógica de negocio                                │
└────────────────────┬────────────────────────────────────────┘
                     │ usa
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Repository (SIN "use server")                              │
│  - const repo = await TypeOrmProductRepository.create()      │
│  - Métodos pueden ser sync o async                          │
└────────────────────┬────────────────────────────────────────┘
                     │ usa
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  TypeORM DataSource (SIN "use server")                       │
│  - getDataSource()  - async                                 │
│  - isDataSourceInitialized() - sync ✅                      │
│  - closeDataSource() - async                                │
└─────────────────────────────────────────────────────────────┘
```

## ✅ Ejemplos Correctos

### configuration/databases/typeorm/config/typeorm-connection.ts
```typescript
// ❌ NO PONGAS "use server" AQUÍ
import { DataSource } from 'typeorm';

let dataSourceInstance: DataSource | null = null;

// ✅ Funciones pueden ser sync o async
export function isDataSourceInitialized(): boolean {
  return dataSourceInstance !== null && dataSourceInstance.isInitialized;
}

// ✅ Funciones async también
export async function getDataSource(): Promise<DataSource> {
  if (dataSourceInstance?.isInitialized) return dataSourceInstance;
  // ... inicialización
}
```

### contexts/product/presentation/actions/find-all-products.action.ts
```typescript
// ✅ SÍ PONGAS "use server" AQUÍ (es un Server Action que se llama desde el cliente)
'use server'

import { cookies } from 'next/headers';
import { TypeOrmProductRepository } from '../../infraestructure/persistence/typeorm/repositories/typeorm-product.repository';
import { ViewAllProductsByEstablishmentUseCase } from '../../application/use-cases/view-all-products-by-establishment.use-case';

// ✅ MUST BE ASYNC
export async function findAllProductsByEstablishmentAction() {
  const repository = await TypeOrmProductRepository.create(); // ✅ Espera async
  const useCase = new ViewAllProductsByEstablishmentUseCase(repository);
  
  const cookieStore = await cookies();
  const establishment = cookieStore.get('establishmentCookie')?.value;
  const establishmentId = BigInt(establishment ? JSON.parse(establishment).establishmentId : 0);
  
  return await useCase.execute(establishmentId);
}
```

### app/(platform)/products/page.tsx
```typescript
// ✅ Este es un Server Component (por defecto en app router)
import { findAllProductsByEstablishmentAction } from '@/contexts/product/presentation/actions/find-all-products.action';

export default async function ProductsPage() {
  // ✅ Llama el Server Action aquí (lado servidor)
  const products = await findAllProductsByEstablishmentAction();
  
  return (
    <div>
      <ProductTable products={products} /> {/* ← Client Component si necesita interactividad */}
    </div>
  );
}
```

## 🚫 Errores Comunes

### ❌ Error 1: "use server" en configuración
```typescript
// ❌ MALO
'use server';
export function isDataSourceInitialized(): boolean { }
// Error: Server Actions must be async functions
```

### ❌ Error 2: Función síncrona en Server Action
```typescript
// ❌ MALO
'use server';
export function syncServerAction() { } // No es async!
```

## ✅ Checklist

- [ ] Archivos de configuración (`typeorm-connection.ts`) - NO tienen `"use server"`
- [ ] Repositorios - NO tienen `"use server"`
- [ ] Casos de uso - NO tienen `"use server"`
- [ ] Server Actions (archivos .action.ts) - SÍ tienen `"use server"`
- [ ] Todas las funciones exportadas en archivos con `"use server"` son `async`
- [ ] Importas repositorios y casos de uso desde Server Actions, no lo opuesto
