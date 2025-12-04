"use client";

import { useAuth, useWorkspace } from "@/shared/hooks/useAuth";
import { formatDate } from "@/shared/lib/utils/date-formatter";
import { numberBasicFormat } from "@/shared/lib/utils/number-formatter";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useAuth();
  const { establishment, branchOffice } = useWorkspace();
  const router = useRouter();

  return (
    <ProtectedRoute>
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
                  <span>{formatDate(new Date())}</span>
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
                <span className="font-bold text-2xl">{numberBasicFormat(2000)}</span>
              </div>
            </div>


            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sucursales
              </h3>
              
            </div>

      </TemplateHeader>
    </ProtectedRoute>
  );
}
