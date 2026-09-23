import { CloudTransferDirectionEnum } from "../enums/cloud-transfer-direction.enum";
import { CloudTransferStatusEnum } from "../enums/cloud-transfer-status.enum";
import { CloudTransferShipmentNotesVO } from "../value-objets/cloud-transfer-shipment-notes.vo";
import { CloudTransferErrorMessageVO } from "../value-objets/cloud-transfer-error-message.vo";
import { CloudTransferItemEntity } from "./cloud-transfer-item.entity";
import { CloudTransferInvalidStatusTransitionException } from "../exceptions/cloud-transfer-invalid-status-transition.exception";

/**
 * Agregado raíz del traspaso a la nube (cabecera, 1 por traspaso). Sigue el patrón ya usado por
 * `TransferEntity`: constructor privado, factories estáticos, getters, verbos de negocio con guardas de
 * invariante (nada de setters públicos crudos). Ver spect/08_cloud_transfer_spect.md sección 3.4.
 */
export class CloudTransferEntity {
    private readonly _cloudTransferId: bigint;
    private _remoteCloudTransferId: bigint | null;
    private _direction: CloudTransferDirectionEnum;
    private _fromBranchOfficeId: bigint | null;
    private _fromCloudBranchOfficeId: bigint;
    private _toBranchOfficeId: bigint | null;
    private _toCloudBranchOfficeId: bigint;
    private _status: CloudTransferStatusEnum;
    private _shipmentNotes: CloudTransferShipmentNotesVO | null;
    private _resolutionNotes: string | null;
    private _errorMessage: CloudTransferErrorMessageVO | null;
    private _requestedByEmployeeId: bigint | null;
    private _processedByEmployeeId: bigint | null;
    private _lastSyncedAt: Date | null;
    private readonly _createdAt: Date;
    private _updatedAt: Date | null;
    private _items: CloudTransferItemEntity[];

    private constructor(
        cloudTransferId: bigint,
        remoteCloudTransferId: bigint | null,
        direction: CloudTransferDirectionEnum,
        fromBranchOfficeId: bigint | null,
        fromCloudBranchOfficeId: bigint,
        toBranchOfficeId: bigint | null,
        toCloudBranchOfficeId: bigint,
        status: CloudTransferStatusEnum,
        shipmentNotes: string | null,
        resolutionNotes: string | null,
        errorMessage: string | null,
        requestedByEmployeeId: bigint | null,
        processedByEmployeeId: bigint | null,
        lastSyncedAt: Date | null,
        createdAt: Date,
        updatedAt: Date | null,
        items: CloudTransferItemEntity[],
    ) {
        this._cloudTransferId = cloudTransferId;
        this._remoteCloudTransferId = remoteCloudTransferId;
        this._direction = direction;
        this._fromBranchOfficeId = fromBranchOfficeId;
        this._fromCloudBranchOfficeId = fromCloudBranchOfficeId;
        this._toBranchOfficeId = toBranchOfficeId;
        this._toCloudBranchOfficeId = toCloudBranchOfficeId;
        this._status = status;
        this._shipmentNotes = CloudTransferShipmentNotesVO.create(shipmentNotes);
        this._resolutionNotes = resolutionNotes;
        this._errorMessage = CloudTransferErrorMessageVO.create(errorMessage);
        this._requestedByEmployeeId = requestedByEmployeeId;
        this._processedByEmployeeId = processedByEmployeeId;
        this._lastSyncedAt = lastSyncedAt;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._items = items;
    }

    /** A crea y envía: direction=OUTGOING, status=PENDING, remoteCloudTransferId=null, toBranchOfficeId=null. */
    static create(
        fromBranchOfficeId: bigint,
        fromCloudBranchOfficeId: bigint,
        toCloudBranchOfficeId: bigint,
        requestedByEmployeeId: bigint,
        shipmentNotes: string | null,
        items: CloudTransferItemEntity[],
    ): CloudTransferEntity {
        return new CloudTransferEntity(
            BigInt(0),
            null,
            CloudTransferDirectionEnum.OUTGOING,
            fromBranchOfficeId,
            fromCloudBranchOfficeId,
            null,
            toCloudBranchOfficeId,
            CloudTransferStatusEnum.PENDING,
            shipmentNotes,
            null,
            null,
            requestedByEmployeeId,
            null,
            null,
            new Date(),
            null,
            items,
        );
    }

    /** Construye/actualiza la fila espejo local a partir de un GET pending o GET :id de la nube. direction=INCOMING. */
    static fromCloudSnapshot(
        remoteCloudTransferId: bigint,
        fromCloudBranchOfficeId: bigint,
        toCloudBranchOfficeId: bigint,
        toBranchOfficeId: bigint,
        status: CloudTransferStatusEnum,
        shipmentNotes: string | null,
        items: CloudTransferItemEntity[],
    ): CloudTransferEntity {
        return new CloudTransferEntity(
            BigInt(0),
            remoteCloudTransferId,
            CloudTransferDirectionEnum.INCOMING,
            null,
            fromCloudBranchOfficeId,
            toBranchOfficeId,
            toCloudBranchOfficeId,
            status,
            shipmentNotes,
            null,
            null,
            null,
            null,
            null,
            new Date(),
            null,
            items,
        );
    }

    static reconstitute(params: {
        cloudTransferId: bigint;
        remoteCloudTransferId: bigint | null;
        direction: CloudTransferDirectionEnum;
        fromBranchOfficeId: bigint | null;
        fromCloudBranchOfficeId: bigint;
        toBranchOfficeId: bigint | null;
        toCloudBranchOfficeId: bigint;
        status: CloudTransferStatusEnum;
        shipmentNotes: string | null;
        resolutionNotes: string | null;
        errorMessage: string | null;
        requestedByEmployeeId: bigint | null;
        processedByEmployeeId: bigint | null;
        lastSyncedAt: Date | null;
        createdAt: Date;
        updatedAt: Date | null;
        items: CloudTransferItemEntity[];
    }): CloudTransferEntity {
        return new CloudTransferEntity(
            params.cloudTransferId,
            params.remoteCloudTransferId,
            params.direction,
            params.fromBranchOfficeId,
            params.fromCloudBranchOfficeId,
            params.toBranchOfficeId,
            params.toCloudBranchOfficeId,
            params.status,
            params.shipmentNotes,
            params.resolutionNotes,
            params.errorMessage,
            params.requestedByEmployeeId,
            params.processedByEmployeeId,
            params.lastSyncedAt,
            params.createdAt,
            params.updatedAt,
            params.items,
        );
    }

    // --- Getters ---
    get cloudTransferId(): bigint { return this._cloudTransferId; }
    get remoteCloudTransferId(): bigint | null { return this._remoteCloudTransferId; }
    get direction(): CloudTransferDirectionEnum { return this._direction; }
    get fromBranchOfficeId(): bigint | null { return this._fromBranchOfficeId; }
    get fromCloudBranchOfficeId(): bigint { return this._fromCloudBranchOfficeId; }
    get toBranchOfficeId(): bigint | null { return this._toBranchOfficeId; }
    get toCloudBranchOfficeId(): bigint { return this._toCloudBranchOfficeId; }
    get status(): CloudTransferStatusEnum { return this._status; }
    get shipmentNotes(): string | null { return this._shipmentNotes?.value ?? null; }
    get resolutionNotes(): string | null { return this._resolutionNotes; }
    get errorMessage(): string | null { return this._errorMessage?.value ?? null; }
    get requestedByEmployeeId(): bigint | null { return this._requestedByEmployeeId; }
    get processedByEmployeeId(): bigint | null { return this._processedByEmployeeId; }
    get lastSyncedAt(): Date | null { return this._lastSyncedAt; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date | null { return this._updatedAt; }
    get items(): CloudTransferItemEntity[] { return this._items; }

    private assertStatusIn(allowed: CloudTransferStatusEnum[], action: string): void {
        if (!allowed.includes(this._status)) {
            throw new CloudTransferInvalidStatusTransitionException(
                `No se puede ${action}: el traspaso está en estado ${this._status}, se esperaba uno de [${allowed.join(', ')}].`,
            );
        }
    }

    /** (local) PENDING -> PENDING, solo fija remoteCloudTransferId tras un POST exitoso a la nube. */
    public markAsCreatedInCloud(remoteCloudTransferId: bigint): void {
        this.assertStatusIn([CloudTransferStatusEnum.PENDING], 'marcar como creado en la nube');
        this._remoteCloudTransferId = remoteCloudTransferId;
        this._updatedAt = new Date();
    }

    public startProcessing(processedByEmployeeId: bigint): void {
        this.assertStatusIn([CloudTransferStatusEnum.PENDING], 'iniciar procesamiento');
        this._status = CloudTransferStatusEnum.IN_TRANSIT;
        this._processedByEmployeeId = processedByEmployeeId;
        this._updatedAt = new Date();
    }

    public receive(processedByEmployeeId: bigint, notes: string | null): void {
        this.assertStatusIn([CloudTransferStatusEnum.IN_TRANSIT], 'recibir');
        this._status = CloudTransferStatusEnum.RECEIVED;
        this._processedByEmployeeId = processedByEmployeeId;
        this._resolutionNotes = notes ?? this._resolutionNotes;
        this._updatedAt = new Date();
    }

    public approve(processedByEmployeeId: bigint, notes: string | null): void {
        this.assertStatusIn([CloudTransferStatusEnum.RECEIVED], 'aprobar');
        this._status = CloudTransferStatusEnum.APPROVED;
        this._processedByEmployeeId = processedByEmployeeId;
        this._resolutionNotes = notes ?? this._resolutionNotes;
        this._updatedAt = new Date();
    }

    public markError(errorMessage: string): void {
        this.assertStatusIn([CloudTransferStatusEnum.IN_TRANSIT], 'marcar como error');
        this._status = CloudTransferStatusEnum.ERROR;
        this._errorMessage = CloudTransferErrorMessageVO.create(errorMessage);
        this._updatedAt = new Date();
    }

    public retryProcessing(): void {
        this.assertStatusIn([CloudTransferStatusEnum.ERROR], 'reintentar procesamiento');
        this._status = CloudTransferStatusEnum.IN_TRANSIT;
        this._errorMessage = null;
        this._updatedAt = new Date();
    }

    /** Cancela el traspaso. Lanza si ya está APPROVED (o CANCELLED), igual que la API. */
    public cancel(reason: string | null): void {
        this.assertStatusIn(
            [CloudTransferStatusEnum.PENDING, CloudTransferStatusEnum.IN_TRANSIT, CloudTransferStatusEnum.RECEIVED],
            'cancelar',
        );
        this._status = CloudTransferStatusEnum.CANCELLED;
        this._resolutionNotes = reason ?? this._resolutionNotes;
        this._updatedAt = new Date();
    }

    public markSynced(): void {
        this._lastSyncedAt = new Date();
        this._updatedAt = new Date();
    }

    /** Solo permitido si status === PENDING (no se pueden agregar líneas a un traspaso ya enviado). */
    public addItem(item: CloudTransferItemEntity): void {
        this.assertStatusIn([CloudTransferStatusEnum.PENDING], 'agregar un item');
        this._items.push(item);
    }
}
