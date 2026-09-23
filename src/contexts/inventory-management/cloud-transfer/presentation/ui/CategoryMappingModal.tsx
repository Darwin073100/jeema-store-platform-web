'use client'
import { useEffect, useState } from "react";
import { TemplateModal } from "@/shared/ui/components/modals/TemplateModal";
import { TextInput, SelectMenu } from "@/shared/ui/components/inputs";
import { TextArea } from "@/shared/ui/components/inputs/TextInput copy";
import { LabelInput } from "@/shared/ui/components/labels";
import { Button } from "@/shared/ui/components/buttons";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { findAllCategoriesByEstablishmentAction } from "@/contexts/product-management/category/presentation/actions/find-all-categories-by-stablishment.action";
import { ICategory } from "@/contexts/product-management/category/presentation/interfaces/ICategory";

interface InventoryFormValues {
    internalBarCode: string | null;
    salePriceOne: number | null;
    salePriceMany: number | null;
    saleQuantityMany: number | null;
    salePriceSpecial: number | null;
    minStockBranch: number | null;
    maxStockBranch: number | null;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    incomingCategoryName: string;
    incomingCategoryDescription: string | null;
    /** Sugerencias de precio del origen (A) — la nube nunca envía min/max stock, son metas locales de B. */
    incomingBarCode: string | null;
    incomingSuggestedSalePriceOne: number | null;
    incomingSuggestedSalePriceMany: number | null;
    incomingSuggestedSaleQuantityMany: number | null;
    incomingSuggestedSalePriceSpecial: number | null;
    submitting: boolean;
    onSubmit: (dto: { localCategoryId?: bigint; newCategoryName?: string; newCategoryDescription?: string | null } & InventoryFormValues) => void;
}

const toNumberOrNull = (value: string): number | null => (value.trim() === '' ? null : Number(value));

/** Paso humano requerido antes de crear un producto nuevo (ver spect/08 sección 3.6/5.9): las categorías son
 * establishment-scoped, así que el nombre de categoría que llegó de A no es garantía de que exista igual en
 * B. El usuario decide: mapear a una categoría local existente, o crear una nueva con ese nombre (prellenado,
 * editable) o cualquier otro.
 * También pide la configuración de inventario de ESTA sucursal (precios, stock mín/máx): la nube solo trae
 * "sugerencias" de precio del origen (A), nunca min/max stock (son metas puramente locales de cada
 * sucursal) — sin este paso, el producto se creaba con toda esta info en cero/vacío. */
const CategoryMappingModal = ({
    isOpen, onClose, incomingCategoryName, incomingCategoryDescription,
    incomingBarCode, incomingSuggestedSalePriceOne, incomingSuggestedSalePriceMany,
    incomingSuggestedSaleQuantityMany, incomingSuggestedSalePriceSpecial,
    submitting, onSubmit,
}: Props) => {
    const [mode, setMode] = useState<'existing' | 'new'>('existing');
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [localCategoryId, setLocalCategoryId] = useState('');
    const [newCategoryName, setNewCategoryName] = useState(incomingCategoryName);
    const [newCategoryDescription, setNewCategoryDescription] = useState(incomingCategoryDescription ?? '');

    const [internalBarCode, setInternalBarCode] = useState(incomingBarCode ?? '');
    const [salePriceOne, setSalePriceOne] = useState(incomingSuggestedSalePriceOne?.toString() ?? '');
    const [salePriceMany, setSalePriceMany] = useState(incomingSuggestedSalePriceMany?.toString() ?? '');
    const [saleQuantityMany, setSaleQuantityMany] = useState(incomingSuggestedSaleQuantityMany?.toString() ?? '');
    const [salePriceSpecial, setSalePriceSpecial] = useState(incomingSuggestedSalePriceSpecial?.toString() ?? '');
    const [minStockBranch, setMinStockBranch] = useState('');
    const [maxStockBranch, setMaxStockBranch] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        setLoadingCategories(true);
        findAllCategoriesByEstablishmentAction()
            .then(setCategories)
            .finally(() => setLoadingCategories(false));
    }, [isOpen]);

    useEffect(() => {
        setNewCategoryName(incomingCategoryName);
        setNewCategoryDescription(incomingCategoryDescription ?? '');
    }, [incomingCategoryName, incomingCategoryDescription]);

    useEffect(() => {
        setInternalBarCode(incomingBarCode ?? '');
        setSalePriceOne(incomingSuggestedSalePriceOne?.toString() ?? '');
        setSalePriceMany(incomingSuggestedSalePriceMany?.toString() ?? '');
        setSaleQuantityMany(incomingSuggestedSaleQuantityMany?.toString() ?? '');
        setSalePriceSpecial(incomingSuggestedSalePriceSpecial?.toString() ?? '');
        setMinStockBranch('');
        setMaxStockBranch('');
    }, [incomingBarCode, incomingSuggestedSalePriceOne, incomingSuggestedSalePriceMany, incomingSuggestedSaleQuantityMany, incomingSuggestedSalePriceSpecial]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!salePriceOne.trim()) return;

        const inventoryValues: InventoryFormValues = {
            internalBarCode: internalBarCode.trim() || null,
            salePriceOne: Number(salePriceOne),
            salePriceMany: toNumberOrNull(salePriceMany),
            saleQuantityMany: toNumberOrNull(saleQuantityMany),
            salePriceSpecial: toNumberOrNull(salePriceSpecial),
            minStockBranch: toNumberOrNull(minStockBranch),
            maxStockBranch: toNumberOrNull(maxStockBranch),
        };

        if (mode === 'existing') {
            if (!localCategoryId) return;
            onSubmit({ localCategoryId: BigInt(localCategoryId), ...inventoryValues });
        } else {
            if (!newCategoryName.trim()) return;
            onSubmit({ newCategoryName: newCategoryName.trim(), newCategoryDescription: newCategoryDescription.trim() || null, ...inventoryValues });
        }
    };

    return (
        <TemplateModal size="md" isOpen={isOpen} onClose={onClose} title="Mapear categoría (producto nuevo)">
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                <p className="text-gray-600 text-sm">
                    La sucursal origen clasificó este producto como <strong>"{incomingCategoryName}"</strong>.
                    Elige a qué categoría de tu catálogo corresponde, o crea una nueva.
                </p>

                <div className="flex gap-2" role="tablist" aria-label="Modo de mapeo de categoría">
                    <Button type="button" size="sm" role="tab" aria-selected={mode === 'existing'} color={mode === 'existing' ? 'blue' : 'gray'} onClick={() => setMode('existing')}>
                        Categoría existente
                    </Button>
                    <Button type="button" size="sm" role="tab" aria-selected={mode === 'new'} color={mode === 'new' ? 'blue' : 'gray'} onClick={() => setMode('new')}>
                        Crear categoría nueva
                    </Button>
                </div>

                {mode === 'existing' ? (
                    <div>
                        <LabelInput value="Categoría local" required="yes" htmlFor="localCategoryId" />
                        {loadingCategories ? <Spinner color="blue" /> : (
                            <SelectMenu
                                id="localCategoryId"
                                items={categories.map(c => ({ value: c.categoryId.toString(), text: c.name }))}
                                value={localCategoryId}
                                onChange={(e) => setLocalCategoryId(e.target.value)} />
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div>
                            <LabelInput value="Nombre de la nueva categoría" required="yes" htmlFor="newCategoryName" />
                            <TextInput id="newCategoryName" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                        </div>
                        <div>
                            <LabelInput value="Descripción" required="no" htmlFor="newCategoryDescription" />
                            <TextArea id="newCategoryDescription" value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)} />
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
                    <p className="text-gray-600 text-sm">
                        Configura el inventario de este producto para tu sucursal. Los precios se prellenaron con lo
                        que cobraba la sucursal origen (editable); el stock mínimo/máximo es una meta local, no viene
                        de la nube.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <LabelInput value="Precio de venta por menudeo" required="yes" htmlFor="salePriceOne" />
                            <TextInput id="salePriceOne" type="number" step="0.01" placeholder="0.00" value={salePriceOne} onChange={(e) => setSalePriceOne(e.target.value)} />
                        </div>
                        <div>
                            <LabelInput value="Código de barras interno" required="no" htmlFor="internalBarCode" />
                            <TextInput id="internalBarCode" value={internalBarCode} onChange={(e) => setInternalBarCode(e.target.value)} />
                        </div>
                        <div>
                            <LabelInput value="Precio de venta por mayoreo" required="no" htmlFor="salePriceMany" />
                            <TextInput id="salePriceMany" type="number" step="0.01" placeholder="0.00" value={salePriceMany} onChange={(e) => setSalePriceMany(e.target.value)} />
                        </div>
                        <div>
                            <LabelInput value="Cantidad para mayoreo" required="no" htmlFor="saleQuantityMany" />
                            <TextInput id="saleQuantityMany" type="number" step="0.01" placeholder="Cantidad por mayoreo" value={saleQuantityMany} onChange={(e) => setSaleQuantityMany(e.target.value)} />
                        </div>
                        <div>
                            <LabelInput value="Precio especial" required="no" htmlFor="salePriceSpecial" />
                            <TextInput id="salePriceSpecial" type="number" step="0.01" placeholder="0.00" value={salePriceSpecial} onChange={(e) => setSalePriceSpecial(e.target.value)} />
                        </div>
                        <div />
                        <div>
                            <LabelInput value="Stock mínimo en sucursal" required="no" htmlFor="minStockBranch" />
                            <TextInput id="minStockBranch" type="number" step="0.001" placeholder="Cantidad mínima" value={minStockBranch} onChange={(e) => setMinStockBranch(e.target.value)} />
                        </div>
                        <div>
                            <LabelInput value="Stock máximo en sucursal" required="no" htmlFor="maxStockBranch" />
                            <TextInput id="maxStockBranch" type="number" step="0.001" placeholder="Cantidad máxima" value={maxStockBranch} onChange={(e) => setMaxStockBranch(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="submit" color="purple" disabled={submitting}>
                        {submitting ? <Spinner /> : null}
                        Confirmar y crear producto
                    </Button>
                    <Button type="button" color="gray" onClick={onClose} disabled={submitting}>Cancelar</Button>
                </div>
            </form>
        </TemplateModal>
    );
};

export { CategoryMappingModal };
