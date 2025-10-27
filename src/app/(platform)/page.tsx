"use client";
import { HiPhoto } from "react-icons/hi2";
import { CardLink } from "@/ui/components/cards/CardLink";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import Sale from '../../ui/assets/images/sale.svg';
import Inventory from '../../ui/assets/images/inventary.svg';
import Contability from '../../ui/assets/images/payCash.svg';
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";

const homeCards = [
  {
    title: 'Nueva venta',
    description: 'Vende productos a clientes',
    to: '/sale/new',
    image: Sale
  },
  {
    title: 'Inventario',
    description: 'Control de los productos',
    to: '/',
    image: Inventory
  },
  {
    title: 'Contabilidad',
    description: 'Revisa los ingresos y egresos',
    to: '/',
    image: Contability
  }
];

export default function Home() {
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
                key={item.title}
                title={item.title}
                description={item.description}
                to={item.to}
                image={item.image}
              />
            ))}
          </form>
          
          <div className="pt-4">
            <h1 className="flex justify-center items-center text-gray-700 text-2xl pb-4">
              Top 10 de productos mas vendidos 
              <HiPhoto />
            </h1>
          </div>
        </div>
      </TemplateHeader>
    </ProtectedRoute>
  );
}
