// src/hooks/useUrlState.ts
import { useRouter, useSearchParams } from "next/navigation";

export const useUrlState = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = (key: string, defaultValue: string = "") => {
    return searchParams.get(key) || defaultValue;
  };

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // NEW: Use replace instead of push for modal-only updates
  const replaceParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return { getParam, updateParams, replaceParams, searchParams };
};
