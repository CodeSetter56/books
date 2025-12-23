"use client";

import { paginationDefaults } from "@/config/constants";
import { useBooks } from "@/features/books/hooks/useBooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

function Pagination() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const searchParams = useSearchParams();

  const limit = Number(searchParams.get("limit")) || paginationDefaults.LIMIT;
  const search = searchParams.get("search") || paginationDefaults.SEARCH;
  let currentPage = Number(searchParams.get("page")) || paginationDefaults.PAGE;

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const { data, isLoading, error } = useBooks({
    page: currentPage,
    limit,
    search,
  });

  const totalPages = data?.totalPages || 1;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const updateUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNumber = Number(inputValue);
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        updateUrl(pageNumber);
      } else {
        setInputValue(currentPage.toString());
      }
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => updateUrl(1)}
          className={
            isFirstPage ? "text-text-muted" : "text-primary cursor-pointer"
          }
        >
          <MdOutlineKeyboardDoubleArrowLeft size={30} />
        </button>
        <button
          disabled={isFirstPage}
          onClick={() => updateUrl(currentPage - 1)}
          className={
            isFirstPage ? "text-text-muted" : "text-primary cursor-pointer"
          }
        >
          <MdOutlineKeyboardArrowLeft size={30} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputSubmit}
          onBlur={() => setInputValue(currentPage.toString())}
          className="w-10 bg-primary text-white text-center py-1 font-semibold rounded-lg focus:outline-none focus:bg-text-muted"
        />
        <div className="text-text-muted text-xs whitespace-nowrap">
          {" "}
          / {totalPages}
        </div>
      </div>

      <div className="flex items-center">
        <button
          disabled={isLastPage}
          onClick={() => updateUrl(currentPage + 1)}
          className={
            isLastPage ? "text-text-muted" : "text-primary cursor-pointer"
          }
        >
          <MdOutlineKeyboardArrowRight size={30} />
        </button>
        <button
          disabled={isLastPage}
          onClick={() => updateUrl(totalPages)}
          className={
            isLastPage ? "text-text-muted" : "text-primary cursor-pointer"
          }
        >
          <MdOutlineKeyboardDoubleArrowRight size={30} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
