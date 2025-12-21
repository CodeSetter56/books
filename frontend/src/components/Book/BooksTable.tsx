import { IBook } from "@/types/types";
import BookCard from "./BookCard";
import { config } from "@/config/config";

async function BooksTable({ page, search }: { page: number; search: string }) {
  // Pass the page and search query to your backend API
  const res = await fetch(
    `${config.backend_url}/books?page=${page}&limit=6&search=${search}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const books: IBook[] = data.books || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {books.length > 0 ? (
        books.map((book) => (
          <div key={book._id}>
            <BookCard book={book} />
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-text-muted">
          No books found.
        </div>
      )}
    </div>
  );
}

export default BooksTable;
