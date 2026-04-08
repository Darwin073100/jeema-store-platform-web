import { Result } from "@/shared/lib/utils/result";

export function errorHandler<E>(error: any, path: string, statusCode: number = 500): Result<any, E> {
    return {
        ...Result.failure<E>({
        error: error.name || 'Error',
        message: error.message,
        path,
        statusCode,
        timestamp: new Date().toString()
    } as E)
    };
}