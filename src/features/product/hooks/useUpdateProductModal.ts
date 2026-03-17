import * as yup from 'yup';
import { ProductEntity } from "../domain/entities/product.entity";
import { useProductStore } from "../infraestructure/stores/product.store"
import { useState, useEffect } from 'react';
import { FloatMessageType } from '@/shared/ui/types/FloatMessageType';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { ViewAllCategoriesAction } from '@/features/category/actions/view-all-categories.action';
import { viewAllBrandsAction } from '@/features/brand/actions/view-all-brands.action';
import { viewAllSeasonsAction } from '@/features/season/actions/view-all-seasons.action';
import { ForSaleEnum } from '../domain/enums/for-sale.enum';
import { IProduct } from '@/contexts/product-management/product/presentation/interfaces/IProduct';
import { ICategory } from '@/contexts/product-management/category/presentation/interfaces/ICategory';
import { IBrand } from '@/contexts/product-management/brand/presentation/interfaces/Ibrand';
import { ISeason } from '@/contexts/product-management/season/presentation/interfaces/ISeason';
import { updateProductAction } from '@/contexts/product-management/product/presentation/actions/update-product.action';
import { UpdateProductDto } from '@/contexts/product-management/product/application/dtos/update-product.dto';
import { findAllCategoriesByEstablishmentAction } from '@/contexts/product-management/category/presentation/actions/find-all-categories-by-stablishment.action';

const schema = yup.object({
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
    unitOfMeasure: yup.string()
        .required('La unidad de medida por defecto para venta es obligatoria')
        .oneOf(Object.values(ForSaleEnum), 'Selecciona una unidad de medida válida'),
    minStockGlobal: yup.number().required('El stock minimo por establecimeinto es obligatorio.').typeError('Asegurate de ingresar la información correcta.'),
    imageUrl: yup.string().notRequired().optional().nullable(),
}).required();

type FormData = yup.InferType<typeof schema>;

const useUpdateProductModal = () => {
    const [floatMessageState, setFloatMessageState] = useState<FloatMessageType>({});
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [brands, setBrands] = useState<IBrand[]>([]);
    const [seasons, setSeasons] = useState<ISeason[]>([]);
    const { product, setProduct } = useProductStore();
    const { isOpenProductModal, setOpenProductModal,  } = useProductStore();

    const { register, handleSubmit, reset, setValue, watch, clearErrors, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema) as any,
        mode: 'onChange',
    });

    // Cargar datos al inicializar el hook (una sola vez)
    useEffect(() => {
        loadCatalogData();
    }, []);

    // Cargar datos adicionales cuando se abre el modal si no se han cargado
    useEffect(() => {
        if (isOpenProductModal && (categories.length === 0 || brands.length === 0 || seasons.length === 0)) {
            loadCatalogData();
        }
    }, [isOpenProductModal, categories.length, brands.length, seasons.length]);

    // Cargar datos del producto cuando se selecciona
    useEffect(() => {
        if (product && isOpenProductModal) {
            reset({
                name: product.name,
                description: product.description || '',
                categoryId: product.categoryId?.toString() || '',
                brandId: product.brandId?.toString() || '',
                seasonId: product.seasonId?.toString() || '',
                universalBarCode: product.universalBarCode || '',
                unitOfMeasure: product.unitOfMeasure as ForSaleEnum,
                minStockGlobal: product.minStockGlobal,
                imageUrl: product.imageUrl || ''
            });
        }
    }, [product, isOpenProductModal, reset]);

    const loadCatalogData = async () => {
        try {
            const [categoriesResult, brandsResult, seasonsResult] = await Promise.all([
                findAllCategoriesByEstablishmentAction(),
                viewAllBrandsAction(),
                viewAllSeasonsAction()
            ]);

            if (categoriesResult) {
                setCategories(categoriesResult); // categoriesResult.value.categories
            }
            if (brandsResult?.ok && brandsResult.value) {
                setBrands([]);
            }
            if (seasonsResult?.ok && seasonsResult.value) {
                setSeasons([]);
            }
        } catch (error) {
            setFloatMessageState({
                description: 'Error al cargar los datos del catálogo',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            });
            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        }
    };

    const handleOpenUpdateProductModal = (product: IProduct) => {
        setProduct(product);
        setOpenProductModal(true);
    }

    const handleCloseUpdateProductModal = () => {
        setOpenProductModal(false);
        resetFormUpdateProduct();
    }

    const resetFormUpdateProduct = () => {
        setProduct(null);
        reset({
            name: '',
            description: '',
            categoryId: '',
            brandId: '',
            seasonId: '',
            universalBarCode: '',
            unitOfMeasure: ForSaleEnum.PC, // Valor por defecto
            minStockGlobal: 0,
            imageUrl: ''
        });
        clearErrors(['brandId', 'categoryId', 'seasonId', 'unitOfMeasure', 'minStockGlobal',
            'universalBarCode', 'imageUrl', 'name', 'description']);
        setFloatMessageState({});
    }

    const onSubmit = async (data: FormData) => {
        if (!product) return;

        setFloatMessageState({});
        setIsLoading(true);

        try {
            const updateData: UpdateProductDto = {
                establishmentId: BigInt(0),
                productId: product.productId,
                name: data.name,
                description: data.description,
                categoryId: BigInt(data.categoryId),
                brandId: BigInt(data.brandId),
                seasonId: BigInt(data.seasonId),
                universalBarCode: data.universalBarCode,
                unitOfMeasure: data.unitOfMeasure,
                minStockGlobal: data.minStockGlobal,
            };

            const result = await updateProductAction(updateData);

            if (result?.ok) {
                setFloatMessageState({
                    description: 'Producto actualizado correctamente',
                    summary: '¡Correcto!',
                    isActive: true,
                    type: 'blue'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                    handleCloseUpdateProductModal();
                }, 2000);
            } else {
                const errorMessage = Array.isArray(result?.error) 
                    ? result.error.join(', ') 
                    : result?.error?.message || 'Error al actualizar el producto';
                
                setFloatMessageState({
                    description: errorMessage,
                    summary: '¡Error!',
                    isActive: true,
                    type: 'red'
                });

                setTimeout(() => {
                    setFloatMessageState({});
                }, 4000);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            setFloatMessageState({
                description: 'Error inesperado al actualizar el producto',
                summary: '¡Error!',
                isActive: true,
                type: 'red'
            });

            setTimeout(() => {
                setFloatMessageState({});
            }, 4000);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        // Estados del modal
        isOpenProductModal,
        setOpenProductModal,
        
        // Estados de datos
        product,
        categories,
        brands,
        seasons,
        isLoading,
        floatMessageState,
        
        // Funciones del modal
        handleOpenUpdateProductModal,
        handleCloseUpdateProductModal,
        resetFormUpdateProduct,
        
        // Funciones del formulario
        register,
        handleSubmit,
        onSubmit,
        errors,
        watch,
        setValue,
        
        // Estados del form
        reset,
        clearErrors
    }
}

export { useUpdateProductModal }
