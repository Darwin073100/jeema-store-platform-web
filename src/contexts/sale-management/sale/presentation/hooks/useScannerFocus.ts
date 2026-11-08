'use client';
import { RefObject, useEffect } from "react";

/**
 * Elementos que deben conservar el foco al recibir un clic. Se compara con `closest`, así que también
 * cubre los clics sobre un icono `<svg>` dentro de un botón (un `SVGElement` no es `HTMLElement`).
 */
const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea, label, [role="button"], [role="dialog"], [data-keep-focus]';

interface Options {
    inputRef: RefObject<HTMLInputElement | null>;
    /** Desactívalo mientras haya un modal abierto para no mandar el foco al input que queda detrás. */
    enabled?: boolean;
}

/**
 * Mantiene el foco en el input del escáner del POS para que un código escaneado siempre llegue al buscador.
 *
 * Devuelve el foco al soltar el clic (`mouseup`) y no al presionarlo, para no mover el contenido entre
 * `mousedown` y `mouseup` (eso cancelaba el `click`). Además usa `preventScroll`, así que nunca desplaza
 * la página hasta el buscador.
 */
export const useScannerFocus = ({ inputRef, enabled = true }: Options) => {
    useEffect(() => {
        if (!enabled) return;

        const focusScanner = () => {
            const input = inputRef.current;
            if (input && document.activeElement !== input) {
                input.focus({ preventScroll: true });
            }
        };

        const handleMouseUp = (event: MouseEvent) => {
            if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) {
                return;
            }
            focusScanner();
        };

        // Al activarse (carga inicial o al cerrar un modal) el foco vuelve al escáner.
        focusScanner();

        document.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('focus', focusScanner);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('focus', focusScanner);
        };
    }, [enabled, inputRef]);
};
