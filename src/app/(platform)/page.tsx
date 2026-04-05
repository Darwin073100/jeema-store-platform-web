import { CardLink } from "@/shared/ui/components/cards/CardLink";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import Sale from '../../shared/ui/assets/images/sale.svg';
import Inventory from '../../shared/ui/assets/images/inventary.svg';
import Contability from '../../shared/ui/assets/images/payCash.svg';
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { PCol, PrimaryTable, PRow } from "@/shared/ui/components/tables/PrimaryTable";
import { FcCurrencyExchange, FcNegativeDynamic, FcSalesPerformance, FcScatterPlot, FcStatistics } from "react-icons/fc";
import { numberBasicFormat, numberMoneyFormat } from "@/shared/lib/utils/number-formatter";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { HideElement } from "@/contexts/authentication-management/auth/presentation/ui/HideElement";
import { findTopProductsByBranchOfficeAction } from "@/contexts/product-management/product/presentation/actions/find-top-products-by-branch-office.action";
import { FilterTopEnum } from "@/contexts/product-management/product/domain/enums/FilterTopEnum";

const homeCards = [
  {
    title: 'Nueva venta',
    description: 'Vende productos a clientes',
    to: '/sale/new',
    image: Sale
  },
  {
    title: 'Traspasos',
    description: 'Historial de traspasos',
    to: '/',
    image: Inventory
  },
  {
    title: 'Finanzas',
    description: 'Revisa los ingresos y egresos',
    to: '/configurations/transactions',
    image: Contability
  }
];

export default async function Home() {
  const resultTopQuantity = await findTopProductsByBranchOfficeAction({filterBy: FilterTopEnum.QUANTITY_SALES});
  const productsTopQuantity = resultTopQuantity ?? []  
  const resultTopTotal = await findTopProductsByBranchOfficeAction({filterBy: FilterTopEnum.TOTAL_SALES});
  const productsTopTotal = resultTopTotal ?? []  

  const breadCrumbItems: BreadcrumbItem[] = [
    {
      label: 'Home'
    }
  ]
  return (
    <ProtectedRoute>
      <TemplateHeader title="Vista general" detail="Página de inicio" breadcrumbItems={breadCrumbItems}>
        <div className="h-full w-full">
          <form className="flex max-md:flex-col gap-4 w-full text-gray-700">
            {homeCards.map(item => (
              <CardLink 
                key={item.title.toString()}
                title={item.title}
                description={item.description}
                to={item.to}
                image={item.image}
              />
            ))}
          </form>
          
          <div className="w-full pt-8 grid grid-cols-2 max-md:grid-cols-1 gap-4">
            <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
              <div>
                <h2 className="flex items-center justify-center gap-4 mb-4 uppercase text-2xl">
                  <FcScatterPlot />
                  Más vendido por volumen
                </h2>
                <PrimaryTable key='topQuantity' theadList={['Top', 'Producto', 'Total', 'Uds']} isActions={false}>
                    {productsTopQuantity.map((item, i) =>(
                      <PRow key={item.productId}>
                        <PCol>{i+1}</PCol>
                        <PCol>{item.name}</PCol>
                        <PCol>{numberMoneyFormat(item.totalSales)}</PCol>
                        <PCol><Badge type="green">{numberBasicFormat(item.quantitySales)}</Badge></PCol>
                      </PRow>
                    ))}
                </PrimaryTable>
              </div>
              <div>
                <h2 className="flex items-center justify-center gap-4 mb-4 uppercase text-2xl">
                  <FcSalesPerformance />
                  Más vendido por monto
                </h2>
                <PrimaryTable key='topTotal' theadList={['Top', 'Producto', 'Total', 'Uds']} isActions={false}>
                  {productsTopTotal.map((item, i) =>(
                      <PRow key={item.productId}>
                        <PCol>{i+1}</PCol>
                        <PCol>{item.name}</PCol>
                        <PCol><Badge type="green">{numberMoneyFormat(item.totalSales)}</Badge></PCol>
                        <PCol>{numberBasicFormat(item.quantitySales)}</PCol>
                      </PRow>
                  ))}
                </PrimaryTable>
              </div>
            </HideElement>
          </div>
        </div>
      </TemplateHeader>
    </ProtectedRoute>
  );
}
