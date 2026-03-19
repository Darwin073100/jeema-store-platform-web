'use client'
import { HideElement } from '@/features/auth/ui/HideElement'
import { useDeleteLotModal } from '@/contexts/purchase-management/lot/presentation/hooks/useDeleteLotModal'
import { useDeleteLotUnitPurchaseModal } from '@/contexts/purchase-management/lot/presentation/hooks/useDeleteLotUnitPurchaseModal'
import { useRegisterLotUnitPurchaseModal } from '@/contexts/purchase-management/lot/presentation/hooks/useRegisterLotUnitPurchaseModal'
import { useUpdateLotUnitPurchaseModal } from '@/contexts/purchase-management/lot/presentation/hooks/useUpdateLotUnitPurchaseModal'
import { DeleteLotModal } from '@/contexts/purchase-management/lot/presentation/ui/DeleteLotModal'
import { DeleteLotUnitPurchaseModal } from '@/contexts/purchase-management/lot/presentation/ui/DeleteLotUnitPurchaseModal'
import { RegisterLotUnitPurchaseModal } from '@/contexts/purchase-management/lot/presentation/ui/RegisterLotUnitPurchaseModal'
import { UpdateLotUnitPurchaseModal } from '@/contexts/purchase-management/lot/presentation/ui/UpdateLotUnitPurchaseModal'
import { formatDate } from '@/shared/lib/utils/date-formatter'
import { Button } from '@/shared/ui/components/buttons'
import { InfoCard } from '@/shared/ui/components/cards'
import React from 'react'
import { HiOutlineCalendar, HiPencil, HiPlus, HiTrash } from 'react-icons/hi'
import { TbBoxMultiple, TbBuildingWarehouse, TbCurrencyDollar, TbMail, TbPackage, TbPhone, TbUser } from 'react-icons/tb'
import { SuplierEntity } from '@/features/suplier/domain/entities/suplier.entity'
import { IProduct } from '@/contexts/product-management/product/presentation/interfaces/IProduct'
import { RegisterLotModal, UpdateLotModal } from '@/contexts/purchase-management/lot/presentation/ui'
import { useUpdateLotModal } from '@/contexts/purchase-management/lot/presentation/hooks'

interface Props {
    product: IProduct,
    supliers: SuplierEntity[]
}

const LotDetail = ({ product, supliers }: Props) => {
    const { handleOpenUpdateLotModal } = useUpdateLotModal();
    const { handleSelectedLotUnitPurchase: handleSelectedLotId } = useRegisterLotUnitPurchaseModal();
    const { handleSelectedLotUnitPurchase } = useUpdateLotUnitPurchaseModal();
    const { handleOpenModalDeleteLotUnitPurchase } = useDeleteLotUnitPurchaseModal();
    const { handleOpenModalDeleteLot } = useDeleteLotModal();
    return (
        <>
            <HideElement roles={['global_admin', 'establishment_manager', 'branch_office_management']}>
                <h4 className="font-medium text-gray-700 flex items-center gap-2 ml-6 mb-0">
                    <TbBuildingWarehouse className="w-5 h-5" />
                    Lotes comprados
                    <RegisterLotModal
                        supliers={supliers} />
                </h4>
                {product.lots && product.lots.length > 0 ? (
                    <>
                        <UpdateLotModal
                            supliers={supliers} />
                        <DeleteLotModal />
                        <div className="px-6 py-2">
                            {product.lots.map((lot, index) => (
                                <div key={lot.lotId} className="border border-gray-200 rounded-lg p-4 bg-white">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                                {index + 1}
                                            </span>
                                            FOLIO #{lot.lotId}
                                        </h3>
                                        <div className="flex gap-2">
                                            <Button color='yellow' onClick={() => handleOpenUpdateLotModal(lot)}>
                                                <HiPencil className="w-4 h-4" /> Modificar
                                            </Button>
                                            <Button color='red' onClick={() => handleOpenModalDeleteLot(lot.lotId)}>
                                                <HiTrash className="w-4 h-4" /> Eliminar
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <InfoCard
                                            label="Unidad báse"
                                            value={`${lot.purchaseUnit.toUpperCase()}`}
                                            icon={<TbPackage className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Precio de compra"
                                            value={`$${lot.purchasePrice}`}
                                            icon={<TbCurrencyDollar className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Cantidad comprada"
                                            value={lot.initialQuantity.toString()}
                                            icon={<TbBoxMultiple className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Fecha de ingreso"
                                            value={formatDate(lot.receivedDate)}
                                            icon={<HiOutlineCalendar className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Fecha de fabricación"
                                            value={lot.manufacturingDate ? formatDate(lot.manufacturingDate) : 'No especificada'}
                                            icon={<HiOutlineCalendar className="w-4 h-4" />}
                                        />
                                        <InfoCard
                                            label="Fecha de caducidad"
                                            value={lot.expirationDate ? formatDate(lot.expirationDate) : 'No especificada'}
                                            icon={<HiOutlineCalendar className="w-4 h-4" />}
                                        />
                                    </div>
                                    {lot.suplier && (
                                        <div className='border border-gray-300 rounded-2xl flex flex-col gap-4 p-4 mb-2'>
                                            <span>Información del proveedor</span>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                <InfoCard
                                                    label="Proveedor"
                                                    value={`${lot.suplier.name}`}
                                                    icon={<TbPackage className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="Contacto"
                                                    value={`${lot.suplier.contactPerson}`}
                                                    icon={<TbUser className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="Teléfono"
                                                    value={lot.suplier.phoneNumber}
                                                    icon={<TbPhone className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="Email"
                                                    value={lot.suplier.email}
                                                    icon={<TbMail className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="Pais"
                                                    value={lot.suplier.address?.country}
                                                    icon={<TbBoxMultiple className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="ciudad"
                                                    value={lot.suplier.address?.city}
                                                    icon={<TbBoxMultiple className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="Municipio"
                                                    value={lot.suplier.address?.municipality}
                                                    icon={<TbBoxMultiple className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="Calle"
                                                    value={lot.suplier.address?.street}
                                                    icon={<TbBoxMultiple className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="Código Postal"
                                                    value={lot.suplier.address?.postalCode}
                                                    icon={<TbBoxMultiple className="w-4 h-4" />}
                                                />
                                                <InfoCard
                                                    label="Referencia"
                                                    value={lot.suplier.address?.reference}
                                                    icon={<TbBoxMultiple className="w-4 h-4" />}
                                                />

                                            </div>
                                        </div>
                                    )}

                                    {/* Unidades de compra */}
                                    <RegisterLotUnitPurchaseModal />
                                    <div className="flex items-center mb-3 gap-4">
                                        <h4 className="font-medium text-gray-700">Unidades de compra</h4>
                                        <Button color='blue' type='button' onClick={() => handleSelectedLotId(lot.lotId)}>
                                            <HiPlus className="w-4 h-4" /> Agregar unidad
                                        </Button>
                                    </div>
                                    {lot.lotUnitPurchases && lot.lotUnitPurchases.length > 0 && (
                                        <div className="mb-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    <UpdateLotUnitPurchaseModal />
                                                    <DeleteLotUnitPurchaseModal />
                                                    {lot.lotUnitPurchases.map((unitPurchase) => (
                                                        <div key={unitPurchase.lotUnitPurchaseId} className="border border-gray-300 rounded-2xl p-4 space-y-2">
                                                            <div className='flex justify-between gap-2'>
                                                                <Button color='yellow' onClick={() => handleSelectedLotUnitPurchase(unitPurchase)}>
                                                                    <HiPencil className="w-4 h-4" />
                                                                    Modificar
                                                                </Button>
                                                                <Button color='red' onClick={() => handleOpenModalDeleteLotUnitPurchase(lot.lotId, unitPurchase.lotUnitPurchaseId)}>
                                                                    <HiTrash className="w-4 h-4" />
                                                                    Eliminar
                                                                </Button>
                                                            </div>
                                                            <InfoCard
                                                                label="Unidad"
                                                                value={unitPurchase.unit}
                                                                className="bg-white"
                                                            />
                                                            <InfoCard
                                                                label="Cantidad comprada"
                                                                value={unitPurchase.purchaseQuantity.toString()}
                                                                className="bg-white"
                                                            />
                                                            <InfoCard
                                                                label="Costo de la unidad"
                                                                value={`$${unitPurchase.purchasePrice}`}
                                                                className="bg-white"
                                                            />
                                                            <InfoCard
                                                                label="Unidades base en esta unidad"
                                                                value={unitPurchase.unitsInPurchaseUnit.toString()}
                                                                className="bg-white"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-6">
                        <div className="text-center py-12">
                            <TbBoxMultiple className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">No hay lotes registrados para este producto</p>
                            <p className="text-gray-500 text-sm mt-1">Agrega un lote para comenzar a gestionar el inventario</p>
                        </div>
                    </div>
                )}
            </HideElement>
        </>
    )
}

export default LotDetail
