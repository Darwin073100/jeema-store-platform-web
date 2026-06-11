import { generateEnrollmentKeyAction } from "@/contexts/establishment-management/establishment/presentation/actions/generate-enrollment-key.action"
import { useTransactionCloudStore } from "../stores/transaction-cloud.store";
import { useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";
import { useEffect } from "react";
import { useTransactionUIStore } from "../stores/transaction-ui.store";

export function useRegisterBranchAndEstablishment() {
    const { setEnrollmentKey, setEstablishmentName } = useTransactionCloudStore();
    const { initLoading, finishLoading} = useTransactionUIStore();
    const { branchOffice, establishment } = useWorkspace();
    
    useEffect(()=> {
        setEstablishmentName(establishment?.name ?? '')
    },[establishment, branchOffice])

    const onSubmit = async ()=> {
        initLoading('generate-enrollment-key');
        const response = await generateEnrollmentKeyAction();
        finishLoading();
        if(response.ok){
            setEnrollmentKey(response.value?.enrollmentKey ?? '');
        }
    }

    return {
        onSubmit
    }
}