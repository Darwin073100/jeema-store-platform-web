import { CardLink } from "@/shared/ui/components/cards/CardLink";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import Sale from '../../shared/ui/assets/images/sale.svg';
import Inventory from '../../shared/ui/assets/images/inventary.svg';
import Contability from '../../shared/ui/assets/images/payCash.svg';
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { HideElement } from "@/contexts/authentication-management/auth/presentation/ui/HideElement";
import { findTopProductsByBranchOfficeAction } from "@/contexts/product-management/product/presentation/actions/find-top-products-by-branch-office.action";
import { FilterTopEnum } from "@/contexts/product-management/product/domain/enums/FilterTopEnum";
import { TopProductsSection } from "@/contexts/product-management/product/presentation/ui/TopProductsSection";

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
          
          <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
            <TopProductsSection
              initialTopQuantity={productsTopQuantity}
              initialTopTotal={productsTopTotal} />
          </HideElement>
        </div>
      </TemplateHeader>
    </ProtectedRoute>
  );
}
