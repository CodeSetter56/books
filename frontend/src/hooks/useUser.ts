// frontend/src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/user";

export const useUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: (failureCount, error: any) => {
      // Don't retry if it's a 401 that couldn't be refreshed
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5,
  });
};