import { DomainException } from "@/shared/domain/exceptions/domain.exceptions";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { Result } from "@/shared/lib/utils/result";

/**
 * Manejo centralizado de errores para el request
 */
export function handleError(error: any, operation: string): Result<any, ErrorEntity> {
    console.error({ operation, error });
    // Si es un error HTTP (del servidor)
    if (error.status && error.data) {
        return Result.failure(error.data as ErrorEntity);
    }

    if (error instanceof DomainException) {
        return Result.failure({
            error: error.name,
            message: error?.message,
            statusCode: error.statusCode || 500,
            path: operation,
            timestamp: new Date().toDateString()
        } satisfies ErrorEntity);
    }
    if (error instanceof Error) {
        return Result.failure({
            error: error.name,
            message: error?.message,
            statusCode: 500,
            path: operation,
            timestamp: new Date().toDateString()
        } satisfies ErrorEntity);
    }

    // Si es un error de red o conexión
    return Result.failure({
        error: error?.message || error,
        message: `No se pudo conectar al servidor durante: ${operation}`,
        statusCode: error?.status || 500,
        path: operation,
        timestamp: new Date().toDateString()
    } satisfies ErrorEntity);
}