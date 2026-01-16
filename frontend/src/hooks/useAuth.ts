// frontend/src/features/auth/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, register } from "@/lib/api/user";
import { IUser } from "@/lib/types";

export const useAuth = () => {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (data: Partial<IUser>) => login(data),
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: Partial<IUser>) => register(data),
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  return {
    handleLogin: loginMutation.mutate,
    handleRegister: registerMutation.mutate,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error as Error | null,
  };
};
