"use client";
import { useSearchParams } from "next/navigation";
import { useBooks } from "@/features/books/hooks/useBooks";
import BookCard from "./BookCard";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";
import { paginationDefaults } from "@/config/constants";

export default function BooksTable() {

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || paginationDefaults.PAGE;
  const search = searchParams.get("search") || paginationDefaults.SEARCH;

  const { data, isLoading, error } = useBooks({ page, limit: paginationDefaults.LIMIT, search });

  if (isLoading) return <CardSkeleton />;
  if (error) return <div className="text-red-500 font-bold">{error.message}</div>;

  const books = data?.books || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {books.length > 0 ? (
        books.map((book: any) => <BookCard key={book._id} book={book} />)
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
}
