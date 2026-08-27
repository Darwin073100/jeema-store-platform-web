import { PrinterConfigurationForm } from "@/contexts/configuration-management/printer-configuration/presentation/ui/PrinterConfigurationForm";
import { ProtectedRoute } from "@/shared/ui/components/routes/ProtectedRoute";
import { BreadcrumbItem, TemplateHeader } from "@/shared/ui/components/templates/TemplateHeader";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Configuraciones', href: '/configurations' },
  { label: 'Impresora térmica' },
];

export default function PrinterConfigurationPage() {
  return (
    <ProtectedRoute requiredRoles={['global_admin', 'establishment_manager', 'branch_office_management']}>
      <TemplateHeader
        title="Impresora térmica"
        detail="Configura la impresora térmica de esta sucursal e impresión automática de tickets."
        breadcrumbItems={breadcrumbItems}
      >
        <PrinterConfigurationForm />
      </TemplateHeader>
    </ProtectedRoute>
  );
}
