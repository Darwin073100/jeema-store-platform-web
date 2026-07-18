'use client';
import { RegisterCloudBranchDto } from '@/contexts/establishment-management/branch-office/application/dtos/register-cloud-branch.dto';
import { registerCloudBranchOfficeAction } from '@/contexts/establishment-management/branch-office/presentation/actions/register-cloud-branch.action';
import { useTransactionUIStore } from '@/contexts/transaction-management/transaction/presentation/stores/transaction-ui.store';
import { useWorkspace } from '@/shared/presentation/hooks/auth/useAuth';
import { useFloatMessageStore } from '@/shared/ui/components/messages/stores/useFloatMessageStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const registerFormData = yup.object().shape({
    enrollmentKey: yup
    .string()
    .trim()
    .min(5, 'La clave de inscripción debe tener mínimo 5 caracteres.')
    .required('La clave de inscripción es requerida.')
    .typeError('Asegurate de ingresar la información correcta.'),
});

type RegisterFormData = yup.InferType<typeof registerFormData>;

export const useRegisterCloudBranch = () => {
    const { branchOffice, setRefresh} = useWorkspace();
    const { setFloatMessageState } = useFloatMessageStore();
    const { initLoading, finishLoading} = useTransactionUIStore();
    const router = useRouter();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerFormData) as any,
        mode: 'onChange'
    });

    const onSubmit = async (data: RegisterFormData) => {
        initLoading('register-cloud-branch');
        const dto: RegisterCloudBranchDto = {
            branchOfficeId: branchOffice?.branchOfficeId ?? BigInt(0),
            branchOfficeName: branchOffice?.name ?? '',
            enrollmentKey: data.enrollmentKey
        }

        const result = await registerCloudBranchOfficeAction(dto);
        if(result.ok){
            setFloatMessageState({
                description: 'Se ha dado de alta en la nube correctamente.',
                isActive: true,
                summary: 'Exito',
                type: 'green'
            });
            setRefresh(true);
            setTimeout(()=> {
                setFloatMessageState({});
            }, 2000);
        } else {
            setFloatMessageState({
                description: result.error?.message ?? 'Error al dar de alta la sucursalen la nube.',
                isActive: true,
                summary: result.error?.error ?? 'Ha ocurrido un error.',
                type: 'red'
            });
            setTimeout(()=> {
                setFloatMessageState({});
            }, 4000);
        }
        finishLoading();
        setRefresh(false);
    }

    return {
        onSubmit,
        register,
        handleSubmit,
        reset,
        errors,
        setValue,
    }
}