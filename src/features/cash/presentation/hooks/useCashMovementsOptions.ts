import React, { useEffect } from "react";
import { useCashStore } from "../../infraestructure/stores/cash.store";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";
import { getLocalDate } from "@/shared/lib/utils/date-formatter";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

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
    const { setCashSessions, cashSessions, setDateInit, setDateFinish, dateInit, dateFinish } = useCashStore();
    const [loading, setLoading] = React.useState(false);
    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            dateInit: new Date('1970-01-01'),
            dateFinish: getLocalDate(),
        }
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

    const onSubmit = (info: FormData) => {
        // 1. Clonamos para no modificar las fechas originales y "limpiamos" el tiempo
        const init = new Date(info.dateInit ?? new Date('1970-01-01'));
        init.setHours(0, 0, 0, 0);

        const finish = new Date(info.dateFinish ?? getLocalDate());
        finish.setHours(23, 59, 59, 999);

        const newArray = data.filter(cashSession => {
            // 2. Convertir la fecha de apertura de caja a objeto Date
            const dateCash = new Date(cashSession.startTime);
            dateCash.setHours(0, 0, 0, 0);

            // 3. Comparación de tiempos (getTime devuelve milisegundos)
            return dateCash.getTime() >= init.getTime() &&
                dateCash.getTime() <= finish.getTime();
        });
        setCashSessions(newArray);
        setDateInit(info.dateInit ?? null);
        setDateFinish(info.dateFinish ?? null);
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
