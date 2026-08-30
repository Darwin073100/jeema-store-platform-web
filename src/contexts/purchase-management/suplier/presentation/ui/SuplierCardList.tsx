'use client'
import React from 'react'
import { Button } from '@/shared/ui/components/buttons'
import { Card } from '@/shared/ui/components/cards'
import { Spinner } from '@/shared/ui/components/loadings/Spinner'
import { FiExternalLink } from 'react-icons/fi'
import { useSuplierActionsBar } from '../hooks/useSuplierActionsBar'
import { useSuplierStore } from '../stores/suplier.store'

const SuplierCardList = () => {
    const { supliersFiltered } = useSuplierStore();
    const { handleSuplierDetail, suplierId } = useSuplierActionsBar();

    if (!supliersFiltered || supliersFiltered.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 w-full text-center text-gray-500 shadow-sm">
                No hay registros...
            </div>
        );
    }

    return (
        <>
            {supliersFiltered.map(item => (
                <Card key={item.suplierId.toString()} className="w-full">
                    <div className="flex justify-between items-start pb-2 border-b border-gray-100 mb-2">
                        <p className="text-lg font-bold text-gray-900">
                            Folio: <span className="text-blue-600">#{item.suplierId}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="col-span-2">
                            <p className="text-gray-500 font-bold">Proveedor:</p>
                            <p className="text-gray-700">{item.name ?? '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Teléfono:</p>
                            <p className="text-gray-700 font-semibold">{item.phoneNumber ?? 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">Correo:</p>
                            <p className="text-gray-700 font-semibold break-words">{item.email ?? 'N/A'}</p>
                        </div>
                        <div className="col-span-2 pt-2 mt-1 border-t border-gray-100">
                            <p className="text-gray-500 font-bold mb-1">Dirección:</p>
                            <div className="grid grid-cols-2 gap-y-2">
                                <div>
                                    <p className="text-gray-500 text-xs">Ciudad:</p>
                                    <p className="text-gray-700 font-semibold">{item.address?.city ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Municipio:</p>
                                    <p className="text-gray-700 font-semibold">{item.address?.municipality ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Colonia:</p>
                                    <p className="text-gray-700 font-semibold">{item.address?.neighborhood ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">C.P.:</p>
                                    <p className="text-gray-700 font-semibold">{item.address?.postalCode ?? 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full mt-3"
                        size="sm"
                        disabled={suplierId === item.suplierId.toString()}
                        title="Ver detalles del proveedor"
                        onClick={() => handleSuplierDetail(item.suplierId.toString())}
                    >
                        {suplierId === item.suplierId.toString()
                            ? <Spinner size={14} />
                            : <FiExternalLink size={14} />}
                        <span>Detalles</span>
                    </Button>
                </Card>
            ))}
        </>
    )
}

export { SuplierCardList };
