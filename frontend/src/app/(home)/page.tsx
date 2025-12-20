import BooksTable from "@/components/BooksTable";
import Skeleton from "@/components/Skeleton";
import { Suspense } from "react";

export default async function Home() {


  return (
    <div className=" w-full p-8">
      <div className="flex flex-col items-start gap-6 ">
        <div className="text-8xl text-primary">Welcome,</div>
        <div className="text-xl font-light italic text-text">
          Browse, create, read till your heart's content
        </div>
      </div>
      <Suspense fallback={<Skeleton />}>
        <BooksTable />
      </Suspense>
    </div>
  );
}
