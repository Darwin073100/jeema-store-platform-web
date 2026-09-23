import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { CloudTransferApiRepository } from "@/contexts/inventory-management/cloud-transfer/domain/repositories/cloud-transfer-api.repository";
import { CreateCloudTransferHttpDto } from "@/contexts/inventory-management/cloud-transfer/application/dtos/create-cloud-transfer-http.dto";
import { ICloudTransferApiResponse } from "@/contexts/inventory-management/cloud-transfer/application/dtos/cloud-transfer-api-response.dto";

/**
 * Doble de prueba de `CloudTransferApiRepository`, simulando en memoria el comportamiento del servidor
 * EDYOF (shape de respuesta confirmado con la llamada real documentada en el reporte final). Permite
 * forzar un fallo en el próximo `create()` para probar el flujo de "guardado local, envío falla" +
 * `RetrySendCloudTransferUseCase`.
 */
export class FakeCloudTransferApiRepository implements CloudTransferApiRepository {
    private nextId = 1;
    private failNextCreate = false;
    private readonly store = new Map<string, ICloudTransferApiResponse>();
    public createCallCount = 0;

    setFailNextCreate(fail: boolean): void {
        this.failNextCreate = fail;
    }

    private static readonly notFoundError: ErrorEntity = {
        error: 'Not Found',
        message: ['No se encontró el traspaso.'],
        path: '/api/v1/cloud-transfers',
        statusCode: 404,
        timestamp: new Date().toISOString(),
    };

    async create(dto: CreateCloudTransferHttpDto): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        this.createCallCount++;
        if (this.failNextCreate) {
            this.failNextCreate = false;
            return Result.failure({
                error: 'Internal Server Error',
                message: 'network error (simulado)',
                path: '/api/v1/cloud-transfers',
                statusCode: 500,
                timestamp: new Date().toISOString(),
            });
        }

        const id = String(this.nextId++);
        const response: ICloudTransferApiResponse = {
            cloudTransferId: id,
            cloudEstablishmentId: '1',
            fromCloudBranchId: dto.fromCloudBranchId,
            toCloudBranchId: dto.toCloudBranchId,
            localTransferId: dto.localTransferId,
            payload: {
                shipmentNotes: dto.shipmentNotes ?? null,
                items: dto.items.map((item) => ({
                    originLocalProductId: item.originLocalProductId,
                    originLocalLotId: item.originLocalLotId ?? null,
                    originLocalInventoryItemId: item.originLocalInventoryItemId ?? null,
                    product: item.product,
                    lot: item.lot,
                    inventory: item.inventory,
                })),
            },
            status: 'Pendiente',
            notes: null,
            errorMessage: null,
            inTransitAt: null,
            approvedAt: null,
            receivedAt: null,
            cancelledAt: null,
            errorAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: null,
            deletedAt: null,
        };
        this.store.set(id, response);
        return Result.success(response);
    }

    async findPendingByToCloudBranchId(toCloudBranchId: bigint): Promise<Result<ICloudTransferApiResponse[], ErrorEntity>> {
        const pending = [...this.store.values()].filter(
            (t) => t.toCloudBranchId === toCloudBranchId.toString() && t.status === 'Pendiente',
        );
        return Result.success(pending);
    }

    async findById(remoteCloudTransferId: bigint): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        const found = this.store.get(remoteCloudTransferId.toString());
        if (!found) return Result.failure(FakeCloudTransferApiRepository.notFoundError);
        return Result.success(found);
    }

    async startProcessing(remoteCloudTransferId: bigint): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        return this.transition(remoteCloudTransferId, (t) => { t.status = 'En_Transito'; });
    }

    async receive(remoteCloudTransferId: bigint, _actingBranchId: bigint, notes?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        return this.transition(remoteCloudTransferId, (t) => { t.status = 'Recibida'; t.notes = notes ?? null; });
    }

    async approve(remoteCloudTransferId: bigint, _actingBranchId: bigint, notes?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        return this.transition(remoteCloudTransferId, (t) => { t.status = 'Aprobada'; t.notes = notes ?? null; });
    }

    async reportError(remoteCloudTransferId: bigint, _actingBranchId: bigint, errorMessage: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        return this.transition(remoteCloudTransferId, (t) => { t.status = 'Error'; t.errorMessage = errorMessage; });
    }

    async cancel(remoteCloudTransferId: bigint, _actingBranchId: bigint, reason?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        return this.transition(remoteCloudTransferId, (t) => { t.status = 'Cancelada'; t.notes = reason ?? null; });
    }

    private transition(
        remoteCloudTransferId: bigint,
        mutate: (t: ICloudTransferApiResponse) => void,
    ): Result<ICloudTransferApiResponse, ErrorEntity> {
        const found = this.store.get(remoteCloudTransferId.toString());
        if (!found) return Result.failure(FakeCloudTransferApiRepository.notFoundError);
        mutate(found);
        return Result.success(found);
    }
}
