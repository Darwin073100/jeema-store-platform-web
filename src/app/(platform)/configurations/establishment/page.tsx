import { findEstablishmentByIdAction } from "@/features/establishment/actions/find-establishment-by-id.action";
import { formatDate, formatDateShort } from "@/shared/lib/utils/date-formatter";
import { numberBasicFormat } from "@/shared/lib/utils/number-formatter";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { PCol, PrimaryTable, PRow } from "@/shared/ui/components/tables/PrimaryTable";
import { TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { FaHistory } from "react-icons/fa";

export default async function Dashboard() {
  const data = await findEstablishmentByIdAction();
  const establishment = data.value ?? null;

  return (
    <ProtectedRoute requiredRoles={['global_admin','establishment_manager', 'branch_office_management']}>
      <TemplateHeader title={establishment?.name ?? 'Establecimiento'} detail="Vista general del establecimeinto." breadcrumbItems={[]}>
            {/* Información del Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-gray-700">
                <div className="flex items-center gap-4">
                  <h1 className="font-semibold">Folio:</h1>
                  <Badge>{establishment?.establishmentId}</Badge>
                </div>
                <div>
                  <h1 className="font-semibold">Establecimiento:</h1>
                  <span>{establishment?.name}</span>
                </div>
                <div>
                  <h1 className="font-semibold">Fecha de alta:</h1>
                  <span>{formatDate(establishment?.createdAt)}</span>
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
              <PrimaryTable theadList={['Folio', 'Sucursal', 'Ciudad', 'Activa', 'Alta']}>
                {establishment?.branchOffices.map(item => <>
                  <PRow>
                    <PCol>{item.branchOfficeId}</PCol>
                    <PCol>{item.name}</PCol>
                    <PCol>{item.address.city}</PCol>
                    <PCol><Badge type="green">{item.deletedAt? 'Inactiva': 'Activa'}</Badge></PCol>
                    <PCol>{formatDateShort(item.createdAt)}</PCol>
                    <PCol><FaHistory/></PCol>
                  </PRow>
                </>)}
              </PrimaryTable>
            </div>

      </TemplateHeader>
    </ProtectedRoute>
  );
}
