import { Badge } from "@/shared/ui/components/badges/Badge";
import { Button } from "@/shared/ui/components/buttons";
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
import { TextInput } from "@/shared/ui/components/inputs";
import { LabelInput } from "@/shared/ui/components/labels";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { BiCloud, BiLink } from "react-icons/bi";
import { BsCloud, BsCloudCheck, BsCloudSlash, BsShop } from "react-icons/bs";
import { IoReload, IoSave } from "react-icons/io5";

export default async function () {

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Traspasos', href: '/transfers' },
        { label: 'Configurar sucursal' }
    ]
    return (
        <ProtectedRoute requiredRoles={['global_admin', 'establishment_manager', 'branch_office_management']}>
            <TemplateHeader title="Configurar sucursal" detail="Realiza la configuración para que tu sucursal envíe y reciba traspasos de otras sucursale." breadcrumbItems={breadcrumbItems}>
                <article className="bg-white rounded-2xl p-4 flex flex-col gap-4 text-gray-600">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 text-white">
                                <BiCloud size={40} />
                            </span>
                            <span className="font-semibold text-2xl">Estado del servicio</span>
                        </div>
                        <Badge size="lg" type="red">Inactivo</Badge>
                    </div>
                    <div className="flex gap-4 justify-between">
                        <div>
                            <div className="bg-gray-100 p-4 rounded-2xl flex gap-2">
                                <span>Clave de inscripción activa: </span>
                                <Badge>BON-MTRZ-8821</Badge>
                            </div>
                            <p>Utilice esta clave para vincular otras sucursales y poder realizar traspasos entre sucursales.</p>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="text-red-600">
                                <BsCloudSlash size={70}/>
                            </div>
                            {/* <BsCloudCheck/> */}
                        </div>
                    </div>
                </article>
                <article className="flex gap-4 text-gray-600 mt-4">
                    <section className="bg-white rounded-2xl p-4 flex flex-col gap-2">
                        <h2 className="flex gap-2 items-center font-bold text-blue-600">
                            <span><BsShop/></span> 
                            <span>Dar de alta establecimiento</span></h2>
                        <span className="bg-blue-100 border-2 border-blue-600 rounded-2xl p-3 text-blue-800 text-sm">
                            Si todavia no has dado de alta tu establecimiento en la nube, introduce el nombre y Genera
                            la clave de inscripción y utilizala para todas tus sucursales y puedan enviar y recibir traspasos.
                        </span>
                        <div>
                            <LabelInput value="Nombre del establecimiento"/>
                            <TextInput placeholder="Ej. Abarrotes Los Tamarindos"/>
                        </div>
                        <div>
                            <LabelInput value="Genera o ingresa la clave de inscripción"/>
                            <div className="w-full flex gap-2 items-center">
                                <div className="w-60"><TextInput placeholder="Ej. AUTO-GEN-2026"/></div>
                                <Button><IoReload/></Button>
                                <Button><IoSave/> Completar registro</Button>
                            </div>
                        </div>
                    </section>
                    <section className="bg-white rounded-2xl p-4 flex flex-col gap-2">
                        <h2 className="flex gap-2 items-center font-bold text-amber-800">
                            <span><BsShop/></span> 
                            <span>Inscribirse a establecimiento</span></h2>
                        <span className="bg-amber-200 border-2 border-amber-600 rounded-2xl p-3 text-amber-800 text-sm">
                            Si ya cuentas con una clave de inscripción usala aqui, para vincularte a la nube de tu establecimeinto.
                        </span>
                        <div>
                            <LabelInput value="Introduce la clave de inscripción"/>
                            <TextInput placeholder="Ej. XXXX-XXXX-XXXX"/>
                        </div>
                        <ButtonOutLine color="green"><BiLink/> Vincular sucursal</ButtonOutLine>
                    </section>
                </article>
            </TemplateHeader>
        </ProtectedRoute>
    );
}