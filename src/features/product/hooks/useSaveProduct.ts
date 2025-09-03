'use client'
import * as yup from 'yup';
import { useProductStore } from '../infraestructure/stores/product.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { useForm } from 'react-hook-form';
import { registerInitialProductAction } from '../actions/register-initial-product.action';
import { RegisterInitialProductDTO } from '../application/dtos/register-initial-product.dto';
import { useWorkspace } from '@/shared/hooks/useAuth';
import { ForSaleEnum } from '../domain/enums/for-sale.enum';

const schema = yup.object({
    // Establishment and Branch Office
    establishmentId: yup.string().required('El ID del establecimiento es obligatorio.'),
    branchOfficeId: yup.string().required('El ID de la sucursal es obligatorio.'),
    
    //Product
    // sku: yup.string().optional().notRequired(),
    name: yup.string().required('El nombre del producto es obligatorio.').min(3, 'El nombre del producto debe tener al menos 3 caracteres.'),
    description: yup.string().optional().notRequired().default(''),
    categoryId: yup.string()
        .required('Debes elegir la categoría del producto.')
        .test('not-empty', 'Debes elegir la categoría del producto.', value => value !== undefined && value !== null && value !== ''),
    brandId: yup.string()
        .required('Debes elegir la marca del producto.')
        .test('not-empty', 'Debes elegir la marca del producto.', value => value !== undefined && value !== null && value !== ''),
    seasonId: yup.string()
        .required('Debes elegir la temporada en la que se vende el producto.')
        .test('not-empty', 'Debes elegir la temporada en la que se vende el producto.', value => value !== undefined && value !== null && value !== ''),
    universalBarCode: yup.string().required('El codigo de barra universal es obligatorio.'),
    unitOfMeasure: yup.string().required('La unidad de medida por defecto para venta es obligatoria'),
    purchaseUnit: yup.string().required('La unidad de medida de compra es obligatoria'),
    minStockGlobal: yup.number().required('El stock minimo por establecimeinto es obligatorio.').typeError('Asegurate de ingresar la información correcta.'),
    imageUrl: yup.string().notRequired().optional().nullable(),
    
    // Lot
    lotNumber: yup.string().default(`LOT-${new Date().getTime()}`),
    purchasePrice: yup.number().positive('El precio debe ser un número positivo').required('El precio de compra es requerido.').typeError('Asegurate de ingresar la información correcta.'),
    initialQuantity: yup.number().positive('La cantidad de producto inicial es obligatoria.').typeError('Asegurate de ingresar la información correcta.'),
    expirationDate: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    manufacturingDate: yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .optional().notRequired().nullable(),
    receivedDate: yup.date()
        .required('La fecha de entrada del producto es requerida.')
        .transform((value, originalValue) => originalValue === '' ? null : value),
    
    // Inventory
    isSellable: yup.boolean(),
    salePriceOne: yup.number().required('El precio de venta por menudeo es obligatorio.').typeError('Asegurate de ingresar la información correcta.'),
    salePriceMany: yup.number().required('El precio de venta por mayoreo es obligatorio.').typeError('Asegurate de ingresar la información correcta.'),
    saleQuantityMany: yup.number().required('La cantidad de producto por mayoreo es obligatorio.').positive('El número debe ser positivo.').typeError('Asegurate de ingresar la información correcta.'),
    salePriceSpecial: yup.number().required('El precio de venta especial es obligatorio.').positive('El número debe ser positivo.').typeError('Asegurate de ingresar la información correcta.'),
    minStockBranch: yup.number().required('El stock mínimo por sucursal es obligatorio.').positive('El número debe ser positivo.').typeError('Asegurate de ingresar la información correcta.'),
    maxStockBranch: yup.number().optional().notRequired().default(0).positive('El numero debe ser positivo').typeError('Asegurate de ingresar la información correcta.'),
    internalBarCode: yup.string().required('El codigo de barra interno es obligatorio.').typeError('Asegurate de ingresar la información correcta.'),
    // LotUnitPurchases validation
    lotUnitPurchases: yup.array().of(
        yup.object({
            purchasePrice: yup.number().required('El precio de compra es obligatorio.').positive('El precio debe ser positivo').typeError('Asegurate de ingresar la información correcta.'),
            purchaseQuantity: yup.number().required('La cantidad de compra es obligatoria.').positive('La cantidad debe ser positiva').typeError('Asegurate de ingresar la información correcta.'),
            unit: yup.string().required('La unidad es obligatoria.').test('not-empty', 'Debes elegir una unidad.', value => value !== undefined && value !== null && value !== ''),
            unitsInPurchaseUnit: yup.number().required('Las unidades en la unidad de compra son requeridas').positive('La cantidad debe ser positiva').typeError('Asegurate de ingresar la información correcta.'),
        })
    ).optional().notRequired(),
    
    // Items del inventario validation
    inventoryItems: yup.array().of(
        yup.object({
            location: yup.string().required('La ubicacion del producto es obligatorio.'),
            quantityOnHand: yup.number().required('El stock para la ubicación asignada es obligatorio.').positive('La cantidad debe ser positiva.').typeError('Asegurate de ingresar la información correcta.'),
            lastStockedAt: yup.date().required().default(() => new Date()),
            purchasePriceAtStock: yup.number().typeError('Asegurate de ingresar la información correcta.')
        })
    ).optional().notRequired()
}).required();

type FormData = yup.InferType<typeof schema>;
type LotUnitPurchaseType = {purchasePrice: number, purchaseQuantity: number, unit: string, unitsInPurchaseUnit: number}
interface Props {
}

const useSaveProduct = () => {
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState(false);
    const { product, setProduct } = useProductStore();
    const { establishment, branchOffice } = useWorkspace();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            expirationDate: new Date(),
            manufacturingDate: new Date(),
            lotUnitPurchases: [],
            inventoryItems: [
                { lastStockedAt: new Date(), location: '', purchasePriceAtStock: 0, quantityOnHand: 0 }
            ]
        }
    });

    useEffect(() => {
        const defaultInventoryItems = [
            { lastStockedAt: new Date(), location: '', purchasePriceAtStock: 0, quantityOnHand: 0 }
        ];
        const defaultLotUnitPurchases: LotUnitPurchaseType[] = [];
        
        reset({
            // sku: uuidv4(),
            lotNumber: new Date().getDate().toString(),
            establishmentId: establishment?.establishmentId || '',
            branchOfficeId: branchOffice?.branchOfficeId || '',
            inventoryItems: defaultInventoryItems,
            lotUnitPurchases: defaultLotUnitPurchases
        });
        
        setInventoryItems(defaultInventoryItems);
        setLotUnitPurchases(defaultLotUnitPurchases);
    }, [reset, establishment, branchOffice]);

    const [lotUnitPurchases, setLotUnitPurchases] = useState<LotUnitPurchaseType[]>([]);

    const [inventoryItems, setInventoryItems] = useState([
        { location: "", quantityOnHand: 0, lastStockedAt: new Date(), purchasePriceAtStock: 0 },
    ]);

    const addLotUnitPurchase = () => {
        const newLotUnitPurchases = [
            ...lotUnitPurchases,
            { purchasePrice: 0, purchaseQuantity: 0, unit: "", unitsInPurchaseUnit: 0 },
        ];
        setLotUnitPurchases(newLotUnitPurchases);
        setValue('lotUnitPurchases', newLotUnitPurchases);
    };

    const removeLotUnitPurchase = (index: number) => {
        const newLotUnitPurchases = lotUnitPurchases.filter((_, i) => i !== index);
        setLotUnitPurchases(newLotUnitPurchases);
        setValue('lotUnitPurchases', newLotUnitPurchases);
    };

    const updateLotUnitPurchase = (index: number, field: string, value: string | number) => {
        const updated = [...lotUnitPurchases];
        updated[index] = { ...updated[index], [field]: value };
        setLotUnitPurchases(updated);
        setValue('lotUnitPurchases', updated);
    };

    // Inventory Items functions
    const addInventoryItem = () => {
        const newInventoryItems = [
            ...inventoryItems,
            { location: "", quantityOnHand: 0, lastStockedAt: new Date(), purchasePriceAtStock: 0, internalBarCode: "" },
        ];
        setInventoryItems(newInventoryItems);
        setValue('inventoryItems', newInventoryItems);
    };

    const removeInventoryItem = (index: number) => {
        const newInventoryItems = inventoryItems.filter((_, i) => i !== index);
        setInventoryItems(newInventoryItems);
        setValue('inventoryItems', newInventoryItems);
    };

    const updateInventoryItem = (index: number, field: string, value: string | number | Date) => {
        const updated = [...inventoryItems];
        updated[index] = { ...updated[index], [field]: value };
        setInventoryItems(updated);
        setValue('inventoryItems', updated);
    };

    const universalBarCode = watch('universalBarCode');
    const handleBarCodeMatch = (index: number = 0) => {
        // Set internal bar code in the specified inventory item (default to first one)
        setValue(`internalBarCode`, universalBarCode || '');
    }

    const resetFormProduct = () => {
        setProduct(null);
        const defaultLotUnitPurchases = [{ purchasePrice: 0, purchaseQuantity: 0, unit: "", unitsInPurchaseUnit: 0 }];
        const defaultInventoryItems = [{ location: "", quantityOnHand: 0, lastStockedAt: new Date(), purchasePriceAtStock: 0, internalBarCode: "" }];
        
        setLotUnitPurchases(defaultLotUnitPurchases);
        setInventoryItems(defaultInventoryItems);
        
        reset({
            lotUnitPurchases: defaultLotUnitPurchases,
            inventoryItems: defaultInventoryItems
        });
        clearErrors(['brandId', 'categoryId', 'seasonId', 'brandId', 'unitOfMeasure', 'minStockGlobal',
            'universalBarCode', 'imageUrl', 'name', 'description', 'purchasePrice', 'receivedDate',
            'salePriceOne', 'salePriceMany', 'salePriceSpecial',
            'saleQuantityMany', 'minStockBranch', 'maxStockBranch', 'lotUnitPurchases', 'inventoryItems']);
    }

    const onSubmit = async (data: FormData) => {
        setFloatMessageState(() => ({}));
        setIsLoading(true);

        let productResult;

        const newProduct: RegisterInitialProductDTO = {
            establishmentId: data.establishmentId || establishment?.establishmentId || '0',
            categoryId: data.categoryId,
            brandId: data.brandId,
            seasonId: data.seasonId,
            name: data.name,
            description: data.description,
            minStockGlobal: data.minStockGlobal,
            unitOfMeasure: data.unitOfMeasure,
            imageUrl: data.imageUrl,
            universalBarCode: data.universalBarCode,
            initialQuantity: data.initialQuantity ?? 0,
            purchaseUnit: data.purchaseUnit as unknown as ForSaleEnum,
            lotUnitPurchases: data.lotUnitPurchases?.map(purchase => ({
                purchasePrice: purchase.purchasePrice,
                purchaseQuantity: purchase.purchaseQuantity,
                unit: purchase.unit as ForSaleEnum,
                unitsInPurchaseUnit: purchase.unitsInPurchaseUnit
            })) || [],
            lotNumber: data.lotNumber,
            purchasePrice: data.purchasePrice,
            receivedDate: data.receivedDate,
            expirationDate: data.expirationDate,
            manufacturingDate: data.manufacturingDate,
            branchOfficeId: data.branchOfficeId || branchOffice?.branchOfficeId || '0',
            isSellable: data.isSellable ?? true,
            maxStockBranch: data.maxStockBranch,
            minStockBranch: data.minStockBranch,
            salePriceMany: data.salePriceMany,
            salePriceOne: data.salePriceOne,
            salePriceSpecial: data.salePriceSpecial,
            saleQuantityMany: data.saleQuantityMany,
            internalBarCode: data.internalBarCode,
            inventoryItems: data.inventoryItems?.map(item => ({
                location: item.location,
                quantityOnHand: item.quantityOnHand,
                lastStockedAt: item.lastStockedAt,
                purchasePriceAtStock: item.purchasePriceAtStock ?? 0
            })) || []
        }

        productResult = await registerInitialProductAction(newProduct);

        if (productResult.ok) {
            setIsLoading(false);
            resetFormProduct();
            setFloatMessageState(() => ({
                description: 'Producto registrado correctamente',
                summary: '¡Correcto!',
                isActive: true,
                type: 'green'
            }));
            setTimeout(() => {
                setFloatMessageState(() => ({}));
            }, 4000);
        } else {
            setIsLoading(false);
            setFloatMessageState(() => ({
                description: productResult && productResult.error ? productResult.error.message : 'Ocurrió un error al registrar el producto.',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            }));
            setTimeout(() => {
                setFloatMessageState(() => ({}));
            }, 4000);
        }
    }
    return {
        product,
        setProduct,
        floatMessageState,
        setFloatMessageState,
        isLoading,
        setIsLoading,
        resetFormProduct,
        onSubmit,
        handleSubmit,
        register,
        errors,
        handleBarCodeMatch,
        updateLotUnitPurchase,
        removeLotUnitPurchase,
        addLotUnitPurchase,
        lotUnitPurchases,
        addInventoryItem,
        removeInventoryItem,
        updateInventoryItem,
        inventoryItems
    }
}

export { useSaveProduct }
