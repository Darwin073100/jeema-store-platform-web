'use client'
import { useState } from "react";
import { TemplateModal } from "@/shared/ui/components/modals/TemplateModal";
import { TextInput } from "@/shared/ui/components/inputs";
import { Button } from "@/shared/ui/components/buttons";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";
import { BarcodeScannerModal } from "@/shared/ui/components/scanner/BarcodeScannerModal";
import { HiOutlineSearch } from "react-icons/hi";
import { IoCameraOutline } from "react-icons/io5";
import { IoMdCheckmark } from "react-icons/io";
import { IProduct } from "@/contexts/product-management/product/presentation/interfaces/IProduct";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    searchText: string;
    setSearchText: (text: string) => void;
    results: IProduct[];
    searching: boolean;
    onSearch: (text?: string) => void;
    onScanned: (code: string) => void;
    onSelect: (productId: bigint) => void;
}

/** Buscador + re-vinculado manual de producto (ver hint del task en el punto 7: reutiliza el escáner de
 * código de barras ya existente porque relinkear "a mano" es justo el caso donde el barcode que llegó de A
 * cambió respecto al catálogo de B — escanear el producto físico en B es la forma más rápida de encontrarlo). */
const ProductRelinkSearchModal = ({ isOpen, onClose, searchText, setSearchText, results, searching, onSearch, onScanned, onSelect }: Props) => {
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    return (
        <TemplateModal size="lg" isOpen={isOpen} onClose={onClose} title="Buscar producto para vincular">
            <div className="p-6 flex flex-col gap-4">
                <p className="text-gray-600 text-sm">
                    El código de barras que llegó de la sucursal origen no coincide con ningún producto de tu
                    catálogo. Busca por nombre o escanea el producto físico para vincularlo manualmente.
                </p>
                <div className="flex gap-2">
                    <TextInput
                        aria-label="Buscar producto por nombre o código de barras"
                        autoFocus
                        placeholder="Nombre o código de barras..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSearch(); } }} />
                    <Button type="button" onClick={() => onSearch()} disabled={searching}>
                        {searching ? <Spinner /> : <HiOutlineSearch className="w-4 h-4" />}
                    </Button>
                    <button
                        type="button"
                        onClick={() => setIsScannerOpen(true)}
                        className="text-blue-600 text-2xl px-2 hover:text-blue-800"
                        aria-label="Escanear con la cámara"
                        title="Escanear con la cámara">
                        <IoCameraOutline />
                    </button>
                </div>

                <ul className="border border-gray-200 rounded-xl divide-y max-h-80 overflow-y-auto" role="listbox" aria-label="Resultados de búsqueda">
                    {results.length === 0 && !searching && (
                        <li className="px-4 py-3 text-gray-500 text-sm">Sin resultados todavía.</li>
                    )}
                    {results.map(product => (
                        <li key={product.productId.toString()}>
                            <button
                                type="button"
                                className="w-full text-left px-4 py-3 hover:bg-green-50 flex justify-between items-center gap-2"
                                onClick={() => onSelect(product.productId)}>
                                <span>
                                    <span className="font-semibold">{product.name}</span>
                                    {product.universalBarCode && <span className="text-gray-500 text-sm ml-2">({product.universalBarCode})</span>}
                                    <span className="block text-xs text-gray-500">{product.category?.name}</span>
                                </span>
                                <IoMdCheckmark className="text-green-600 text-xl flex-shrink-0" />
                            </button>
                        </li>
                    ))}
                </ul>

                <BarcodeScannerModal
                    isOpen={isScannerOpen}
                    onClose={() => setIsScannerOpen(false)}
                    onDetected={(code) => { setIsScannerOpen(false); onScanned(code); }} />
            </div>
        </TemplateModal>
    );
};

export { ProductRelinkSearchModal };
