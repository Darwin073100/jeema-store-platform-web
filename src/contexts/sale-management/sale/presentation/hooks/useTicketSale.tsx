import { useState } from "react";
import { findTicketBySaleIdAction } from "../actions/find-ticket-by-sale-id.action";
import { useSaleUIStore } from "../stores/sale.ui.store";
import { pdf } from "@react-pdf/renderer";
import { Ticket58Document } from "../documents/Ticket58Document";
import { useWorkspace } from "@/shared/presentation/hooks/auth/useAuth";
import { useQzTray, blobToBase64 } from "@/contexts/configuration-management/printer-configuration/presentation/hooks/useQzTray";
import { findPrinterConfigurationByBranchAction } from "@/contexts/configuration-management/printer-configuration/presentation/actions/find-printer-configuration-by-branch.action";
import { IPrinterConfiguration } from "@/contexts/configuration-management/printer-configuration/presentation/interfaces/IPrinterConfiguration";
interface Props {
}
const useTicketSale = ({}: Props) => {
    const [error, setError] = useState<string | null>(null);

    const { openSaleModal, setPdfUrl, pdfUrl, initLoading, loading, finishLoading, setFloatMessageState } = useSaleUIStore();
    const { branchOffice } = useWorkspace();
    const { printPdf } = useQzTray();

    // Impresión silenciosa en la impresora térmica configurada para la sucursal, disparada en
    // paralelo tras generar el ticket. La venta ya está persistida en backend en este punto — un
    // fallo aquí (QZ Tray apagado, impresora desconectada) nunca debe afectar el modal ni el estado
    // de la venta, solo mostrar un aviso no bloqueante.
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

    const handlePrint = async (saleId: bigint) => {
        initLoading('saleTicket');
        openSaleModal("saleTicketModal");
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
            setError("No se pudo cargar el documento.");
        } finally {
            finishLoading();
        }
    };

    return {
        pdfUrl,
        loading,
        error,
        handlePrint,
    }
}

export default useTicketSale
