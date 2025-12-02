/**
 * Interface para cliente HTTP genérico
 */
export interface HttpClient {
    get<T>(url: string, body?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;
    post<T>(url: string, body?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;
    put<T>(url: string, body?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;
    patch<T>(url: string, body?: any, headers?: Record<string, string>): Promise<HttpResponse<T>>;
    delete<T>(url: string, headers?: Record<string, string>): Promise<HttpResponse<T>>;
}

export interface HttpResponse<T> {
    data: T;
    status: number;
    headers: Record<string, string>;
    ok: boolean;
}

export interface HttpError {
    message: string;
    status: number;
    data?: any;
}
