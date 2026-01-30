import { findEstablishmentByIdAction } from "@/features/establishment/actions/find-establishment-by-id.action";
import { formatDate, formatDateShort } from "@/shared/lib/utils/date-formatter";
import { numberBasicFormat } from "@/shared/lib/utils/number-formatter";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { Button } from "@/shared/ui/components/buttons";
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { PCol, PrimaryTable, PRow } from "@/shared/ui/components/tables/PrimaryTable";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { BiAddToQueue, BiCalendar, BiInfoSquare, BiPencil } from "react-icons/bi";

export default async function Dashboard() {
  const data = await findEstablishmentByIdAction();
  const establishment = data.value ?? null;
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Configuraciones', href: '/configurations' },
    { label: establishment?.name ?? 'Establecimiento' },
  ];
  return (
    <ProtectedRoute requiredRoles={['global_admin','establishment_manager', 'branch_office_management']}>
      <TemplateHeader title={establishment?.name ?? 'Establecimiento'} detail="Vista general del establecimeinto." breadcrumbItems={breadcrumbItems}>
            {/* Información del Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md w-full p-6 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-4">
                  <Badge>FOLIO {establishment?.establishmentId}</Badge>
                </div>
                <div>
                  <h1 className="font-bold text-[12px] text-gray-500">NOMBRE COMERCIAL</h1>
                  <span className="text-sm font-bold">{establishment?.name}</span>
                </div>
                <div>
                  <h1 className="font-bold text-[12px] text-gray-500">FECHA DE REGISTRO</h1>
                  <span className="text-sm font-bold text-gray-400"><BiCalendar></BiCalendar> {formatDate(establishment?.createdAt)}</span>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <ButtonOutLine className="w-full"><BiPencil></BiPencil>Editar información</ButtonOutLine>
                  <ButtonOutLine color="purple" className="w-full"><BiAddToQueue></BiAddToQueue>Agregar sucursal</ButtonOutLine>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center bg-blue-400 text-white rounded-lg shadow-md p-6">
                <span className="text-center">CANTIDAD DE PRODUCTOS</span>
                <span className="font-bold text-2xl">{numberBasicFormat(2000)}</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-green-400 text-white rounded-lg shadow-md p-6">
                <span className="text-center">{`VENTAS ${new Date().getFullYear()}`}</span>
                <span className="font-bold text-2xl">{numberBasicFormat(2000)}</span>
              </div>
              <div className="flex flex-col justify-center items-center bg-purple-400 text-white rounded-lg shadow-md p-6">
                <span className="text-center">SUCURSALES</span>
                <span className="font-bold text-2xl">{numberBasicFormat(establishment?.branchOffices.length ?? 0)}</span>
              </div>
            </div>


            <div className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sucursales
              </h3>
              <PrimaryTable theadList={['Folio', 'Sucursal', 'Ciudad', 'Estado', 'Alta']}>
                {establishment?.branchOffices.map(item => <>
                  <PRow>
                    <PCol>{item.branchOfficeId}</PCol>
                    <PCol>{item.name}</PCol>
                    <PCol>{item.address.city}</PCol>
                    <PCol><Badge type="green">{item.deletedAt? 'Inactiva': 'Activa'}</Badge></PCol>
                    <PCol>{formatDateShort(item.createdAt)}</PCol>
                    <PCol className="flex justify-end"><Button size="sm" color="yellow"><BiInfoSquare></BiInfoSquare>Info.</Button></PCol>
                  </PRow>
                </>)}
              </PrimaryTable>
            </div>

      </TemplateHeader>
    </ProtectedRoute>
  );
}
