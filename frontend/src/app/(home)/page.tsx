import BooksTable from "@/components/BooksTable";
import CardSkeleton from "@/components/Skeletons/CardSkeleton";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="w-full p-8">
      <div className="flex flex-col items-start gap-6 ">
        <div className=" text-4xl text-center md:text-8xl md:text-start text-primary">Welcome,</div>
        <div className="text-md md:text-xl font-light italic text-text">
          Browse, create, read till your heart's content
        </div>
      </div>
      <Suspense fallback={<CardSkeleton />}>
        <BooksTable />
      </Suspense>
    </div>
  );
}
