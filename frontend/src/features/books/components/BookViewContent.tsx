"use client";

import { useBook } from "../hooks/useBook";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import PdfViewerWrapper from "@/features/pdf/components/PdfViewerWrapper";

export default function BookViewContent() {
  const params = useParams();
  const bookId = params.bookId as string;
  const { data: book, isLoading, error } = useBook(bookId);

  if (isLoading) return <div>Loading...</div>;
  if (error || !book) return notFound();

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

        <div className="flex flex-col w-full">
          <h2 className="text-4xl md:text-7xl font-bold text-primary text-balance capitalize mb-2">
            {book.title}
          </h2>
          <p className="font-bold text-text text-xl md:text-3xl mb-2 text-primary-500">
            By {book.author.name}
          </p>
          <div className="mb-6">
            <h3 className="font-semibold text-text-muted mb-2">
              Genre: <span className="text-primary">{book.genre}</span>
            </h3>
          </div>
          <div className="mt-auto pt-4">
            <a
              href={book.file}
              target="_blank"
              className="px-6 py-2 border border-primary text-primary rounded-2xl hover:bg-primary hover:text-white transition-colors"
            >
              Download PDF
            </a>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <PdfViewerWrapper fileUrl={book.file} />
      </div>
    </div>
  );
}
