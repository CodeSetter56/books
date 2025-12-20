import { IBook } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

export default function BookCard({ book }: { book: IBook }) {

  const genres = ["Fiction", "Sci-Fi", "Adventure", "History", "Biography"];

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-5 shadow-md rounded-xl bg-secondary border-border">
      <Image
        className="rounded-xl"
        src={book.coverimg}
        alt={book.title}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "auto", height: "12rem" }}
      />

      <div className="flex flex-col w-full">
        <h2 className="line-clamp-2 text-xl font-bold text-primary text-balance capitalize">
          {book.title}
        </h2>
        <p className="font-bold text-text text-xl mt-1">By: {book.author.name}</p>

        <div className="grid grid-cols-2 my-auto gap-3">
          {genres.slice(0, 4).map((genre, index) => {
            const isLastVisible = index === 3;
            const hasMore = genres.length > 4;
            if (isLastVisible && hasMore) {
              return (
                <p
                  key={index}
                  className="font-semibold border border-border text-center text-text-muted rounded text-xs flex items-center justify-center"
                >
                  +{genres.length - 3} more
                </p>
              );
            }

            return (
              <p
                key={index}
                className="border border-border text-center rounded text-xs font-semibold text-text-muted px-1"
              >
                {genre}
              </p>
            );
          })}
        </div>

        <Link
          href={`/book/${book._id}`}
          className="py-1 px-2 rounded-xl border border-primary mt-auto inline-block text-primary font-medium text-sm
                   hover:font-bold hover:bg-primary-100 transition w-fit"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}
