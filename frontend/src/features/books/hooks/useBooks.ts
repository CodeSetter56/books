import { useQuery } from "@tanstack/react-query";
import getBooks from "../BookService";
import { IBookParams } from "@/lib/types";

export function useBooks({ search, page, limit }: IBookParams) {
  return useQuery({
    queryKey: ["books", { search, page, limit }],
    queryFn: () => getBooks({ search, page, limit }),
  });
}
