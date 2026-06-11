/**
 * Interface para configuración de API
 */
export interface ApiConfig {
    baseUrl: string;
    timeout?: number;
    defaultHeaders?: Record<string, string>;
    apiVersion?: string;
    getEndpointUrl(path: string): string;
    getAuthenticatedHeaders(token?: string): Record<string, string>;
}