'use client'
import { useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
import { TextInput } from "@/shared/ui/components/inputs";
import { LabelInput } from "@/shared/ui/components/labels";
import { BiLink } from "react-icons/bi";
import { BsShop } from "react-icons/bs";
import { useRegisterCloudBranchAndEstablishment } from "../../hooks/useRegisterCloudBranchAndEstablishment";

function RegisterCloudBranch() {
    const { establishment } = useWorkspace();
    const { errors, handleSubmit, onSubmit, register} = useRegisterCloudBranchAndEstablishment();
    return (
        <>{!establishment?.enrollmentKey ?
            <section className="bg-white rounded-2xl p-4 flex flex-col gap-2">
                <h2 className="flex gap-2 items-center font-bold text-amber-800">
                    <span><BsShop /></span>
                    <span>Inscribirse a establecimiento</span></h2>
                <span className="bg-amber-200 border-2 border-amber-600 rounded-2xl p-3 text-amber-800 text-sm">
                    Si ya cuentas con una clave de inscripción usala aqui, para vincularte a la nube de tu establecimeinto.
                </span>
                <div>
                    <LabelInput value="Introduce la clave de inscripción" />
                    <TextInput placeholder="Ej. XXXX-XXXX-XXXX" />
                </div>
                <ButtonOutLine color="green"><BiLink /> Vincular sucursal</ButtonOutLine>
            </section> : null
        }</>
    );
}

export { RegisterCloudBranch };