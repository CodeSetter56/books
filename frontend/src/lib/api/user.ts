// frontend/src/lib/api/user.ts
import apiClient from "./client";
import { IUser } from "@/lib/types";

export const getMe = async (): Promise<IUser> => {
  const res = await apiClient.get("/users/me");
  return res.data;
};

export const login = async (data: Partial<IUser>) => {
  const res = await apiClient.post("/users/login", data);
  return res.data;
};

export const logout = async () => {
  const res = await apiClient.post("/users/logout");
  return res.data;
};

export const register = async (data: Partial<IUser>) => {
  const res = await apiClient.post("/users/register", data); 
  return res.data;
};
