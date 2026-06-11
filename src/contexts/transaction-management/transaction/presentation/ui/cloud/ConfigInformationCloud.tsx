'use client'
import { useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";
import { Badge } from "@/shared/ui/components/badges/Badge";
import { BiCloud } from "react-icons/bi";
import { BsCloudCheck, BsCloudSlash } from "react-icons/bs";

function ConfigInformationCloud() {
    const { establishment } = useWorkspace();
    return (
        <article className="bg-white rounded-2xl p-4 flex flex-col gap-4 text-gray-600">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white">
                        <BiCloud size={40} />
                    </span>
                    <span className="font-semibold text-2xl">Estado del servicio</span>
                </div>
                <Badge size="lg" type={establishment?.enrollmentKey? 'blue': 'red'}>{establishment?.enrollmentKey? 'Activo': 'Inactivo'}</Badge>
            </div>
            <div className="flex gap-4 justify-between">
                <div>
                    <div className="bg-gray-100 p-4 rounded-2xl flex gap-2">
                        <span>Clave de inscripción activa: </span>
                        <Badge type={establishment?.enrollmentKey? 'blue': 'red'}>{establishment?.enrollmentKey? establishment.enrollmentKey: 'No registrado'}</Badge>
                    </div>
                    <p>Utilice esta clave para vincular otras sucursales y poder realizar traspasos entre sucursales.</p>
                </div>
                <div className="flex justify-center items-center">
                    {!establishment?.enrollmentKey? 
                    <div className="text-red-600">
                        <BsCloudSlash size={70} />
                    </div>: 
                    <div className="text-blue-600">
                        <BsCloudCheck size={70} />
                    </div>}
                </div>
            </div>
        </article>
    );
}

export { ConfigInformationCloud };