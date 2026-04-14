'use client'
import { Button } from "@/shared/ui/components/buttons";
import { FiExternalLink } from "react-icons/fi";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { PCol, PrimaryTable, PRow, PTableEmpty } from "@/shared/ui/components/tables/PrimaryTable";
import { useSuplierActionsBar } from "../hooks/useSuplierActionsBar";
import { useSuplierStore } from "../stores/suplier.store";

interface Props {
}

export function SuplierDesktopTable({}: Props) {
    const { supliersFiltered } = useSuplierStore();
    const { handleSuplierDetail, suplierId} = useSuplierActionsBar();
    const head = ['FOLIO', 'PROVEEDOR', 'TELEFONO', 'CORREO', 'CIUDAD', 'MUNICIPIO', 'COLONIA', 'C.P.'];

    return (
        <div>
            <PrimaryTable theadList={head} isActions={true}>
                {supliersFiltered.map(item => (
                    <PRow key={item?.suplierId || Math.random()}>
                        <PCol>{item?.suplierId || '-'}</PCol>
                        <PCol>{item?.name || '-'}</PCol>
                        <PCol>{item.phoneNumber}</PCol>
                        <PCol>{item.email}</PCol>
                        <PCol>{item?.address?.city}</PCol>
                        <PCol>{item?.address?.municipality}</PCol>
                        <PCol>{item?.address?.neighborhood}</PCol>
                        <PCol>{item?.address?.postalCode}</PCol>
                        <PCol className="flex justify-end">
                            <Button
                                disabled={suplierId===item.suplierId.toString()}
                                size="sm"
                                color="yellow"
                                onClick={() => handleSuplierDetail(item?.suplierId?.toString() || '')}
                                title="Ver detalles del producto"
                            >
                                {suplierId===item.suplierId.toString()
                                    ? <Spinner size={14} />
                                    :<FiExternalLink size={14} /> }
                                <span>Detalles</span>
                            </Button>
                        </PCol>
                    </PRow>
                ))}
                {(!supliersFiltered || supliersFiltered.length === 0) && (
                    <PTableEmpty colsNumber={head.length + 1} />
                )}
            </PrimaryTable>
        </div>
    )
}