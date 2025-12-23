// codesetter56/books/books-ce91c92da01eb2e7b923e09be8526d9ec58b11e6/frontend/src/app/book/[bookId]/page.tsx

import { config } from "@/lib/config";
import { IBook } from "@/features/books/BookTypes";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Skeleton from "@/components/Skeletons/CardSkeleton";
import PdfViewerWrapper from "@/features/pdf/components/PdfViewerWrapper";

type Props = {
  params: Promise<{ bookId: string }>;
};

async function ViewBook({ params }: Props) {
  const { bookId } = await params;
  let book: IBook | null = null;

  try {
    const res = await fetch(`${config.backend_url}/books/${bookId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return notFound();
      throw new Error("Failed to fetch book");
    }

    const data = await res.json();
    book = data.book;
  } catch (error) {
    console.error("Error fetching book:", error);
  }

  if (!book) return <div>Book not found</div>;

  return (
    <div className="container mx-auto mt-10 p-5">
      <div className="flex flex-col md:flex-row gap-8 border p-5 shadow-md rounded-xl bg-secondary border-border mb-10 min-h-[400px]">
        <div className="relative w-full md:w-1/3 h-96 flex-shrink-0">
          <Image
            className="rounded-xl object-cover"
            src={book.coverimg}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        {/* Using flex-col with mt-auto instead of absolute positioning */}
        <div className="flex flex-col w-full">
          <h2 className="text-4xl md:text-7xl font-bold text-primary text-balance capitalize mb-2">
            {book.title}
          </h2>
          <p className="font-bold text-text text-xl md:text-3xl mb-2 text-primary-500">
            By {book.author.name}
          </p>
          <p className="font-bold text-text-muted text-sm mb-6 text-primary-500 italic">
            Contact: {book.author.email}
          </p>

          <div className="mb-6">
            <h3 className="font-semibold text-text-muted mb-2">Genre</h3>
            <div className="flex flex-wrap gap-2 text-primary">
              <span className="px-3 py-1 border border-border rounded-lg bg-background">
                {book.genre}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <button className="px-6 py-2 border border-primary text-primary rounded-2xl hover:bg-primary hover:text-white transition-colors">
              Download Book
            </button>
          </div>
        </div>
      </div>

      {/* Container to handle PDF overflow on mobile */}
      <div className="w-full overflow-x-auto">
        <Suspense
          fallback={
            <div>
              <Skeleton />
            </div>
          }
        >
          <PdfViewerWrapper fileUrl={book.file} />
        </Suspense>
      </div>
    </div>
  );
}

export default ViewBook;
