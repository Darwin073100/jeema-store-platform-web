import React, { useEffect } from "react";
import { useCashStore } from "../stores/cash.store";
import { CashSessionEntity } from "../../../../../features/cash/domain/entities/cash-session.entity";
import { getLocalDate } from "@/shared/lib/utils/date-formatter";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { findCashMovementsByBranchOfficeIdAction } from "../actions/find-cash-movements-by-branch-office-id.action";
import { useCashUIStore } from "../stores/cash-ui.store";

export const schema = yup.object().shape({
    dateInit: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    dateFinish: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
}).required();

type FormData = yup.InferType<typeof schema>;
interface Props {
    data: CashSessionEntity[]
}
const useCashMovementsOptions = ({ data }: Props) => {
    const { setCashSessions, cashSessions, setDateInit, setDateFinish,  } = useCashStore();
    const { runLoading, stopLoading, loading} = useCashUIStore();
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {}
    });
    useEffect(() => {
        setCashSessions(data);
    }, [data]);

    const cashSessionTotalAmount = ()=> {
        let total = 0;
        for(let i = 0; i < cashSessions.length; i++){
            total = total + (cashSessions[i].actualBalance ?? 0);
        }
        return total;
    }

    const onSubmit = async (info: FormData) => {
        runLoading('movementsCashSession');
        const lotsResponse = await findCashMovementsByBranchOfficeIdAction({dateInit: info.dateInit ?? null, dateFinish: info.dateFinish ?? null});
        stopLoading();
        if(lotsResponse.ok && lotsResponse.value){
            setCashSessions(lotsResponse.value.cashSessions);
            setDateInit(info.dateInit ?? null);
            setDateFinish(info.dateFinish ?? null);
        }
    }

    return {
        cashSessionTotalAmount,
        loading,
        cashSessions,
        setCashSessions,
        setDateFinish,
        setDateInit,
        onSubmit,
        handleSubmit,
        register,
        errors,
    }
}

export { useCashMovementsOptions };
