'use client'
import { Button } from "@/shared/ui/components/buttons";
import { TextInput } from "@/shared/ui/components/inputs";
import { IoReload, IoSave } from "react-icons/io5";
import { useRegisterBranchAndEstablishment } from "../../hooks/useRegisterBranchAndEstablishment";
import { useTransactionCloudStore } from "../../stores/transaction-cloud.store";
import { BsShop } from "react-icons/bs";
import { LabelInput } from "@/shared/ui/components/labels";
import { useTransactionUIStore } from "../../stores/transaction-ui.store";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";

export function RegisterBranchAndEstablishment() {
    const { onSubmit } = useRegisterBranchAndEstablishment();
    const {loading} = useTransactionUIStore();
    const { setEnrollmentKey, enrollmentKey, setEstablishmentName, establishmentName } = useTransactionCloudStore();
    return (
        <section className="bg-white rounded-2xl p-4 flex flex-col gap-2">
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
                    onChange={(e)=> setEstablishmentName(e.target.value)}
                    value={establishmentName} 
                    placeholder="Ej. Abarrotes Los Tamarindos" />
            </div>
            <div>
                <LabelInput value="Genera o ingresa la clave de inscripción" />
                <div className="w-full flex gap-2 items-center">
                    <div className="w-60">
                        <TextInput
                            value={enrollmentKey}
                            onChange={(e) => setEnrollmentKey(e.target.value)}
                            placeholder="Ej. AUTO-GEN-2026" />
                    </div>
                    <Button type="button" onClick={() => onSubmit()}>{loading=='generate-enrollment-key'? <Spinner/>: <IoReload />}</Button>
                    <Button><IoSave /> Completar registro</Button>
                </div>
            </div>
        </section>
    )
}