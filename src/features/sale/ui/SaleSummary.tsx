'use client';
import { Button } from "@/shared/ui/components/buttons";
import { IoIosCash, IoIosPerson } from "react-icons/io";
import { numberBasicFormat } from "@/shared/lib/utils/number-formatter";
import { useSaleSummary } from "../hooks/useSaleSummary";
import { SalePaymentModal } from "./SalePaymentModal";
import { useSalePayment } from "../hooks/useSalePayment";
import { PaymentMethodEntity } from "@/features/payment-method/domain/entities/payment-method-entity";
import useTransferDataToClientNewSale from "../hooks/useTransferDataToClient";
import { SaleCustomerListModal } from "./SaleCustomerListModal";
import { useCustomerSale } from "../hooks/useCustomerSale";
import { CustomerEntity } from "@/features/customer/domain/entities/customer.entity";
import { InventoryItemEntity } from "@/features/inventory/domain/entities/inventory-item.entity";

interface Props {
    paymentMethods: PaymentMethodEntity[],
    customers: CustomerEntity[],
    inventoryItems: InventoryItemEntity[],
}

const SaleSummary = ({ paymentMethods, customers, inventoryItems }: Props) => {
    const {} = useTransferDataToClientNewSale({methods: paymentMethods, customers, inventoryItems});
    const { productQuantity, total} = useSaleSummary();
    const { handleCheckerOpenModalFinishSale } = useSalePayment();
    const { customerSelected, openSaleModal } = useCustomerSale();

    return (
        <section className="sticky top-4 max-lg:hidden">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6 w-[300px]">
                <div className="space-y-6 border-b border-gray-200 pb-6">
                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Total a pagar</span>
                        <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            $ {numberBasicFormat(total)}
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-gray-600 text-sm">Productos en venta</span>
                        <div className="text-2xl font-semibold text-blue-700">{ numberBasicFormat(productQuantity) } unidades</div>
                    </div>
                </div>

                {/* Potential Component: SaleCustomerInfo */}
                <div className="py-6 space-y-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Cliente</span>
                        <Button onClick={()=> openSaleModal('customerListModal')} size="sm" className="shadow-sm hover:shadow-md transition-all">
                            <IoIosPerson className="text-lg" />
                            <span>Seleccionar</span>
                        </Button>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium text-blue-800">{`${customerSelected?.firstName ?? 'Seleccina un cliente'} ${customerSelected?.lastName ?? ''}`}</h3>
                        { customerSelected?.address
                            ? <p className="text-sm text-gray-600 mt-1">
                                    { `${customerSelected?.address?.city}, ${customerSelected?.address?.state}, ${customerSelected?.address?.country}, 
                                    ${customerSelected?.address?.municipality}, ${customerSelected?.address?.postalCode}, ${customerSelected?.address?.reference}.`}
                            </p>
                            : <p className="text-sm text-gray-600 mt-1">
                                Sin dirección
                            </p>
                        }
                    </div>
                    <SaleCustomerListModal />
                </div>

                <div className="pt-6">
                    <Button onClick={()=> handleCheckerOpenModalFinishSale()} className="w-full justify-center py-4 shadow-md hover:shadow-lg transition-all text-lg">
                        <IoIosCash className="text-2xl" />
                        <span className="font-medium">Finalizar Venta</span>
                    </Button>
                </div>
            </div>
            <SalePaymentModal />
        </section>
    )
}

export { SaleSummary };
