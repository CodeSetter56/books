// frontend/src/lib/api/user.ts
import { config } from "@/lib/config";
import { IUser } from "@/lib/types";

export const register = async (data: Partial<IUser>) => {
  const res = await fetch(`${config.backend_url}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Registration failed");
  }
  return res.json();
};

export const login = async (data: Partial<IUser>) => {
  const res = await fetch(`${config.backend_url}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Login failed");
  }
  return res.json();
};

// frontend/src/lib/api/user.ts

export const getMe = async (): Promise<IUser> => {
  const res = await fetch(`${config.backend_url}/users/me`, {
    // browser sends cookies automatically if credentials are included
    // or if the request is same-origin
  });

  if (!res.ok) throw new Error("Not logged in");
  return res.json();
};