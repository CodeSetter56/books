"use client";
import Pagination from "@/components/Pagination";

interface ModalHeaderProps {
  numPages: number;
  isSideBySide: boolean;
  onToggleView: () => void;
  onClose: () => void;
}

export const ModalHeader = ({
  numPages,
  isSideBySide,
  onToggleView,
  onClose,
}: ModalHeaderProps) => (
  <div className="h-16 bg-secondary flex items-center justify-between px-6 border-b border-border z-10 shrink-0">
    <button
      onClick={onToggleView}
      className="hidden lg:block px-4 py-1 border border-primary text-primary rounded hover:bg-primary/10 transition-colors"
    >
      {isSideBySide ? "Single View" : "Side-by-Side"}
    </button>

    <div className="flex-1 max-w-xs">
      <Pagination totalPages={numPages} replaceOnChange />
    </div>

    <button
      onClick={onClose}
      className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
    >
      ✕
    </button>
  </div>
);
