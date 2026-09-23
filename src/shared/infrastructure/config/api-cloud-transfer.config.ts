import { ApiConfig } from "@/shared/domain/repositories/api-config";

/**
 * Implementación de configuración de API
 */
export class ApiCloudTransferConfigImpl implements ApiConfig {
    public readonly baseUrl: string;
    public readonly timeout: number;
    public readonly defaultHeaders: Record<string, string>;
    public readonly apiVersion: string;

    constructor() {
        // Configuracion de las variables de entorno
        // NOTA: nombres corregidos para que coincidan con .env.template (URL_EDYOF_PLATFORM_API /
        // PREFIX_EDYOF_PLATFORM_API). Antes se leían nombres inexistentes
        // (URL_JEEMA_TRANSFER_PLATFORM_API/PREFIX_JEEMA_TRANSFER_PLATFORM_API) con un default de prefijo
        // incorrecto ('/api' en vez de '/api/v1'), lo que hacía que cualquier llamada apuntara a la ruta
        // equivocada del servidor EDYOF. Ver spect/08_cloud_transfer_spect.md sección 8.1.
        const baseApiUrl = process.env.URL_EDYOF_PLATFORM_API || 'http://localhost:3001';
        const apiPrefix = process.env.PREFIX_EDYOF_PLATFORM_API || '/api/v1';
        
        this.baseUrl = `${baseApiUrl}${apiPrefix}`;
        this.timeout = 30000; // 30 segundos
        this.apiVersion = 'v1';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
    }

    /**
     * Obtiene la URL completa para un endpoint
     */
    getEndpointUrl(path: string): string {
        // Asegurar que el path comience con /
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${this.baseUrl}${normalizedPath}`;
    }

    /**
     * Obtiene headers con autenticación si está disponible
     */
    getAuthenticatedHeaders(token?: string): Record<string, string> {
        const headers = { ...this.defaultHeaders };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    }
}
