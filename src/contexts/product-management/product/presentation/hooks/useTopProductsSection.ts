'use client'
import { useRef, useState } from "react";
import { findTopProductsByBranchOfficeAction } from "../actions/find-top-products-by-branch-office.action";
import { TopProductsResponseDto } from "../../application/dtos/products-top-by-branch-office-response.dto";

export const TOP_LIMIT_OPTIONS = [10, 25, 50, 100];

export type PeriodMode = 'month' | 'range';

export interface TopProductsFilters {
    mode: PeriodMode;
    /** `YYYY-MM` */
    month: string;
    /** `YYYY-MM-DD`, solo en modo rango. */
    dateInit: string;
    dateFinish: string;
    /** "" = todas las categorías. */
    categoryId: string;
    limit: number;
}

interface Props {
    initialData: TopProductsResponseDto;
}

const useTopProductsSection = ({ initialData }: Props) => {
    const [data, setData] = useState(initialData);
    const [filters, setFilters] = useState<TopProductsFilters>({
        mode: 'month',
        // El mes por defecto lo decide el servidor (zona horaria de la tienda), no el navegador.
        month: initialData.dateInit.slice(0, 7),
        dateInit: initialData.dateInit,
        dateFinish: initialData.dateFinish,
        categoryId: '',
        limit: TOP_LIMIT_OPTIONS[0],
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // Solo la última petición actualiza la tabla (evita que una respuesta lenta pise a una nueva).
    const lastRequestId = useRef(0);

    const fetchTop = async (next: TopProductsFilters) => {
        const requestId = ++lastRequestId.current;
        setLoading(true);
        setErrorMessage(null);
        try {
            const result = await findTopProductsByBranchOfficeAction({
                limit: next.limit,
                categoryId: next.categoryId || null,
                ...(next.mode === 'range'
                    ? { dateInit: next.dateInit, dateFinish: next.dateFinish }
                    : { month: next.month }),
            });
            if (requestId !== lastRequestId.current) return;
            if (result.ok && result.value) {
                setData(result.value);
            } else {
                const message = result.error?.message;
                setErrorMessage((Array.isArray(message) ? message.join(' ') : message) || 'No se pudo cargar el top de productos.');
            }
        } catch {
            if (requestId === lastRequestId.current) setErrorMessage('No se pudo conectar con el servidor.');
        } finally {
            if (requestId === lastRequestId.current) setLoading(false);
        }
    };

    /** Actualiza uno o más filtros y vuelve a consultar en cuanto el periodo está completo. */
    const updateFilters = (changes: Partial<TopProductsFilters>) => {
        const next = { ...filters, ...changes };
        setFilters(next);
        const periodReady = next.mode === 'month' ? !!next.month : !!next.dateInit && !!next.dateFinish;
        if (periodReady) {
            void fetchTop(next);
        }
    };

    /**
     * Cambia entre "mes" y "rango". Al pasar a rango se precarga el periodo que ya se está viendo,
     * así no hace falta volver a consultar.
     */
    const changeMode = (mode: PeriodMode) => {
        if (mode === filters.mode) return;
        if (mode === 'range') {
            setFilters({ ...filters, mode, dateInit: data.dateInit, dateFinish: data.dateFinish });
        } else {
            updateFilters({ mode });
        }
    };

    return {
        data,
        filters,
        loading,
        errorMessage,
        updateFilters,
        changeMode,
    }
}

export { useTopProductsSection };
