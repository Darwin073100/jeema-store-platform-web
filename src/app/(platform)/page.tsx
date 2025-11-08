"use client";
import { HiPhoto } from "react-icons/hi2";
import { CardLink } from "@/ui/components/cards/CardLink";
import { ProtectedRoute } from "@/ui/components/routes/ProtectedRoute";
import Sale from '../../ui/assets/images/sale.svg';
import Inventory from '../../ui/assets/images/inventary.svg';
import Contability from '../../ui/assets/images/payCash.svg';
import { BreadcrumbItem, TemplateHeader } from "@/ui/components/templates/TemplateHeader";
import { FaHistory } from "react-icons/fa";
import { PCol, PrimaryTable, PRow } from "@/ui/components/tables/PrimaryTable";
import { FcNegativeDynamic, FcStatistics } from "react-icons/fc";

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
          
          <div className="w-full pt-8 flex justify-between gap-4">
            <div>
              <h2 className="flex items-center justify-center gap-4 mb-4 uppercase text-2xl"><FcStatistics />Productos mas vendidos</h2>
              <PrimaryTable theadList={['Top', 'Producto', 'Total', 'Cantidad']}>
                <PRow>
                  <PCol>1</PCol>
                  <PCol>Sombrilla doble tela</PCol>
                  <PCol>$20,000</PCol>
                  <PCol>300</PCol>
                  <PCol><FaHistory/></PCol>
                </PRow>
                <PRow>
                  <PCol>1</PCol>
                  <PCol>Sombrilla doble tela</PCol>
                  <PCol>$20,000</PCol>
                  <PCol>300</PCol>
                  <PCol><FaHistory/></PCol>
                </PRow>
                <PRow>
                  <PCol>1</PCol>
                  <PCol>Sombrilla doble tela</PCol>
                  <PCol>$20,000</PCol>
                  <PCol>300</PCol>
                  <PCol><FaHistory/></PCol>
                </PRow>
                <PRow>
                  <PCol>1</PCol>
                  <PCol>Sombrilla doble tela</PCol>
                  <PCol>$20,000</PCol>
                  <PCol>300</PCol>
                  <PCol><FaHistory/></PCol>
                </PRow>
              </PrimaryTable>
            </div>
            <div>
              <h2 className="flex items-center justify-center gap-4 mb-4 uppercase text-2xl"><FcNegativeDynamic />Productos con bajo stock</h2>
              <PrimaryTable theadList={['Top', 'Producto', 'Stock min.', 'Stock total']}>
                <PRow>
                  <PCol>1</PCol>
                  <PCol>Sombrilla doble tela</PCol>
                  <PCol>20</PCol>
                  <PCol>24</PCol>
                  <PCol><FaHistory/></PCol>
                </PRow>
                <PRow>
                  <PCol>1</PCol>
                  <PCol>Sombrilla doble tela</PCol>
                  <PCol>20</PCol>
                  <PCol>24</PCol>
                  <PCol><FaHistory/></PCol>
                </PRow>
                <PRow>
                  <PCol>1</PCol>
                  <PCol>Sombrilla doble tela</PCol>
                  <PCol>20</PCol>
                  <PCol>24</PCol>
                  <PCol><FaHistory/></PCol>
                </PRow>
              </PrimaryTable>
            </div>
          </div>
        </div>
      </TemplateHeader>
    </ProtectedRoute>
  );
}
