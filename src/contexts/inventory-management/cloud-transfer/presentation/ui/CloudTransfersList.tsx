'use client'
import Link from "next/link";
import { PrimaryTable } from "@/shared/ui/components/tables/PrimaryTable/PrimaryTable";
import { PTableEmpty } from "@/shared/ui/components/tables/PrimaryTable/PTableEmpty";
import { Button } from "@/shared/ui/components/buttons";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { FloatMessage } from "@/shared/ui/components/messages/FloatMessage";
import { HiPlus, HiOutlineRefresh, HiOutlineEye } from "react-icons/hi";
import { useCloudTransferList } from "../hooks/useCloudTransferList";
import { CloudTransferStatusBadge } from "./CloudTransferStatusBadge";
import { formatDate } from "@/shared/lib/utils/date-formatter";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";

const theadList = ['Traspaso', 'Sucursal (cloud)', 'Items', 'Notas de envío', 'Fecha', 'Estado'];

const CloudTransfersList = () => {
    const { transfers, listTab, setListTab, loading, handleRefreshIncoming } = useCloudTransferList();
    const { floatMessageState } = useCloudTransferUIStore();

    return (
        <div className="flex flex-col gap-4 w-full">
            <FloatMessage {...floatMessageState} />
            <div className="flex max-md:flex-col gap-4 justify-between items-center">
                <div className="flex gap-2" role="tablist" aria-label="Dirección del traspaso">
                    <Button
                        type="button"
                        role="tab"
                        aria-selected={listTab === CloudTransferDirectionEnum.INCOMING}
                        color={listTab === CloudTransferDirectionEnum.INCOMING ? 'blue' : 'gray'}
                        onClick={() => setListTab(CloudTransferDirectionEnum.INCOMING)}
                    >
                        Entrantes
                    </Button>
                    <Button
                        type="button"
                        role="tab"
                        aria-selected={listTab === CloudTransferDirectionEnum.OUTGOING}
                        color={listTab === CloudTransferDirectionEnum.OUTGOING ? 'blue' : 'gray'}
                        onClick={() => setListTab(CloudTransferDirectionEnum.OUTGOING)}
                    >
                        Salientes
                    </Button>
                </div>
                <div className="flex gap-2">
                    {listTab === CloudTransferDirectionEnum.INCOMING && (
                        <Button
                            type="button"
                            color="teal"
                            onClick={handleRefreshIncoming}
                            disabled={loading === 'refreshing'}
                            title="Consulta a la nube si hay traspasos entrantes nuevos"
                        >
                            {loading === 'refreshing' ? <Spinner /> : <HiOutlineRefresh className="w-4 h-4" />}
                            Actualizar
                        </Button>
                    )}
                    <Link href="/transfers/new">
                        <Button type="button" color="green">
                            <HiPlus className="w-4 h-4" />
                            Nuevo traspaso
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <PrimaryTable theadList={theadList}>
                    {loading === 'listing' ? (
                        <tr>
                            <td colSpan={theadList.length + 1} className="px-6 py-8 text-center">
                                <Spinner color="blue" />
                            </td>
                        </tr>
                    ) : transfers.length === 0 ? (
                        <PTableEmpty colsNumber={theadList.length + 1} />
                    ) : (
                        transfers.map(transfer => (
                            <tr key={transfer.cloudTransferId.toString()} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                                <td className="px-6 py-4 font-medium">#{transfer.cloudTransferId.toString()}</td>
                                <td className="px-6 py-4">{transfer.toCloudBranchOfficeId?.toString()} / {transfer.fromCloudBranchOfficeId?.toString()}</td>
                                <td className="px-6 py-4">{transfer.items.length}</td>
                                <td className="px-6 py-4 max-w-60 truncate" title={transfer.shipmentNotes ?? ''}>{transfer.shipmentNotes || 'Sin notas'}</td>
                                <td className="px-6 py-4">{formatDate(transfer.createdAt)}</td>
                                <td className="px-6 py-4"><CloudTransferStatusBadge status={transfer.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/transfers/detail/${transfer.cloudTransferId.toString()}`} aria-label={`Ver detalle del traspaso ${transfer.cloudTransferId.toString()}`}>
                                        <Button type="button" size="sm" color="blue">
                                            <HiOutlineEye className="w-4 h-4" />
                                            <span className="max-sm:hidden">Ver</span>
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                </PrimaryTable>
            </div>
        </div>
    );
};

export { CloudTransfersList };
