'use server';

import { unstable_noStore } from 'next/cache';
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import { Result } from '@/shared/lib/utils/result';
import { handleError } from '@/shared/infrastructure/http/handlers/handleError';

/**
 * Carga la clave privada RSA usada para firmar mensajes QZ Tray.
 *
 * Prioridad: QZ_PRIVATE_KEY (contenido PEM inline, útil en secret managers que solo inyectan
 * variables de entorno) sobre QZ_PRIVATE_KEY_PATH (ruta a un archivo .pem en disco, útil en
 * desarrollo). Nunca se hardcodea la clave en el código ni se expone al cliente.
 */
function loadQzPrivateKey(): string {
  const inlineKey = process.env.QZ_PRIVATE_KEY;
  if (inlineKey && inlineKey.trim().length > 0) {
    // Soporta el caso en que el valor venga con saltos de línea escapados ("\n" literal),
    // común cuando se inyecta desde un panel de variables de entorno de una sola línea.
    return inlineKey.includes('\\n') ? inlineKey.replace(/\\n/g, '\n') : inlineKey;
  }

  const keyPath = process.env.QZ_PRIVATE_KEY_PATH;
  if (!keyPath || keyPath.trim().length === 0) {
    throw new Error(
      'No hay clave privada de firma QZ Tray configurada. Define QZ_PRIVATE_KEY o QZ_PRIVATE_KEY_PATH (ver src/shared/infrastructure/qz/README.md).',
    );
  }

  const absolutePath = isAbsolute(keyPath) ? keyPath : resolve(process.cwd(), keyPath);
  return readFileSync(absolutePath, 'utf-8');
}

/**
 * Server Action invocada por el cliente vía `qz.security.setSignaturePromise` para firmar cada
 * mensaje que el navegador le manda a QZ Tray (conectar, listar impresoras, imprimir), evitando el
 * popup de confianza de QZ en cada sesión. Firma con SHA1withRSA (algoritmo que QZ Tray espera),
 * sobre el string exacto que QZ pide firmar.
 */
export async function signQzMessageAction(messageToSign: string) {
  try {
    unstable_noStore();

    if (!messageToSign || messageToSign.length === 0) {
      throw new Error('El mensaje a firmar no puede ir vacío.');
    }

    const privateKey = loadQzPrivateKey();

    const signer = createSign('SHA1');
    signer.update(messageToSign, 'utf8');
    signer.end();
    const signature = signer.sign(privateKey, 'base64');

    return {
      ...Result.success({ signature }),
    };
  } catch (error) {
    return {
      ...handleError(error, 'signQzMessageAction'),
    };
  }
}
