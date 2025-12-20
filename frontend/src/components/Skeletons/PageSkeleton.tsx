function PageSkeleton() {
  // Simulating a grid of 4 PDF pages
  const skeletonPages = Array.from({ length: 4 });

  return (
    <div className="w-full mt-12 mx-auto p-4 md:p-8 border border-border rounded-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {skeletonPages.map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-50 dark:bg-text-muted border border-border rounded-lg p-2 animate-pulse"
          >
            {/* PDF Page Placeholder - matches the 250px width of your PdfTable */}
            <div className="w-[250px] h-[350px] bg-text-muted rounded mb-2"></div>

            {/* Page Label Placeholder */}
            <div className="h-3 bg-text-muted rounded w-1/3"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PageSkeleton;
