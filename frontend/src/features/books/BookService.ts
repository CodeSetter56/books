import { config } from "@/lib/config";
import { IBookParams } from "./BookTypes";

export default async function getBooks({ page, limit, search }: IBookParams) {
  const url = new URL(`${config.backend_url}/books`);
  if (page) url.searchParams.append("page", page.toString());
  if (limit) url.searchParams.append("limit", limit.toString());
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "An unexpected error occurred");
  }
  return res.json();
}

export async function getBookById(bookId: string) {
  const res = await fetch(`${config.backend_url}/books/${bookId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch book");
  }

  const data = await res.json();
  return data.book;
}