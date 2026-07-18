'use client'
import { ButtonOutLine } from "@/shared/ui/components/buttons/ButtonOutLine";
import { TextInput } from "@/shared/ui/components/inputs";
import { LabelInput } from "@/shared/ui/components/labels";
import { BiLink } from "react-icons/bi";
import { BsShop } from "react-icons/bs";
import { IUserWorkspace } from "@/contexts/authentication-management/auth/application/dtos/IUserWorkspace";
import { useRegisterCloudBranch } from "../../hooks/useRegisterCloudBranch";
import { useTransactionUIStore } from "@/contexts/transaction-management/transaction/presentation/stores/transaction-ui.store";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
interface Props {
    workspace: IUserWorkspace | null
}
function RegisterCloudBranch({ workspace }:Props) {
    // const { establishment } = useWorkspace();
    const { errors, handleSubmit, onSubmit, register, } = useRegisterCloudBranch();
    const { loading } = useTransactionUIStore();
    return (
        <>{!workspace?.establishment?.enrollmentKey ?
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-4 flex flex-col gap-2">
                <h2 className="flex gap-2 items-center font-bold text-amber-800">
                    <span><BsShop /></span>
                    <span>Inscribirse a establecimiento</span></h2>
                <span className="bg-amber-200 border-2 border-amber-600 rounded-2xl p-3 text-amber-800 text-sm">
                    Si ya cuentas con una clave de inscripción usala aqui, para vincularte a la nube de tu establecimeinto.
                </span>
                <div>
                    <LabelInput value="Introduce la clave de inscripción" />
                    <TextInput
                        {...register('enrollmentKey')}
                        error={!!errors.enrollmentKey}
                        errorMessage={errors.enrollmentKey?.message}
                        placeholder="Ej. XXXX-XXXX-XXXX" />
                </div>
                <ButtonOutLine color="green">
                    {loading==='register-cloud-branch'? <Spinner size={14}/>:<BiLink />} Vincular sucursal
                </ButtonOutLine>
            </form> : null
        }</>
    );
}

export { RegisterCloudBranch };