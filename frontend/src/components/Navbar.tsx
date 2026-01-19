"use client";

import Link from "next/link";
import { MdHexagon } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";

function Navbar() {
  const { handleLogout } = useAuth();
  const { data: user, isLoading } = useUser();

  return (
    <nav className="bg-secondary border-b border-border py-4 px-6 flex items-center justify-between">
      <div>
        <Link href="/">
          <div className="flex items-center gap-4 transition-opacity hover:opacity-80 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <MdHexagon size={54} className="absolute text-primary" />
              <FaBookOpen size={26} className="relative text-white" />
            </div>
            <span className="text-xl font-bold text-primary">ELib</span>
          </div>
        </Link>
      </div>
      {user ? (
        <button
          onClick={() => handleLogout()}
          className="px-4 py-2 border border-primary rounded-2xl hover:bg-primary hover:text-white"
        >
          Sign out
        </button>
      ) : (
        <div>
          <Link
            href="/authenticate"
            className="px-4 py-2 border border-primary rounded-2xl hover:bg-primary hover:text-white"
          >
            Sign in
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
