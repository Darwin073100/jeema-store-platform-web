'use client'
import * as yup from 'yup';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { FloatMessageType } from "@/shared/ui/types/FloatMessageType";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Result } from '@/shared/features/result';
import { ErrorEntity } from '@/shared/features/error.entity';
import { SeasonEntity } from '../domain/entities/season.entity';
import { useSeasonStore } from '../infraestructure/season.store';
import { RegisterSeasonDTO } from '../application/dtos/register-season.dto';
import { UpdateSeasonDTO } from '../application/dtos/update-season.dto';
import { registerSeasonAction } from '../actions/register-season.action';
import { useUpdateSeason } from './useUpdateSeason';

const schema = yup.object({
    name: yup.string().required('El campo es obligatorio').min(3, 'La categoría debe tener al menos 3 caracteres.'),
    description: yup.string().optional().notRequired().default(''),
    dateInit: yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    dateFinish: yup.string()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable()
}).required();

type FormData = yup.InferType<typeof schema>;

interface Props{
    seasonList: SeasonEntity[]
}

const useSeasonModal = ({ seasonList }: Props) => {
    const { setSeasons, addSeason, season, setSeason, modalOpen, setModalOpen } = useSeasonStore();
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState(false);
    const { handleUpdate, isUpdating } = useUpdateSeason();
    const router = useRouter();

    const isEditMode = !!season;

    const handleOpenModal = () => {
        setModalOpen(!modalOpen);
        resetForm();
    }

    useEffect(()=>{
        if (seasonList && Array.isArray(seasonList)) {
            setSeasons(seasonList);
        }
    },[seasonList, setSeasons]);

    const { register, handleSubmit, reset, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues:{
            dateFinish: '',
            dateInit: '',
        }
    });

    const resetForm = ()=>{
        setSeason(null)
        reset({
            name: '',
            description: '',
            dateInit: '',
            dateFinish: ''
        });
        clearErrors(['description', 'name', 'dateInit', 'dateFinish'])
    }

    // Helper para formatear fecha al formato YYYY-MM-DD que esperan los inputs de tipo date
    const formatDateForInput = (date: Date | string | null | undefined): string => {
        if (!date) return '';
        
        try {
            let dateObj: Date;
            
            if (typeof date === 'string') {
                // Si es string, crear la fecha manualmente para evitar problemas de timezone
                const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
                if (isoMatch) {
                    const [, year, month, day] = isoMatch;
                    dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                } else {
                    dateObj = new Date(date);
                }
            } else {
                dateObj = date;
            }
            
            if (isNaN(dateObj.getTime())) {
                console.warn('Invalid date received:', date);
                return '';
            }
            
            // Usar métodos locales para evitar problemas de timezone
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            
            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error formatting date:', error, 'Input:', date);
            return '';
        }
    }

    // Helper para convertir string de fecha (YYYY-MM-DD) a Date object
    const parseInputDate = (dateString: string | null | undefined): Date | null => {
        if (!dateString || dateString === '') return null;
        
        try {
            // Crear la fecha correctamente para evitar problemas de timezone
            // Parseamos manualmente para asegurar que se interprete en zona horaria local
            const [year, month, day] = dateString.split('-').map(Number);
            const date = new Date(year, month - 1, day); // month - 1 porque los meses en JS son 0-indexados
            
            return isNaN(date.getTime()) ? null : date;
        } catch (error) {
            return null;
        }
    }

    useEffect(()=>{
        if(!!season){
            const formData = {
                name: season.name,
                description: season.description,
                dateInit: formatDateForInput(season.dateInit),
                dateFinish: formatDateForInput(season.dateFinish)
            };
            reset(formData);
        } else {
            resetForm()
        }
    },[season, reset]);

    const onSubmit = async (data: FormData) => {
        setFloatMessageState(() => ({}));
        setIsLoading(true);
        let result;
        
        if (!errors.name) {
            if (isEditMode && season) {
                // Modo actualización
                const updateData: UpdateSeasonDTO = {
                    seasonId: season.seasonId,
                    name: data.name,
                    description: data.description,
                    dateInit: parseInputDate(data.dateInit),
                    dateFinish: parseInputDate(data.dateFinish)
                };
                
                const updateResult = await handleUpdate(updateData);
                if (updateResult.success) {
                    setIsLoading(false);
                    resetForm();
                    setFloatMessageState(()=>({
                        description: 'Temporada actualizada correctamente',
                        summary: '¡Correcto!',
                        isActive: true,
                        type: 'blue'
                    }));

                    setTimeout(()=>{
                        setFloatMessageState(() => ({}));
                    }, 4000);
                    return;
                } else {
                    const errorMessage = Array.isArray(updateResult.error) 
                        ? updateResult.error.join(', ') 
                        : updateResult.error || 'Error al actualizar';
                    
                    result = Result.failure({
                        error: errorMessage,
                        message: errorMessage,
                        statusCode: 500,
                        path: '',
                        timestamp: new Date().toDateString()
                    } satisfies ErrorEntity);
                }
            } else {
                // Modo creación
                const newSeason = {
                    name: data.name,
                    description: data.description,
                    dateInit: parseInputDate(data.dateInit),
                    dateFinish: parseInputDate(data.dateFinish)
                }
                result = await registerSeasonAction(newSeason);
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
            if(result.value){
                addSeason(result.value)
            }

            // Refrescar datos del servidor
            router.refresh();

            resetForm();
            setFloatMessageState(()=>({
                description: 'Temporada creada correctamente',
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
        setSeasons,
        addSeason,
        season, 
        setSeason,
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

export { useSeasonModal };
