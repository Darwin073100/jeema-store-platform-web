'use client';
import { useCallback, useState } from 'react';
import { useWorkspace } from '@/shared/presentation/hooks/auth/useAuth';
import { useQzTray, blobToBase64 } from './useQzTray';
import { findPrinterConfigurationByBranchAction } from '../actions/find-printer-configuration-by-branch.action';
import { IPrinterConfiguration } from '../interfaces/IPrinterConfiguration';

interface PrintTicketOptions {
  /** Solo usado por el disparo automático al finalizar una venta — ver useTicketSale. */
  requireAutoPrintOnSale?: boolean;
}

interface UsePrintTicketReturn {
  printing: boolean;
  printError: string | null;
  printTicket: (blob: Blob, options?: PrintTicketOptions) => Promise<void>;
}

/**
 * Busca la PrinterConfiguration activa de la sucursal actual e imprime un blob PDF ya generado
 * vía QZ Tray. Único punto reutilizado tanto por la impresión automática al finalizar una venta
 * (useTicketSale, con requireAutoPrintOnSale: true) como por los botones "Imprimir" manuales del
 * resto de modales de ticket (reimpresión de venta, cierre de caja).
 */
export function usePrintTicket(): UsePrintTicketReturn {
  const [printing, setPrinting] = useState(false);
  const [printError, setPrintError] = useState<string | null>(null);
  const { branchOffice } = useWorkspace();
  const { printPdf } = useQzTray();

  const findPrinterConfig = useCallback(
    async (options?: PrintTicketOptions): Promise<IPrinterConfiguration | null> => {
      if (!branchOffice) {
        return null;
      }
      const result = await findPrinterConfigurationByBranchAction(branchOffice.branchOfficeId);
      if (!result.ok || !result.value) {
        return null;
      }
      return (
        result.value.printerConfigurations.find(
          (config: IPrinterConfiguration) =>
            config.isActive && (!options?.requireAutoPrintOnSale || config.autoPrintOnSale)
        ) ?? null
      );
    },
    [branchOffice]
  );

  const printTicket = useCallback(
    async (blob: Blob, options?: PrintTicketOptions): Promise<void> => {
      setPrinting(true);
      setPrintError(null);
      try {
        const printerConfig = await findPrinterConfig(options);
        if (!printerConfig) {
          if (options?.requireAutoPrintOnSale) {
            return;
          }
          throw new Error('No hay una impresora configurada y activa para esta sucursal.');
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
