import React from 'react';
import { Metadata } from 'next';
import { ProtectedRoute } from '@/shared/ui/components/routes/ProtectedRoute';
import { BreadcrumbItem, TemplateHeader } from '@/shared/ui/components/templates/TemplateHeader'
import { findAllCustomerByEstablishmentAction } from '@/contexts/sale-management/customer/presentation/actions/find-all-customer-by-establishment.action'
import CustomerDesktopTable from '@/contexts/sale-management/customer/presentation/ui/CustomerDesktopTable';
import { CustomerOptios } from '@/contexts/sale-management/customer/presentation/ui/CustomerOptios';

// Configurar la página para que no se cachée y siempre obtenga datos frescos
export const revalidate = 0; // Revalidar en cada request
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

export const metadata: Metadata = {
    title: 'Customers'
}

const breadCrumbItems: BreadcrumbItem[] = [
    {
        label: 'clientes'
    }
]

export default async function CustomerPage() {
    const customersResult = await findAllCustomerByEstablishmentAction();
    const currentCustomers = customersResult?.value?.customers ?? [];

  return (
    <ProtectedRoute>
        <TemplateHeader breadcrumbItems={breadCrumbItems} title='Clientes' detail='Vista general de los clientes en todo el establecimeinto.'>
            <CustomerOptios 
                customersList={currentCustomers}/>
            <div className="hidden md:block">
                <CustomerDesktopTable />
            </div>
            <div className="md:hidden">
                {/* <SaleCardList
                    sales={currentSales} /> */}
            </div>
        </TemplateHeader>
    </ProtectedRoute>
  )
}
