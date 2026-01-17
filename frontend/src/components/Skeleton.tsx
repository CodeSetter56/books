export default function Skeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row gap-5 border p-5 rounded-xl bg-secondary border-border h-full animate-pulse"
        >
          <div className="flex-shrink-0 flex justify-center items-start">
            <div
              className="rounded-xl bg-gray-200"
              style={{ width: "150px", height: "12rem" }}
            ></div>
          </div>
          <div className="flex flex-col flex-grow min-w-0">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="mt-4 h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="mt-auto flex justify-end gap-4">
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
