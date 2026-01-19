// frontend/src/app/book/[bookId]/page.tsx

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/getQueryClient";
import BookViewContent from "@/components/Book/BookViewContent";
import { getBookById } from "@/lib/api/book";

export default async function BookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBookById(bookId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookViewContent />
    </HydrationBoundary>
  );
}
