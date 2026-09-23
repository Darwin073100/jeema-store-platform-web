import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { searchCandidateProductsForCloudTransferItemAction } from "../actions/search-candidate-products-for-cloud-transfer-item.action";
import { createAndSendCloudTransferAction } from "../actions/create-and-send-cloud-transfer.action";
import { useCloudTransferStore, DraftCloudTransferItem } from "../stores/cloud-transfer.store";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";

const registerFormData = yup.object().shape({
    toCloudBranchOfficeId: yup
        .number()
        .typeError('Ingresa el id de sucursal en la nube (número) de la sucursal destino.')
        .required('El id de sucursal destino en la nube es obligatorio.')
        .positive('Debe ser un número positivo.'),
    shipmentNotes: yup
        .string()
        .max(500, 'Las notas de envío no pueden superar los 500 caracteres.')
        .optional(),
});

type RegisterFormData = yup.InferType<typeof registerFormData>;

/** Lógica de la pantalla de creación (`/transfers/new`): A busca productos de su propio catálogo/stock,
 * arma un carrito de líneas (producto + lote + ubicación de inventario + cantidad) y envía el traspaso.
 * No hay directorio de sucursales en la nube (ver spect/08 sección 8.4) — el id destino es texto libre. */
const useCreateCloudTransfer = () => {
    const router = useRouter();
    const { draftItems, addDraftItem, updateDraftItemQuantity, removeDraftItem, clearDraftItems } = useCloudTransferStore();
    const { cloudTransferLoading, runCloudTransferLoading, stopCloudTransferLoading, setFloatMessageState } = useCloudTransferUIStore();

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<IProduct[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterFormData>({
        resolver: yupResolver(registerFormData) as any,
        mode: 'onChange',
    });

    const handleSearchProducts = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchText.trim()) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const result = await searchCandidateProductsForCloudTransferItemAction(searchText.trim());
            setSearchResults(result.ok ? (result.value ?? []) : []);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectProduct = (product: IProduct) => {
        setSelectedProduct(product);
    };

    const handleAddDraftItem = (item: DraftCloudTransferItem) => {
        addDraftItem(item);
        setSelectedProduct(null);
        setSearchResults([]);
        setSearchText('');
    };

    const onSubmit = async (data: RegisterFormData) => {
        if (draftItems.length === 0) {
            setFloatMessageState({
                summary: 'Faltan productos',
                description: 'Agrega al menos un producto al traspaso antes de enviarlo.',
                isActive: true,
                type: 'yellow',
            });
            setTimeout(() => setFloatMessageState({}), 4000);
            return;
        }
        const invalidQuantity = draftItems.find(i => i.quantityToTransfer <= 0 || i.quantityToTransfer > i.availableQuantity);
        if (invalidQuantity) {
            setFloatMessageState({
                summary: 'Cantidad inválida',
                description: `La cantidad a transferir de "${invalidQuantity.productName}" debe ser mayor a 0 y no exceder el stock disponible (${invalidQuantity.availableQuantity}).`,
                isActive: true,
                type: 'yellow',
            });
            setTimeout(() => setFloatMessageState({}), 4000);
            return;
        }

        runCloudTransferLoading('creating');
        try {
            const result = await createAndSendCloudTransferAction({
                toCloudBranchOfficeId: BigInt(data.toCloudBranchOfficeId),
                shipmentNotes: data.shipmentNotes || null,
                items: draftItems.map(i => ({
                    originLocalProductId: i.originLocalProductId,
                    originLocalLotId: i.originLocalLotId,
                    originLocalInventoryItemId: i.originLocalInventoryItemId,
                    quantityToTransfer: i.quantityToTransfer,
                })),
            });

            if (!result.ok || !result.value) {
                setFloatMessageState({
                    summary: result.error?.statusCode ? `${result.error.statusCode}: ¡Error!` : '500: ¡Error!',
                    description: result.error?.message?.toString() || 'No se pudo crear el traspaso.',
                    isActive: true,
                    type: 'red',
                });
                setTimeout(() => setFloatMessageState({}), 4000);
                return;
            }

            clearDraftItems();
            reset();

            if (result.sendError) {
                // El stock ya se descontó localmente en A; solo falló el POST a la nube. Se puede reintentar
                // desde el detalle (retrySendCloudTransferAction).
                setFloatMessageState({
                    summary: 'Traspaso guardado, no se pudo enviar',
                    description: 'El traspaso se guardó localmente y el stock ya se descontó, pero no se pudo notificar a la nube. Podrás reintentar el envío desde el detalle.',
                    isActive: true,
                    type: 'yellow',
                });
            } else {
                setFloatMessageState({
                    summary: '¡Correcto!',
                    description: '¡Traspaso creado y enviado a la nube!',
                    isActive: true,
                    type: 'green',
                });
            }
            setTimeout(() => setFloatMessageState({}), 4000);
            router.push(`/transfers/detail/${result.value.cloudTransferId.toString()}`);
        } finally {
            stopCloudTransferLoading();
        }
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        searchText,
        setSearchText,
        searchResults,
        searching,
        handleSearchProducts,
        selectedProduct,
        setSelectedProduct,
        handleSelectProduct,
        draftItems,
        handleAddDraftItem,
        updateDraftItemQuantity,
        removeDraftItem,
        loading: cloudTransferLoading,
    };
};

export { useCreateCloudTransfer };
