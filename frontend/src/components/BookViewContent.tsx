"use client";

import dynamic from "next/dynamic";
import { useBook } from "../hooks/useBook";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";

const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-64 bg-secondary border border-border rounded-lg animate-pulse"
        />
      ))}
    </div>
  ),
});

export default function BookViewContent() {
  const { bookId } = useParams();
  const { data: book, isLoading, error } = useBook(bookId as string);

  if (isLoading)
    // Enhanced loading state
    return (
      <div className="container mx-auto mt-10 p-5">
        <div className="flex flex-col md:flex-row gap-8 border p-8 shadow-xl rounded-2xl bg-secondary border-border mb-12 animate-pulse">
          <div className="w-full md:w-1/4 h-72 bg-gray-200 rounded-xl flex-shrink-0" />
          <div className="flex flex-col py-2 flex-grow">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="h-6 bg-gray-200 rounded-full w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-secondary border border-border rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );

  if (error || !book) return notFound();

  return (
    <div className="container mx-auto mt-10 p-5">
      <div className="flex flex-col md:flex-row gap-8 border p-8 shadow-xl rounded-2xl bg-secondary border-border mb-12">
        <div className="relative w-full md:w-1/4 h-75 flex-shrink-0 shadow-lg">
          <Image
            className="rounded-xl object-cover"
            src={book.coverimg}
            alt={book.title}
            fill
            priority
          />
        </div>

        <div className="flex flex-col py-2">
          <h1 className="text-5xl md:text-7xl font-black text-primary mb-4">
            {book.title}
          </h1>
          <p className="text-2xl text-text-muted mb-6 italic">
            by {book.author.name}
          </p>
          <div className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-semibold w-fit">
            {book.genre}
          </div>
          <div className="mt-auto">Download</div>
        </div>
      </div>

      <div className="w-full">
        <PdfViewer fileUrl={book.file} />
      </div>
    </div>
  );
}
