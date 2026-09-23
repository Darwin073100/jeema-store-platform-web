/**
 * Estado de resolución (matching) de una línea de traspaso del lado B. Naming literal en inglés (excepción
 * deliberada a la convención "labels en español" del resto del repo): es estado interno de resolución de
 * esta app, no un label de negocio mostrado tal cual en un enum de dominio como `TransferStatusEnum`. La UI
 * de `spect/09_..._spect.md` es libre de traducirlo a español para mostrarlo.
 */
export enum CloudTransferItemResolutionStatusEnum {
  PENDING = 'Pending',
  MATCHED = 'Matched',
  NEW_PRODUCT = 'NewProduct',
  REJECTED = 'Rejected',
}
