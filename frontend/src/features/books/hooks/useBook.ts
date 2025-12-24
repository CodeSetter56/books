import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../BookService";

export function useBook(bookId: string) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: () => getBookById(bookId),
  });
}
