/**
 * Filtro del top de productos vendidos. Las fechas viajan como texto (sin zona horaria) y el caso
 * de uso las interpreta como días calendario.
 * Prioridad del periodo: rango (dateInit/dateFinish) > mes (month) > mes actual.
 */
export interface FilterTopRequestDTO {
    /** Cuántos productos devolver. Por defecto 10, máximo 100. */
    limit?: number;
    /** Id de la categoría; null/vacío = todas. */
    categoryId?: string | null;
    /** Mes en formato `YYYY-MM`. */
    month?: string | null;
    /** Día inicial inclusivo, `YYYY-MM-DD`. */
    dateInit?: string | null;
    /** Día final inclusivo, `YYYY-MM-DD`. */
    dateFinish?: string | null;
}
