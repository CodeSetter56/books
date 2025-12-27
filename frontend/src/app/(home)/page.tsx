import CardSkeleton from "@/components/Skeletons/CardSkeleton";
import { Suspense } from "react";
import BooksTable from "@/features/books/components/BooksTable";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/getQueryClient";
import getBooks from "@/features/books/BookService";
import { paginationDefaults } from "@/config/constants";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; limit?: string }>;
}) {

  const { page, search, limit } = await searchParams;
  const queryClient = getQueryClient();

  const params = {
    page: Number(page) || paginationDefaults.PAGE,
    limit: Number(limit) || paginationDefaults.LIMIT,
    search: search || paginationDefaults.SEARCH,
  };

  // Prefetch data on server
  await queryClient.prefetchQuery({
    queryKey: ["books", params],
    queryFn: () => getBooks(params),
  });

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
        <HydrationBoundary state={dehydrate(queryClient)}>
   
          <Suspense
            fallback={
              <div className="mt-10">
                <CardSkeleton />
              </div>
            }
          >
            <BooksTable />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
