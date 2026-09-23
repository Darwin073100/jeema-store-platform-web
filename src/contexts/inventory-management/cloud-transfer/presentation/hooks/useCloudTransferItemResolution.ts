import { useEffect, useState } from "react";
import { searchCandidateProductsForCloudTransferItemAction } from "../actions/search-candidate-products-for-cloud-transfer-item.action";
import { resolveCloudTransferItemAsExistingProductAction } from "../actions/resolve-cloud-transfer-item-as-existing-product.action";
import { mapCloudCategoryToLocalCategoryAction } from "../actions/map-cloud-category-to-local-category.action";
import { resolveCloudTransferItemAsNewProductAction } from "../actions/resolve-cloud-transfer-item-as-new-product.action";
import { rejectCloudTransferItemAction } from "../actions/reject-cloud-transfer-item.action";
import { findAllProductByIdAction } from "@/contexts/product-management/product/presentation/actions/find-product-by-id.action";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";
import { ICloudTransferItem } from "../interfaces/ICloudTransferItem";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";

/** Lógica de resolución (matching) de UN item de traspaso — usada por `CloudTransferItemResolutionCard`,
 * la pieza central de la UI (ver spect/09_..._spect.md). Cubre los 3 caminos de negocio:
 * 1) re-vincular a un producto local ya existente (búsqueda manual, cuando el barcode cambió y el
 *    auto-match del backend, `StartProcessingCloudTransferUseCase`, no encontró nada),
 * 2) declararlo producto nuevo (requiere mapear categoría de la nube -> categoría local, humano),
 * 3) rechazar la línea (no se recibe).
 */
const useCloudTransferItemResolution = (item: ICloudTransferItem, onResolved: () => void) => {
    const { runCloudTransferLoading, stopCloudTransferLoading, setFloatMessageState } = useCloudTransferUIStore();

    // --- Detalle del producto local ya emparejado (MATCHED o NEW_PRODUCT), para el lado derecho de la tabla ---
    const [matchedProduct, setMatchedProduct] = useState<IProduct | null>(null);
    const [loadingMatchedProduct, setLoadingMatchedProduct] = useState(false);

    useEffect(() => {
        let active = true;
        if (item.matchedLocalProductId && item.resolutionStatus !== CloudTransferItemResolutionStatusEnum.PENDING) {
            setLoadingMatchedProduct(true);
            findAllProductByIdAction(item.matchedLocalProductId)
                .then(result => { if (active) setMatchedProduct(result); })
                .finally(() => { if (active) setLoadingMatchedProduct(false); });
        } else {
            setMatchedProduct(null);
        }
        return () => { active = false; };
    }, [item.matchedLocalProductId, item.resolutionStatus]);

    const showError = (error?: { statusCode?: number; message?: string | string[] }) => {
        setFloatMessageState({
            summary: error?.statusCode ? `${error.statusCode}: ¡Error!` : '500: ¡Error!',
            description: Array.isArray(error?.message) ? error.message.join(', ') : (error?.message?.toString() || 'Ocurrió un error inesperado.'),
            isActive: true,
            type: 'red',
        });
        setTimeout(() => setFloatMessageState({}), 5000);
    };

    const showSuccess = (description: string) => {
        setFloatMessageState({ summary: '¡Correcto!', description, isActive: true, type: 'green' });
        setTimeout(() => setFloatMessageState({}), 3000);
    };

    // --- Búsqueda + re-vinculado manual ---
    const [relinkSearchText, setRelinkSearchText] = useState('');
    const [relinkResults, setRelinkResults] = useState<IProduct[]>([]);
    const [relinkSearching, setRelinkSearching] = useState(false);

    const handleRelinkSearch = async (text?: string) => {
        const query = (text ?? relinkSearchText).trim();
        if (!query) { setRelinkResults([]); return; }
        setRelinkSearching(true);
        try {
            const result = await searchCandidateProductsForCloudTransferItemAction(query);
            setRelinkResults(result.ok ? (result.value ?? []) : []);
        } finally {
            setRelinkSearching(false);
        }
    };

    const handleRelinkScanned = (code: string) => {
        setRelinkSearchText(code);
        handleRelinkSearch(code);
    };

    const handleResolveAsExistingProduct = async (matchedLocalProductId: bigint) => {
        runCloudTransferLoading('resolving-item');
        try {
            const result = await resolveCloudTransferItemAsExistingProductAction(item.cloudTransferItemId, matchedLocalProductId);
            if (!result.ok) { showError(result.error); return; }
            showSuccess('¡Producto vinculado correctamente!');
            setRelinkResults([]);
            setRelinkSearchText('');
            onResolved();
        } finally {
            stopCloudTransferLoading();
        }
    };

    // --- Producto nuevo: mapeo de categoría + creación ---
    const handleResolveAsNewProduct = async (dto: {
        localCategoryId?: bigint;
        newCategoryName?: string;
        newCategoryDescription?: string | null;
        localBrandId?: bigint;
        internalBarCode?: string | null;
        salePriceOne?: number | null;
        salePriceMany?: number | null;
        saleQuantityMany?: number | null;
        salePriceSpecial?: number | null;
        minStockBranch?: number | null;
        maxStockBranch?: number | null;
    }) => {
        runCloudTransferLoading('resolving-item');
        try {
            const categoryResult = await mapCloudCategoryToLocalCategoryAction({
                localCategoryId: dto.localCategoryId,
                newCategoryName: dto.newCategoryName,
                newCategoryDescription: dto.newCategoryDescription,
            });
            if (!categoryResult.ok || !categoryResult.value) { showError(categoryResult.error); return; }

            const resolveResult = await resolveCloudTransferItemAsNewProductAction({
                cloudTransferItemId: item.cloudTransferItemId,
                localCategoryId: categoryResult.value.categoryId,
                localBrandId: dto.localBrandId,
                internalBarCode: dto.internalBarCode,
                salePriceOne: dto.salePriceOne,
                salePriceMany: dto.salePriceMany,
                saleQuantityMany: dto.saleQuantityMany,
                salePriceSpecial: dto.salePriceSpecial,
                minStockBranch: dto.minStockBranch,
                maxStockBranch: dto.maxStockBranch,
            });
            if (!resolveResult.ok) { showError(resolveResult.error); return; }
            showSuccess('¡Producto nuevo creado y vinculado!');
            onResolved();
        } finally {
            stopCloudTransferLoading();
        }
    };

    // --- Rechazo ---
    const handleReject = async (reason: string) => {
        runCloudTransferLoading('resolving-item');
        try {
            const result = await rejectCloudTransferItemAction(item.cloudTransferItemId, reason);
            if (!result.ok) { showError(result.error); return; }
            showSuccess('Línea rechazada.');
            onResolved();
        } finally {
            stopCloudTransferLoading();
        }
    };

    return {
        matchedProduct,
        loadingMatchedProduct,
        relinkSearchText,
        setRelinkSearchText,
        relinkResults,
        relinkSearching,
        handleRelinkSearch,
        handleRelinkScanned,
        handleResolveAsExistingProduct,
        handleResolveAsNewProduct,
        handleReject,
    };
};

export { useCloudTransferItemResolution };
