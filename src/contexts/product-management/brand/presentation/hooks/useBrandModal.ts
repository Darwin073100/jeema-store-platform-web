'use client'
import * as yup from 'yup';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Result } from '@/shared/features/result';
import { ErrorEntity } from '@/shared/features/error.entity';
import { useBrandStore } from '../stores/brand.store';
import { IBrand } from '@/contexts/product-management/brand/presentation/interfaces/Ibrand';
import { UpdateBrandDto } from '@/contexts/product-management/brand/application/dtos/update-brand.dto';
import { registerBrandAction } from '@/contexts/product-management/brand/presentation/actions/register-brand.action';
import { useUpdateBrand } from './useUpdateBrand';

const schema = yup.object({
    name: yup.string().trim().required('El campo es obligatorio').min(3, 'La marca debe tener al menos 3 caracteres.'),
}).required();

type FormData = yup.InferType<typeof schema>;

interface Props{
    brandList: IBrand[]
}

const useBrandModal = ({ brandList }: Props) => {
    const { setBrands, addBrand, updateBrand, brand, setBrand, modalOpen, setModalOpen } = useBrandStore();
    const { updateBrand: updateBrandAction, isLoading: isUpdating } = useUpdateBrand();
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const isEditMode = !!brand;

    const handleOpenModal = () => {
        setModalOpen(!modalOpen);
        resetForm();
    }

    useEffect(()=>{
        if (brandList && Array.isArray(brandList)) {
            setBrands(brandList);
        }
    },[brandList, setBrands]);

    const { register, handleSubmit, reset, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const resetForm = ()=>{
        setBrand(null)
        reset({});
        clearErrors(['name'])
    }

    useEffect(()=>{
        if(!!brand){
            reset({
                name: brand.name
            })
        } else {
            resetForm()
        }
    },[brand, reset]);

    const onSubmit = async (data: FormData) => {
        setFloatMessageState(() => ({}));
        setIsLoading(true);
        let result:any;
        
        if (!errors.name) {
            if (isEditMode && brand) {
                // Update existing brand
                const updateBrandDTO: UpdateBrandDto = {
                    brandId: brand.brandId,
                    name: data.name
                };
                
                const success = await updateBrandAction(updateBrandDTO);
                
                if (success) {
                    // Update the brand in the store
                    const updatedBrand: IBrand = {
                        ...brand,
                        name: data.name,
                        updatedAt: new Date()
                    };
                    updateBrand(updatedBrand);
                    
                    result = { ok: true };
                } else {
                    result = { ok: false, error: { message: 'Error updating brand' } };
                }
            } else {
                // Create new brand
                const newBrand = {
                    name: data.name
                }
                result = await registerBrandAction(newBrand);
            }
        } else {
            result = Result.failure({
                error: 'Hay un error',
                message: 'Hay un error',
                statusCode: 500,
                path: '',
                timestamp: new Date().toDateString()
            } satisfies ErrorEntity);
        }

        if (result?.ok) {
            setIsLoading(false);
            if(result.value && !isEditMode){
                addBrand(result.value)
            }

            // Refrescar datos del servidor
            router.refresh();

            resetForm();
            setFloatMessageState(()=>({
                description: isEditMode ? 'Marca actualizada correctamente' : 'Marca creada correctamente',
                summary: '¡Correcto!',
                isActive: true,
                type: 'blue'
            }));

            setTimeout(()=>{
                setFloatMessageState(() => ({}));
            }, 4000);

        } else {
            setIsLoading(false);
            setFloatMessageState(()=>({
                description: result?.error?.message,
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            }));
            setTimeout(()=>{
                setFloatMessageState(() => ({}));
            }, 4000);          
        }

    }
    
    return {
        setBrands,
        addBrand,
        updateBrand,
        brand, 
        setBrand,
        floatMessageState,
        setFloatMessageState,
        isLoading: isLoading || isUpdating,
        setIsLoading,
        modalOpen, 
        setModalOpen,
        handleOpenModal,
        resetForm,
        onSubmit,
        handleSubmit,
        register,
        errors,
        isEditMode,
    }
}

export { useBrandModal };
