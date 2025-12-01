'use client';
import { Button } from "@/ui/components/buttons";
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

const SaleSummaryMovile = ({ paymentMethods, customers, inventoryItems }: Props) => {
    const { } = useTransferDataToClientNewSale({ methods: paymentMethods, customers, inventoryItems });
    const { productQuantity, total } = useSaleSummary();
    const { handleCheckerOpenModalFinishSale } = useSalePayment();
    const { customerSelected, openSaleModal } = useCustomerSale();

    return (
        <section className="lg:hidden absolute w-screen">
            <div className="w-full fixed z-10 bottom-0 left-0 right-0 bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-2">
                <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 flex justify-between">
                        {`${customerSelected?.firstName ?? 'Seleccina un cliente'} ${customerSelected?.lastName ?? ''}`}
                        <Button onClick={() => openSaleModal('customerListModal')} size="sm" className="shadow-sm hover:shadow-md transition-all">
                            <IoIosPerson className="text-lg" />
                        </Button></h3>
                    {customerSelected?.address
                        ? <p className="text-sm text-gray-600 mt-1">
                            {`${customerSelected?.address?.city}, ${customerSelected?.address?.state}, ${customerSelected?.address?.country}, 
                                    ${customerSelected?.address?.municipality}, ${customerSelected?.address?.postalCode}, ${customerSelected?.address?.reference}.`}
                        </p>
                        : <p className="text-sm text-gray-600 mt-1">
                            Sin dirección
                        </p>
                    }
                </div>

                <SaleCustomerListModal />

                <div className="flex items-center justify-between mt-2">
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        $ {numberBasicFormat(total)}
                    </div>
                    <div className="text-2xl font-semibold text-blue-700">{numberBasicFormat(productQuantity)} uds</div>
                    <Button onClick={() => handleCheckerOpenModalFinishSale()}>
                        <IoIosCash className="text-2xl" />
                        <span className="font-medium">Finalizar Venta</span>
                    </Button>
                </div>
            </div>
            <SalePaymentModal />
        </section>
    )
}

export { SaleSummaryMovile };
