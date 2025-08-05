"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { UseApiHook, ApiResponse } from "@/types";

interface UseApiOptions<T> {
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  retryCount?: number;
  retryDelay?: number;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiHook<T> & {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
} {
  const {
    initialData = null,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        const result = await apiFunction(...args);

        setData(result);
        retryCountRef.current = 0;

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err: any) {
        if (err.name === "AbortError") {
          return null; // Request was cancelled
        }

        const errorMessage = err.message || "An error occurred";

        // Retry logic
        if (retryCountRef.current < retryCount) {
          retryCountRef.current += 1;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          return execute(...args);
        }

        setError(errorMessage);

        if (onError) {
          onError(errorMessage);
        }

        return null;
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [apiFunction, onSuccess, onError, retryCount, retryDelay]
  );

  const refetch = useCallback(async (): Promise<void> => {
    await execute();
  }, [execute]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setIsLoading(false);
    retryCountRef.current = 0;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [initialData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    execute,
    reset,
  };
}

// Specialized hook for GET requests
export function useApiGet<T = any>(
  url: string | null,
  options: UseApiOptions<T> & {
    dependencies?: any[];
    enabled?: boolean;
  } = {}
) {
  const { dependencies = [], enabled = true, ...apiOptions } = options;

  const apiFunction = useCallback(async () => {
    if (!url) throw new Error("URL is required");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }, [url]);

  const api = useApi<T>(apiFunction, apiOptions);

  // Auto-execute on mount and dependency changes
  useEffect(() => {
    if (enabled && url) {
      api.execute();
    }
  }, [enabled, url, ...dependencies]);

  return api;
}

// Specialized hook for POST requests
export function useApiPost<TRequest = any, TResponse = any>(
  url: string,
  options: UseApiOptions<TResponse> = {}
) {
  const apiFunction = useCallback(
    async (data: TRequest) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    [url]
  );

  return useApi<TResponse>(apiFunction, options);
}

// Hook for handling file uploads
export function useApiUpload<T = any>(
  url: string,
  options: UseApiOptions<T> = {}
) {
  const apiFunction = useCallback(
    async (formData: FormData) => {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    [url]
  );

  return useApi<T>(apiFunction, options);
}

// Hook for handling API with pagination
export function useApiPagination<T = any>(
  baseUrl: string,
  options: UseApiOptions<T> & {
    pageSize?: number;
    initialPage?: number;
  } = {}
) {
  const { pageSize = 20, initialPage = 1, ...apiOptions } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState<T[]>([]);

  const apiFunction = useCallback(
    async (page: number) => {
      const url = `${baseUrl}?page=${page}&limit=${pageSize}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    [baseUrl, pageSize]
  );

  const api = useApi(apiFunction, {
    ...apiOptions,
    onSuccess: (data: any) => {
      if (currentPage === 1) {
        setAllData(data.items || []);
      } else {
        setAllData((prev) => [...prev, ...(data.items || [])]);
      }

      setHasMore(data.hasMore || false);

      if (apiOptions.onSuccess) {
        apiOptions.onSuccess(data);
      }
    },
  });

  const loadMore = useCallback(async () => {
    if (!hasMore || api.isLoading) return;

    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await api.execute(nextPage);
  }, [currentPage, hasMore, api]);

  const refresh = useCallback(async () => {
    setCurrentPage(1);
    setAllData([]);
    setHasMore(true);
    await api.execute(1);
  }, [api]);

  return {
    ...api,
    data: allData,
    currentPage,
    hasMore,
    loadMore,
    refresh,
  };
}
