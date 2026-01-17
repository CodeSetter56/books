// frontend/src/hooks/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, logout, register } from "@/lib/api/user";
import { IUser } from "@/lib/types";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (data: Partial<IUser>) => login(data),
    onSuccess: () => {
      // Invalidate the 'me' query to fetch fresh user data now that we are logged in
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/");
      router.refresh();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: Partial<IUser>) => register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push("/");
      router.refresh();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all cached user data (the "me" query)
      queryClient.setQueryData(["me"], null);
      queryClient.invalidateQueries({ queryKey: ["me"] });

      // Redirect to the authentication page
      router.push("/authenticate");
    },
  });

  return {
    handleLogin: loginMutation.mutate,
    handleLogout: logoutMutation.mutate,
    handleRegister: registerMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: (loginMutation.error || registerMutation.error) as Error | null,
  };
};
