'use client';
import { Badge } from '@/shared/ui/components/badges/Badge';
import { Button } from '@/shared/ui/components/buttons';
import { Spinner } from '@/shared/ui/components/loadings/Spinner';
import React, { useEffect } from 'react'
import { IoMdAdd } from 'react-icons/io';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { HideElement } from '@/features/auth/ui/HideElement';
import { LotEntity } from '../../domain/entities/lot.entity';
import { useLotStore } from '../../infraestructure/store/lot.store';
import { useLotActionsBar } from '../../hooks/useLotActionsBar';
import { TextInput } from '@/shared/ui/components/inputs';
import { LabelInput } from '@/shared/ui/components/labels';
import { FaFilter } from 'react-icons/fa';
import { useLotUIStore } from '../../infraestructure/store/lot-ui.store';
interface Props{
    data: LotEntity[]
}
const LotActionsBar = ({ data }:Props) => {
    const { lotsFiltered, setLots } = useLotStore();
    const { loading } = useLotUIStore();
    const { handleDownloadExcel, errors,handleSubmit,onSubmit,register } = useLotActionsBar();
    
    useEffect(()=>{
        setLots(data);
    },[data]);

    return (
        <div className="flex justify-between gap-2">
            <div className='flex items-center gap-2'>
                <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4'>
                        <div>
                            <LabelInput value='Fecha de inicio' description='Si borras la fécha de inicio tomará la del día en transcurso por default.'/>
                            <TextInput
                                {...register('dateInit')}
                                error={!!errors.dateInit?.message}
                                errorMessage={errors.dateInit?.message}
                                name='dateInit'
                                type='date' />
                        </div>
                        <div>
                            <LabelInput value='Fecha de límite' description='Si borras la fécha límite tomará la del día en transcurso por default.'/>
                            <TextInput
                                {...register('dateFinish')}
                                error={!!errors.dateFinish?.message}
                                errorMessage={errors.dateFinish?.message}
                                name='dateFinish'
                                type='date' />
                        </div>
                        <div className='flex items-end'>
                            <Button color='yellow' disabled={loading === 'find-report-lots'}>
                                {loading === 'find-report-lots' ? <Spinner size={14} /> : <FaFilter size={14} />}
                                Aplicar filtro
                            </Button>
                        </div>
                    </form>
                </HideElement>
            </div>
            <div className="flex gap-4 items-center justify-between">
                <div className='flex gap-4 items-center'>
                    <HideElement roles={['global_admin','establishment_manager', 'branch_office_management']}>
                        <Button disabled={loading==='find-report-lots'} color='green' onClick={()=> handleDownloadExcel()}>
                            <PiMicrosoftExcelLogoFill />
                            <span className='max-md:hidden'>Exportar a Excel</span>
                        </Button>
                    </HideElement>
                    <div>
                        Compras<Badge>{lotsFiltered.length}</Badge>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { LotActionsBar };
