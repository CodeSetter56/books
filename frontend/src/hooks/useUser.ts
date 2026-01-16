import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/lib/types";
import { getMe } from "@/lib/api/user";

export const useUser = () => {
  const { data, isLoading, isError, error } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false, // Don't retry if the user isn't logged in
    staleTime: 1000 * 60 * 5, // Keep user data fresh for 5 minutes
  });

  return {
    user: data,
    isLoading,
    isLoggedIn: !!data,
    error,
  };
};
