"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  // Helper to determine Icon styles
  const getIconStyles = (isDisabled: boolean) => {
    return `rounded-md transition-colors ${
      isDisabled
        ? "text-text-muted" // Disabled color
        : "text-primary cursor-pointer" // Active color on the icon itself
    }`;
  };

  return (
    <div className="flex items-center gap-2 justify-center">
      {/* Jump to First Page */}
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
        title="First Page"
      >
        <MdKeyboardDoubleArrowLeft
          size={32}
          className={getIconStyles(currentPage === 1)}
        />
      </button>

      {/* Previous Page */}
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        title="Previous Page"
      >
        <MdKeyboardArrowLeft
          size={32}
          className={getIconStyles(currentPage === 1)}
        />
      </button>

      <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-xl border border-border">
        <span className="text-sm font-medium text-text">
          {currentPage} / {totalPages}
        </span>
      </div>

      {/* Next Page */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        title="Next Page"
      >
        <MdKeyboardArrowRight
          size={32}
          className={getIconStyles(currentPage === totalPages)}
        />
      </button>

      {/* Jump to Last Page */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => changePage(totalPages)}
        title="Last Page"
      >
        <MdKeyboardDoubleArrowRight
          size={32}
          className={getIconStyles(currentPage === totalPages)}
        />
      </button>
    </div>
  );
}
