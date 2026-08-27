'use client'
import { useState } from "react";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { findTopProductsByBranchOfficeAction } from "../actions/find-top-products-by-branch-office.action";
import { FilterTopEnum } from "../../domain/enums/FilterTopEnum";
import { ProductsTopByBranchOfficeResponseDto } from "../../application/dtos/products-top-by-branch-office-response.dto";

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
    initialTopQuantity: ProductsTopByBranchOfficeResponseDto[];
    initialTopTotal: ProductsTopByBranchOfficeResponseDto[];
}

const useTopProductsSection = ({ initialTopQuantity, initialTopTotal }: Props) => {
    const [productsTopQuantity, setProductsTopQuantity] = useState(initialTopQuantity);
    const [productsTopTotal, setProductsTopTotal] = useState(initialTopTotal);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {}
    });

    const onSubmit = async (info: FormData) => {
        setLoading(true);
        try {
            const [resultTopQuantity, resultTopTotal] = await Promise.all([
                findTopProductsByBranchOfficeAction({
                    filterBy: FilterTopEnum.QUANTITY_SALES,
                    dateInit: info.dateInit ?? null,
                    dateFinish: info.dateFinish ?? null,
                }),
                findTopProductsByBranchOfficeAction({
                    filterBy: FilterTopEnum.TOTAL_SALES,
                    dateInit: info.dateInit ?? null,
                    dateFinish: info.dateFinish ?? null,
                }),
            ]);
            setProductsTopQuantity(resultTopQuantity ?? []);
            setProductsTopTotal(resultTopTotal ?? []);
        } finally {
            setLoading(false);
        }
    };

    return {
        productsTopQuantity,
        productsTopTotal,
        loading,
        register,
        errors,
        handleSubmit,
        onSubmit,
    }
}

export { useTopProductsSection };
