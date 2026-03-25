"use client";

import { useAuth } from "@/shared/presentation/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Spinner } from "@/shared/ui/components/loadings/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [] 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Verificar roles si se especificaron
  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => user?.roles?.includes(role));

  // Verificar permisos si se especificaron
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => user?.permissions?.includes(permission));

  if (isLoading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <p>Redirigiendo al login...</p>
      </div>
    );
  }

  if (!hasRequiredRole || !hasRequiredPermission) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes los permisos necesarios para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
