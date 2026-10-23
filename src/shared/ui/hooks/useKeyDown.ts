// shared/hooks/useKeyDown.ts
import { useEffect, useRef } from "react";

export type FNType =
  | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6'
  | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12'
  | 'ESC';

export type KeyHandlers = Partial<Record<FNType, (event: KeyboardEvent) => void>>;

interface Options {
  /** Permite activar/desactivar los atajos (ej. cuando hay un modal abierto) */
  enabled?: boolean;
  /** Evita el comportamiento por defecto del navegador (ej. F1 = ayuda). Default: true */
  preventDefault?: boolean;
  /** Ignora repeticiones al mantener presionada la tecla. Default: true */
  ignoreRepeat?: boolean;
}

// event.key del navegador → nuestro tipo
const KEY_MAP: Record<string, FNType> = {
  Escape: 'ESC',
  F1: 'F1', F2: 'F2', F3: 'F3', F4: 'F4', F5: 'F5', F6: 'F6',
  F7: 'F7', F8: 'F8', F9: 'F9', F10: 'F10', F11: 'F11', F12: 'F12',
};

export const useKeyDown = (
  handlers: KeyHandlers,
  { enabled = true, preventDefault = true, ignoreRepeat = true }: Options = {}
) => {
  // Siempre guardamos la última versión de los handlers.
  // Así el listener se registra una sola vez y nunca usa estado "viejo".
  const handlersRef = useRef<KeyHandlers>(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const fn = KEY_MAP[event.key];
      if (!fn) return;

      const handler = handlersRef.current[fn];
      if (!handler) return; // si no hay acción para esa tecla, no la bloqueamos

      if (ignoreRepeat && event.repeat) return;
      if (preventDefault) event.preventDefault();

      handler(event);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, preventDefault, ignoreRepeat]);
};