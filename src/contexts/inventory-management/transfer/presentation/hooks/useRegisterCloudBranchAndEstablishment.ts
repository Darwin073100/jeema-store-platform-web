'use client';
import { RegisterBranchAndEstablishmentDto } from '@/contexts/establishment-management/branch-office/application/dtos/register-branch-and-establishment.dto';
import { registerCloudBranchOfficeAndCloudEstablishmentAction } from '@/contexts/establishment-management/branch-office/presentation/actions/register-cloud-branch-and-cloud-establishment.action';
import { generateEnrollmentKeyAction } from '@/contexts/establishment-management/establishment/presentation/actions/generate-enrollment-key.action';
import { useTransactionUIStore } from '@/contexts/transaction-management/transaction/presentation/stores/transaction-ui.store';
import { useWorkspace } from '@/shared/presentation/hooks/auth/useAuth';
import { useFloatMessageStore } from '@/shared/ui/components/messages/stores/useFloatMessageStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const registerFormData = yup.object().shape({
    cloudEstablishmentName: yup
        .string()
        .trim()
        .min(3, 'El nombre debe tener mínimo 3 caracteres.')
        .required('El nombre del establecimiento es requerido.')
        .typeError('Asegurate de ingresar la información correcta.'),
    enrollmentKey: yup
        .string()
        .trim()
        .min(5, 'La clave de inscripción debe tener mínimo 5 caracteres.')
        .required('La clave de inscripción es requerida.')
        .typeError('Asegurate de ingresar la información correcta.'),
});

type RegisterFormData = yup.InferType<typeof registerFormData>;

export const useRegisterCloudBranchAndEstablishment = () => {
    const { branchOffice, establishment, setRefresh} = useWorkspace();
    const { setFloatMessageState } = useFloatMessageStore();
    const { initLoading, finishLoading} = useTransactionUIStore();
    const router = useRouter();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerFormData) as any,
        mode: 'onChange'
    });

    const generateEnrollmentKey = async ()=> {
        initLoading('generate-enrollment-key');
        const response = await generateEnrollmentKeyAction();
        finishLoading();
        if(response.ok){
            setValue('enrollmentKey',response.value?.enrollmentKey ?? '');
            setFloatMessageState({
                description: 'Se ha generado una clave de inscripción.',
                isActive: true,
                summary: 'Clave generada',
                type: 'green'
            });
            setTimeout(()=> {
                setFloatMessageState({});
            }, 2000);
        } else {
            setFloatMessageState({
                description: response.error?.message ?? 'Error al generar la clave de inscripción.',
                isActive: true,
                summary: response.error?.error ?? 'Ha ocurrido un error.',
                type: 'red'
            });
            setTimeout(()=> {
                setFloatMessageState({});
            }, 4000);
        }
    }

    setValue('cloudEstablishmentName', establishment?.name ?? '');

    const onSubmit = async (data: RegisterFormData) => {
        initLoading('register-cloud-branch-and-establishment');
        const dto: RegisterBranchAndEstablishmentDto = {
            branchOfficeId: branchOffice?.branchOfficeId ?? BigInt(0),
            branchOfficeName: branchOffice?.name ?? '',
            enrollmentKey: data.enrollmentKey,
            establishmentId: establishment?.establishmentId ?? BigInt(0),
            establishmentName: establishment?.name ?? '',
        }

        const result = await registerCloudBranchOfficeAndCloudEstablishmentAction(dto);
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
                description: result.error?.message ?? 'Error al dar de alta la sucursal y el establecimeinto.',
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
        generateEnrollmentKey
    }
}