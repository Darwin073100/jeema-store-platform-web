"use client";

import { useAccessToken } from "./useAuth";
import { useCallback } from "react";

export function useAuthenticatedRequest() {
  const { accessToken, isReady } = useAccessToken();

  const makeRequest = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!isReady || !accessToken) {
        throw new Error("No hay token de acceso disponible");
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      };

      const requestOptions: RequestInit = {
        ...options,
        headers,
      };

      try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
      } catch (error) {
        console.error("Error en petición autenticada:", error);
        throw error;
      }
    },
    [accessToken, isReady]
  );

  const get = useCallback(
    (url: string, options: RequestInit = {}) => {
      return makeRequest(url, { ...options, method: "GET" });
    },
    [makeRequest]
  );

  const post = useCallback(
    (url: string, data?: any, options: RequestInit = {}) => {
      return makeRequest(url, {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [makeRequest]
  );

  const put = useCallback(
    (url: string, data?: any, options: RequestInit = {}) => {
      return makeRequest(url, {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [makeRequest]
  );

  const del = useCallback(
    (url: string, options: RequestInit = {}) => {
      return makeRequest(url, { ...options, method: "DELETE" });
    },
    [makeRequest]
  );

  return {
    makeRequest,
    get,
    post,
    put,
    delete: del,
    isReady,
    accessToken,
  };
}
