import { ILinkButton } from "@/lib/types";
import Link from "next/link";

export default function LinkButton({ destination, text }: ILinkButton) {
  return (
    <Link
      href={destination}
      className="px-4 py-1.5 border border-primary text-primary rounded-2xl hover:bg-primary hover:text-white transition-colors"
    >
      {text}
    </Link>
  );
}
