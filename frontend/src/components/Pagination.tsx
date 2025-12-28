"use client";

import { useUrlState } from "@/hooks/useUrlState";
import { paginationDefaults } from "@/config/constants";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

export default function Pagination({
  totalPages,
  replaceOnChange,
}: {
  totalPages: number;
  replaceOnChange?: boolean;
}) {
  const { getParam, updateParams, replaceParams } = useUrlState();
  const currentPage = Number(getParam("page", String(paginationDefaults.PAGE)));

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      if (replaceOnChange) replaceParams({ page: String(newPage) });
      else updateParams({ page: String(newPage) });
    }
  };

  return (
    <div className="w-full flex items-center justify-center gap-2">
      <div className="flex items-center">
        <button
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(1)}
          className="disabled:text-text-muted disabled:cursor-default text-primary cursor-pointer"
        >
          <MdOutlineKeyboardDoubleArrowLeft size={30} />
        </button>
        <button
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="disabled:text-text-muted disabled:cursor-default text-primary cursor-pointer"
        >
          <MdOutlineKeyboardArrowLeft size={30} />
        </button>
      </div>

      <div className="flex items-center gap-1">
        <input
          key={currentPage} // Forces re-render when page changes via buttons
          type="text"
          defaultValue={currentPage}
          onBlur={(e) => handlePageChange(Number(e.target.value))}
          onKeyDown={(e) =>
            e.key === "Enter" && handlePageChange(Number(e.currentTarget.value))
          }
          className="w-10 bg-primary text-white text-center py-1 font-semibold rounded-lg focus:outline-none"
        />
        <span className="text-text-muted text-xs">/ {totalPages}</span>
      </div>

      <div className="flex items-center">
        <button
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="disabled:text-text-muted disabled:cursor-default text-primary cursor-pointer"
        >
          <MdOutlineKeyboardArrowRight size={30} />
        </button>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="disabled:text-text-muted disabled:cursor-default text-primary cursor-pointer"
        >
          <MdOutlineKeyboardDoubleArrowRight size={30} />
        </button>
      </div>
    </div>
  );
}
