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
    // { scroll: false } prevents jump-to-top on page change
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return { getParam, updateParams, searchParams };
};
