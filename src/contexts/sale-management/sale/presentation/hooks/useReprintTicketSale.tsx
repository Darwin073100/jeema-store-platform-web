import { useEffect, useState } from "react";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { findTicketBySaleIdAction } from "../actions/find-ticket-by-sale-id.action";
import { pdf } from "@react-pdf/renderer";
import { Ticket58Document } from "../documents/Ticket58Document";
import { useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";
import { useQzTray, blobToBase64 } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/useQzTray";
import { findPrinterConfigurationByBranchAction } from "@/contexts/configuration-management/printer-configuration/presentation/actions/find-printer-configuration-by-branch.action";
import { IPrinterConfiguration } from "@/contexts/configuration-management/printer-configuration/presentation/interfaces/IPrinterConfiguration";
interface Props {
    saleId: bigint,
}
const useReprintTicketSale = ({ saleId }: Props) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { saleModals, setFloatMessageState } = useSaleUIStore();
    const { branchOffice } = useWorkspace();
    const { printPdf } = useQzTray();

    // Mismo tratamiento que en useTicketSale: impresión silenciosa en paralelo tras generar el
    // ticket, sin afectar el modal ni el estado de la venta si falla.
    const printSilently = async (blob: Blob) => {
        try {
            if (!branchOffice) {
                return;
            }
            const result = await findPrinterConfigurationByBranchAction(branchOffice.branchOfficeId);
            if (!result.ok || !result.value) {
                return;
            }
            const printerConfig = result.value.printerConfigurations.find(
                (config: IPrinterConfiguration) => config.isActive && config.autoPrintOnSale
            );
            if (!printerConfig) {
                return;
            }

            const base64Pdf = await blobToBase64(blob);
            await printPdf(base64Pdf, printerConfig);
        } catch (printError) {
            setFloatMessageState({
                summary: 'Impresión no disponible',
                description: 'No se pudo imprimir automáticamente — revisa la impresora.',
                type: 'yellow',
                isActive: true,
            });
            setTimeout(() => setFloatMessageState({}), 5000);
        }
    };

    const handlePrint = async () => {
        setLoading(true);
        try {
            if (saleId === BigInt(0)) {
                return;
            }
            const result = await findTicketBySaleIdAction(saleId);
            if (!result.ok) {
                return;
            }
            if (!result.value) {
                return;
            }
            // Generar el Blob usando el componente de React
            const doc = (
                <Ticket58Document
                sale={result.value}
                />
            );
            const blob = await pdf(doc).toBlob();
            
            // Crear nueva URL
            setPdfUrl(URL.createObjectURL(blob));

            // Disparo en paralelo, sin esperar ni bloquear el modal ya abierto.
            void printSilently(blob);
        } catch (error) {
            console.error(error)
            setError("No se pudo cargar el documento.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (saleModals === 'saleTicketReprintModal') {
            handlePrint();
        }
    }, [saleId, saleModals === 'saleTicketReprintModal']);
    return {
        pdfUrl,
        loading,
        error
    }
}

export default useReprintTicketSale
