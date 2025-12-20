import { IBook } from "@/types/types";
import BookCard from "./BookCard";
import { config } from "@/config/config";

async function BooksTable() {

  const res = await fetch(`${config.backend_url}/books`);
  const data = await res.json();
  const books: IBook[] = data.books;

  return (
    <div className="w-full mt-12 mx-auto p-4 md:p-8 border border-border rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book._id}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BooksTable;
