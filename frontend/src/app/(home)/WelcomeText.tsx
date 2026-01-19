"use client";

import { useUser } from "@/hooks/useUser";

export default function WelcomeText() {
  const { data: user } = useUser();

  // Data is pre-hydrated, so we render the final state immediately
  return (
    <div className="text-4xl text-center md:text-8xl md:text-left text-primary min-h-[1.2em]">
      {user ? `Hi ${user.name}` : "Welcome,"}
    </div>
  );
}
