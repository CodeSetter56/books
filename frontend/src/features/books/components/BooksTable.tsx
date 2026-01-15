"use client";

import { useSearchParams } from "next/navigation";
import { useBooks } from "@/features/books/hooks/useBooks";
import BookCard from "./BookCard";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";
import { paginationDefaults } from "@/config/constants";
import Pagination from "@/components/Pagination";
import { IBook } from "@/lib/types";

export default function BooksTable() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || paginationDefaults.PAGE;
  const limit = Number(searchParams.get("limit")) || paginationDefaults.LIMIT;
  const search = searchParams.get("search") || paginationDefaults.SEARCH;

  const { data, isLoading, error } = useBooks({ page, limit, search });

  if (isLoading)
    return (
      <div className="mt-10">
        <CardSkeleton />
      </div>
    );

  if (error) {
    return (
      <div className="text-red-500 font-bold p-4 text-center">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </div>
    );
  }

  const books: IBook[] = data?.books || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="p-4 bg-secondary rounded-2xl border border-border">
        <Pagination totalPages={totalPages} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {books.length > 0 ? (
          books.map((book) => <BookCard key={book._id} book={book} />)
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-text-muted italic text-lg text-primary">
              No books found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
