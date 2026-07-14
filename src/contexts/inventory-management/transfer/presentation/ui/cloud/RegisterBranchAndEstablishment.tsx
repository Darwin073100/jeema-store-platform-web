'use client'
import { Button } from "@/shared/ui/components/buttons";
import { TextInput } from "@/shared/ui/components/inputs";
import { IoReload, IoSave } from "react-icons/io5";
import { BsShop } from "react-icons/bs";
import { LabelInput } from "@/shared/ui/components/labels";
import { useTransactionUIStore } from "../../../../../transaction-management/transaction/presentation/stores/transaction-ui.store";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { useRegisterCloudBranchAndEstablishment } from "../../hooks/useRegisterCloudBranchAndEstablishment";
import { IUserWorkspace } from "@/contexts/authentication-management/auth/application/dtos/IUserWorkspace";
interface Props {
    workspace: IUserWorkspace | null
}
export function RegisterBranchAndEstablishment({workspace}: Props) {
    const {loading} = useTransactionUIStore();
    const { errors, handleSubmit, onSubmit, register, generateEnrollmentKey} = useRegisterCloudBranchAndEstablishment();
    return (
        <>{!workspace?.establishment?.enrollmentKey? 
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-4 flex flex-col gap-2">
            <h2 className="flex gap-2 items-center font-bold text-blue-600">
                <span><BsShop /></span>
                <span>Dar de alta establecimiento</span></h2>
            <span className="bg-blue-100 border-2 border-blue-600 rounded-2xl p-3 text-blue-800 text-sm">
                Si todavia no has dado de alta tu establecimiento en la nube, introduce el nombre y Genera
                la clave de inscripción y utilizala para todas tus sucursales y puedan enviar y recibir traspasos.
            </span>
            <div>
                <LabelInput value="Nombre del establecimiento" />
                <TextInput
                    placeholder="Ej. Abarrotes Los Tamarindos"
                    {...register('cloudEstablishmentName')}
                    error={!!errors.cloudEstablishmentName}
                    errorMessage={errors.cloudEstablishmentName?.message} />
            </div>
            <div>
                <LabelInput value="Genera o ingresa la clave de inscripción" />
                <div className="w-full flex gap-2 items-center">
                    <div className="w-60">
                        <TextInput
                            {...register('enrollmentKey')}
                            error={!!errors.enrollmentKey}
                            errorMessage={errors.enrollmentKey?.message}
                            placeholder="Ej. 1212-2026-45658485" />
                    </div>
                    <Button type="button" onClick={() => generateEnrollmentKey()}>{loading=='generate-enrollment-key'? <Spinner/>: <IoReload />}</Button>
                    <Button type="submit">{loading=='register-cloud-branch-and-establishment'? <Spinner/>: <IoSave />} Completar registro</Button>
                </div>
            </div>
        </form>: null
        }</>        
    )
}