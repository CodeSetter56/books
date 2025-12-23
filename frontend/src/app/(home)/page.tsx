import BookPanel from "@/features/books/components/BookPanel";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";
import { Suspense } from "react";
import BooksTable from "@/features/books/components/BooksTable";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page, search } = await searchParams;

  return (
    <div className="w-full p-8">
      <div className="flex flex-col items-center md:items-start gap-6">
        <div className="text-4xl text-center md:text-8xl md:text-left text-primary">
          Welcome,
        </div>
        <div className="text-sm md:text-xl font-light italic text-text text-center md:text-left">
          Browse, create, read till your heart's content
        </div>
      </div>

      <div className="w-full mt-12 border border-border rounded-2xl p-4 ">
        <div className="p-4 bg-secondary rounded-2xl border border-border">
          <BookPanel/>
        </div>
        <Suspense
          fallback={
            <div className="mt-10">
              <CardSkeleton />
            </div>
          }
        >
          <BooksTable/>
        </Suspense>
      </div>
    </div>
  );
}
