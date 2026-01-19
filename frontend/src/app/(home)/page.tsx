import { Suspense } from "react";
import BooksTable from "@/components/Book/BooksTable";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/getQueryClient";
import getBooks from "@/lib/api/book";
import { getMe } from "@/lib/api/user";
import { cookies } from "next/headers";
import WelcomeText from "./WelcomeText";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; limit?: string }>;
}) {
  const { page, search, limit } = await searchParams;
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  const params = {
    page: Number(page) || 1, 
    limit: Number(limit) || 6,
    search: search || "",
  };

  // Prefetch both user and books simultaneously
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["books", params],
      queryFn: () => getBooks(params),
    }),
    token
      ? queryClient.prefetchQuery({ queryKey: ["me"], queryFn: getMe })
      : Promise.resolve(),
  ]);

  return (
    <div className="p-8">
      <div className="flex flex-col items-center md:items-start gap-6">
        <WelcomeText />
        <div className="text-sm md:text-xl font-light italic text-text text-center md:text-left">
          Browse, create, read till your heart's content
        </div>
      </div>
      <div className="w-full mt-12 border border-border rounded-2xl p-4">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                Loading books...
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
