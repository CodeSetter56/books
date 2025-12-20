import { config } from "@/config/config";
import { IBook } from "@/types/types"; // Assuming you have this type defined
import Image from "next/image";
import { notFound } from "next/navigation";

// Next.js 15+ treats params as a Promise
type Props = {
  params: Promise<{ bookId: string }>;
};

async function ViewBook({ params }: Props) {
  // 1. Await the params to get the ID
  const { bookId } = await params;

  // 2. Fetch the data
  // Added try/catch for safety, and cache options if needed
  let book: IBook | null = null;

  try {
    const res = await fetch(`${config.backendUrl}/books/${bookId}`, {
      cache: "no-store", // Use 'force-cache' if you want static generation
    });

    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error("Failed to fetch book");
    }

    const data = await res.json();
    book = data.book;

    console.log("Fetched book:", book);
  } catch (error) {
    console.error("Error fetching book:", error);
    // You might want to return an error UI here
  }

  if (!book) return <div>Book not found</div>;

  // 3. Render the UI
  return (
    <div className="max-w-4xl mx-auto mt-10 p-5">
      <div className="flex flex-col md:flex-row gap-8 border p-5 shadow-md rounded-xl bg-secondary border-border">
        {/* Book Cover */}
        <div className="relative w-full md:w-1/3 h-96">
          <Image
            className="rounded-xl object-cover"
            src={book.coverimg}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Book Details */}
        <div className="flex flex-col w-full md:w-2/3">
          <h2 className="text-3xl font-bold text-primary text-balance capitalize mb-2">
            {book.title}
          </h2>
          <p className="font-bold text-text text-xl mb-4 text-primary-500">
            By {book.author.name}
          </p>

          <div className="mb-4">
            <h3 className="font-semibold text-text-muted mb-2">Genre</h3>
            <div className="flex flex-wrap gap-2">
              {/* Handle genre if it's a string or an array */}
              {Array.isArray(book.genre) ? (
                book.genre.map((g, i) => (
                  <span
                    key={i}
                    className="border border-border px-3 py-1 rounded text-sm font-medium text-text-muted"
                  >
                    {g}
                  </span>
                ))
              ) : (
                <span className="border border-border px-3 py-1 rounded text-sm font-medium text-text-muted">
                  {book.genre}
                </span>
              )}
            </div>
          </div>

          {/* Description or extra details usually go here */}
        </div>
      </div>
    </div>
  );
}

export default ViewBook;
