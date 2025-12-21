import BookPanel from "@/components/Book/BookPanel";
import BooksTable from "@/components/Book/BooksTable";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";
import { Suspense } from "react";
import { config } from "@/config/config";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page, search } = await searchParams;
  const currentPage = parseInt(page || "1");
  const searchQuery = search || "";

  // Fetch initial metadata to get totalPages for the Panel
  const res = await fetch(
    `${config.backend_url}/books?page=${currentPage}&limit=6&search=${searchQuery}`,
    { cache: "no-store" }
  );
  const data = await res.json();
  const totalPages = data.totalPages || 1;

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
          <BookPanel totalPages={totalPages} />
        </div>
        <Suspense
          fallback={
            <div className="mt-10">
              <CardSkeleton />
            </div>
          }
          key={`${currentPage}-${searchQuery}`}
        >
          <BooksTable page={currentPage} search={searchQuery} />
        </Suspense>
      </div>
    </div>
  );
}
