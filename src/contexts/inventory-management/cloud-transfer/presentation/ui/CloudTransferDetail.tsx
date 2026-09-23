'use client'
import { useState } from "react";
import { Button } from "@/shared/ui/components/buttons";
import { TextArea } from "@/shared/ui/components/inputs/TextInput copy";
import { InfoCard } from "@/shared/ui/components/cards";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { FloatMessage } from "@/shared/ui/components/messages/FloatMessage";
import {
    HiOutlinePlay, HiOutlineCheckCircle, HiOutlineBadgeCheck, HiOutlineBan,
    HiOutlineExclamationCircle, HiOutlineRefresh, HiOutlineExclamation,
} from "react-icons/hi";
import { useCloudTransferDetail } from "../hooks/useCloudTransferDetail";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";
import { CloudTransferStatusBadge } from "./CloudTransferStatusBadge";
import { CloudTransferItemResolutionCard } from "./CloudTransferItemResolutionCard";
import { ResolutionStatusBadge } from "./ResolutionStatusBadge";
import { ICloudTransfer } from "../interfaces/ICloudTransfer";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";
import { formatDate } from "@/shared/lib/utils/date-formatter";

interface Props {
    transfer: ICloudTransfer;
}

const CloudTransferDetail = ({ transfer: initialTransfer }: Props) => {
    const {
        transfer, refresh, handleRefresh, loading, reasonPrompt, setReasonPrompt,
        handleStartProcessing, handleReceive, handleApprove, handleCancel, handleReportError, handleRetrySend,
        isIncoming, isOutgoing, hasUnresolvedItems,
        canStartProcessing, canRetryProcessing, canReceive, canApprove, canReportError, canCancel, canRetrySend,
        showResolutionTable,
    } = useCloudTransferDetail(initialTransfer);
    const { floatMessageState } = useCloudTransferUIStore();
    const [reasonText, setReasonText] = useState('');

    const isBusy = loading !== 'none';

    const submitReasonPrompt = () => {
        if (reasonPrompt === 'cancel') handleCancel(reasonText);
        if (reasonPrompt === 'error') handleReportError(reasonText);
        setReasonPrompt(null);
        setReasonText('');
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <FloatMessage {...floatMessageState} />

            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                <div className="flex max-md:flex-col justify-between md:items-center gap-2">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Traspaso #{transfer.cloudTransferId.toString()}</h2>
                        <p className="text-gray-500 text-sm">
                            {isIncoming ? 'Entrante' : 'Saliente'} · Creado el {formatDate(transfer.createdAt)}
                            {transfer.remoteCloudTransferId && <> · ID en la nube: {transfer.remoteCloudTransferId.toString()}</>}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <CloudTransferStatusBadge status={transfer.status} size="md" />
                        {isOutgoing && transfer.remoteCloudTransferId && (
                            <Button
                                type="button"
                                color="teal"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={isBusy}
                                title="Consulta a la nube el avance de este traspaso"
                            >
                                {loading === 'refreshing' ? <Spinner /> : <HiOutlineRefresh className="w-4 h-4" />}
                                Actualizar
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoCard label="Sucursal origen (cloud)" value={transfer.fromCloudBranchOfficeId.toString()} />
                    <InfoCard label="Sucursal destino (cloud)" value={transfer.toCloudBranchOfficeId.toString()} />
                    <InfoCard label="Notas de envío" value={transfer.shipmentNotes || 'Sin notas'} />
                    {transfer.resolutionNotes && <InfoCard label="Notas de resolución" value={transfer.resolutionNotes} />}
                    {transfer.errorMessage && <InfoCard label="Último error" value={transfer.errorMessage} className="bg-red-50 border-red-200" />}
                </div>

                {!transfer.remoteCloudTransferId && isOutgoing && transfer.status === CloudTransferStatusEnum.PENDING && (
                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-xl p-3 text-sm">
                        <HiOutlineExclamation className="w-5 h-5 flex-shrink-0" />
                        El traspaso se guardó localmente (el stock ya se descontó) pero no se pudo enviar a la nube. Reintenta el envío.
                    </div>
                )}

                {isIncoming && transfer.status === CloudTransferStatusEnum.RECEIVED && hasUnresolvedItems && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-800 rounded-xl p-3 text-sm">
                        <HiOutlineExclamationCircle className="w-5 h-5 flex-shrink-0" />
                        Hay líneas sin resolver. No podrás aprobar el traspaso hasta que todas tengan un producto vinculado, sean marcadas como nuevas o rechazadas.
                    </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                    {canStartProcessing && (
                        <Button type="button" color="blue" onClick={handleStartProcessing} disabled={isBusy}>
                            {loading === 'starting-processing' ? <Spinner /> : <HiOutlinePlay className="w-4 h-4" />}
                            Empezar a procesar
                        </Button>
                    )}
                    {canRetryProcessing && (
                        <Button type="button" color="blue" onClick={handleStartProcessing} disabled={isBusy}>
                            {loading === 'starting-processing' ? <Spinner /> : <HiOutlineRefresh className="w-4 h-4" />}
                            Reintentar procesamiento
                        </Button>
                    )}
                    {canReceive && (
                        <Button type="button" color="teal" onClick={handleReceive} disabled={isBusy} title={hasUnresolvedItems ? 'Puedes confirmar la recepción física aunque falten líneas por resolver' : undefined}>
                            {loading === 'receiving' ? <Spinner /> : <HiOutlineCheckCircle className="w-4 h-4" />}
                            Confirmar recepción física
                        </Button>
                    )}
                    {canApprove && (
                        <Button type="button" color="green" onClick={handleApprove} disabled={isBusy || hasUnresolvedItems} title={hasUnresolvedItems ? 'Resuelve todas las líneas antes de aprobar' : undefined}>
                            {loading === 'approving' ? <Spinner /> : <HiOutlineBadgeCheck className="w-4 h-4" />}
                            Aprobar traspaso
                        </Button>
                    )}
                    {canReportError && (
                        <Button type="button" color="orange" onClick={() => setReasonPrompt('error')} disabled={isBusy}>
                            {loading === 'reporting-error' ? <Spinner /> : <HiOutlineExclamationCircle className="w-4 h-4" />}
                            Reportar error
                        </Button>
                    )}
                    {canRetrySend && (
                        <Button type="button" color="yellow" onClick={handleRetrySend} disabled={isBusy}>
                            {loading === 'retrying-send' ? <Spinner /> : <HiOutlineRefresh className="w-4 h-4" />}
                            Reintentar envío a la nube
                        </Button>
                    )}
                    {canCancel && (
                        <Button type="button" color="red" onClick={() => setReasonPrompt('cancel')} disabled={isBusy}>
                            {loading === 'cancelling' ? <Spinner /> : <HiOutlineBan className="w-4 h-4" />}
                            Cancelar traspaso
                        </Button>
                    )}
                </div>

                {reasonPrompt && (
                    <div className="flex flex-col gap-2 border border-gray-200 rounded-xl p-4">
                        <TextArea
                            aria-label={reasonPrompt === 'cancel' ? 'Motivo de cancelación' : 'Mensaje de error'}
                            placeholder={reasonPrompt === 'cancel' ? 'Motivo de la cancelación (opcional)...' : 'Describe el error que ocurrió...'}
                            value={reasonText}
                            onChange={(e) => setReasonText(e.target.value)} />
                        <div className="flex gap-2 justify-end">
                            <Button type="button" color={reasonPrompt === 'cancel' ? 'red' : 'orange'} onClick={submitReasonPrompt} disabled={reasonPrompt === 'error' && !reasonText.trim()}>
                                Confirmar
                            </Button>
                            <Button type="button" color="gray" onClick={() => { setReasonPrompt(null); setReasonText(''); }}>Cancelar</Button>
                        </div>
                    </div>
                )}
            </section>

            {showResolutionTable ? (
                <section className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-gray-800">Resolución de productos ({transfer.items.length})</h2>
                    {transfer.items
                        .sort((a, b) => a.lineNumber - b.lineNumber)
                        .map(item => (
                            <CloudTransferItemResolutionCard key={item.cloudTransferItemId.toString()} item={item} onResolved={refresh} />
                        ))}
                </section>
            ) : (
                <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
                    <h2 className="text-lg font-bold text-gray-800">Productos ({transfer.items.length})</h2>
                    {transfer.items.sort((a, b) => a.lineNumber - b.lineNumber).map(item => (
                        <div key={item.cloudTransferItemId.toString()} className="flex max-md:flex-col md:items-center justify-between gap-2 border border-gray-200 rounded-xl p-3">
                            <div>
                                <span className="font-semibold">{item.productName}</span>
                                <span className="text-gray-500 text-sm ml-2">Lote {item.lotNumber} · {item.lotTransferredQuantity} {item.productUnitOfMeasure}</span>
                            </div>
                            {isIncoming && <ResolutionStatusBadge status={item.resolutionStatus} />}
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
};

export { CloudTransferDetail };
