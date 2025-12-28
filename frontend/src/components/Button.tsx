import { IButton } from "@/lib/types";

export default function Button({ text }: IButton) {
  return (
    <button className="px-4 py-1.5 border border-primary text-primary rounded-2xl hover:bg-primary hover:text-white transition-colors">
      {text}
    </button>
  );
}
