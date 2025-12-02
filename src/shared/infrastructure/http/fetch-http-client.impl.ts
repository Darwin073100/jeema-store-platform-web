import { HttpClient, HttpResponse, HttpError } from './http-client.interface';

/**
 * Implementación concreta del HttpClient usando fetch
 */
export class FetchHttpClient implements HttpClient {
    constructor(private readonly baseURL?: string) {}

    async get<T>(url: string, body?: any, headers?: Record<string, string>): Promise<HttpResponse<T>> {
        return this.request<T>('GET', url, body, headers);
    }

    async post<T>(url: string, body?: any, headers?: Record<string, string>): Promise<HttpResponse<T>> {
        return this.request<T>('POST', url, body, headers);
    }

    async put<T>(url: string, body?: any, headers?: Record<string, string>): Promise<HttpResponse<T>> {
        return this.request<T>('PUT', url, body, headers);
    }

    async patch<T>(url: string, body?: any, headers?: Record<string, string>): Promise<HttpResponse<T>> {
        return this.request<T>('PATCH', url, body, headers);
    }

    async delete<T>(url: string, headers?: Record<string, string>): Promise<HttpResponse<T>> {
        return this.request<T>('DELETE', url, undefined, headers);
    }

    private async request<T>(
        method: string,
        url: string,
        body?: any,
        headers?: Record<string, string>
    ): Promise<HttpResponse<T>> {
        const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
        
        try {
            const response = await fetch(fullUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            const data = response.headers.get('content-type')?.includes('application/json')
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                // Si no es exitoso, lanzar error con los datos del servidor
                const error: HttpError = {
                    message: `HTTP Error ${response.status}: ${response.statusText}`,
                    status: response.status,
                    data: data
                };
                throw error;
            }

            const httpResponse: HttpResponse<T> = {
                data,
                status: response.status,
                headers: this.extractHeaders(response.headers),
                ok: response.ok,
            };

            return httpResponse;
        } catch (error) {
            // Si es un error que ya manejamos, lo relanzamos
            if ('status' in (error as any)) {
                throw error;
            }
            // Si es un error de red u otro, lo envolvemos
            throw this.handleError(error as Error);
        }
    }

    private extractHeaders(headers: Headers): Record<string, string> {
        const headerObj: Record<string, string> = {};
        headers.forEach((value, key) => {
            headerObj[key] = value;
        });
        return headerObj;
    }

    private handleError(error: Error): HttpError {
        return {
            message: error.message,
            status: 500, // Default status for network errors
            data: null,
        };
    }
}
