import { Metadata } from "next";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import TemplateNotFoundDinamic from "@/shared/ui/components/templates/TemplateNotFoundDinamic";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";
import { CloudTransferDetail } from "@/contexts/inventory-management/cloud-transfer/presentation/ui/CloudTransferDetail";
import { findCloudTransferByIdAction } from "@/contexts/inventory-management/cloud-transfer/presentation/actions/find-cloud-transfer-by-id.action";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Traspasos|Detalle'
}

interface Props {
    params: {
        cloudTransferId: string;
    }
}

export default async function CloudTransferDetailPage({ params }: Props) {
    const { cloudTransferId } = await params;

    let transferId: bigint;
    try {
        transferId = BigInt(cloudTransferId);
    } catch {
        return (
            <ProtectedRoute>
                <TemplateNotFoundDinamic
                    linkHref="/transfers/list"
                    linkText="Volver a la lista de traspasos"
                    title="¡Oops! Id de traspaso inválido"
                    description="El identificador del traspaso no es válido." />
            </ProtectedRoute>
        );
    }

    const result = await findCloudTransferByIdAction(transferId);

    if (!result.ok || !result.value) {
        return (
            <ProtectedRoute>
                <TemplateNotFoundDinamic
                    linkHref="/transfers/list"
                    linkText="Volver a la lista de traspasos"
                    title="¡Oops! No pudimos encontrar este traspaso"
                    description="El traspaso solicitado no existe o no se pudo cargar en este momento." />
            </ProtectedRoute>
        );
    }

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Traspasos', href: '/transfers' },
        { label: 'Lista', href: '/transfers/list' },
        { label: `#${transferId.toString()}` }
    ]

    return (
        <ProtectedRoute>
            <TemplateHeader
                title={`Traspaso #${transferId.toString()}`}
                detail="Detalle, procesamiento y resolución de productos del traspaso."
                breadcrumbItems={breadcrumbItems}>
                <CloudTransferDetail transfer={result.value} />
            </TemplateHeader>
        </ProtectedRoute>
    );
}
