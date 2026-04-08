"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { setCookie } from "cookies-next";
import { useState, useEffect } from "react";
import { safeJsonSerialize } from "@/shared/lib/utils/safe-json-serialize";
import { userWorkspaceAction } from "@/contexts/authentication-management/auth/presentation/actions/user-workspace.action";
import { IUserWorkspace } from "@/contexts/authentication-management/auth/application/dtos/IUserWorkspace";

export function useAuth() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error de autenticación",
      };
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut({ redirect: false });
  };

  return {
    // Estado de autenticación
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    
    // Datos del usuario (sin workspace)
    user: session?.user || null,
    
    // Métodos
    login,
    logout,
    loading,
    // Session completa por si necesitas algo más específico
    session,
  };
}

// Hook específico para obtener información del workspace (lazy-loaded)
export function useWorkspace() {
  const { isAuthenticated, isLoading } = useAuth();
  const [workspace, setWorkspace] = useState<IUserWorkspace | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || isLoading || workspaceLoading) return;

    // Evitar cargar si ya tenemos datos
    if (workspace) return;

    const loadWorkspace = async () => {
      try {
        setWorkspaceLoading(true);
        const result = await userWorkspaceAction();
        
        if (result.ok && result.value) {
          setWorkspace(result.value);
          // Cachear en cookies para disponibilidad rápida
          setCookie("establishmentCookie", safeJsonSerialize(result.value.establishment ?? {}), {maxAge: 60*60});
          setCookie("branchOfficeCookie", safeJsonSerialize(result.value.branchOffice ?? {}), {maxAge: 60*60});
          setCookie("employeeCookie", safeJsonSerialize(result.value.employee ?? {}), {maxAge: 60*60});
        } else {
          setWorkspaceError(result.error?.message?.toString() || "Error cargando workspace");
        }
      } catch (error) {
        setWorkspaceError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setWorkspaceLoading(false);
      }
    };

    loadWorkspace();
  }, [isAuthenticated, isLoading, workspace, workspaceLoading]);

  return {
    // Información del establecimiento
    establishment: workspace?.establishment || null,
    
    // Información de la sucursal
    branchOffice: workspace?.branchOffice || null,
    
    // Información del empleado
    employee: workspace?.employee || null,
    
    // Workspace completo
    workspace,
    
    // Estado
    isLoaded: isAuthenticated && !isLoading && !!workspace,
    isLoading: workspaceLoading,
    error: workspaceError,
  };
}

// Hook para obtener el accessToken para hacer peticiones
export function useAccessToken() {
  const { isAuthenticated } = useAuth();
  
  return {
    isReady: isAuthenticated,
  };
}
