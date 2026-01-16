"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRef } from "react";
import { IUser } from "@/lib/types";

function Signin() {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleLogin, isLoading, error } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries()) as Partial<IUser>;

    handleLogin(data);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">Sign In</h2>
        {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
      </div>

      {/* FIXED: Added onSubmit and ref here */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-text ml-1"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email" // FIXED: Required for FormData
            type="email"
            required
            placeholder="name@example.com"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-text ml-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password" // FIXED: Required for FormData
            type="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

        <div className="my-2 mx-auto">
          <button
            type="submit" // FIXED: type="submit" ensures Enter key works
            disabled={isLoading}
            className="px-4 py-2 border border-primary rounded-2xl hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signin;
