'use client';
import { useCallback, useState } from 'react';
import { useQzTray, blobToBase64 } from './useQzTray';
import { findPrinterConfigurationByCashRegisterAction } from '../actions/find-printer-configuration-by-cash-register.action';
import { IPrinterConfiguration } from '../interfaces/IPrinterConfiguration';

interface PrintTicketOptions {
  /** Solo usado por el disparo automático al finalizar una venta — ver useTicketSale. */
  requireAutoPrintOnSale?: boolean;
}

interface UsePrintTicketReturn {
  printing: boolean;
  printError: string | null;
  printTicket: (blob: Blob, cashRegisterId: bigint, options?: PrintTicketOptions) => Promise<void>;
}

/**
 * Busca la PrinterConfiguration activa de la caja registradora indicada e imprime un blob PDF ya
 * generado vía QZ Tray. Único punto reutilizado tanto por la impresión automática al finalizar una
 * venta (useTicketSale, con requireAutoPrintOnSale: true) como por los botones "Imprimir" manuales
 * del resto de modales de ticket (reimpresión de venta, cierre de caja).
 *
 * `cashRegisterId` es responsabilidad del caller: cada consumidor resuelve la caja correcta según
 * su propio flujo (venta/reimpresión → sale.cashSession.cashRegisterId, cierre de caja →
 * cashSession.cashRegisterId) — este hook no infiere ninguna caja "actual" por su cuenta.
 */
export function usePrintTicket(): UsePrintTicketReturn {
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const { printPdf } = useQzTray();

  const findPrinterConfig = useCallback(
    async (cashRegisterId: bigint, options?: PrintTicketOptions): Promise<IPrinterConfiguration | null> => {
      if (!cashRegisterId || cashRegisterId === BigInt(0)) {
        return null;
      }
      const result = await findPrinterConfigurationByCashRegisterAction(cashRegisterId);
      if (!result.ok || !result.value || !result.value.printerConfiguration) {
        return null;
      }
      const config = result.value.printerConfiguration;
      const matches = config.isActive && (!options?.requireAutoPrintOnSale || config.autoPrintOnSale);
      return matches ? config : null;
    },
    []
  );

  const printTicket = useCallback(
    async (blob: Blob, cashRegisterId: bigint, options?: PrintTicketOptions): Promise<void> => {
      setPrinting(true);
      setPrintError(null);
      try {
        const printerConfig = await findPrinterConfig(cashRegisterId, options);
        if (!printerConfig) {
          if (options?.requireAutoPrintOnSale) {
            return;
          }
          throw new Error('No hay una impresora configurada y activa para esta caja.');
        }
        const base64Pdf = await blobToBase64(blob);
        await printPdf(base64Pdf, printerConfig);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo imprimir el ticket.';
        setPrintError(message);
        throw error;
      } finally {
        setPrinting(false);
      }
    },
    [findPrinterConfig, printPdf]
  );

  return { printing, printError, printTicket };
}
