import { PageSkeleton } from "@/shared/ui/components/loadings/PageSkeleton";
import { Skeleton } from "@/shared/ui/components/loadings/Skeleton";

// Respaldo para las rutas que todavía no tienen un loading.tsx propio.
export default function Loading() {
    return (
        <PageSkeleton>
            <Skeleton className="h-96 w-full rounded-xl mt-4" />
        </PageSkeleton>
    );
}
