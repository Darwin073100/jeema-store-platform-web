export interface ErrorEntity {
    error: string,
    message: string|string[],
    path: string,
    statusCode: number,
    timestamp: string
} 