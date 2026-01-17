"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRef } from "react";
import { IUser } from "@/lib/types";

function Signup() {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleRegister, isLoading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries()) as Partial<IUser>;

    handleRegister(data);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">Register</h2>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-sm font-semibold text-text ml-1"
          >
            Username
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="username"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>

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
          {/* Container using flex and items-center to align items side-by-side */}
          <div className="flex items-center gap-3 w-full">
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {/* whitespace-nowrap and flex-shrink-0 ensure the button doesn't deform or wrap text */}
            <button
              type="submit"
              disabled={isLoading}
              className="whitespace-nowrap flex-shrink-0 px-6 py-3 border border-primary rounded-2xl hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Signup;
