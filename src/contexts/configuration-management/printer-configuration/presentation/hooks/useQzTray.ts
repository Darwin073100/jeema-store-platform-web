'use client';
import { useCallback, useRef, useState } from 'react';
import * as qz from 'qz-tray';
import { signQzMessageAction } from '@/shared/infrastructure/qz/sign-qz-message.action';
import { IPrinterConfiguration } from '../interfaces/IPrinterConfiguration';

/**
 * Certificado público QZ Tray, servido como asset estático (texto plano PEM). Se sirve desde
 * `public/qz/digital-certificate.txt`, ver `qz.security.setCertificatePromise`.
 */
const QZ_CERTIFICATE_URL = '/qz/digital-certificate.txt';

/**
 * Registra las promesas de seguridad (certificado + firma) una sola vez por sesión de navegador,
 * sin importar cuántos componentes monten este hook. Evita popups de confianza de QZ Tray al
 * imprimir de forma automática. Ver backend de firma en
 * `src/shared/infrastructure/qz/sign-qz-message.action.ts`.
 */
let qzSecurityConfigured = false;

function configureQzSecurity(): void {
  if (qzSecurityConfigured) {
    return;
  }
  qzSecurityConfigured = true;

  qz.security.setCertificatePromise((resolve, reject) => {
    fetch(QZ_CERTIFICATE_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo cargar el certificado digital de QZ Tray.');
        }
        return response.text();
      })
      .then((certificate) => resolve(certificate))
      .catch((error) => reject(error instanceof Error ? error.message : String(error)));
  });

  qz.security.setSignaturePromise((dataToSign: string) => async (resolve, reject) => {
    try {
      const result = await signQzMessageAction(dataToSign);
      if (result.ok && result.value) {
        resolve(result.value.signature);
      } else {
        reject(result.error?.message?.toString() ?? 'No se pudo firmar el mensaje de impresión.');
      }
    } catch (error) {
      reject(error instanceof Error ? error.message : 'Error inesperado firmando el mensaje de impresión.');
    }
  });
}

/** Separa un `target` con forma "host:puerto" (conexión QZ_NETWORK). */
function parseNetworkTarget(target: string): { host: string; port?: string } {
  const separatorIndex = target.lastIndexOf(':');
  if (separatorIndex === -1) {
    return { host: target };
  }
  return {
    host: target.slice(0, separatorIndex),
    port: target.slice(separatorIndex + 1),
  };
}

/**
 * Construye la configuración de impresión de QZ Tray a partir de una `PrinterConfiguration`.
 *
 * MVP (fase 1): tanto QZ_OS_PRINTER como QZ_USB se resuelven igual — `target` es el nombre de la
 * impresora tal como la reconoce el sistema operativo/QZ Tray (`qz.printers.find()`), ya que fase 1
 * solo envía el PDF ya renderizado (`type: 'pixel', format: 'pdf'`) y no comandos ESC/POS crudos por
 * USB. Distinguir USB de verdad (direccionamiento por vendor/product) queda para fase 2.
 */
/**
 * `size.width` debe coincidir EXACTO con el ancho de página que ya usa el PDF (`mmToPt(58)` /
 * `mmToPt(80)` en `Ticket58Document` y variantes) — no con el ancho "realmente imprimible" del
 * cabezal térmico. La zona no imprimible del hardware ya se resuelve dentro del propio PDF
 * (padding asimétrico, ver esos archivos: el corte ocurre en una posición fija desde el borde
 * izquierdo de la página, no está centrado, así que NO se puede compensar reescalando/recentrando
 * a otro tamaño de página aquí). Si `size` no coincide con el PDF, QZ puede reescalar el contenido
 * al tamaño declarado y reintroducir el mismo corte de otra forma. Solo fijamos `margins: 0` para
 * evitar que el driver de impresión del SO le sume OTRO margen encima del que ya trae el PDF.
 */
function buildPrinterConfig(printerConfig: IPrinterConfiguration): qz.PrintConfig {
  const copies = printerConfig.copies && printerConfig.copies > 0 ? printerConfig.copies : 1;
  const options: qz.PrintConfig = {
    copies,
    units: 'mm',
    size: { width: printerConfig.paperWidthMm, height: null },
    margins: 0,
  };

  if (printerConfig.connectionType === 'QZ_NETWORK') {
    const { host, port } = parseNetworkTarget(printerConfig.target);
    return qz.configs.create({ host, port }, options);
  }

  return qz.configs.create(printerConfig.target, options);
}

/** Convierte un Blob (el PDF ya generado con `@react-pdf/renderer`) a base64, para `qz.print`. */
export async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  if (typeof window === 'undefined' || typeof window.btoa !== 'function') {
    throw new Error('La conversión a base64 solo está disponible en el navegador.');
  }
  return window.btoa(binary);
}

function toFriendlyConnectError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  if (/timeout|unable to establish|connection/i.test(raw)) {
    return 'No se pudo conectar con QZ Tray. Verifica que esté instalado y en ejecución en este equipo.';
  }
  return raw || 'No se pudo conectar con QZ Tray.';
}

interface UseQzTrayReturn {
  connected: boolean;
  connecting: boolean;
  error: string | null;
  printers: string[];
  findingPrinters: boolean;
  connect: () => Promise<void>;
  findPrinters: () => Promise<string[]>;
  printPdf: (base64Pdf: string, printerConfig: IPrinterConfiguration) => Promise<void>;
}

/**
 * Encapsula la conexión/reconexión al agente local QZ Tray (certificado + firma) y la impresión
 * silenciosa vía `qz.print`. Usado tanto por el formulario de configuración de impresora
 * (`PrinterConfigurationForm`) como por el enganche de impresión automática en el flujo de venta
 * (`useTicketSale`/`useReprintTicketSale`) — un único pipeline de impresión, sin duplicar lógica.
 */
export function useQzTray(): UseQzTrayReturn {
  const [connected, setConnected] = useState<boolean>(() => {
    try {
      return qz.websocket.isActive();
    } catch {
      return false;
    }
  });
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [printers, setPrinters] = useState<string[]>([]);
  const [findingPrinters, setFindingPrinters] = useState(false);
  const connectingPromiseRef = useRef<Promise<void> | null>(null);

  const connect = useCallback(async (): Promise<void> => {
    configureQzSecurity();

    if (qz.websocket.isActive()) {
      setConnected(true);
      setError(null);
      return;
    }

    if (connectingPromiseRef.current) {
      return connectingPromiseRef.current;
    }

    setConnecting(true);
    setError(null);

    const promise = qz
      .websocket.connect({ retries: 1, delay: 1 })
      .then(() => {
        setConnected(true);
      })
      .catch((err: unknown) => {
        setConnected(false);
        const message = toFriendlyConnectError(err);
        setError(message);
        throw new Error(message);
      })
      .finally(() => {
        setConnecting(false);
        connectingPromiseRef.current = null;
      });

    connectingPromiseRef.current = promise;
    return promise;
  }, []);

  const ensureConnected = useCallback(async (): Promise<void> => {
    configureQzSecurity();
    if (qz.websocket.isActive()) {
      setConnected(true);
      return;
    }
    await connect();
  }, [connect]);

  const findPrinters = useCallback(async (): Promise<string[]> => {
    setFindingPrinters(true);
    try {
      await ensureConnected();
      const found = await qz.printers.find();
      const list = Array.isArray(found) ? found : [found];
      setPrinters(list);
      return list;
    } catch (err) {
      setPrinters([]);
      throw err;
    } finally {
      setFindingPrinters(false);
    }
  }, [ensureConnected]);

  const printPdf = useCallback(async (base64Pdf: string, printerConfig: IPrinterConfiguration): Promise<void> => {
    await ensureConnected();
    const config = buildPrinterConfig(printerConfig);
    await qz.print(config, [
      {
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data: base64Pdf,
      },
    ]);
  }, [ensureConnected]);

  return {
    connected,
    connecting,
    error,
    printers,
    findingPrinters,
    connect,
    findPrinters,
    printPdf,
  };
}
