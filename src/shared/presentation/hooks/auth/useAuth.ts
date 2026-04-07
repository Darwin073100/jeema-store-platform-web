"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { useState } from "react";

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
    
    // Datos del usuario
    user: session?.user || null,
    
    // Datos del workspace (cached)
    workspace: session?.user.workspace || null,
    
    // Métodos
    login,
    logout,
    loading,
    // Session completa por si necesitas algo más específico
    session,
  };
}

// Hook específico para obtener información del workspace
export function useWorkspace() {
  const { workspace, isAuthenticated } = useAuth();
  setCookie("establishmentCookie", workspace?.establishment || "", {maxAge: 60*60})
  setCookie("branchOfficeCookie", workspace?.branchOffice || "", {maxAge: 60*60})
  setCookie("employeeCookie", workspace?.employee || "", {maxAge: 60*60})

  return {
    // Información del establecimiento
    establishment: workspace?.establishment || null,
    // Setear la cookie del establecimiento por una hora
    
    // Información de la sucursal
    branchOffice: workspace?.branchOffice || null,
    
    // Información del empleado
    employee: workspace?.employee || null,
    
    // Workspace completo
    workspace,
    
    // Estado
    isLoaded: isAuthenticated && !!workspace,
  };
}

// Hook para obtener el accessToken para hacer peticiones
export function useAccessToken() {
  const { isAuthenticated } = useAuth();
  
  return {
    isReady: isAuthenticated,
  };
}
