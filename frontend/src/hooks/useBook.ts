import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/lib/api/book";

export function useBook(bookId: string) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBookById(bookId),
  });
}
