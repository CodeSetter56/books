"use client";

import { useUser } from "@/hooks/useUser";

export default function WelcomeText() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="text-4xl text-center md:text-8xl md:text-left text-primary animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="text-4xl text-center md:text-8xl md:text-left text-primary">
      {user ? `Hi ${user.name}` : "Welcome,"}
    </div>
  );
}
