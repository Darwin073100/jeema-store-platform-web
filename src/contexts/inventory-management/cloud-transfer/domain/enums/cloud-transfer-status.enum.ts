/**
 * Espeja EXACTAMENTE los strings de estado que devuelve la API EDYOF (confirmado contra
 * http://localhost:3001/api/docs-json). No es una extensión de `TransferStatusEnum` (traspaso local de un
 * solo item) — son agregados distintos con ciclos de vida distintos. Ver spect/08_cloud_transfer_spect.md
 * sección 3.2 para el razonamiento completo (en particular, por qué `IN_TRANSIT` usa guión bajo aquí y
 * espacio en `TransferStatusEnum`).
 */
export enum CloudTransferStatusEnum {
  PENDING = 'Pendiente',
  IN_TRANSIT = 'En_Transito',
  RECEIVED = 'Recibida',
  APPROVED = 'Aprobada',
  CANCELLED = 'Cancelada',
  ERROR = 'Error',
}
