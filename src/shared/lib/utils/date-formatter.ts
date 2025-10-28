/**
 * Formatea una fecha a string legible
 * Ej: 18 de septiembre de 2025, 19:14
 */
export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

export const formatTime = (time: any) => time.substring(0, 5); // Simple HH:MM

export function formatDateWithOutTime(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return 'Fecha inválida';
    }
}

/**
 * Formatea una fecha a string corto
 * Ej: 18/9/2025 
 */
export function formatDateShort(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('es-ES');
    } catch (error) {
        return 'Fecha inválida';
    }
}
