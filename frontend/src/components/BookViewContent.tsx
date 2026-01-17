"use client";

import dynamic from "next/dynamic";
import { useBook } from "../hooks/useBook";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";


const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div>
      Loading...
    </div>
  ),
});

export default function BookViewContent() {
  const { bookId } = useParams();
  const { data: book, isLoading, error } = useBook(bookId as string);

 if (isLoading)
   return (
  <div>
     Loading...
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
