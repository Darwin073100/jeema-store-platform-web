/**
 * Indica si, desde el punto de vista de ESTA instalación, el traspaso fue creado y enviado por ella
 * (OUTGOING, esta instalación es A) o recibido vía `GET pending` (INCOMING, esta instalación es B).
 * Se guarda explícito (no derivado en cada query) para poder indexar/filtrar sin inferirlo de qué columna
 * de sucursal es null. Ver spect/08_cloud_transfer_spect.md sección 3.3.
 */
export enum CloudTransferDirectionEnum {
  OUTGOING = 'Saliente',
  INCOMING = 'Entrante',
}
