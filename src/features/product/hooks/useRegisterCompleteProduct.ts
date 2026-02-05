'use client'
import * as yup from 'yup';
import { useProductStore } from '../infraestructure/stores/product.store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { useForm } from 'react-hook-form';
import {v4 as UUID} from 'uuid'
import { ForSaleEnum } from '../domain/enums/for-sale.enum';
import { RCPInventory, RCPLot, RegisterCompleteProductDTO } from '../application/dtos/register-complete-product.dto';
import { registerCompleteProductAction } from '../actions/register-complete-product.action';
import { LocationEnum } from '@/features/inventory/domain/enums/location.enum';
import { generateBarcodeAction } from '@/features/inventory/actions/generate-barcode.action';
import { useProductUIStore } from '../infraestructure/stores/product-ui.store';

export const schema = yup.object().shape({
    //Product
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
    universalBarCode: yup.string().required('El codigo de barra universal es obligatorio.').max(13, 'El código de barra no puede ser mayor a 13 caracteres.'),
    unitOfMeasure: yup.string().required('La unidad de medida por defecto para venta es obligatoria'),
    minStockGlobal: yup.number().required('El stock minimo por establecimeinto es obligatorio.').typeError('Asegurate de ingresar la información correcta.'),
    imageUrl: yup.string().notRequired().optional().nullable(),
    
    //? VALIDACION PARA EL LOTE
    lotCheck: yup.boolean().required(),
    suplierId: yup.string().when('lotCheck',{
        is: true,
        then: (schema)=> schema
            .optional()
            .default('0')
            .typeError(`Asegurate de ingresar la información correcta.`),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    purchaseUnit: yup.string().when('lotCheck',{
        is: true,
        then: (schema)=> schema
            .required('La unidad de medida de compra es obligatoria'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    purchasePrice: yup.number().when('lotCheck',{
        is: true,
        then: (schema)=> schema
            .required('El precio de compra es obligatorio.')
            .typeError('Asegurate de ingresar la información correcta.')
            .test('max-decimals', 'El precio de compra debe ser un número con hasta 4 decimales.', 
                  value => value === undefined || Number(value.toFixed(4)) === value),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    initialQuantity: yup.number().when('lotCheck',{
        is: true,
        then: (schema)=> schema
            .required('La cantidad inicial es obligatoria.')
            .typeError('Asegurate de ingresar la información correcta.')
            .test('max-decimals', 'La cantidad inicial debe ser un número con hasta 3 decimales.', 
                  value => value === undefined || Number(value.toFixed(3)) === value),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    expirationDate: yup.date().when('lotCheck',{
        is: true,
        then: (schema)=> schema
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .optional().notRequired().nullable(),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    manufacturingDate: yup.date().when('lotCheck',{
        is: true,
        then: (schema)=> schema
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .optional().notRequired().nullable(),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    receivedDate: yup.date().when('lotCheck',{
        is: true,
        then: (schema)=> schema
            .required('La fecha de entrada del producto es requerida.')
            .transform((value, originalValue) => originalValue === '' ? null : value),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    
    //? VALIDACION PARA EL INVENTARIO
    inventoryCheck: yup.boolean().required(),
    salePriceOne: yup.number().when('inventoryCheck',{
        is: true,
        then: (schema)=> schema
            .required('El precio de venta por menudeo es obligatorio.')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    salePriceMany: yup.number().when('inventoryCheck',{
        is: true,
        then: (schema)=> schema
            .required('El precio de venta por mayoreo es obligatorio.')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    saleQuantityMany: yup.number().when('inventoryCheck',{
        is: true,
        then: (schema)=> schema
            .required('La cantidad de producto por mayoreo es obligatorio.')
            .positive('El número debe ser positivo.')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    minStockBranch: yup.number().when('inventoryCheck',{
        is: true,
        then: (schema)=> schema
            .required('El stock mínimo por sucursal es obligatorio.')
            .positive('El número debe ser positivo.')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    maxStockBranch: yup.number().when('inventoryCheck',{
        is: true,
        then: (schema)=> schema
            .optional()
            .notRequired()
            .default(0)
            .positive('El numero debe ser positivo')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),
    internalBarCode: yup.string().when('inventoryCheck',{
        is: true,
        then: (schema)=> schema
            .required('El codigo de barra interno es obligatorio.')
            .max(13, 'El código de barra no puede ser mayor a 13 caracteres.')
            .typeError('Asegurate de ingresar la información correcta.'),
        otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
    }),

    //? LotUnitPurchases validation
    lotUnitPurchases: yup.array().of(
        yup.object({
            purchasePrice: yup.number().when('lotCheck',{
                is: true,
                then: (schema)=> schema
                    .required('El precio de compra es obligatorio.')
                    .positive('El precio debe ser positivo')
                    .typeError('Asegurate de ingresar la información correcta.'),
                otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
            }),
            purchaseQuantity: yup.number().when('lotCheck',{
                is: true,
                then: (schema)=> schema
                    .required('La cantidad de compra es obligatoria.')
                    .positive('La cantidad debe ser positiva')
                    .typeError('Asegurate de ingresar la información correcta.'),
                otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
            }),
            unit: yup.string().when('lotCheck',{
                is: true,
                then: (schema)=> schema
                    .required('La unidad es obligatoria.')
                    .test('not-empty', 'Debes elegir una unidad.', value => value !== undefined && value !== null && value !== ''),
                otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
            }),
            unitsInPurchaseUnit: yup.number().when('lotCheck',{
                is: true,
                then: (schema)=> schema
                    .required('Las unidades en la unidad de compra son requeridas')
                    .positive('La cantidad debe ser positiva')
                    .typeError('Asegurate de ingresar la información correcta.'),
                otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
            }),
        })
    ).optional().notRequired(),
    
    //? Items del inventario validation
    inventoryItems: yup.array().of(
        yup.object({
            location: yup.string().when('inventoryCheck',{
                is: true,
                then: (schema)=> schema
                    .required('La ubicacion del producto es obligatorio.')
                    .typeError('Asegurate de ingresar la información correcta.'),
                otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
            }),
            quantityOnHand: yup.number().when('inventoryCheck',{
                is: true,
                then: (schema)=> schema
                    .required('El stock para la ubicación asignada es obligatorio.')
                    .positive('La cantidad debe ser positiva.')
                    .typeError('Asegurate de ingresar la información correcta.'),
                otherwise: (schema)=> schema.optional().transform(value=> (value === ''? undefined: value))
            })
        })
    ).optional().notRequired()
}).required();

type FormData = yup.InferType<typeof schema>;
type LotUnitPurchaseType = {purchasePrice: number, purchaseQuantity: number, unit: string, unitsInPurchaseUnit: number}

const useRegisterCompleteProduct = () => {
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState(false);
    const { product, setProduct } = useProductStore();
    const { initLoading, finishLoading } = useProductUIStore();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            // expirationDate: new Date(),
            // manufacturingDate: new Date(),
            lotUnitPurchases: [],
            inventoryItems: [
                { location: '', quantityOnHand: 0 }
            ]
        }
    });

    useEffect(() => {
        const defaultInventoryItems = [
            { lastStockedAt: new Date(), location: '', purchasePriceAtStock: 0, quantityOnHand: 0 }
        ];
        const defaultLotUnitPurchases: LotUnitPurchaseType[] = [];
        
        reset({
            inventoryItems: defaultInventoryItems,
            lotUnitPurchases: [],
            brandId: '',
            categoryId: '',
            suplierId: '',
            description: '',
            expirationDate: undefined,
            imageUrl: null,
            initialQuantity: 0,
            internalBarCode: '',
            universalBarCode: '',
            manufacturingDate: undefined,
            maxStockBranch: 0,
            minStockBranch: 0,
            minStockGlobal: 0,
            name: '',
            purchasePrice: 0.0,
            purchaseUnit: '',
            receivedDate: new Date(),
            salePriceMany: 0,
            salePriceOne: 0,
            saleQuantityMany: 0,
            seasonId: '',
            unitOfMeasure: ''
        });
        
        setInventoryItems(defaultInventoryItems);
        setLotUnitPurchases([]);
    }, [reset]);

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
        // Calcular el stock total usado
        const totalUsedStock = inventoryItems.reduce((sum, item) => sum + Number(item.quantityOnHand), 0);
        const totalInitialStock = Number(initialQuantityWatch);
        const availableStock = totalInitialStock - totalUsedStock;

        if (availableStock <= 0) {
            setFloatMessageState({
                description: 'No hay stock disponible para agregar una nueva ubicación',
                summary: '¡Stock Agotado!',
                isActive: true,
                type: 'red'
            });

            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
            
            return;
        }

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

    const initialQuantityWatch = watch('initialQuantity');
    const inventoryItemsWatch = watch('inventoryItems');
    const handleInitialQuantityToquantityOnHand = (index: number = 0) => {
        if (!inventoryItemsWatch) return;

        // Calcular el stock total usado hasta el momento
        let usedStockInInventoryItem = 0;
        for (let i = 0; i < inventoryItemsWatch?.length; i++) {
            if (i !== index) { // Excluimos el ítem actual del cálculo
                usedStockInInventoryItem += Number(inventoryItemsWatch[i].quantityOnHand);
            }
        }

        // Calcular stock disponible
        const totalInitialStock = Number(initialQuantityWatch);
        const availableStock = totalInitialStock - usedStockInInventoryItem;

        if (availableStock <= 0) {
            setFloatMessageState({
                description: 'No hay stock disponible para asignar a esta ubicación',
                summary: '¡Stock Agotado!',
                isActive: true,
                type: 'red'
            });

            // Limpiar el mensaje después de 4 segundos
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);

            return;
        }

        // Actualizar el stock en la ubicación actual
        updateInventoryItem(index, 'quantityOnHand', availableStock);

        // Si este era el último stock disponible, mostrar mensaje
        if (availableStock === totalInitialStock - usedStockInInventoryItem) {
            setFloatMessageState({
                description: `Se ha asignado el stock restante (${availableStock}) a esta ubicación`,
                summary: '¡Stock Asignado!',
                isActive: true,
                type: 'green'
            });

            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        }
    }
    const universalBarCode = watch('universalBarCode');
    const handleBarCodeMatch = (index: number = 0) => {
        // Set internal bar code in the specified inventory item (default to first one)
        setValue(`internalBarCode`, universalBarCode || '');
    }
    const minStockGlobal = watch('minStockGlobal');
    const handleStockGlobalToBranch = () => {
        // Set internal bar code in the specified inventory item (default to first one)
        setValue(`minStockBranch`, minStockGlobal || 0);
    }

    const resetFormProduct = () => {
        setProduct(null);
        const defaultLotUnitPurchases = [{ purchasePrice: 0, purchaseQuantity: 0, unit: "", unitsInPurchaseUnit: 0 }];
        const defaultInventoryItems = [{ location: "", quantityOnHand: 0, lastStockedAt: new Date(), purchasePriceAtStock: 0, internalBarCode: "" }];
        
        setLotUnitPurchases([]);
        setInventoryItems(defaultInventoryItems);
        
        reset({
            inventoryItems: defaultInventoryItems, lotUnitPurchases: [], suplierId: '',
            brandId: '', categoryId: '',description: '', expirationDate: undefined, imageUrl: null, initialQuantity: 0,
            internalBarCode: '', universalBarCode: '', manufacturingDate: undefined, maxStockBranch: 0, minStockBranch: 0,
            minStockGlobal: 0, name: '', purchasePrice: 0, purchaseUnit: '', receivedDate: new Date(), salePriceMany: 0, salePriceOne: 0,
            saleQuantityMany: 0, seasonId: '', unitOfMeasure: ''          
        });
        clearErrors(['brandId', 'categoryId', 'seasonId', 'brandId', 'unitOfMeasure', 'minStockGlobal', 'suplierId',
            'universalBarCode', 'imageUrl', 'name', 'description', 'purchasePrice', 'receivedDate',
            'salePriceOne', 'salePriceMany','saleQuantityMany', 'minStockBranch', 'maxStockBranch', 'lotUnitPurchases', 
            'inventoryItems']);
    }

    const handleGenerateBarcode = async ()=>{
        initLoading('generateBarcode');
        const response = await generateBarcodeAction();
        finishLoading();
        if (response.ok && response.value) {
            setValue('universalBarCode', response.value.barcode);
            setValue('internalBarCode', response.value.barcode);
            setFloatMessageState(() => ({
                description: 'Código generado',
                summary: '¡Correcto!',
                isActive: true,
                type: 'green'
            }));
            setTimeout(() => {
                setFloatMessageState(() => ({}));
            }, 2000);
        } else {
            setFloatMessageState(() => ({
                description: 'No se pudo generrar el código de barra.',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            }));
            setTimeout(() => {
                setFloatMessageState(() => ({}));
            }, 4000);
        }
    }

    const lotCheck = watch('lotCheck');
    const inventoryCheck = watch('inventoryCheck');

    const onSubmit = async (data: FormData) => {
        setFloatMessageState(() => ({}));
        setIsLoading(true);

        let rcpInventory: RCPInventory| null = inventoryCheck? {
            branchOfficeId: '0',
            isSellable: true,
            maxStockBranch: data.maxStockBranch ?? undefined,
            minStockBranch: data.minStockBranch ?? undefined,
            salePriceMany: data.salePriceMany ?? undefined,
            salePriceOne: data.salePriceOne ?? undefined,
            salePriceSpecial: undefined,
            saleQuantityMany: data.saleQuantityMany ?? undefined,
            internalBarCode: data.internalBarCode ?? undefined,
            inventoryItems:data.inventoryItems? data.inventoryItems?.map(item => ({
                location: item.location as LocationEnum ?? LocationEnum.STOCK,
                quantityOnHand: Number(item.quantityOnHand ?? 0),
                lastStockedAt: new Date() ,
                purchasePriceAtStock: 0
            })): undefined
        }: null;

        let rcpLot: RCPLot | null = lotCheck? {
            initialQuantity: Number(data.initialQuantity ?? 0),
            suplierId: data.suplierId && data.suplierId.trim().toUpperCase()!== '0'? data.suplierId : null,
            purchaseUnit: data.purchaseUnit as ForSaleEnum,
            lotUnitPurchases:data.lotUnitPurchases? data.lotUnitPurchases?.map(purchase => ({
                purchasePrice: Number(purchase.purchasePrice ?? 0),
                purchaseQuantity: Number(purchase.purchaseQuantity ?? 0),
                unit: purchase.unit as ForSaleEnum,
                unitsInPurchaseUnit: Number(purchase.unitsInPurchaseUnit ?? 0)
            })): undefined,
            lotNumber: UUID(),
            purchasePrice: Number(data.purchasePrice ?? 0),
            receivedDate: data.receivedDate ?? new Date(),
            expirationDate: data.expirationDate ?? null,
            manufacturingDate: data.manufacturingDate ?? null,
        }: null;

        let productResult;
        const newProduct: RegisterCompleteProductDTO = {
            establishmentId: '0',
            categoryId: data.categoryId,
            brandId: data.brandId,
            seasonId: data.seasonId,
            name: data.name,
            description: data.description,
            minStockGlobal: data.minStockGlobal,
            unitOfMeasure: data.unitOfMeasure,
            imageUrl: data.imageUrl,
            universalBarCode: data.universalBarCode,
            inventory: rcpInventory,
            lot: rcpLot,
            
        }
        productResult = await registerCompleteProductAction(newProduct);

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
            }, 2000);
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
        handleStockGlobalToBranch,
        handleInitialQuantityToquantityOnHand,
        updateLotUnitPurchase,
        removeLotUnitPurchase,
        addLotUnitPurchase,
        lotUnitPurchases,
        addInventoryItem,
        removeInventoryItem,
        updateInventoryItem,
        inventoryItems,
        lotCheck,
        inventoryCheck,
        handleGenerateBarcode,
    }
}

export { useRegisterCompleteProduct }
