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

interface Props {
    isOpen: boolean;
    onClose: () => void;
    incomingCategoryName: string;
    incomingCategoryDescription: string | null;
    submitting: boolean;
    onSubmit: (dto: { localCategoryId?: bigint; newCategoryName?: string; newCategoryDescription?: string | null }) => void;
}

/** Paso humano requerido antes de crear un producto nuevo (ver spect/08 sección 3.6/5.9): las categorías son
 * establishment-scoped, así que el nombre de categoría que llegó de A no es garantía de que exista igual en
 * B. El usuario decide: mapear a una categoría local existente, o crear una nueva con ese nombre (prellenado,
 * editable) o cualquier otro. */
const CategoryMappingModal = ({ isOpen, onClose, incomingCategoryName, incomingCategoryDescription, submitting, onSubmit }: Props) => {
    const [mode, setMode] = useState<'existing' | 'new'>('existing');
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [localCategoryId, setLocalCategoryId] = useState('');
    const [newCategoryName, setNewCategoryName] = useState(incomingCategoryName);
    const [newCategoryDescription, setNewCategoryDescription] = useState(incomingCategoryDescription ?? '');

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'existing') {
            if (!localCategoryId) return;
            onSubmit({ localCategoryId: BigInt(localCategoryId) });
        } else {
            if (!newCategoryName.trim()) return;
            onSubmit({ newCategoryName: newCategoryName.trim(), newCategoryDescription: newCategoryDescription.trim() || null });
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
