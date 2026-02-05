import { findEstablishmentByIdAction } from "@/features/establishment/actions/find-establishment-by-id.action";
import { BranchesInEstablishment } from "@/features/establishment/ui/BranchesInEstablishment";
import { WorkspaceInformation } from "@/features/establishment/ui/WorkspaceInformation";
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
              {establishment && <WorkspaceInformation 
                establishment={establishment}/>}

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
            <BranchesInEstablishment 
              branchOffices={establishment?.branchOffices ?? []}/>
      </TemplateHeader>
    </ProtectedRoute>
  );
}
