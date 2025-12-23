import { useQuery } from "@tanstack/react-query";
import getBooks from "../BookService";
import { IBookParams } from "../BookTypes";

export function useBooks({ search, page, limit }: IBookParams) {
  return useQuery({
    queryKey: ["books", { search, page, limit }],
    queryFn: () => getBooks({ search, page, limit }),
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
  });
}
