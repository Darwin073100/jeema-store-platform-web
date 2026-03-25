import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";

/**
 * Manejo centralizado de errores para el request
 */
export function handleError(error: any, operation: string): Result<any, ErrorEntity> {
    console.error({operation, error});
    // Si es un error HTTP (del servidor)
    if (error.status && error.data) {
        return Result.failure(error.data as ErrorEntity);
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