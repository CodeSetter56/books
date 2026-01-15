import Image from "next/image";
import LinkButton from "@/components/LinkButton";
import { IBook } from "@/lib/types";

export default function BookCard({ book }: { book: IBook }) {
  return (
    <div className="flex flex-col md:flex-row gap-5 border p-5 shadow-md rounded-xl bg-secondary border-border h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex-shrink-0 flex justify-center items-start">
        <Image
          className="rounded-xl object-cover"
          src={book.coverimg}
          alt={book.title}
          width={150}
          height={200}
          style={{ width: "auto", height: "12rem" }}
        />
      </div>

      <div className="flex flex-col flex-grow min-w-0">
        <h2 className="line-clamp-2 text-xl font-bold text-primary text-balance capitalize">
          {book.title}
        </h2>
        <p className="font-bold text-text text-lg mt-1 truncate">
          By: {book.author.name}
        </p>

        <div className="flex gap-2 my-4">
          <span className="border border-border text-center rounded text-xs font-semibold text-text-muted px-2 py-1 truncate">
            {book.genre}
          </span>
        </div>

        <div className="mt-auto">
          <LinkButton destination={`/book/${book._id}`} text="Read More" />
        </div>
      </div>
    </div>
  );
}
