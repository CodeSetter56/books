// frontend/src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/user";

export const useUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: data, // Now accurately passes user object to components
    isLoading,
    isLoggedIn: !!data,
    error,
  };
};
