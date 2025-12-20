import BooksTable from "@/components/BooksTable";
import { config } from "@/config/config";

export default async function Home() {

  const res = await fetch(`${config.backendUrl}/books`);
  const data = await res.json();

  return (
    <div className=" w-full p-8">
      <div className="flex flex-col items-start gap-6 ">
        <div className="text-8xl text-primary">Welcome,</div>
        <div className="text-xl font-light italic text-text">
          Browse, create, read till your heart's content
        </div>
      </div>
      <BooksTable books={data.books} />
    </div>
  );
}
