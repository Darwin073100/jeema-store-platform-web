'use client'
import { useState } from "react";
import { Button } from "@/shared/ui/components/buttons";
import { TextInput, SelectMenu } from "@/shared/ui/components/inputs";
import { TextArea } from "@/shared/ui/components/inputs/TextInput copy";
import { LabelInput } from "@/shared/ui/components/labels";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { FloatMessage } from "@/shared/ui/components/messages/FloatMessage";
import { HiOutlineSearch, HiPlus, HiTrash } from "react-icons/hi";
import { useCreateCloudTransfer } from "../hooks/useCreateCloudTransfer";
import { useCloudTransferUIStore } from "../stores/cloud-transfer-ui.store";

const CreateCloudTransferForm = () => {
    const {
        register, handleSubmit, onSubmit, errors,
        searchText, setSearchText, searchResults, searching, handleSearchProducts,
        selectedProduct, setSelectedProduct, handleSelectProduct,
        draftItems, handleAddDraftItem, updateDraftItemQuantity, removeDraftItem,
        loading,
    } = useCreateCloudTransfer();
    const { floatMessageState } = useCloudTransferUIStore();

    const [lotId, setLotId] = useState<string>('');
    const [inventoryItemId, setInventoryItemId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(0);

    const selectedLot = selectedProduct?.lots?.find(l => l.lotId.toString() === lotId) ?? null;
    const selectedInventoryItem = selectedProduct?.inventory?.inventoryItems?.find(i => i.inventoryItemId.toString() === inventoryItemId) ?? null;

    const resetPicker = () => {
        setLotId('');
        setInventoryItemId('');
        setQuantity(0);
    };

    const handleConfirmAdd = () => {
        if (!selectedProduct || !selectedLot || !selectedInventoryItem || quantity <= 0) return;
        handleAddDraftItem({
            key: `${selectedProduct.productId}-${selectedLot.lotId}-${selectedInventoryItem.inventoryItemId}`,
            originLocalProductId: selectedProduct.productId,
            originLocalLotId: selectedLot.lotId,
            originLocalInventoryItemId: selectedInventoryItem.inventoryItemId,
            productName: selectedProduct.name,
            productUniversalBarCode: selectedProduct.universalBarCode,
            lotNumber: selectedLot.lotNumber,
            location: selectedInventoryItem.location,
            availableQuantity: selectedInventoryItem.quantityOnHan,
            quantityToTransfer: quantity,
        });
        resetPicker();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
            <FloatMessage {...floatMessageState} />

            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-gray-800">1. Datos del envío</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <LabelInput
                            value="Id de sucursal destino (en la nube)"
                            required="yes"
                            htmlFor="toCloudBranchOfficeId"
                            description="No existe todavía un directorio de sucursales en la nube: pide este id a la otra tienda por fuera del sistema." />
                        <TextInput
                            id="toCloudBranchOfficeId"
                            type="number"
                            placeholder="Ej. 12"
                            error={!!errors.toCloudBranchOfficeId}
                            errorMessage={errors.toCloudBranchOfficeId?.message}
                            {...register('toCloudBranchOfficeId')} />
                    </div>
                    <div className="md:col-span-2">
                        <LabelInput value="Notas de envío" required="no" htmlFor="shipmentNotes" />
                        <TextArea
                            id="shipmentNotes"
                            placeholder="Notas adicionales para la sucursal destino"
                            error={!!errors.shipmentNotes}
                            errorMessage={errors.shipmentNotes?.message}
                            {...register('shipmentNotes')} />
                    </div>
                </div>
            </section>

            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-gray-800">2. Agrega productos de tu inventario</h2>
                <div className="flex gap-2">
                    <TextInput
                        aria-label="Buscar producto por nombre o código de barras"
                        placeholder="Buscar por nombre o código de barras..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchProducts(); } }} />
                    <Button type="button" onClick={() => handleSearchProducts()} disabled={searching}>
                        {searching ? <Spinner /> : <HiOutlineSearch className="w-4 h-4" />}
                        Buscar
                    </Button>
                </div>

                {searchResults.length > 0 && !selectedProduct && (
                    <ul className="border border-gray-200 rounded-xl divide-y max-h-64 overflow-y-auto" role="listbox" aria-label="Resultados de búsqueda">
                        {searchResults.map(product => (
                            <li key={product.productId.toString()}>
                                <button
                                    type="button"
                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 flex justify-between items-center"
                                    onClick={() => handleSelectProduct(product)}>
                                    <span>
                                        <span className="font-semibold">{product.name}</span>
                                        {product.universalBarCode && <span className="text-gray-500 text-sm ml-2">({product.universalBarCode})</span>}
                                    </span>
                                    <span className="text-xs text-gray-500">{product.category?.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {selectedProduct && (
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800">{selectedProduct.name}</span>
                            <Button type="button" size="sm" color="gray" onClick={() => { setSelectedProduct(null); resetPicker(); }}>Cambiar producto</Button>
                        </div>
                        {(!selectedProduct.lots || selectedProduct.lots.length === 0) && (
                            <p className="text-red-600 text-sm">Este producto no tiene lotes registrados, no se puede transferir.</p>
                        )}
                        {(!selectedProduct.inventory || (selectedProduct.inventory.inventoryItems ?? []).length === 0) && (
                            <p className="text-red-600 text-sm">Este producto no tiene stock en ninguna ubicación de esta sucursal.</p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <LabelInput value="Lote" required="yes" htmlFor="lotId" />
                                <SelectMenu
                                    id="lotId"
                                    items={(selectedProduct.lots ?? []).map(lot => ({ value: lot.lotId.toString(), text: `${lot.lotNumber} ($${lot.purchasePrice})` }))}
                                    value={lotId}
                                    onChange={(e) => setLotId(e.target.value)} />
                            </div>
                            <div>
                                <LabelInput value="Ubicación / stock" required="yes" htmlFor="inventoryItemId" />
                                <SelectMenu
                                    id="inventoryItemId"
                                    items={(selectedProduct.inventory?.inventoryItems ?? []).map(item => ({ value: item.inventoryItemId.toString(), text: `${item.location.toUpperCase()} (stock: ${item.quantityOnHan})` }))}
                                    value={inventoryItemId}
                                    onChange={(e) => setInventoryItemId(e.target.value)} />
                            </div>
                            <div>
                                <LabelInput value="Cantidad a transferir" required="yes" htmlFor="quantity" />
                                <TextInput
                                    id="quantity"
                                    type="number"
                                    step="0.001"
                                    max={selectedInventoryItem?.quantityOnHan}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))} />
                                {selectedInventoryItem && <span className="text-xs text-gray-500">Disponible: {selectedInventoryItem.quantityOnHan}</span>}
                            </div>
                        </div>
                        <Button
                            type="button"
                            color="green"
                            className="self-end"
                            disabled={!selectedLot || !selectedInventoryItem || quantity <= 0 || quantity > (selectedInventoryItem?.quantityOnHan ?? 0)}
                            onClick={handleConfirmAdd}>
                            <HiPlus className="w-4 h-4" /> Agregar al traspaso
                        </Button>
                    </div>
                )}
            </section>

            <section className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-gray-800">3. Productos a enviar ({draftItems.length})</h2>
                {draftItems.length === 0 ? (
                    <p className="text-gray-500">Aún no has agregado productos.</p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {draftItems.map(item => (
                            <div key={item.key} className="flex max-md:flex-col md:items-center justify-between gap-2 border border-gray-200 rounded-xl p-3">
                                <div>
                                    <span className="font-semibold">{item.productName}</span>
                                    <span className="text-gray-500 text-sm ml-2">Lote {item.lotNumber} · {item.location.toUpperCase()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        aria-label={`Cantidad a transferir de ${item.productName}`}
                                        type="number"
                                        step="0.001"
                                        max={item.availableQuantity}
                                        className="w-24"
                                        value={item.quantityToTransfer}
                                        onChange={(e) => updateDraftItemQuantity(item.key, Number(e.target.value))} />
                                    <span className="text-xs text-gray-500">/ {item.availableQuantity} disp.</span>
                                    <Button type="button" size="sm" color="red" aria-label={`Quitar ${item.productName} del traspaso`} onClick={() => removeDraftItem(item.key)}>
                                        <HiTrash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <div className="flex justify-end gap-3">
                <Button type="submit" disabled={loading === 'creating' || draftItems.length === 0}>
                    {loading === 'creating' ? <Spinner /> : null}
                    Enviar traspaso
                </Button>
            </div>
        </form>
    );
};

export { CreateCloudTransferForm };
