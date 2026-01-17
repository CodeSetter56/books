"use client";

import { useUser } from "@/hooks/useUser";

export default function WelcomeText() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md md:h-20 md:w-96"></div>
    );
  }

  return (
    <div className="text-4xl text-center md:text-8xl md:text-left text-primary">
      {user ? `Hi ${user.name}` : "Welcome,"}
    </div>
  );
}
