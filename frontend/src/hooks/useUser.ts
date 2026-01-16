// frontend/src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/user";
import { IUser } from "@/lib/types";

export const useUser = () => {
  const { data, isLoading, isError, error } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: getMe,
    // Do not retry if the error is "Not logged in" to avoid unnecessary requests
    retry: (failureCount, error: any) => {
      if (error?.message === "Not logged in") return false;
      return failureCount < 3;
    },
    staleTime: 1000 * 60 * 5, // Consider user data fresh for 5 minutes
  });

  return {
    user: data,
    isLoading,
    isLoggedIn: !!data,
    error: error as Error | null,
  };
};
