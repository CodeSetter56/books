import Link from "next/link";
import { MdHexagon } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import Button from "./Button";

function Navbar() {
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
      <div>
        <Button text="Sign in"/>
      </div>
    </nav>
  );
}

export default Navbar;
