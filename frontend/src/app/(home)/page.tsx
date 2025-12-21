// codesetter56/books/books-ce91c92da01eb2e7b923e09be8526d9ec58b11e6/frontend/src/app/(home)/page.tsx

import BooksTable from "@/components/BooksTable";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="w-full p-8">
      {/* 1. Added items-center for mobile, md:items-start for desktop */}
      <div className="flex flex-col items-center md:items-start gap-6">
        {/* 2. Added text-center for mobile, md:text-left for desktop */}
        <div className="text-4xl text-center md:text-8xl md:text-left text-primary">
          Welcome,
        </div>

        {/* 3. Added text-center for mobile, md:text-left for desktop */}
        <div className="text-sm md:text-xl font-light italic text-text text-center md:text-left">
          Browse, create, read till your heart's content
        </div>
      </div>

      <Suspense fallback={<CardSkeleton />}>
        <BooksTable />
      </Suspense>
    </div>
  );
}
