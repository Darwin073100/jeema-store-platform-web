---
name: new-use-case
description: Crea un caso de uso completo en JEEMA siguiendo Arquitectura Limpia - entidad/repositorio de dominio, use case, DTOs, repositorio TypeORM, Server Action con requireSession y validación, y su test. Úsalo cuando el usuario pida una operación nueva (registrar, actualizar, consultar, cancelar...) sobre una entidad.
argument-hint: <contexto>/<entidad> <verbo> (ej. sale-management/sale cancelar)
---

# Nuevo caso de uso

Argumentos: `$ARGUMENTS` → contexto, entidad y operación. Si faltan, pregúntalos (una sola pregunta).

## 0. Reconocimiento (no escribas nada aún)

- `ls src/contexts/<contexto>/<entidad>/` y abre **un caso de uso hermano** del mismo tipo (lectura vs
  escritura, transaccional o no). Copiarás su forma, imports y nombres.
- Abre la interfaz del repositorio de dominio, la entidad, su mapper y un action existente de la entidad.
- Si la operación toca más de un agregado, abre `CalculateSaleUseCase` como referencia de
  `runInTransaction`.

## 1. Dominio — `domain/`

- Si la operación cambia estado: añade a la entidad un método con nombre (`cancel()`, `applyPayment()`)
  que valide la regla y lance una `DomainException` específica (`exceptions/<nombre>.exception.ts`,
  `statusCode` 400/404/409).
- Añade a la interfaz del repositorio **solo** los métodos nuevos que el caso de uso necesita.

## 2. Aplicación — `application/`

- `dtos/<verbo>-<entidad>.dto.ts` (input) y, si aplica, DTO de respuesta. No importes
  `presentation/interfaces`.
- `use-cases/<verbo>-<entidad>.use-case.ts`:

```ts
/** <Qué hace, en una línea, en español>. */
export class CancelSaleUseCase {
    constructor(
        private readonly saleRepository: SaleRepository,          // interfaz de domain/
        private readonly transactionDB: TransactionDBRepository,  // solo si es multi-agregado
    ) {}

    async execute(dto: CancelSaleDTO): Promise<SaleEntity> {
        const sale = await this.saleRepository.findById(dto.saleId);
        if (!sale) throw new SaleNotFoundException(dto.saleId);
        sale.cancel(dto.reason);                                    // la regla vive en la entidad
        return this.saleRepository.update(sale);
    }
}
```

## 3. Infraestructura — `infraestructure/persistence/typeorm/`

- Implementa los métodos nuevos en `Typeorm<Entidad>Repository`, usando el mapper ORM ↔ dominio.
- ¿Requiere columna/tabla? Detente y sigue el skill `/new-migration` primero.

## 4. Presentación — `presentation/actions/<verbo>-<entidad>.action.ts`

Plantilla obligatoria (requireSession → validar → componer → ejecutar → revalidar → Result):

```ts
'use server';
import { revalidatePath } from "next/cache";
import { object, string } from "yup";
import { requireSession } from "@/shared/infrastructure/auth/require-session";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";

const schema = object({ saleId: string().required(), reason: string().trim().max(250).required() });

export async function cancelSaleAction(input: CancelSaleDTO) {
    try {
        await requireSession({ permissions: ["<permiso>"] });   // confirma con el usuario el permiso
        const dto = await schema.validate(input, { stripUnknown: true });
        const useCase = new CancelSaleUseCase(await TypeormSaleRepository.create());
        const result = await useCase.execute(dto);
        revalidatePath("/sale");
        return { ...Result.success(SaleMapper.toIResponse(result)) };
    } catch (error) {
        return { ...handleError(error, "cancelSaleAction") };
    }
}
```

Si no sabes qué permiso exigir, búscalo en `initial-data-postgres-script.sql` o pregunta.

## 5. Test — `test/contexts/<contexto>/<entidad>/application/use-cases/<verbo>-<entidad>.use-case.test.ts`

`/** @jest-environment node */`, repositorio fake en memoria o pg-mem. Casos mínimos: éxito, no
encontrado, cada regla de negocio violada.

## 6. Verificación

```bash
pnpm lint && pnpm typecheck:ci && pnpm test test/contexts/<contexto>/<entidad>
```

Reporta los archivos creados por capa y el resultado de los comandos. No conectes la UI salvo que se
haya pedido (eso es trabajo del agente `frontend`).
