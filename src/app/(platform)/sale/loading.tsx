import { CardListSkeleton } from "@/shared/ui/components/loadings/CardListSkeleton";
import { PageSkeleton } from "@/shared/ui/components/loadings/PageSkeleton";
import { Skeleton } from "@/shared/ui/components/loadings/Skeleton";
import { TableSkeleton } from "@/shared/ui/components/loadings/TableSkeleton";

export default function Loading() {
    return (
        <PageSkeleton>
            {/* Filtros */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-between gap-4">
                    <Skeleton className="h-10 w-full max-w-md" />
                    <Skeleton className="h-10 w-40 max-md:w-12" />
                </div>
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="py-4">
                <Skeleton className="h-8 w-40 max-sm:w-10" />
            </div>
            <div className="hidden md:block">
                <TableSkeleton theadList={['Folio', 'Cliente', 'Empleado', 'Status', 'Total', 'Fecha']} />
            </div>
            <div className="md:hidden mt-2 flex flex-col items-center gap-2 w-full">
                <CardListSkeleton />
            </div>
        </PageSkeleton>
    );
}
