"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

function BookPanel({ totalPages }: { totalPages: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const [inputValue, setInputValue] = useState(currentPage.toString());

  // Sync input value if URL changes (e.g., back button)
  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const updateUrl = (params: { page?: number; search?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (params.page !== undefined) {
      // Ensure page is within bounds
      const targetPage = Math.max(1, Math.min(params.page, totalPages));
      newParams.set("page", targetPage.toString());
    }

    if (params.search !== undefined) {
      if (params.search) newParams.set("search", params.search);
      else newParams.delete("search");
      newParams.set("page", "1");
    }

    router.push(`/?${newParams.toString()}`);
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = parseInt(inputValue);
      if (!isNaN(val)) {
        updateUrl({ page: val });
      } else {
        setInputValue(currentPage.toString());
      }
    }
  };

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      {/* 1. Search Bar */}
      <div className="w-full flex items-center justify-center">
        <input
          type="text"
          placeholder="Search books..."
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateUrl({ search: e.target.value })}
          className="w-full max-w-xs px-4 py-1 rounded-lg bg-background border border-border text-text focus:outline-none"
        />
      </div>

      {/* 2. Filters */}
      <div className="w-full flex items-center justify-center text-text-muted">
        Filters
      </div>

      {/* 3. Navigation */}
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center">
          <button
            disabled={isFirstPage}
            onClick={() => updateUrl({ page: 1 })}
            className={`${
              isFirstPage ? "text-text-muted" : "text-primary"
            } disabled:cursor-not-allowed`}
          >
            <MdOutlineKeyboardDoubleArrowLeft size={30} />
          </button>
          <button
            disabled={isFirstPage}
            onClick={() => updateUrl({ page: currentPage - 1 })}
            className={`${
              isFirstPage ? "text-text-muted" : "text-primary"
            } disabled:cursor-not-allowed`}
          >
            <MdOutlineKeyboardArrowLeft size={30} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-1">
          <div className="text-text-muted text-xs">Go to: </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputSubmit}
            onBlur={() => setInputValue(currentPage.toString())}
            className="w-10 bg-primary text-white text-center py-1 font-semibold rounded-lg focus:outline-none focus:border focus:border-text-muted"
          />
          <div className="text-text-muted text-xs whitespace-nowrap">
            {" "}
            of {totalPages}
          </div>
        </div>

        <div className="flex items-center">
          <button
            disabled={isLastPage}
            onClick={() => updateUrl({ page: currentPage + 1 })}
            className={`${
              isLastPage ? "text-text-muted" : "text-primary"
            } disabled:cursor-not-allowed`}
          >
            <MdOutlineKeyboardArrowRight size={30} />
          </button>
          <button
            disabled={isLastPage}
            onClick={() => updateUrl({ page: totalPages })}
            className={`${
              isLastPage ? "text-text-muted" : "text-primary"
            } disabled:cursor-not-allowed`}
          >
            <MdOutlineKeyboardDoubleArrowRight size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookPanel;
