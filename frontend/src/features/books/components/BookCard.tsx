import { IBook } from "@/features/books/BookTypes";
import Image from "next/image";
import Link from "next/link";

export default function BookCard({ book }: { book: IBook }) {
  const genres = ["Fiction", "Sci-Fi", "Adventure", "History", "Biography"];

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-5 shadow-md rounded-xl bg-secondary border-border h-full">
      {/* Container to prevent image stretching */}
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

        {/* Improved genre grid with fixed font sizes to prevent stretching */}
        <div className="grid grid-cols-2 gap-3 my-4">
          {genres.slice(0, 4).map((genre, index) => {
            const isLastVisible = index === 3;
            const hasMore = genres.length > 4;
            if (isLastVisible && hasMore) {
              return (
                <p
                  key={index}
                  className="font-semibold border border-border text-center text-text-muted rounded text-[10px] py-1 flex items-center justify-center"
                >
                  +{genres.length - 3} more
                </p>
              );
            }

            return (
              <p
                key={index}
                className="border border-border text-center rounded text-[10px] font-semibold text-text-muted px-1 py-1 truncate"
              >
                {genre}
              </p>
            );
          })}
        </div>

        <div className="mt-auto">
          <Link
            href={`/book/${book._id}`}
            className="py-1.5 px-4 rounded-xl border border-primary inline-block text-primary font-medium text-sm
                     hover:font-bold hover:bg-primary-100 transition w-fit"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
}
