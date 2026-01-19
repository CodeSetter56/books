import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/user";

export const useUser = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // Keep user data fresh for 5 minutes
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};
