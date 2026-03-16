# Arquitectura Next.js + TypeORM (MVC)

## 📋 Estructura de Carpetas Recomendada

```
src/
├── configuration/
│   └── databases/typeorm/
│       └── config/
│           └── typeorm-connection.ts          ← Módulo servidor (NO "use server")
│
├── contexts/[agregate-root]/[entity]/
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
│  - const repo = await TypeOrmProductRepository.create()     │
│  - Métodos pueden ser sync o async                          │
└────────────────────┬────────────────────────────────────────┘
                     │ usa
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  TypeORM DataSource (SIN "use server")                      │
│  - getDataSource()  - async                                 │
│  - isDataSourceInitialized() - sync                         │
│  - closeDataSource() - async                                │
└─────────────────────────────────────────────────────────────┘
``` 
### Ejemplo de una entidad de dominio category.entity.ts
``` js
 
``` 