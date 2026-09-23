import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { searchCandidateProductsForCloudTransferItemAction } from "../actions/search-candidate-products-for-cloud-transfer-item.action";
import { createAndSendCloudTransferAction } from "../actions/create-and-send-cloud-transfer.action";
import { listCloudBranchOfficesForTransferAction } from "../actions/list-cloud-branch-offices-for-transfer.action";
import { useCloudTransferStore, DraftCloudTransferItem } from "../stores/cloud-transfer.store";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";
import { ICloudBranchOffice } from "@/contexts/establishment-management/branch-office/presentation/interfaces/ICloudBranchOffice";

const registerFormData = yup.object().shape({
    shipmentNotes: yup
        .string()
        .max(500, 'Las notas de envío no pueden superar los 500 caracteres.')
        .optional(),
});

type RegisterFormData = yup.InferType<typeof registerFormData>;

/** Lógica de la pantalla de creación (`/transfers/new`): A busca productos de su propio catálogo/stock,
 * arma un carrito de líneas (producto + lote + ubicación de inventario + cantidad) y envía el traspaso.
 * La sucursal destino se elige de un directorio real (`listCloudBranchOfficesForTransferAction`, todas las
 * sucursales inscritas con la misma clave de inscripción), no se captura como id libre. */
const useCreateCloudTransfer = () => {
    const router = useRouter();
    const { draftItems, addDraftItem, updateDraftItemQuantity, removeDraftItem, clearDraftItems } = useCloudTransferStore();
    const { cloudTransferLoading, runCloudTransferLoading, stopCloudTransferLoading, setFloatMessageState } = useCloudTransferUIStore();

    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<IProduct[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    const [cloudBranchOffices, setCloudBranchOffices] = useState<ICloudBranchOffice[]>([]);
    const [loadingDirectory, setLoadingDirectory] = useState(true);
    const [directoryError, setDirectoryError] = useState<string | null>(null);
    const [toCloudBranchOfficeId, setToCloudBranchOfficeId] = useState('');

    useEffect(() => {
        setLoadingDirectory(true);
        listCloudBranchOfficesForTransferAction()
            .then((result) => {
                if (result.ok) {
                    setCloudBranchOffices(result.value ?? []);
                    setDirectoryError(null);
                } else {
                    setDirectoryError(result.error?.message?.toString() || 'No se pudo cargar el directorio de sucursales.');
                }
            })
            .finally(() => setLoadingDirectory(false));
    }, []);

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
        if (!toCloudBranchOfficeId) {
            setFloatMessageState({
                summary: 'Falta la sucursal destino',
                description: 'Elige a qué sucursal quieres enviar este traspaso.',
                isActive: true,
                type: 'yellow',
            });
            setTimeout(() => setFloatMessageState({}), 4000);
            return;
        }
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
                toCloudBranchOfficeId: BigInt(toCloudBranchOfficeId),
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
                // desde el detalle (retrySendCloudTransferAction). Se muestra el motivo real devuelto por
                // EDYOF (p. ej. un 400 de validación) en vez de un mensaje genérico, para no obligar a leer
                // los logs del servidor para saber qué falló — mismo tratamiento que `showError` en
                // useCloudTransferDetail.ts.
                const reason = Array.isArray(result.sendError.message)
                    ? result.sendError.message.join(', ')
                    : (result.sendError.message?.toString() || 'No se pudo notificar a la nube.');
                setFloatMessageState({
                    summary: 'Traspaso guardado, no se pudo enviar',
                    description: `El traspaso se guardó localmente y el stock ya se descontó, pero no se pudo notificar a la nube: ${reason}. Podrás reintentar el envío desde el detalle.`,
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
        cloudBranchOffices,
        loadingDirectory,
        directoryError,
        toCloudBranchOfficeId,
        setToCloudBranchOfficeId,
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
