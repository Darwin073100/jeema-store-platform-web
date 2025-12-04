import React from 'react';
import { Metadata } from 'next';
import { ProtectedRoute } from '@/shared/ui/components/routes/ProtectedRoute';
import { BreadcrumbItem, TemplateHeader } from '@/shared/ui/components/templates/TemplateHeader'
import { findAllCustomerByEstablishmentAction } from '@/features/customer/actions/find-all-customer-by-establishment.action'
import CustomerDesktopTable from '@/features/customer/presentation/ui/CustomerDesktopTable';
import { CustomerOptios } from '@/features/customer/presentation/ui/CustomerOptios';

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
