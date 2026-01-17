import { Suspense } from "react";
import BooksTable from "@/components/BooksTable";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/getQueryClient";
import getBooks from "@/lib/api/book";
import WelcomeText from "./WelcomeText";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; limit?: string }>;
}) {
  const { page, search, limit } = await searchParams;
  const queryClient = getQueryClient();

  const params = {
    page: Number(page) || 1,
    limit: Number(limit) || 6,
    search: search || "",
  };

  await queryClient.prefetchQuery({
    queryKey: ["books", params],
    queryFn: () => getBooks(params),
  });

  return (
    <div className="p-8">
      <div className="flex flex-col items-center md:items-start gap-6">
        <WelcomeText />
        <div className="text-sm md:text-xl font-light italic text-text text-center md:text-left">
          Browse, create, read till your heart's content
        </div>
      </div>
      <div className="w-full mt-12 border border-border rounded-2xl p-4 ">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
          fallback={
            <div>
              Loading...
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
