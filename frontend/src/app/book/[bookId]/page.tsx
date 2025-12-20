import { config } from "@/config/config";
import { IBook } from "@/types/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import PdfViewerWrapper from "./PdfViewerWrapper";
import { Suspense } from "react";
import Skeleton from "@/components/Skeletons/CardSkeleton";

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
      <div className="flex flex-col md:flex-row gap-8 border p-5 shadow-md rounded-xl bg-secondary border-border mb-10">
        <div className="relative w-full md:w-1/3 h-96">
          <Image
            className="rounded-xl object-cover"
            src={book.coverimg}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>

        <div className="flex flex-col gap-4 w-full relative">
          <h2 className="text-7xl font-bold text-primary text-balance capitalize mb-2">
            {book.title}
          </h2>
          <p className="font-bold text-text text-3xl mb-4 text-primary-500">
            By {book.author.name}
          </p>
          <p className="font-bold text-text-muted text-md mb-4 text-primary-500 italic">
            Contact: {book.author.email}
          </p>

          <div className="mb-4">
            <h3 className="font-semibold text-text-muted mb-2">Genre</h3>
            <div className="flex flex-wrap gap-2">{book.genre}</div>
          </div>

          <div className="bottom-0 absolute">
            <button className="px-4 py-2 border border-primary text-primary rounded-2xl">
              Download Book
            </button>
          </div>
        </div>
      </div>

      {/* PDF Grid View */}
      <div>
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
